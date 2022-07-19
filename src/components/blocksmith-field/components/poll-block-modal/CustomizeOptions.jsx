import React from 'react';
import { SwitchField } from 'components';

export default function CustomizeOptions(props) {
  const {
    aside,
    setAside
  } = props;

  return (
    <div className="container-lg py-5">
      <SwitchField
        name="aside"
        label="Aside"
        checked={aside}
        onChange={(e) => setAside(e.target.checked)}
      />
    </div>
  );
}
