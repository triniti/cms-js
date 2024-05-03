import React from 'react';
import { Col, Row } from 'reactstrap';
import { SwitchField, TextField, UrlField } from '@triniti/cms/components/index.js';
import PicklistField from 'plugins/sys/components/picklist-field';

export default function CarouselWidgetFields() {
  return (
    <>
      <Row>
        <Col xs={4}>
          <SwitchField name="show_header" label="Show Header" />
        </Col>
        <Col xs={4}>
          <SwitchField name="show_border" label="Show Border" />
        </Col>
        <Col xs={4}>
          <SwitchField name="show_options" label="Show Options" />
        </Col>
        <Col xs={4}>
          <SwitchField name="show_controls" label="Show Controls" />
        </Col>
        <Col xs={4}>
          <SwitchField name="show_position_indicators" label="Show Position Indicators" />
        </Col>
      </Row>

      <TextField name="header_text" label="Header Text" />
      <PicklistField name="widget_themes" label="Theme" />
      <TextField name="view_all_text" label="View All Text" />
      <UrlField name="view_all_url" label="View All Url" />
      <TextField name="partner_text" label="Partner Text" />
      <UrlField name="partner_url" label="Partner Url" />
    </>
  );
}
