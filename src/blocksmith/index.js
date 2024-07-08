import React from 'react';

export default function Blocksmith(props) {
  return <textarea value={JSON.stringify(props.node.toObject())} />;
}
