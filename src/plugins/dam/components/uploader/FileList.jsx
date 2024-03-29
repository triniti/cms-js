import React, { useEffect, useRef } from 'react';
import noop from 'lodash-es/noop';
import throttle from 'lodash-es/throttle'
import { compute as computeScrollIntoView } from 'compute-scroll-into-view';
import Swal from 'sweetalert2';

import FileItem from './FileItem';

const confirmSelect = async () => {
  return Swal.fire({
    confirmButtonText: 'Yes',
    showCancelButton: true,
    text: 'Do you want to select another asset without saving? The unsaved changes will be lost.',
    title: 'Are you sure?',
    icon: 'warning',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-danger',
      cancelButton: 'btn btn-secondary',
    },
  });
}

export default props => {
  const {
    files,
    isFormDirty = false,
    onDelete,
    onRetry,
    onSelectFile,
  } = props;
  const fileList = useRef();
  let activeFileItem = null;

  const handleOnChange = (hashName) => {
    if (!isFormDirty) {
      onSelectFile(hashName);
    } else {
      confirmSelect().then(({ value }) => {
        if (value) {
          onSelectFile(hashName);
        } else {
          // do nothing, user declined
        }
      });
    }
  };

  const ensureActiveItemVisible = () => {
    if (!activeFileItem) {
      return;
    }

    computeScrollIntoView(activeFileItem, { scrollMode: 'if-needed' }).forEach((action) => {
      if (action.el.className !== fileList.current.className) {
        // computeScrollIntoView thinks we need to scroll
        // more elements than is actually necessary/desired
        return;
      }

      const el = action.el;
      const top = action.top;

      if (el.scroll && ('scrollBehavior' in document.body.style)) {
        el.scroll({
          top,
          behavior: 'smooth',
        });
      } else {
        el.scrollTop = top;
      }
    });
  };

  const ensureActiveItemVisibleThrottled = throttle(ensureActiveItemVisible, 5000);
  useEffect(() => ensureActiveItemVisibleThrottled());

  return (
    <div className="dam-file-list" ref={fileList}>
      {
        Object.keys(files).map((hash) => (
          <FileItem
            file={files[hash]}
            hashName={hash}
            key={hash}
            onClick={() => handleOnChange(hash)}
            onDelete={onDelete}
            onRetry={onRetry}
            onSelectFile={onSelectFile}
            innerRef={files[hash].active ? (el) => { activeFileItem = el; } : noop}
          />
        ))
      }
    </div>
  );
};
