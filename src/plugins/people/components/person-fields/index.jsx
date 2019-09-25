import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';
import { Field, FieldArray } from 'redux-form';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import { fieldRules } from '../../constants';

const removeNewline = (value) => value && value.replace('\n', '');

const PersonFields = ({ formName, person, isEditMode, schemas }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" />
      <SlugEditor
        formName={formName}
        nodeRef={NodeRef.fromNode(person)}
        initialSlug={person.get('slug')}
        schemas={schemas}
        isEditMode={isEditMode}
      />
      <Field
        areLinkedImagesAllowed={false}
        name="imageRef"
        component={ImageAssetPickerField}
        isEditMode={isEditMode}
        node={person}
        label="Select Image"
      />
      <Field
        component={CheckboxField}
        disabled={!isEditMode}
        label="Is Celebrity"
        name="isCelebrity"
      />
      <Field
        name="bio"
        component={TextareaField}
        maxLength={fieldRules.DESCRIPTION_MAX_CHARACTERS}
        readOnly={!isEditMode}
        label="Bio"
        placeholder="Enter A Short Bio"
        normalize={removeNewline}
      />
      <Field
        name="bioSource"
        component={TextField}
        readOnly={!isEditMode}
        label="Bio Source"
        placeholder="e.g. imdb, freebase, custom"
      />
      <Field
        name="imdbUrl"
        component={TextField}
        readOnly={!isEditMode}
        label="imdb url"
      />
      <Field
        name="twitterUsername"
        component={TextField}
        readOnly={!isEditMode}
        label="Twitter Username"
      />
      {
        schemas.node.hasMixin('triniti:common:mixin:themeable') && (
          <Field
            component={PicklistPickerField}
            isEditMode={isEditMode}
            label="Theme"
            name="theme"
            picklistId="person-themes"
          />
        )
      }
      {
        schemas.node.hasMixin('triniti:boost:mixin:sponsorable')
        && <FieldArray name="sponsorRefs" component={SponsorPickerField} isEditMode={isEditMode} />
      }
    </CardBody>
  </Card>
);

PersonFields.propTypes = {
  formName: PropTypes.string,
  isEditMode: PropTypes.bool,
  person: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
};

PersonFields.defaultProps = {
  formName: '',
  isEditMode: false,
};

export default PersonFields;
