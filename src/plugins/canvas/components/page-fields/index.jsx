import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';

import DatePickerField from '@triniti/cms/components/date-picker-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import RedirectPickerField from '@triniti/cms/plugins/sys/components/redirect-picker-field';
import Schema from '@gdbots/pbj/Schema';
import SelectField from '@triniti/cms/components/select-field';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextField from '@triniti/cms/components/text-field';
import { Card, CardBody, CardHeader } from '@triniti/admin-ui-plugin/components';

const PageFields = ({ formName, page, isEditMode, layouts, schemas }) => (
  <Card>
    <CardHeader>Details</CardHeader>
    <CardBody indent>
      <Field readOnly={!isEditMode} name="title" component={TextField} label="Title" placeholder="Enter Title" size="xlg" />
      <SlugEditor
        formName={formName}
        initialSlug={page.get('slug')}
        isEditMode={isEditMode}
        nodeRef={page.get('_id').toNodeRef()}
        schemas={schemas}
      />
      {
        schemas.node.hasMixin('triniti:curator:mixin:teaserable') && (
          <Field
            component={DatePickerField}
            label="Order Date"
            name="orderDate"
            readOnly={!isEditMode}
          />
        )
      }
      {
        schemas.node.hasMixin('gdbots:ncr:mixin:expirable') && (
          <Field
            component={DatePickerField}
            label="Expires At"
            name="expiresAt"
            readOnly={!isEditMode}
          />
        )
      }
      <Field
        component={ImageAssetPickerField}
        isEditMode={isEditMode}
        label="Primary Image"
        name="imageRef"
        node={page}
      />

      <hr />

      <Field disabled={!isEditMode} name="layout" component={SelectField} label="Layout" options={layouts} />
      {
        schemas.node.hasMixin('triniti:sys:mixin:vanity-urlable') && (
          <FieldArray
            component={RedirectPickerField}
            isEditMode={isEditMode}
            label="Vanity URL"
            name="redirectRefs"
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

PageFields.propTypes = {
  formName: PropTypes.string,
  isEditMode: PropTypes.bool,
  layouts: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  page: PropTypes.instanceOf(Message).isRequired,
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
};

PageFields.defaultProps = {
  formName: '',
  isEditMode: false,
  layouts: [],
};

export default PageFields;
