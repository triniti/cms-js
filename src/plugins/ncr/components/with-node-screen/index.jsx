import React, { useEffect } from 'react';
import startCase from 'lodash-es/startCase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loading, withForm } from 'components';
import usePolicy from 'plugins/iam/components/usePolicy';
import pruneNodes from 'plugins/ncr/actions/pruneNodes';
import useNode from 'plugins/ncr/components/useNode';
import useDelegate from 'plugins/ncr/components/with-node-screen/useDelegate';
import useParams from 'plugins/ncr/components/with-node-screen/useParams';


export { useDelegate, useParams };

const defaultFormConfig = {
  restorable: true,
  keepDirtyOnReinitialize: true,
};

export default function withNodeScreen(Screen, config) {
  const ScreenWithForm = withForm(Screen, { ...defaultFormConfig, ...(config.form || {}) });
  return function ScreenWithNode(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const policy = usePolicy();
    const { editMode, nodeRef, qname, label, tab, urls } = useParams(props, config);
    const { node, refreshNode, isRefreshing, setNode, pbjxError } = useNode(nodeRef);

    useEffect(() => {
      if (editMode && !policy.isGranted(`${qname}:update`)) {
        navigate(urls.viewMode);
      }
    }, [editMode, policy]);

    useEffect(() => () => dispatch(pruneNodes()), []);

    if (!node) {
      return <Loading error={pbjxError}>Loading {startCase(label)}...</Loading>;
    }

    if (editMode && !policy.isGranted(`${qname}:update`)) {
      return <Loading>Redirecting to view mode...</Loading>;
    }

    return <ScreenWithForm
      {...props}
      formName={nodeRef}
      pbj={node}
      node={node}
      nodeRef={nodeRef}
      qname={qname}
      policy={policy}
      isRefreshing={isRefreshing}
      refreshNode={refreshNode}
      replaceNode={setNode}
      editMode={editMode}
      tab={tab}
      urls={urls}
    />;
  };
}
