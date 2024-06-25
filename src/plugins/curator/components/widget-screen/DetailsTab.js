import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase.js';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  ErrorBoundary,
  Loading,
  SwitchField,
  TextField,
  UrlField
} from '@triniti/cms/components/index.js';
import TaggableFields from '@triniti/cms/plugins/common/components/taggable-fields/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`@triniti/cms/plugins/curator/components/widget-screen/${file}Fields.js`));
  return components[label];
};

export default function DetailsTab(props) {
  const { label, node } = props;
  const FieldsComponent = resolveComponent(label);
  const schema = node.schema();

  return (
    <>
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody>
          <TextField name="title" label="Title" required />
          <TextField name="header_text" label="Header Text" />
          <SwitchField name="show_header" label="Show Header" />
          <SwitchField name="show_border" label="Show Border" />
          <TextField name="view_all_text" label="View All Text" />
          <UrlField name="view_all_url" label="View All URL" />
          <TextField name="partner_text" label="Partner Text" />
          <UrlField name="partner_url" label="Partner Url" />
          {schema.hasMixin('triniti:common:mixin:themeable') && (
            <PicklistField name="theme" label="Theme" picklist={`${label}-themes`} />
          )}
        </CardBody>
      </Card>

      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <FieldsComponent {...props} />
        </ErrorBoundary>
      </Suspense>

      <TaggableFields />
    </>
  );
}
