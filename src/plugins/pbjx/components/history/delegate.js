import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import DateTimeType from '@gdbots/pbj/types/DateTimeType';
import { change } from 'redux-form';
import camelCase from 'lodash/camelCase';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';


export default (dispatch, ownProps) => ({
  /**
   * Initializes the container.
   *
   * This is needed because state is not wiped out
   * when components/container are unmounted.
   */
  handleInitialize: () => {
    const { node, schema } = ownProps;
    const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
    dispatch(schema.createMessage().set('stream_id', streamId).set('count', 10));
  },

  /**
   * Handles load more events.
   *
   * @param {string} since - Return events since this time.
   */
  handleLoadMore: (since) => {
    const { node, schema } = ownProps;
    const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
    dispatch(schema.createMessage({
      count: 10,
      stream_id: streamId,
      since,
    }));
  },

  /**
   * Handles Revert.
   *
   * @param {array} selected
   */
  handleRevert: (selected) => {
    const { node, formName, setBlocks } = ownProps;
    selected.forEach((item) => {
      const { id, value } = item;
      const idFormatted = id === 'live_m3u8_url' ? 'liveM3u8Url' : camelCase(id);

      if (id === 'blocks') {
        setBlocks(dispatch, formName, value, true);
      } else {
        const fieldType = node.schema().getField(id).getType();
        if (fieldType instanceof DateTimeType && value) {
          dispatch(change(formName, idFormatted, new Date(value)));
        } else {
          dispatch(change(formName, idFormatted, value));
        }
      }
    });
  },

  /**
   * @param {Schema} schema - An instance of Schema to use to create requests.
   */
  componentWillUnmount: (schema) => {
    dispatch(clearResponse(schema.getCurie()));
  },
});
