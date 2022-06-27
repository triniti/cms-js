import noop from 'lodash/noop';
import throttle from 'lodash/throttle';
import PropTypes from 'prop-types';
import React from 'react';
import computeScrollIntoView from 'compute-scroll-into-view';
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
    this.fileList = React.createRef();
    this.ensureActiveItemVisible = this.ensureActiveItemVisible.bind(this);
    this.throttleActiveItemVisibility = throttle(this.ensureActiveItemVisible, 5000);
  }

  componentDidUpdate() {
    this.throttleActiveItemVisibility();
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
    if (!this.activeFileItem) {
      return
    }
    
    // computeScrollIntoView thinks we need to scroll more elements than is actually necessary/desired
    computeScrollIntoView(this.activeFileItem, { scrollMode: 'if-needed' }).forEach((action) => {
      if (action.el.className !== this.fileList.current.className) {
        return
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
  }

  render() {
    const {
      files,
      onDelete,
      onRetry,
      onSelectFile,
    } = this.props;

    return (
      <div className="dam-file-list" ref={this.fileList}>
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
