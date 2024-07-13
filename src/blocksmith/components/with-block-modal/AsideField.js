import React from 'react';
import { SwitchField } from '@triniti/cms/components/index.js';

export default function AsideField() {
  return (
    <SwitchField
      name="aside"
      label="Aside"
      description="This block is indirectly related to the main content."
    />
  );
}
