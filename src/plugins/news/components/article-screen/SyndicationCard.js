import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { SwitchField } from '@triniti/cms/components/index.js';

export default function SyndicationCard() {
  return (
    <Card>
      <CardHeader>Syndication</CardHeader>
      <CardBody>
        <Row>
          <Col sm={6} xl={3}>
            <SwitchField name="apple_news_enabled" label="Apple News" />
          </Col>
          <Col sm={6} xl={3}>
            <SwitchField name="amp_enabled" label="Google AMP" />
          </Col>
          <Col sm={6} xl={3}>
            <SwitchField name="smartnews_enabled" label="SmartNews" />
          </Col>
          <Col sm={6} xl={3}>
            <SwitchField name="twitter_publish_enabled" label="Twitter" />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
