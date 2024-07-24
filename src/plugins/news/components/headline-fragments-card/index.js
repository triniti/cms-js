import React from 'react';
import { useForm } from 'react-final-form'
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
const OPTIONS_SIZES = [
  { label: 'XL', value: 1 },
  { label: 'L', value: 2 },
  { label: 'M', value: 3 },
  { label: 'S', value: 4 },
  { label: 'XS', value: 5 },
  { label: 'XXS', value: 6 },
];

export default function HeadlineFragmentsCard(props) {
  const { groupClassName = '' } = props;
  const rootClassName = classNames(groupClassName, 'form-group');
  const { fields } = useFieldArray('hf');
  const form = useForm();

  // Setup default values
  if (!fields.length) {
    fields.push('');
    fields.push('');
    fields.push('');
    form.change('hf_styles[0]', 'uppercase');
    form.change('hf_styles[1]', 'uppercase');
    form.change('hf_styles[2]', 'uppercase');
    form.change('hf_sizes[0]', 3); // M
    form.change('hf_sizes[1]', 1); // XL
    form.change('hf_sizes[2]', 1); // XL
  }

  const emptyFieldToString = (field) => {
    if (!form.getFieldState(field).value)
      form.change(field, '');
  }

  return (
    <Card>
      <CardHeader>Headline Fragments</CardHeader>
      <CardBody className="pb-0">
        <div className={rootClassName} id={`form-group-headline-fragments`}>
          {fields.map((field, index) => {
            return (
              <Row className="gx-2" key={field}>
                <Col>
                  <TextField name={field} beforeSubmit={() => emptyFieldToString(field) } />
                </Col>
                <Col xs="2">
                  <SelectField name={`hf_styles[${index}]`} isClearable={false} options={OPTIONS_STYLES} />
                </Col>
                <Col xs="2">
                  <SelectField name={`hf_sizes[${index}]`} isClearable={false} options={OPTIONS_SIZES} />
                </Col>
              </Row>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}