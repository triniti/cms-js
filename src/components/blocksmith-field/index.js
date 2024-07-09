import React from 'react';
import Blocksmith from '@triniti/cms/blocksmith/index.js';
import { useField, useFormContext, withPbj } from '@triniti/cms/components/index.js';

const BlocksmithWithTextBlock = withPbj(Blocksmith, `${APP_VENDOR}:canvas:block:text-block`);

export default function BlocksmithField(props) {
  const formContext = useFormContext();
  const { input } = useField({ name: 'blocks', ...props }, formContext);
  return (
    <div>
      <BlocksmithWithTextBlock
        blocks={input.value}
        editMode={formContext.editMode}
        node={formContext.pbj}
        onChange={input.onChange}
      />
    </div>
  );
}
