import React, { useEffect } from 'react';
import startCase from 'lodash-es/startCase.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loading, withForm } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import pruneNodes from '@triniti/cms/plugins/ncr/actions/pruneNodes.js';
import useDelegate from '@triniti/cms/plugins/ncr/components/with-node-screen/useDelegate.js';
import useParams from '@triniti/cms/plugins/ncr/components/with-node-screen/useParams.js';

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
    const { node, refreshNode, isRefreshing, setNode, pbjxError } = useNode(nodeRef, true);
    const canUpdate = policy.isGranted(`${qname}:update`);
    const canUnlock = policy.isGranted(`${qname}:unlock`);

    useEffect(() => {
      if (editMode && !canUpdate) {
        navigate(urls.viewMode);
      }
    }, [editMode, canUpdate]);

    useEffect(() => {
      if (!node || canUnlock) {
        return;
      }

      if (node.get('is_locked', false)) {
        navigate(urls.leave);
      }
    }, [node, canUnlock]);

    useEffect(() => () => dispatch(pruneNodes()), []);

    if (!node) {
      return <Loading error={pbjxError}>Loading {startCase(label)}...</Loading>;
    }

    if (editMode && !canUpdate) {
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
