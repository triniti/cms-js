import React from 'react';
import startCase from 'lodash-es/startCase.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import useParams from '@triniti/cms/plugins/ncr/components/with-node-screen/useParams.js';
import withForm from '@triniti/cms/plugins/dam/components/uploader/withForm.js';
import { Loading } from '@triniti/cms/components/index.js';

export default function withNode(Component) {
  const ComponentWithForm = withForm(Component);
  return props => {
    const config = {};
    const { nodeRef, qname, label } = useParams(props, config);
    const { refreshNodeRef } = props;
    const { node, refreshNode, isRefreshing, setNode, pbjxError } = useNode(nodeRef);
    refreshNodeRef.current = refreshNode;

    if (!node) {
      return <Loading error={pbjxError}>Loading {startCase(label)}...</Loading>;
    }

    return <ComponentWithForm
      {...props}
      formName={nodeRef}
      pbj={node}
      node={node}
      nodeRef={nodeRef}
      qname={qname}
      isRefreshing={isRefreshing}
      refreshNode={refreshNode}
      replaceNode={setNode}
      />
  }
}
