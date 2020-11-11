import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import { change } from 'redux-form';
import isEqual from 'lodash/isEqual';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import updateResponseNode from '@triniti/cms/plugins/pbjx/actions/updateResponseNode';
import { filterRevertableData } from '../../utils/filterData';
import filterRemoved from '../../utils/filterRemoved';
import findNodeDiff from '../../utils/findNodeDiff';
import fullMapsAndLists from '../../utils/fullMapsAndLists';

class Delegate {
  constructor(dispatch, ownProps) {
    this.dispatch = dispatch;
    this.ownProps = ownProps;

    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.handleInitialize = this.handleInitialize.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleRevert = this.handleRevert.bind(this);
    this.hasDifferentDbValues = this.hasDifferentDbValues.bind(this);
    this.isDbValueSameAsNodeValue = this.isDbValueSameAsNodeValue.bind(this);
  }

  /**
   * @param {Schema} schema - An instance of Schema to use to create requests.
   */
  componentWillUnmount(schema) {
    this.dispatch(clearResponse(schema.getCurie()));
  }

  /**
   * Initializes the container.
   *
   * This is needed because state is not wiped out
   * when components/container are unmounted.
   */
  handleInitialize() {
    const { node, schema } = this.ownProps;
    const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
    this.dispatch(schema.createMessage().set('stream_id', streamId).set('count', 10));
  }

  /**
   * Handles load more events.
   *
   * @param {string} since - Return events since this time.
   */
  handleLoadMore(since) {
    const { node, schema } = this.ownProps;
    const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
    this.dispatch(schema.createMessage({
      count: 10,
      stream_id: streamId,
      since,
    }));
  }

  /**
   * Handles Revert.
   *
   * @param {array} selected
   */
  handleRevert(selected) {
    const { node, nodeRequest, formName, setBlocks } = this.ownProps;
    const updatedNode = node.clone();
    selected.forEach((item) => {
      const { id, value } = item;
      const field = node.schema().getField(id);
      if (id === 'blocks') {
        setBlocks(this.dispatch, formName, value);
        return;
      }
      updatedNode.clear(id);
      if (field.isASingleValue()) {
        updatedNode.set(id, value);
      }
      if (field.isASet()) {
        updatedNode.addToSet(id, value);
      }
      if (field.isAList()) {
        updatedNode.addToList(id, value ? Array.from(value) : []);
      }
      if (field.isAMap()) {
        /* eslint-disable no-restricted-syntax */
        for (const [k, v] of Object.entries(value)) {
          updatedNode.addToMap(id, k, v);
        }
      }
    });

    this.dispatch(updateResponseNode(updatedNode, nodeRequest.schema().getCurie()));

    setTimeout(() => this.dispatch(change(formName, '_forceDirty', true)));
  }

  /**
   * Is Db Value Same As Node Value
   *
   * (For lack of a shorter name.)
   *
   * @param {string} id
   * @param {*} dbValue
   * @returns boolean
   */
  isDbValueSameAsNodeValue(id, dbValue) {
    const nodeValue = this.ownProps.node.toObject()[id];
    return isEqual(dbValue, nodeValue);
  }

  /**
   * Checks against the current event for different db values.
   * @param {*} event
   * @returns boolean
   */
  hasDifferentDbValues(event) {
    // find properties in node that were removed
    const newNode = event.get('new_node').toObject();
    const oldNode = event.get('old_node').toObject();
    const newNodeKeys = Object.keys(newNode);
    const oldNodeKeys = Object.keys(oldNode);
    const missingKeys = oldNodeKeys.filter((x) => !newNodeKeys.includes(x));

    missingKeys.forEach((key) => {
      newNode[key] = null;
    });

    const diffNode = findNodeDiff(filterRevertableData(newNode), filterRevertableData(oldNode));
    const data = filterRemoved(fullMapsAndLists(filterRevertableData(diffNode), newNode));
    const aDiffField = data[Object.keys(data).find((dbField) => !this.isDbValueSameAsNodeValue(dbField, data[dbField]))];

    return aDiffField !== undefined;
  }
}

export { Delegate };
export default (dispatch, ownProps) => new Delegate(dispatch, ownProps);
