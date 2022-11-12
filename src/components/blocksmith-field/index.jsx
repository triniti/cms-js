import React from 'react';
import Blocksmith from 'components/blocksmith-field/Blocksmith';
import useField from 'components/useField';
import useFormContext from 'components/useFormContext';

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
