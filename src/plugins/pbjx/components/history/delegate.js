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
      formId = camelCase(`${id.substr(0, id.lastIndexOf('_'))}_refs`);
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
      formValue = value.map((currentValue) => ({
        label: currentValue,
        value: currentValue,
      }));
    }
  }

  return {
    formId,
    formValue,
  };
};

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
  }

  /**
   * Initializes the container.
   *
   * This is needed because state is not wiped out
   * when components/container are unmounted.
   */
  handleInitialize(formValues) {
    const { node, schema } = this.ownProps;
    const streamId = StreamId.fromString(`${node.schema().getCurie().getMessage()}.history:${node.get('_id')}`);
    this.formValues = formValues;
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
    const origFormValues = this.formValues;
    selected.forEach((item) => {
      const { id, value } = item;
      const { formId, formValue } = formatIdAndValue(item);
      if (id === 'blocks') {
        setBlocks(this.dispatch, formName, formValue);
      } else if (['hf', 'hf_sizes', 'hf_styles'].includes(id)) {
        this.dispatch(change(formName, 'hf', formatHfValue(id, value, origFormValues.hf)));
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
   * @param {Schema} schema - An instance of Schema to use to create requests.
   */
  componentWillUnmount(schema) {
    this.dispatch(clearResponse(schema.getCurie()));
  }
}

export { Delegate };
export default (dispatch, ownProps) => new Delegate(dispatch, ownProps);
