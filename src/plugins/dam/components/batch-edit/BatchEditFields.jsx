import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Col, FormGroup, Row } from '@triniti/admin-ui-plugin/components';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import { DATE_FIELD_QUICK_SELECT_OPTIONS } from '@triniti/cms/plugins/dam/constants';

export default class BatchEditFields extends React.Component {
  static propTypes = {
    assetIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentValues: PropTypes.shape({
      credit: PropTypes.object,
      expiresAt: PropTypes.instanceOf(Date),
    }),
    onBatchUpdate: PropTypes.func,
    initialValues: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    currentValues: {},
    onBatchUpdate: noop,
  };

  constructor(props) {
    super(props);
    this.handleBatchUpdate = this.handleBatchUpdate.bind(this);
  }

  handleBatchUpdate() {
    const {
      assetIds,
      onBatchUpdate,
      initialValues,
      currentValues,
    } = this.props;
    onBatchUpdate(currentValues.credit.value, assetIds, initialValues);
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <FormGroup>
              <Field name="title" component={TextField} label="Title" placeholder="Title" size="sm" />
            </FormGroup>
          </Col>
        </Row>
        <Row className="gutter-sm">
          <Col>
            <FormGroup>
              <Field
                component={PicklistPickerField}
                isEditMode
                label="Credit"
                name="credit"
                picklistId="image-asset-credits"
                size="sm"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="gutter-sm">
          <Col>
            <Field
              component={DatePickerField}
              label="Expires At"
              name="expiresAt"
              quickSelectOptions={DATE_FIELD_QUICK_SELECT_OPTIONS}
              showQuickSelect
              showSetCurrentDateTimeIcon={false}
              showTime={false}
              size="sm"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup className="mb-3">
              <Field name="description" component={TextareaField} label="description" size="sm" />
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}
