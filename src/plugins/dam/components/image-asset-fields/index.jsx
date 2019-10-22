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
import './style.scss';

const ImageAssetFields = ({ asset, isEditMode, schemas }) => (
  <>
    <Card>
      <CardHeader>Image Asset</CardHeader>
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
          picklistId="image-asset-credits"
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
