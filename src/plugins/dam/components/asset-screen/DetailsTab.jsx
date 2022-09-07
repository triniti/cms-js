import React, { lazy, Suspense } from 'react';
import startCase from 'lodash-es/startCase';
import { Card, CardBody, CardHeader } from 'reactstrap';
import {
  TextField
} from 'components';
import filesize from 'filesize';
import TaggableFields from 'plugins/common/components/taggable-fields';

const getFileSize = (value) => {
    return filesize(value.toString(), {round :1});
  }




const components = {};
const resolveComponent = (label) => {
  if (components[label]) {
    return components[label];
  }

  const file = startCase(label).replace(/\s/g, '');
  components[label] = lazy(() => import(`./${file}Fields`));
  return components[label];
};

export default function DetailsTab(props) {
  const { label, node, nodeRef } = props;
  const FieldsComponent = resolveComponent(label);
  const schema = node.schema();

  const getDimensions = (value) =>{
    return `${value} x ${node.get('height')}`;
 }

  return (
    <>
      <Card>
        <CardHeader>{startCase(label).replace(/\s/g, ' ')}</CardHeader>
        <CardBody>
          <TextField name="mime_type" label="MIME type" readOnly />
          <TextField name="file_size" label="File size"  format={getFileSize} />
          {label==='image-asset' && (
            <TextField name="width" label="Dimensions"  format={getDimensions} />
          )}
          <TextField name="title" label="Title" required />
        </CardBody>
      </Card>
      <TaggableFields />
    </>
  );
}
