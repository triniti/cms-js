import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import classNames from 'classnames';
import { Col, Row } from 'reactstrap';
import { useFieldArray } from 'react-final-form-arrays';
import { SelectField, TextField } from '@triniti/cms/components/index.js';

const OPTIONS_STYLES = [
  { label: 'UPPERCASE', value: 'uppercase' },
  { label: 'TitleCase', value: 'titlecase' },
  { label: 'no styling', value: 'none' },
];
const OPTIONS_SIZE = [
  { label: 'XL', value: 1 },
  { label: 'L', value: 2 },
  { label: 'M', value: 3 },
  { label: 'S', value: 4 },
  { label: 'XS', value: 5 },
  { label: 'XXS', value: 6 },
];

export default function HeadlineFragmentsField(props) {
  const { pbjName, groupClassName = '' } = props;

  const rootClassName = classNames(groupClassName, 'form-group');
  const { fields } = useFieldArray('hf');

  return (
    <Card>
      <CardHeader>Headline Fragments</CardHeader>
      <CardBody className="pb-0">
        <div className={rootClassName} id={`form-group-${pbjName || name}`}>
          {fields.map((field, index) => {
            return (
              <Row className="gx-2" key={field}>
                <Col>
                  <TextField name={field} pbjName={name} />
                </Col>
                <Col xs="2">
                  <SelectField name={`hf_styles[${index}]`} options={OPTIONS_STYLES} />
                </Col>
                <Col xs="2">
                  <SelectField name={`hf_size[${index}]`} options={OPTIONS_SIZE} />
                </Col>
              </Row>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}