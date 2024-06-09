import React, { useEffect } from 'react';
import startCase from 'lodash-es/startCase.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loading, withForm } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import pruneNodes from '@triniti/cms/plugins/ncr/actions/pruneNodes.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import useDelegate from '@triniti/cms/plugins/ncr/components/with-node-screen/useDelegate.js';
import useParams from '@triniti/cms/plugins/ncr/components/with-node-screen/useParams.js';
import useRaven from '@triniti/cms/plugins/raven/components/useRaven.js';


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

    useRaven({ editMode, node, nodeRef });

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
