import React from 'react';
import memoize from 'lodash-es/memoize';
import noop from 'lodash-es/noop.js';
import { Field } from 'react-final-form';
import { Button, Col, FormGroup, Row } from 'reactstrap';
import AssetSnippet from '@triniti/cms/plugins/dam/components/asset-snippet';
import DatePickerField from '@triniti/cms/components/date-picker-field/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';
import TextareaField from '@triniti/cms/components/textarea-field/index.js';
import TextField from '@triniti/cms/components/text-field/index.js';
import { DATE_FIELD_QUICK_SELECT_OPTIONS } from '@triniti/cms/plugins/dam/constants';

const getPicklistId = memoize((cacheKey, asset) => `${asset.schema().getCurie().getMessage()}-credits`);

export default function UploaderAssetFields ({
  activeHashName,
  currentValues: {},
  enableCreditApplyAll = false,
  enableExpirationDateApplyAll = false,
  files = {},
  onCreditApplyToAll = noop,
  onExpiresAtApplyToAll = noop,
  hasMultipleFiles = false,
  initialValues = {},
  uploadedFiles = {},
}) {
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
                onClick={() => onCreditApplyToAll((currentValues.credit || {}).value, uploadedFiles, initialValues)}
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
                onClick={() => onExpiresAtApplyToAll(currentValues.expiresAt || null, uploadedFiles, initialValues)}
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
