import React from 'react';
import getRootFields from 'utils/getRootFields';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio';

export default (props) => {
  const { delegate, form, formState, isFreshBlock, onAddBlock, onEditBlock, pbj } = props;

  delegate.handleSave = form.submit;
  delegate.handleSubmit = async (values) => {
    const paths = getRootFields(Object.keys(formState.dirtyFields));
    paths.forEach(path => {
      if (path === 'aspect_ratio') {
        return pbj.set(path, AspectRatio.create(values[path]));
      }
      pbj.set(path, values[path]);
    });

    if (isFreshBlock) {
      onAddBlock(pbj);
    } else {
      onEditBlock(pbj);
    }

    props.toggle();
  };

  return delegate;
};
