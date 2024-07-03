import { useEffect, useRef, useState } from 'react';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';

export default (config = {}) => {
  const batchRef = useRef(null);
  const refreshedRef = useRef(0);
  const [refreshed, setRefreshed] = useState(0);
  refreshedRef.current = refreshed;

  useEffect(() => {
    batchRef.current = new Map();
    return () => {
      if (!batchRef.current) {
        return;
      }

      batchRef.current.forEach((upload) => {
        upload.cancel();
      });

      batchRef.current = null;
    };
  }, []);

  const add = (upload) => {
    if (!batchRef.current) {
      refresh();
      return;
    }

    batchRef.current.set(upload.nameHash, upload);
    refresh();
  };

  const remove = (nameHash) => {
    if (!batchRef.current) {
      refresh();
      return;
    }

    batchRef.current.delete(nameHash);
    refresh();
  };

  const has = (nameHash) => {
    if (!batchRef.current) {
      return false;
    }

    return batchRef.current.has(nameHash);
  };

  const get = (nameHash) => {
    if (!batchRef.current) {
      return null;
    }

    return batchRef.current.get(nameHash);
  };

  const clear = () => {
    if (!batchRef.current) {
      refresh();
      return;
    }

    batchRef.current = new Map();
    refresh();
  };

  const values = () => {
    if (!batchRef.current) {
      return [];
    }

    return Array.from(batchRef.current.values());
  };

  const refresh = () => {
    setRefreshed(refreshedRef.current + 1);
  };

  const completed = () => {
     if (!batchRef.current) {
      return true;
    }

    let total = 0;
    for (let upload of batchRef.current.values()) {
      if (upload.status === uploadStatus.COMPLETED) {
        total++;
      }
    }

    return total;
  };

  return {
    config,
    add,
    remove,
    has,
    get,
    clear,
    values,
    refresh,
    completed: completed(),
    size: batchRef.current ? batchRef.current.size : 0,
  };
};
