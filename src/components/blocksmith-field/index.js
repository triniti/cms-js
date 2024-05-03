import React from 'react';
import Blocksmith from '@triniti/cms/components/blocksmith-field/Blocksmith.js';
import useField from '@triniti/cms/components/useField.js';
import useFormContext from '@triniti/cms/components/useFormContext.js';

// todo: audit draft dependencies and decorate-component-with-props, prepend-http, etc
// todo: make sure the tests get carried over
export default function BlocksmithField(props) {
  const { node } = props;
  const formContext = useFormContext();
  const { input } = useField({ ...props, name: 'blocks' }, formContext);
  return (
    <div>
      <Blocksmith blocks={input.value} editMode={formContext.editMode} node={node} onChange={input.onChange} />
    </div>
  );
}
