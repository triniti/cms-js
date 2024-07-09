import React from 'react';
import { Alert } from 'reactstrap';

export default function YoutubeVideoBlockPreview(props) {
  const { pbj } = props;
  return (
    <Alert color="warning">
      <h1>Youtube Video Block</h1>
      <p>{pbj.schema().getId().toString()}</p>
    </Alert>
  );
}
