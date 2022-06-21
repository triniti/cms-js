import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import swal from 'sweetalert2';

import FileItem from './FileItem';

class FileList extends React.Component {
  static async confirmSelect() {
    return swal.fire({
      cancelButtonClass: 'btn btn-secondary',
      confirmButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      text: 'Do you want to select another asset without saving? The unsaved changes will be lost.',
      title: 'Are you sure?',
      type: 'warning',
      reverseButtons: true,
    });
  }

  static propTypes = {
    files: PropTypes.shape({ hashName: PropTypes.object }).isRequired,
    isFormDirty: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSelectFile: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentDidUpdate() {
    this.ensureActiveItemVisible();
  }

  handleOnChange(hashName) {
    const { isFormDirty, onSelectFile } = this.props;
    if (!isFormDirty) {
      onSelectFile(hashName);
    } else {
      FileList.confirmSelect().then(({ value }) => {
        if (value) {
          onSelectFile(hashName);
        } else {
          // do nothing, user declined
        }
      });
    }
  }

  ensureActiveItemVisible() {
    if (this.activeFileItem) {
      scrollIntoViewIfNeeded(this.activeFileItem, {
        scrollMode: 'if-needed',
        behavior: (actions) => {
          const canSmoothScroll = ('scrollBehavior' in document.body.style);
          actions.forEach((_ref) => {
            if (_ref.el.className !== 'dam-file-list') { // todo: use a ref for this comparison
              return;
            }
            const el = _ref.el;
            const top = _ref.top;
            const left = _ref.left;

            if (el.scroll && canSmoothScroll) {
              el.scroll({
                top,
                left,
                behavior: 'smooth',
              });
            } else {
              el.scrollTop = top;
              el.scrollLeft = left;
            }
          });
        },
      });
    }
  }

  render() {
    const {
      files,
      onDelete,
      onRetry,
      onSelectFile,
    } = this.props;

    return (
      <div className="dam-file-list">
        {
          Object.keys(files).map((hash) => (
            <FileItem
              file={files[hash]}
              hashName={hash}
              key={hash}
              onClick={() => this.handleOnChange(hash)}
              onDelete={onDelete}
              onRetry={onRetry}
              onSelectFile={onSelectFile}
              innerRef={files[hash].active ? (el) => { this.activeFileItem = el; } : noop}
            />
          ))
        }
      </div>
    );
  }
}

export default FileList;
