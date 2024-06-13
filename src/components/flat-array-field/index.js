import React from 'react';
import classNames from 'classnames';
import { Badge, Button, Col, Label, Row } from 'reactstrap';
import { FieldArray } from 'react-final-form-arrays';
import isEmpty from 'lodash-es/isEmpty.js';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import { Icon, useFormContext } from '@triniti/cms/components/index.js';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));

export default function FlatArrayField(props) {
  const { groupClassName = '', name, label, component: Component, pbjName, required, ...rest } = props;
  const { editMode, form } = useFormContext();
  const { push } = form.mutators;

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>
      <FieldArray name={name} isEqual={isEqual}>
        {({ fields }) => {
          if (!editMode && fields.length === 0) {
            return <input className="form-control" readOnly value="No values" />;
          }

          return fields.map((fname, index) => (
            <Row className="gx-2" key={fname}>
              <Col xs="11">
                <Component name={fname} label="" pbjName={name} {...rest} />
              </Col>
              {editMode && (
                <Col xs="1" className="col-btn">
                  <Button color="hover" className="rounded-circle" onClick={() => fields.remove(index)}>
                    <Icon imgSrc="trash" alt="Remove" />
                  </Button>
                </Col>
              )}
            </Row>
          ));
        }}
      </FieldArray>
      {editMode && (
        <Button outline color="light" onClick={() => push(name)}>
          <Icon imgSrc="plus-outline" size="sm" className="me-2" /> Add
        </Button>
      )}
    </div>
  );
}
