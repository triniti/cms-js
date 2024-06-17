import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { TextField, ValuesField } from '@triniti/cms/components/index.js';

const HighlightsCard = ({ title }) =>
  <Card>
    <CardHeader>{title || 'Highlights'}</CardHeader>
    <CardBody className="pb-0">
      <ValuesField name="episode_highlights" component={TextField} fieldLabel="Highlight" />
    </CardBody>
  </Card>
;

export default HighlightsCard;