import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import AssetSnippet from '@triniti/cms/plugins/dam/components/asset-snippet';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import Message from '@gdbots/pbj/Message';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import TranscodeableCard from '@triniti/cms/plugins/ovp/components/transcodeable-card';
import TranscribeableCard from '@triniti/cms/plugins/ovp/components/transcribeable-card';
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
        picklistId="video-asset-credits"
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
  schemas.node.hasMixin('triniti:ovp:mixin:transcodeable')
  && <TranscodeableCard node={asset} />,
  schemas.node.hasMixin('triniti:ovp:mixin:transcribable')
  && <TranscribeableCard node={asset} />,
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
