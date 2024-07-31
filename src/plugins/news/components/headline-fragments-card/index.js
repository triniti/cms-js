import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Col, Row } from 'reactstrap';
import { SelectField, TextField } from '@triniti/cms/components/index.js';

const fragments = [0, 1, 2];

const styles = [
  { label: 'UPPERCASE', value: 'uppercase' },
  { label: 'TitleCase', value: 'titlecase' },
  { label: 'no styling', value: 'none' },
];

const sizes = [
  { label: 'XL', value: 1 },
  { label: 'L', value: 2 },
  { label: 'M', value: 3 },
  { label: 'S', value: 4 },
  { label: 'XS', value: 5 },
  { label: 'XXS', value: 6 },
];

export default function HeadlineFragmentsCard() {
  return (
    <Card>
      <CardHeader>Headline Fragments</CardHeader>
      <CardBody>
        {fragments.map((index) => {
          return (
            <Row className="gx-2" key={`hf${index}`}>
              <Col>
                <TextField name={`hf[${index}]`} pbjName="hf" />
              </Col>
              <Col xs="2">
                <SelectField
                  name={`hf_styles[${index}]`}
                  pbjName="hf_styles"
                  isClearable={false}
                  options={styles}
                />
              </Col>
              <Col xs="2">
                <SelectField
                  name={`hf_sizes[${index}]`}
                  pbjName="hf_sizes"
                  isClearable={false}
                  options={sizes}
                />
              </Col>
            </Row>
          );
        })}
      </CardBody>
    </Card>
  );
}
