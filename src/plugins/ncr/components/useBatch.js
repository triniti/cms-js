import { useEffect, useRef, useState } from 'react';

export default (response) => {
  const batchRef = useRef(null);
  const [total, setTotal] = useState(0);
  const [totalSelected, setTotalSelected] = useState(0);
  const [refreshed, setRefreshed] = useState(0);

  useEffect(() => {
    if (!response) {
      return;
    }

    batchRef.current = new Set();
    setTotal(response.get('nodes', []).length);
    setTotalSelected(0);
  }, [response]);

  const toggle = (node) => {
    if (!batchRef.current) {
      setRefreshed(refreshed + 1);
      return;
    }

    if (batchRef.current.has(node)) {
      batchRef.current.delete(node);
      setTotalSelected(totalSelected - 1);
    } else {
      batchRef.current.add(node);
      setTotalSelected(totalSelected + 1);
    }
  };

  const toggleAll = () => {
    if (!batchRef.current) {
      setRefreshed(refreshed + 1);
      return;
    }

    const shouldDeleteAll = hasAll();
    for (const node of response.get('nodes', [])) {
      if (shouldDeleteAll) {
        batchRef.current.delete(node);
      } else {
        batchRef.current.add(node);
      }
    }

    setTotalSelected(shouldDeleteAll ? 0 : total);
  };

  const has = node => batchRef.current ? batchRef.current.has(node) : false;
  const hasAll = () => {
    if (!batchRef.current || totalSelected === 0) {
      return false;
    }

    return totalSelected === total;
  };

  const remove = (node) => {
    if (!batchRef.current) {
      setRefreshed(refreshed + 1);
      return;
    }

    batchRef.current.delete(node);
    setTotalSelected(totalSelected - 1);
  };

  const reset = () => {
    if (!batchRef.current) {
      setTotalSelected(0);
      return;
    }

    batchRef.current = new Set();
    setTotalSelected(0);
  };

  const values = () => {
    if (!batchRef.current) {
      return (new Set).values();
    }

    return batchRef.current.values();
  };

  return {
    toggle,
    toggleAll,
    has,
    hasAll,
    remove,
    reset,
    values,
    size: batchRef.current ? batchRef.current.size : 0,
  };
};
