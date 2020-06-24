import clearResponse from '@triniti/cms/plugins/pbjx/actions/clearResponse';
import DateTimeType from '@gdbots/pbj/types/DateTimeType';
import { change } from 'redux-form';
import camelCase from 'lodash/camelCase';
import StreamId from '@gdbots/schemas/gdbots/pbjx/StreamId';


const formatIdAndValue = ({ id, value }) => {
  let formId = null;
  switch (id) {
    case 'live_m3u8_url':
      formId = 'liveM3u8Url';
      break;

    case 'channel_ref':
    case 'sponsor_ref':
      formId = camelCase(id.substr(0, id.lastIndexOf('_')));
      formId += 'Refs';
      break;

    default:
      formId = camelCase(id);
      break;
  }

  let formValue = value;
  if (value) {
    if (formId.endsWith('Refs') && !Array.isArray(value)) {
      formValue = [value];
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
    } else if (id === 'hashtags' && Array.isArray(value)) {
      formValue = value.reduce((accumulator, currentValue) => {
        accumulator.push({
          label: currentValue,
          value: currentValue,
        });
        return accumulator;
      }, []);
    }
  }

  return {
    formId,
    formValue,
  };
};


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
      const { id } = item;
      const { formId, formValue } = formatIdAndValue(item);
      if (id === 'blocks') {
        setBlocks(dispatch, formName, formValue, true);
      } else {
        const fieldType = node.schema().getField(id).getType();
        console.log('Richard', {
          fieldType,
          formValue,
          formName,
          formId,
        });
        if (fieldType instanceof DateTimeType && formValue) {
          dispatch(change(formName, formId, new Date(formValue)));
        } else {
          dispatch(change(formName, formId, formValue));
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
