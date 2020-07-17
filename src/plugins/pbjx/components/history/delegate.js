import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import DateTimeType from '@gdbots/pbj/types/DateTimeType';
import { change } from 'redux-form';
import camelCase from 'lodash/camelCase';
import isEqual from 'lodash/isEqual';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';
import { filterRevertableData } from '../../utils/filterData';
import filterRemoved from '../../utils/filterRemoved';
import findNodeDiff from '../../utils/findNodeDiff';
import fullMapsAndLists from '../../utils/fullMapsAndLists';


/**
 * Takes DB ID and returns what it would be on the form.
 *
 * @param {string} id
 * @returns {string}
 */
const toFormId = (id) => {
  let formId = null;
  switch (id) {
    case 'live_m3u8_url':
      formId = 'liveM3u8Url';
      break;

    case 'channel_ref':
    case 'sponsor_ref':
      formId = camelCase(`${id.substr(0, id.lastIndexOf('_'))}_refs`);
      break;

    default:
      formId = camelCase(id);
      break;
  }

  return formId;
};

/**
 * Formats value to what our redux form expects.
 *
 * @param {string} id
 * @param {*} value
 * @returns {*}
 */
const toFormValue = (id, value) => {
  if (!value) {
    return value;
  }

  let formValue = value;

  if (id.endsWith('refs') || ['channel_ref', 'sponsor_ref'].includes(id)) {
    if (!Array.isArray(value)) {
      formValue = [NodeRef.fromString(value)];
    } else {
      formValue = value.map((v) => NodeRef.fromString(v));
    }
  } else if (['classification', 'swipe', 'theme'].includes(id)) {
    formValue = {
      label: value,
      value,
    };
  } else if (['dfp_cust_params', 'tags'].includes(id)) {
    formValue = [];
    /* eslint-disable no-restricted-syntax */
    for (const [key, keyValue] of Object.entries(value)) {
      formValue.push({
        key,
        value: keyValue,
      });
    }
  } else if (id === 'slotting') {
    formValue = [];
    /* eslint-disable no-restricted-syntax */
    for (const [key, keyValue] of Object.entries(value)) {
      formValue.push({
        key: {
          label: key,
          value: key,
        },
        value: keyValue,
      });
    }
  } else if (['hashtags', 'meta_keywords'].includes(id) && Array.isArray(value)) {
    formValue = value.map((currentValue) => ({
      label: currentValue,
      value: currentValue,
      __isNew__: true,
    }));
  }
  return formValue;
};

/**
 * Format HF (Headline Fragment Field) Value
 *
 * @param {string} id
 * @param {Object} value
 * @param {Object} origHf
 */
const formatHfValue = (id, value, origHf) => {
  const newHf = [...origHf];
  const sizes = {
    1: 'XL',
    2: 'L',
    3: 'M',
    4: 'S',
    5: 'XS',
    6: 'XSS',
  };
  const styles = {
    uppercase: 'UPPERCASE',
    titlecase: 'TitleCase',
    none: 'no styling',
  };

  value.forEach((currentValue, index) => {
    switch (id) {
      case 'hf':
        newHf[index].text = currentValue;
        break;
      case 'hf_sizes':
        newHf[index].size = { label: sizes[currentValue], value: currentValue };
        break;
      case 'hf_styles':
        newHf[index].style = { label: styles[currentValue], value: currentValue };
        break;
      default:
        break;
    }
  });
  return newHf;
};

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
  handleInitialize(formValues) {
    this.formValues = formValues;
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
    const { node, formName, setBlocks } = this.ownProps;
    selected.forEach((item) => {
      const { id, value } = item;
      const formId = toFormId(id);
      const formValue = toFormValue(id, value);
      if (id === 'blocks') {
        setBlocks(this.dispatch, formName, formValue);
      } else if (['hf', 'hf_sizes', 'hf_styles'].includes(id)) {
        this.dispatch(change(formName, 'hf', formatHfValue(id, value, this.formValues.hf)));
      } else {
        const fieldType = node.schema().getField(id).getType();
        if (fieldType instanceof DateTimeType && formValue) {
          this.dispatch(change(formName, formId, new Date(formValue)));
        } else {
          this.dispatch(change(formName, formId, formValue));
        }
      }
    });
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
