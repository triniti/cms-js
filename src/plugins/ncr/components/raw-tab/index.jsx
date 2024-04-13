import React from 'react';
import RawPbj from '@triniti/cms/components/raw-pbj';

export default function RawTab({ node, tab }) {
  if (tab !== 'raw') {
    return null;
  }

  return <RawPbj pbj={node} />;
}
