import React from 'react';
import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';
import PaginatorItem from 'plugins/dam/components/uploader/PaginatorItem';
import PaginatorNoFiles from 'plugins/dam/components/uploader/PaginatorNoFiles';

// Change this to the amount of files to display as paginating buttons
const MAX_FILE_LINKS = 3;

export default ({
  files,
  onSelectFile,
  className,
}) => {
  const fileKeys = Object.keys(files);
  const previousOptions = { disabled: true };
  const nextOptions = { disabled: true };
  let paginatorButtons = [];

  if (fileKeys.length) {
    let activeFileIndex = null;

    // Next & Previous button functionality
    fileKeys.forEach((hashName, index) => {
      const file = files[hashName];

      if (file.active) {
        activeFileIndex = index;

        if (index > 0) {
          delete previousOptions.disabled;
          previousOptions.onClick = () => {
            onSelectFile(fileKeys[index - 1]);
          };
        }

        if (index < fileKeys.length - 1) {
          delete nextOptions.disabled;
          nextOptions.onClick = () => {
            onSelectFile(fileKeys[index + 1]);
          };
        }
      }
    });

    // Subtract one because we automatically add the active to the list first
    const maxFileLinks = fileKeys.length >= MAX_FILE_LINKS ? MAX_FILE_LINKS : fileKeys.length;

    // Pagination Items - active one in there by default because we build around it
    let paginateFileKeys = [activeFileIndex];

    let left = 1;
    let right = 1;
    let direction = 'backward';
    while (paginateFileKeys.length < maxFileLinks) {
      // Add the previous item
      if (direction === 'backward' && fileKeys[activeFileIndex - left]) {
        paginateFileKeys.push(activeFileIndex - left);
        direction = 'forward';
        left += 1;
      } else {
        direction = 'forward';
      }

      // Add the next item to the list
      if (direction === 'forward' && fileKeys[activeFileIndex + right]) {
        paginateFileKeys.push(activeFileIndex + right);
        direction = 'backward';
        right += 1;
      } else {
        direction = 'backward';
      }
    }

    // Sort them in order
    paginateFileKeys = paginateFileKeys.sort();
    paginatorButtons = paginateFileKeys.map((fileKeysIndex) => {
      const hashName = fileKeys[fileKeysIndex];
      const fileInfo = files[hashName];

      return {
        hashName,
        label: fileKeysIndex + 1, // File position by index
        options: { active: fileInfo.active },
        handleSelectFile: onSelectFile,
      };
    });
  }

  return (
    <Pagination className={`${className} mb-0`}>
      <PaginationItem {...previousOptions}>
        <PaginationLink previous />
      </PaginationItem>

      { (fileKeys.length > 0 && paginatorButtons.map(PaginatorItem)) || <PaginatorNoFiles /> }

      <PaginationItem {...nextOptions}>
        <PaginationLink next />
      </PaginationItem>
    </Pagination>
  );
};
