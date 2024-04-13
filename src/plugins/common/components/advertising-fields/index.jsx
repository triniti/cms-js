import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { KeyValuesField, SwitchField, TextField } from '@triniti/cms/components';

export default function AdvertisingFields() {
  return (
    <Card>
      <CardHeader>Advertising</CardHeader>
      <CardBody className="pb-0">
        <SwitchField name="ads_enabled" label="Ads Enabled?" />
        <TextField name="dfp_ad_unit_path" label="DFP Ad Unit Path" />
        <KeyValuesField name="dfp_cust_params" label="DFP custom parameters" component={TextField} />
      </CardBody>
    </Card>
  );
}
