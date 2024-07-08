import React from 'react';
import Blocksmith from '@triniti/cms/blocksmith/index.js';
import useField from '@triniti/cms/components/useField.js';
import useFormContext from '@triniti/cms/components/useFormContext.js';

export default function BlocksmithField(props) {
  const formContext = useFormContext();
  const { input } = useField({ name: 'blocks', ...props }, formContext);
  return (
    <div>
      <Blocksmith
        blocks={input.value}
        editMode={formContext.editMode}
        node={formContext.pbj}
        onChange={input.onChange}
      />
    </div>
  );
}
