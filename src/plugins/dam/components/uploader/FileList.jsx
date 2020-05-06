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
    // Raven is making `componentDidUpdate` fire on each heart beat thus
    // the uploader modal jumps when users with a small screen (like a 13" mbp)
    // scrolls down. This will check if the user's browser is about a 13" screen
    // or less and prevent the scrolling into view from happening.
    if (document.documentElement.clientHeight > 792) {
      this.ensureActiveItemVisible();
    }
  }

  ensureActiveItemVisible() {
    if (this.activeFileItem) {
      scrollIntoViewIfNeeded(this.activeFileItem, { duration: 500 });
    }
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
