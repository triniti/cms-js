import React from 'react';

export default function CodeBlockPreview({ block }) {
  return <div dangerouslySetInnerHTML={{ __html: block.get('code') }} />;
};
