import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { KeyValuesField, NumberField, SwitchField, TextField, TrinaryField } from 'components';

export default function DetailsTab() {
  return (
    <Card>
      <CardHeader>Details</CardHeader>
      <CardBody className="pb-0">
        <TextField name="title" label="Title" readOnly required />
        <KeyValuesField name="booleans" label="Booleans" component={SwitchField} size="lg" />
        <KeyValuesField name="floats" label="Floats" component={NumberField} />
        <KeyValuesField name="ints" label="Integers" component={NumberField} />
        <KeyValuesField name="strings" label="Strings" component={TextField} />
        <KeyValuesField name="trinaries" label="Trinaries" component={TrinaryField} />
      </CardBody>
    </Card>
  );
}
