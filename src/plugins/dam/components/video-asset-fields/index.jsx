import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import DatePickerField from '@triniti/cms/components/date-picker-field';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import AssetSnippet from '@triniti/cms/plugins/dam/components/asset-snippet';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import Message from '@gdbots/pbj/Message';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const VideoAssetFields = ({ asset, isEditMode, schemas }) => ([
  <Card key="asset">
    <CardHeader>Video Asset</CardHeader>
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
        component={PicklistPickerField}
        isEditMode={isEditMode}
        label="Credit"
        name="credit"
        picklistId="video-asset-credits"
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

VideoAssetFields.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
  editableEmail: PropTypes.bool,
  isEditMode: PropTypes.bool,
};

VideoAssetFields.defaultProps = {
  editableEmail: false,
  isEditMode: false,
};

export default VideoAssetFields;
