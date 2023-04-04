import memoize from 'lodash/memoize';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'react-final-form';
import { Button, Col, FormGroup, Row } from 'reactstrap';
import AssetSnippet from 'plugins/dam/components/asset-snippet';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import PicklistField from 'plugins/sys/components/picklist-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import { DATE_FIELD_QUICK_SELECT_OPTIONS } from '@triniti/cms/plugins/dam/constants';

const getPicklistId = memoize((cacheKey, asset) => `${asset.schema().getCurie().getMessage()}-credits`);

export default class UploaderAssetFields extends React.Component {
  static propTypes = {
    activeHashName: PropTypes.string.isRequired,
    currentValues: PropTypes.shape({
      credit: PropTypes.shape({}),
      expiresAt: PropTypes.instanceOf(Date),
    }),
    enableCreditApplyAll: PropTypes.bool,
    enableExpirationDateApplyAll: PropTypes.bool,
    files: PropTypes.shape({ hashName: PropTypes.shape({}) }).isRequired,
    onCreditApplyToAll: PropTypes.func,
    onExpiresAtApplyToAll: PropTypes.func,
    hasMultipleFiles: PropTypes.bool,
    initialValues: PropTypes.shape({}).isRequired,
    uploadedFiles: PropTypes.shape({ hashName: PropTypes.shape({}) }).isRequired,
  };

  static defaultProps = {
    currentValues: {},
    enableCreditApplyAll: false,
    enableExpirationDateApplyAll: false,
    onCreditApplyToAll: noop,
    onExpiresAtApplyToAll: noop,
    hasMultipleFiles: false,
  };

  constructor(props) {
    super(props);
    this.handleCreditApplyToAll = this.handleCreditApplyToAll.bind(this);
    this.handleExpiresAtApplyToAll = this.handleExpiresAtApplyToAll.bind(this);
  }

  handleCreditApplyToAll() {
    const {
      onCreditApplyToAll,
      initialValues,
      currentValues,
      uploadedFiles,
    } = this.props;
    onCreditApplyToAll((currentValues.credit || {}).value, uploadedFiles, initialValues);
  }

  handleExpiresAtApplyToAll() {
    const {
      onExpiresAtApplyToAll,
      initialValues,
      currentValues,
      uploadedFiles,
    } = this.props;
    onExpiresAtApplyToAll(currentValues.expiresAt || null, uploadedFiles, initialValues);
  }

  render() {
    const {
      activeHashName,
      enableCreditApplyAll,
      enableExpirationDateApplyAll,
      files,
      hasMultipleFiles,
    } = this.props;
    const { asset, previewUrl } = files[activeHashName];

    return (
      <div>
        <AssetSnippet asset={asset} previewUrl={previewUrl} />
        <Row>
          <Col>
            <FormGroup>
              <Field name="title" component={TextField} label="Title" placeholder="Title" size="sm" />
              {asset.schema().getCurie().getMessage() === 'image-asset' && (
                <>
                  <Field name="displayTitle" component={TextField} label="Display Title" placeholder="Display title" size="sm" />
                  <Field name="altText" component={TextField} label="Alt Text" placeholder="Alternative information" size="sm" />
                </>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row className="gutter-sm">
          {!hasMultipleFiles
            && (
              <Col>
                <FormGroup>
                  <PicklistField 
                    editMode
                    label="Credit"
                    name="credit"
                    picklist={getPicklistId(activeHashName, asset)}
                    size="sm"
                  />
                </FormGroup>
              </Col>
            )}
          {hasMultipleFiles
            && [
              <Col md="9" key="a">
                <FormGroup className="mb-3">
                  <PicklistField 
                    editMode
                    label="Credit"
                    name="credit"
                    picklist={getPicklistId(activeHashName, asset)}
                  />
                </FormGroup>
              </Col>,
              <Col md="3" className="text-right" key="b">
                <div className="mt-4 w-100 d-sm-none d-md-block" />
                <Button
                  disabled={!enableCreditApplyAll}
                  onClick={this.handleCreditApplyToAll}
                >
                  Apply to all
                </Button>
              </Col>,
            ]}
        </Row>
        <Row className="gutter-sm">
          {!hasMultipleFiles && (
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
          )}
          {hasMultipleFiles
            && [
              <Col md="9" key="a">
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
              </Col>,
              <Col md="3" className="text-right" key="b">
                <div className="mt-4 w-100 d-sm-none d-md-block" />
                <Button
                  size="sm"
                  disabled={!enableExpirationDateApplyAll}
                  onClick={this.handleExpiresAtApplyToAll}
                >
                  Apply to all
                </Button>
              </Col>,
            ]}
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