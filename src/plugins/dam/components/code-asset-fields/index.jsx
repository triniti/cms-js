import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import TextField from '@triniti/cms/components/text-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import AssetSnippet from '@triniti/cms/plugins/dam/components/asset-snippet';
import Message from '@gdbots/pbj/Message';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';

const CodeAssetFields = ({ asset, isEditMode, schemas }) => ([
  <Card key="asset">
    <CardHeader>Code Asset</CardHeader>
    <CardBody indent>
      <AssetSnippet asset={asset} />
      <Field
        name="title"
        component={TextField}
        label="Title"
        placeholder="enter title"
        readOnly={!isEditMode}
        size="xlg"
      />
      <Field
        name="displayTitle"
        component={TextField}
        label="Display Title"
        placeholder="enter display title"
        readOnly={!isEditMode}
      />
      <Field
        component={PicklistPickerField}
        isEditMode={isEditMode}
        label="Credit"
        name="credit"
        picklistId="code-asset-credits"
      />
      <Field
        name="creditUrl"
        component={TextField}
        label="Credit Url"
        placeholder="enter credit url"
        readOnly={!isEditMode}
      />
      <Field
        name="ctaText"
        component={TextField}
        label="Cta Text"
        placeholder="enter cta text"
        readOnly={!isEditMode}
      />
      <Field
        name="ctaUrl"
        component={TextField}
        label="Cta Url"
        placeholder="enter cta url"
        readOnly={!isEditMode}
      />
      <Field
        component={DatePickerField}
        label="Expires At"
        name="expiresAt"
        readOnly={!isEditMode}
        showSetCurrentDateTimeIcon={false}
        showTime={false}
      />
      <Field
        name="description"
        label="Description"
        component={TextareaField}
        readOnly={!isEditMode}
      />
    </CardBody>
  </Card>,
  schemas.node.hasMixin('gdbots:common:mixin:taggable')
  && <AdvancedFields key="advanced-fields" isEditMode={isEditMode} />,
]);

CodeAssetFields.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
  isEditMode: PropTypes.bool,
};

CodeAssetFields.defaultProps = {
  isEditMode: false,
};

export default CodeAssetFields;
