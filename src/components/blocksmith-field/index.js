import React from 'react';
import Blocksmith from '@triniti/cms/blocksmith/index.js';
import useField from '@triniti/cms/components/useField.js';
import useFormContext from '@triniti/cms/components/useFormContext.js';

// todo: audit draft dependencies and decorate-component-with-props, prepend-http, etc
// todo: make sure the tests get carried over
export default function BlocksmithField(props) {
  const formContext = useFormContext();
  const { input } = useField({ ...props }, formContext);
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
