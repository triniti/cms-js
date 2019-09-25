import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';

import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const ChannelFields = ({ channel, formName, isEditMode, schemas }) => (
  <Card key="details">
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" />
      <SlugEditor
        formName={formName}
        nodeRef={channel.get('_id').toNodeRef()}
        initialSlug={channel.get('slug')}
        isEditMode={isEditMode}
        schemas={schemas}
      />
      <Field
        areLinkedImagesAllowed={false}
        name="imageRef"
        component={ImageAssetPickerField}
        isEditMode={isEditMode}
        node={channel}
        label="Primary Image"
      />
      {
        schemas.node.hasMixin('triniti:boost:mixin:sponsorable')
        && <FieldArray name="sponsorRefs" component={SponsorPickerField} isEditMode={isEditMode} />
      }
    </CardBody>
  </Card>
);

ChannelFields.propTypes = {
  channel: PropTypes.instanceOf(Message),
  formName: PropTypes.string,
  isEditMode: PropTypes.bool,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)),
};

ChannelFields.defaultProps = {
  channel: null,
  formName: '',
  isEditMode: false,
  schemas: {},
};

export default ChannelFields;
