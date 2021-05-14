import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { DATE_FIELD_QUICK_SELECT_OPTIONS } from '@triniti/cms/plugins/dam/constants';
import { Field, FieldArray } from 'redux-form';
import AdvancedFields from '@triniti/cms/plugins/common/components/advanced-fields';
import AssetSnippet from '@triniti/cms/plugins/dam/components/asset-snippet';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import Message from '@gdbots/pbj/Message';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PollPickerField from '@triniti/cms/plugins/apollo/components/poll-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import damUrl from '../../utils/damUrl';
import './style.scss';

const ImageAssetFields = ({ asset, isEditMode, schemas }) => (
  <>
    <Card>
      <CardHeader>Image Asset</CardHeader>
      <CardBody indent>
        <AssetSnippet asset={asset} previewUrl={damUrl(asset, 'o')} />
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
          name="altText"
          component={TextField}
          label="Alt Text"
          placeholder="alternative information for an image if a user for some reason cannot view it"
          readOnly={!isEditMode}
        />
        <Field
          component={PicklistPickerField}
          isEditMode={isEditMode}
          label="Credit"
          name="credit"
          picklistId="image-asset-credits"
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
          quickSelectOptions={DATE_FIELD_QUICK_SELECT_OPTIONS}
          readOnly={!isEditMode}
          showQuickSelect
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
    </Card>
    {schemas.node.hasMixin('triniti:apollo:mixin:has-poll')
    && (
      <Card>
        <CardHeader>Poll</CardHeader>
        <CardBody>
          <FieldArray
            component={PollPickerField}
            isEditMode={isEditMode}
            isMulti={false}
            name="pollRefs"
          />
        </CardBody>
      </Card>
    )}
    {schemas.node.hasMixin('gdbots:common:mixin:taggable')
    && <AdvancedFields isEditMode={isEditMode} />}
  </>
);

ImageAssetFields.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
  isEditMode: PropTypes.bool,
  schemas: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

ImageAssetFields.defaultProps = {
  isEditMode: false,
};

export default ImageAssetFields;
