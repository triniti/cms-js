import React from 'react';
import getRootFields from 'utils/getRootFields';

export default (props) => {
  const { delegate, form, formState, isFreshBlock, onAddBlock, onEditBlock, pbj } = props;

  delegate.handleSave = form.submit;
  delegate.handleSubmit = async (values) => {
    const paths = getRootFields(Object.keys(formState.dirtyFields));
    paths.forEach(path => pbj.set(path, values[path]));

    if (isFreshBlock) {
      onAddBlock(pbj);
    } else {
      onEditBlock(pbj);
    }

    props.toggle();
  };

  return delegate;
};
