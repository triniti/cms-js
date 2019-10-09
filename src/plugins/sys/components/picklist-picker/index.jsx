import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';


import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Exception from '@gdbots/common/Exception';
import Message from '@gdbots/pbj/Message';
import {
  Alert,
  FormGroup,
  FormText,
  Label,
  Select,
  StatusMessage,
} from '@triniti/admin-ui-plugin/components';
import { STATUS_FAILED, STATUS_REJECTED } from '@triniti/app/constants';

import delegateFactory from './delegate';
import selector from './selector';

class PicklistPicker extends React.Component {
  static propTypes = {
    allowOther: PropTypes.bool,
    error: PropTypes.string,
    isEditMode: PropTypes.bool,
    label: PropTypes.string,
    input: PropTypes.object, // eslint-disable-line
    meta: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    multi: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    picklistId: PropTypes.string.isRequired,
    touched: PropTypes.bool,
    value: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    warning: PropTypes.string,
    delegate: PropTypes.shape({
      getPicklist: PropTypes.func.isRequired,
    }).isRequired,
    getNodeRequestState: PropTypes.shape({
      exception: PropTypes.instanceOf(Exception),
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
    }).isRequired,
    node: PropTypes.instanceOf(Message),
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
  };

  static defaultProps = {
    allowOther: false,
    isEditMode: false,
    label: '',
    multi: false,
    node: null,
    meta: {},
    error: '',
    touched: false,
    warning: '',
  };

  componentDidMount() {
    const { delegate, getNodeRequestState: { exception }, node } = this.props;
    if (!node && (!exception || exception.getCode() !== Code.NOT_FOUND.getValue())) {
      delegate.getPicklist();
    }
  }

  render() {
    const {
      allowOther,
      input,
      getNodeRequestState: { exception, status },
      isEditMode,
      label,
      multi,
      options,
      picklistId,
      value,
      error,
      touched,
      warning,
      onChange,
      ...rest
    } = this.props;

    if (exception && (status === STATUS_FAILED || status === STATUS_REJECTED)) {
      return (
        <FormGroup>
          <Label>{label}</Label>
          {exception.getCode() === Code.NOT_FOUND.getValue()
            ? (
              <Alert color="danger">
                  Please make sure {picklistId} Picklist has been created!
              </Alert>
            )
            : <StatusMessage key="status" exception={exception} status={status} />}
        </FormGroup>
      );
    }

    return (
      <FormGroup>
        <Label>{label}</Label>
        <Select
          creatable={allowOther}
          isDisabled={!isEditMode}
          isMulti={multi}
          onChange={onChange}
          options={options}
          value={value}
          {...rest}
        />
        {warning
          && <FormText color="warning">{warning}</FormText>}
        {touched && error
          && <FormText color="danger">{error}</FormText>}
      </FormGroup>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PicklistPicker);
