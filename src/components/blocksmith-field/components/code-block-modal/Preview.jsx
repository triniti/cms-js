import React from 'react';

export default function CodeBlockPreview({ formState }) {
  return <div dangerouslySetInnerHTML={{ __html: formState.values.code }} />;
};
