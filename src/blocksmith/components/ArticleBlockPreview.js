import React from 'react';
import { Alert } from 'reactstrap';

export default function ArticleBlockPreview(props) {
  const { pbj } = props;
  return (
    <Alert color="info">
      <h1>Article Block</h1>
      <p>{JSON.stringify(pbj)}</p>
    </Alert>
  )
}
