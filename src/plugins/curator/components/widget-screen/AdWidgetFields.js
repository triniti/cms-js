import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import AdSizeEnum from '@triniti/schemas/triniti/common/enums/AdSize.js';
import { EnumField, KeyValuesField, TextField } from '@triniti/cms/components/index.js';

export default function AdWidgetFields() {
  return (
    <Card>
      <CardHeader>Ad Widget Configuration</CardHeader>
      <CardBody className="pb-0">
        <EnumField enumClass={AdSizeEnum} name="ad_size" label="Ad Size" />
        <TextField name="dfp_ad_unit_path" label="DFP Ad Unit Path" />
        <KeyValuesField name="dfp_cust_params" label="DFP Custom Parameters" component={TextField} />
      </CardBody>
    </Card>
  );
}
