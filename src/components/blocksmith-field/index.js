import React, { useRef } from 'react';
import Blocksmith from '@triniti/cms/blocksmith/index.js';
import { useField, useFormContext, withPbj } from '@triniti/cms/components/index.js';

const BlocksmithWithTextBlock = withPbj(Blocksmith, `${APP_VENDOR}:canvas:block:text-block`);

const defaultBeforeSubmit = (...args) => {
  console.log('defaultBeforeSubmit', args);
};

export default function BlocksmithField(props) {
  const formContext = useFormContext();
  const beforeSubmitRef = useRef(defaultBeforeSubmit);

  const field = useField({
      name: 'blocks',
      beforeSubmit: beforeSubmitRef.current,
      ...props
    },
    formContext
  );

  return (
    <div>
      <BlocksmithWithTextBlock
        field={field}
        beforeSubmitRef={beforeSubmitRef}
      />
    </div>
  );
}
