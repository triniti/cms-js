import React, { useState } from 'react';
import { ModalBody } from 'reactstrap';
import { SelectField, SwitchField, TextareaField, TextField } from 'components';
import withBlockModal from 'components/blocksmith-field/components/with-block-modal';
import IframeBlockPreview from 'components/blocksmith-field/components/iframe-block-modal/Preview';
import determineIfExistingBlocksCanBeUsed from 'components/blocksmith-field/utils/determineIfExistingBlocksCanBeUsed';
import Swal from 'sweetalert2';

const alignOptions = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
];

const useSSl = document.location.protocol === 'https:';
// specifically used to match data attributes set to iframe tag
const IFRAME_DATA_ATTR_REGEX = /data-([^"']+)=["']([^"']+)["']/gi;
const IFRAME_ALIGN_ATTR_REGEX = /align=["']([^"']*)["']/;
const IFRAME_HEIGHT_ATTR_REGEX = /height=["']([^"']*)["']/;
const IFRAME_SRC_ATTR_REGEX = /src=["']([^"']*)["']/;
const IFRAME_WIDTH_ATTR_REGEX = /width=["']([^"']*)["']/;

const confirmBlock = async (type) => {
  return Swal.fire({
    title: `This looks like a ${type} block`,
    text: 'Would you like to use that block instead?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-secondary',
    reverseButtons: true,
  });
}

function IframeBlockModal(props) {
  const { block, form, formState } = props;
  const { valid } = formState;
  const [hasManualDimensions, setHasManualDimensions] = useState(block.has('height') || block.has('width'));

  const handleDimensionsCheckbox = (checked) => {
    setHasManualDimensions(checked);
    if (!checked) {
      form.change('height', null);
      form.change('width', null);
    } else {
      if (block.has('height')) {
        form.change('height', block.get('height'));
      }

      if (block.has('width')) {
        form.change('width', block.get('width'));
      }
    }
  };

  const parseInput = (input) => {
    const blockType = determineIfExistingBlocksCanBeUsed(input);

    if (blockType) {
      confirmBlock(blockType).then(({ value }) => {
        if (value) {
          toggle();
          // todo: open the other modal if user agrees
        } else {
          // do nothing, user declined
        }
      });
    }

    let src = null;
    const dataAttributes = {};
    let matchArr = [];

    if (IFRAME_ALIGN_ATTR_REGEX.test(input)) {
      form.change('align', input.match(IFRAME_ALIGN_ATTR_REGEX)[1]);
    }
    if (IFRAME_HEIGHT_ATTR_REGEX.test(input)) {
      form.change('height', input.match(IFRAME_HEIGHT_ATTR_REGEX)[1]);
      setHasManualDimensions(true);
    }
    if (IFRAME_WIDTH_ATTR_REGEX.test(input)) {
      form.change('width', input.match(IFRAME_WIDTH_ATTR_REGEX)[1]);
      setHasManualDimensions(true);
    }
    if (IFRAME_DATA_ATTR_REGEX.test(input)) {
      let matches = [];
      matches = input.match(IFRAME_DATA_ATTR_REGEX);
      matches.forEach((item) => {
        // without resetting the lastIndex,
        // the exec method will start matching from the most recent matched index
        IFRAME_DATA_ATTR_REGEX.lastIndex = 0;

        matchArr = IFRAME_DATA_ATTR_REGEX.exec(item);
        // three elements in matchArr for each data attribute match - full match, key and value
        // Example: for 'data-foo = bar', the matchArr Array will have [data-foo, foo, bar]
        dataAttributes[matchArr[1]] = matchArr[2];
      });
    }

    if (IFRAME_SRC_ATTR_REGEX.test(input)) {
      src = decodeURIComponent(input.match(IFRAME_SRC_ATTR_REGEX)[1]);
    } else { // direct url, presumably
      src = decodeURIComponent(input);
    }
    if (/^\/\//.test(src)) { // eg '//blah.sweetvideo.com'
      src = `https:${src}`;
    }
    if (/^http:/.test(src) && useSSl) {
      src = src.replace(/^http:/, 'https:');
    }

    return src;
  }

  return (
    <div className="modal-scrollable">
      <ModalBody>
        <TextareaField name="src" label="iFrame Source URL" placeholder="Enter iframe source or embed code" error="iFrame source or embed code is invalid" parse={parseInput} />
        {valid && <IframeBlockPreview {...props} />}
        <SelectField name="align" label="Align" options={alignOptions} />
        <SwitchField
          name="has_manual_dimensions"
          label="Manually adjust dimensions"
          checked={hasManualDimensions}
          onChange={e => handleDimensionsCheckbox(e.target.checked)}
          editMode
        />
        <div className={hasManualDimensions ? 'd-block' : 'd-none'}>
          <TextField name="height" label="Height" />
          <TextField name="width" label="Width" />
        </div>
        <SwitchField name="scrolling_enabled" label="Scrolling" editMode />
      </ModalBody>
    </div>
  );
}

export default withBlockModal(IframeBlockModal);
