import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import GetNodeRequestV1 from '@gdbots/schemas/gdbots/ncr/request/GetNodeRequestV1.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import * as constants from '@triniti/cms/constants.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import { getInstance } from '@triniti/app/main.js';


const fetchNode = async (nodeRef, consistent = false) => {
  const app = getInstance();
  const pbjx = await app.getPbjx();
  const request = GetNodeRequestV1.create()
    .set('consistent_read', consistent)
    .set('node_ref', NodeRef.fromString(`${nodeRef}`));
  const response = await pbjx.request(request);
  return response.get('node');
};

export default (nodeRef, consistent = false) => {
  const cachedNode = useSelector(state => consistent ? null : getNode(state, nodeRef));
  const [node, setNode] = useState(cachedNode);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(constants.STATUS_NONE);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (!nodeRef || consistent || !cachedNode) {
      return;
    }

    setNode(cachedNode.freeze());
    setError(null);
    setStatus(constants.STATUS_FULFILLED);
  }, [nodeRef, cachedNode, consistent]);

  useEffect(() => {
    if (!nodeRef || !node || !consistent) {
      return;
    }

    setNode(null);
    setError(null);
    setStatus(constants.STATUS_NONE);
  }, [nodeRef]);

  useEffect(() => {
    if (!nodeRef) {
      return;
    }

    if (!consistent && cachedNode && refreshCount === 0) {
      return;
    }

    let cancelled = false;
    setError(null);
    setStatus(constants.STATUS_PENDING);

    (async () => {
      if (cancelled) {
        return;
      }

      let newNode;

      try {
        newNode = await fetchNode(nodeRef, consistent);
      } catch (e) {
        if (cancelled) {
          return;
        }

        setError(getFriendlyErrorMessage(e));
        setStatus(constants.STATUS_FAILED);
        return;
      }

      if (cancelled) {
        return;
      }

      setError(null);
      setStatus(constants.STATUS_FULFILLED);
      setNode(newNode.freeze());
    })();

    return () => {
      cancelled = true;
    };
  }, [nodeRef, refreshCount]);

  const isRefreshing = status === constants.STATUS_PENDING && node !== null;
  const refreshNode = () => {
    if (isRefreshing) {
      return;
    }

    setRefreshCount(refreshCount + 1);
  };

  return {
    node,
    setNode,
    refreshNode,
    isRefreshing,
    pbjxError: error,
    pbjxStatus: status,
  };
};

