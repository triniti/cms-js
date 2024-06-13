import React, { useRef } from 'react';

export default function RenderCount() {
  const renders = useRef(0);
  return <label>count={++renders.current}</label>;
}
