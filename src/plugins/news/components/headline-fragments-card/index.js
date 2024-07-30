import React, { useEffect, useRef } from 'react';
import { useFormContext } from '@triniti/cms/components/index.js';
import { Card, CardBody, CardHeader } from 'reactstrap';
import classNames from 'classnames';
import { Col, Row } from 'reactstrap';
import { SelectField, TextField } from '@triniti/cms/components/index.js';
import noop from 'lodash-es/noop.js';
import merge from 'lodash-es/merge.js';

const HEADLINES_LENGHT = 3;

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

const OPTIONS_HEADLINES_DEFAULTS = ['', '', ''];
const OPTIONS_STYLES_DEFAULTS = ['uppercase', 'uppercase', 'uppercase'];
const OPTIONS_SIZES_DEFAULTS = [3, 1, 1];


export default function HeadlineFragmentsCard(props) {
  const { groupClassName = '' } = props;
  const rootClassName = classNames(groupClassName, 'form-group');
  const formContext = useFormContext();
  const { form, pbj } = formContext;
  const initialHfValueRef = useRef(null);
  const initialHfStylesValueRef = useRef(null);
  const initialHfSizesValueRef = useRef(null);

  // Setup Headlines
  useEffect(() => {
    if (!pbj) {
      return;
    }

    if (!formContext.delegate.shouldReinitialize) {
      return;
    }

    setTimeout(() => {
      const hf = pbj.get('hf', OPTIONS_HEADLINES_DEFAULTS);
      initialHfValueRef.current = hf;
      form.registerField('hf', noop, {}, {
        initialValue: initialHfValueRef.current,
        beforeSubmit: () => {
          form.change('hf', merge([], OPTIONS_HEADLINES_DEFAULTS, form.getFieldState('hf').value));
        }
      });
    });
  });

  // Setup Styles
  useEffect(() => {
    if (!pbj) {
      return;
    }

    if (!formContext.delegate.shouldReinitialize) {
      return;
    }

    setTimeout(() => {
      const hfStyles = pbj.get('hf_styles', OPTIONS_STYLES_DEFAULTS);
      initialHfStylesValueRef.current = hfStyles;
      form.registerField('hf_styles', noop, {}, {
        initialValue: initialHfStylesValueRef.current,
        beforeSubmit: () => {
          console.log('does this work? (styles)', merge([], OPTIONS_STYLES_DEFAULTS, form.getFieldState('hf_styles').value));
          form.change('hf_styles', merge([], OPTIONS_STYLES_DEFAULTS, form.getFieldState('hf_styles').value));
        }
      });
    });
  });

  // Setup Sizes
  useEffect(() => {
    if (!pbj) {
      return;
    }

    if (!formContext.delegate.shouldReinitialize) {
      return;
    }

    setTimeout(() => {
      const hfSizes = pbj.get('hf_sizes', OPTIONS_SIZES_DEFAULTS);
      initialHfSizesValueRef.current = hfSizes;
      form.registerField('hf_sizes', noop, {}, {
        initialValue: initialHfSizesValueRef.current,
        beforeSubmit: () => {
          console.log('does this work? (sizes)', merge([], OPTIONS_SIZES_DEFAULTS, form.getFieldState('hf_sizes').value));
          form.change('hf_sizes', merge([], OPTIONS_SIZES_DEFAULTS, form.getFieldState('hf_sizes').value));
        }
      });
    });
  });

  return (
    <Card>
      <CardHeader>Headline Fragments</CardHeader>
      <CardBody className="pb-0">
        <div className={rootClassName} id={`form-group-headline-fragments`}>
          {[...Array(HEADLINES_LENGHT).keys()].map((index) => {
            return (
              <Row className="gx-2" key={`hf_row[${index}]`}>
                <Col>
                  <TextField name={`hf[${index}]`} pbjName="hf" />
                </Col>
                <Col xs="2">
                  <SelectField name={`hf_styles[${index}]`} pbjName="hf_styles" isClearable={false} options={OPTIONS_STYLES} />
                </Col>
                <Col xs="2">
                  <SelectField name={`hf_sizes[${index}]`} pbjName="hf_sizes" isClearable={false} options={OPTIONS_SIZES} />
                </Col>
              </Row>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}