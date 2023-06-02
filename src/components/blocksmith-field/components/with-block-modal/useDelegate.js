import React from 'react';
import getRootFields from 'utils/getRootFields';
import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

export default (props) => {
  const { delegate, form, formState, isFreshBlock, onAddBlock, onEditBlock, pbj } = props;

  delegate.handleSave = form.submit;
  delegate.handleSubmit = async (values) => {
    const paths = getRootFields(Object.keys(formState.dirtyFields));
    paths.forEach(path => {
      if (path === 'aspect_ratio') {
        return pbj.set(path, AspectRatio.create(values[path]));
      }
      if (path.endsWith('_date')) {
        return pbj.set(path, new Date(values[path]));
      }
      if (path.endsWith('_refs') && values[path].length > 0) {
        pbj.clear(path);
        return pbj.addToList(path, values[path].map((nodeRef) => NodeRef.fromString(nodeRef)));
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