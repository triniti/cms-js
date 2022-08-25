import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextField } from 'components';
import AdvertisingFields from 'plugins/common/components/advertising-fields';
import TaggableFields from 'plugins/common/components/taggable-fields';


export default function DetailsTab(props) {
  const { node, nodeRef } = props;
  const schema = node.schema();

  return (
    <>
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody>
        <TextField name="title" label="Title" required />
      </CardBody>
    </Card>
    <AdvertisingFields />
    <TaggableFields />
  </>
  );
}
