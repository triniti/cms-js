import React from 'react';
import startCase from 'lodash-es/startCase';
import useNode from 'plugins/ncr/components/useNode';
import useParams from 'plugins/ncr/components/with-node-screen/useParams';
import withForm from 'plugins/dam/components/uploader/withForm';
import { Loading } from 'components';

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