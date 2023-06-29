import React, { useState, useRef, lazy, useEffect } from 'react';
import Editor from '@draft-js-plugins/editor';
// import MultiDecorator from '@draft-js-plugins/editor/lib/Editor/MultiDecorator';
import {
  // BlockMapBuilder,
  CompositeDecorator,
  EditorState,
  genKey,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  RichUtils,
} from 'draft-js';
import { Button } from 'reactstrap';
import moment from 'moment';
import { Map } from 'immutable';
import Swal from 'sweetalert2';
import { getSelectionEntity } from 'draftjs-utils'; // todo: maybe take this and drop the dep
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import JsonSerializer from '@gdbots/pbj/serializers/JsonSerializer';
import { ErrorBoundary, Icon, withPbj } from 'components';
import UncontrolledTooltip from 'components/uncontrolled-tooltip';
import BlockButtons from 'components/blocksmith-field/components/block-buttons';
import BoldInlineToolbarButton from 'components/blocksmith-field/components/bold-inline-toolbar-button';
import ItalicInlineToolbarButton from 'components/blocksmith-field/components/italic-inline-toolbar-button';
import LinkInlineToolbarButton from 'components/blocksmith-field/components/link-inline-toolbar-button';
import UnderlineInlineToolbarButton from 'components/blocksmith-field/components/underline-inline-toolbar-button';
import OrderedListInlineToolbarButton from 'components/blocksmith-field/components/ordered-list-inline-toolbar-button';
import UnorderedListInlineToolbarButton from 'components/blocksmith-field/components/unordered-list-inline-toolbar-button';
import StrikethroughInlineToolbarButton from 'components/blocksmith-field/components/strikethrough-inline-toolbar-button';
import HighlightInlineToolbarButton from 'components/blocksmith-field/components/highlight-inline-toolbar-button';
import SpecialCharacterModal from 'components/blocksmith-field/components/special-character-modal';
import Sidebar from 'components/blocksmith-field/components/sidebar';
import convertToEditorState from 'components/blocksmith-field/utils/convertToEditorState';
import ListBlockWrapper from 'components/blocksmith-field/components/list-block-wrapper';
import LinkModal from 'components/blocksmith-field/components/link-modal';
import { getPlaceholderConfig } from 'components/blocksmith-field/placeholderConfig';
import { getModalComponent } from 'components/blocksmith-field/resolver';
import addEmoji from 'components/blocksmith-field/utils/addEmoji';
import areKeysSame from 'components/blocksmith-field/utils/areKeysSame';
import blockParentNode from 'components/blocksmith-field/utils/blockParentNode';
import convertToCanvasBlocks from 'components/blocksmith-field/utils/convertToCanvasBlocks';
import createLinkAtSelection from 'components/blocksmith-field/utils/createLinkAtSelection';
import deleteBlock from 'components/blocksmith-field/utils/deleteBlock';
import dropBlock from 'components/blocksmith-field/utils/dropBlock';
import findBlock from 'components/blocksmith-field/utils/findBlock';
import getBlockForKey from 'components/blocksmith-field/utils/getBlockForKey';
import getBlockNode from 'components/blocksmith-field/utils/getBlockNode';
import getDraggedBlockNode from 'components/blocksmith-field/utils/getDraggedBlockNode';
import getInsertBlockMarkerNode from 'components/blocksmith-field/utils/getInsertBlockMarkerNode';
import getListBlockNodes from 'components/blocksmith-field/utils/getListBlockNodes';
import getValidBlockTarget from 'components/blocksmith-field/utils/getValidBlockTarget';
import handleDocumentDragover from 'components/blocksmith-field/utils/handleDocumentDragover';
import handleDocumentDrop from 'components/blocksmith-field/utils/handleDocumentDrop';
import insertEmptyBlock from 'components/blocksmith-field/utils/insertEmptyBlock';
import isBlockAList from 'components/blocksmith-field/utils/isBlockAList';
import isBlockEmpty from 'components/blocksmith-field/utils/isBlockEmpty';
import isFirstListBlock from 'components/blocksmith-field/utils/isFirstListBlock';
import selection from 'components/blocksmith-field/utils/selection';
import isLastListBlock from 'components/blocksmith-field/utils/isLastListBlock';
import pushEditorState from 'components/blocksmith-field/utils/pushEditorState';
import removeLinkAtSelection from 'components/blocksmith-field/utils/removeLinkAtSelection';
import updateBlocks from 'components/blocksmith-field/utils/updateBlocks';
import replaceBlockAtKey from 'components/blocksmith-field/utils/replaceBlockAtKey';
import selectBlock, { selectionTypes as selectBlockSelectionTypes} from 'components/blocksmith-field/utils/selectBlock';
import shiftBlock from 'components/blocksmith-field/utils/shiftBlock';
import sidebar from 'components/blocksmith-field/utils/sidebar';
import styleDragTarget, { clearDragCache } from 'components/blocksmith-field/utils/styleDragTarget';
import visibilityWatcher from 'components/blocksmith-field/utils/visibilityWatcher';
import customStyleMap from 'components/blocksmith-field/customStyleMap';
import decorators from 'components/blocksmith-field/decorators';
import constants, { blockTypes, COPIED_BLOCK_KEY } from 'components/blocksmith-field/constants';
import DraggableTextBlock from 'components/blocksmith-field/components/draggable-text-block';
import { normalizeKey } from 'components/blocksmith-field/utils';
import noop from 'lodash/noop';
// import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import 'components/blocksmith-field/styles.scss';
import { insert } from 'final-form-arrays';

let TextBlockV1;
const GenericBlockPlaceholder = lazy(() => import('components/blocksmith-field/components/generic-block-placeholder'));

const confirmDelete = async () => {
  return Swal.fire({
    title: 'Are you sure?',
    text: 'This block will be deleted',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete!',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-secondary',
    reverseButtons: true,
  });
}

export default function Blocksmith(props) {
  const {
    blocks,
    editMode,
    // node,
    onChange: ffOnChange, // (final form api) onChange
  } = props;

  let origEditorState = EditorState.createEmpty(new CompositeDecorator(decorators));
  if (blocks && blocks.length) {
    convertToCanvasBlocks(origEditorState).then((canvasBlocks) => {
      origEditorState = convertToEditorState(canvasBlocks);
    });
  }

  const [ blockButtonsStyle, setBlockButtonsStyle ] = useState({ transform: 'scale(0)' });
  const [ editorState, setEditorStateX ] = useState(origEditorState);
  const [ isHoverInsertMode, setIsHoverInsertMode ] = useState(false);
  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
  const [ errors, setErrors ] = useState({});
  const [ readOnly, setReadOnly ] = useState(!editMode);
  const [ isDirty, setIsDirty ] = useState(false);
  const [ sidebarResetFlag, setSidebarResetFlag ] = useState(0);
  const [ activeBlockKey, setActiveBlockKey ] = useState();
  const [ modalComponent, setModalComponent ] = useState();
  const [ hoverBlockNode, setHoverBlockNode ] = useState();
  const [ isHoverInsertModeBottom, setIsHoverInsertModeBottom ] = useState();
  const [ sidebarHolderStyle, setSidebarHolderStyle ] = useState({
    transform: 'scale(1)',
    top: 14,
  });
  const [ copiedBlock, setCopiedBlock ] = useState();
  const popoverRef = useRef();
  const editorRef = useRef();

  const setEditorState = (...props) => {
    try {
      console.log('Set Editor State', props);
      setEditorStateX(...props);
      throw new Error('setEditorState Debug!');
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * allows to overwrite the default block render map, this will ensure the pasted text will
   * only convert to Draft block types if the element is listed in the map below.
   *
   * e.g., when a h3 element is pasted into blocksmith, it will be converted to <p> tags
   *
   * @link https://draftjs.org/docs/advanced-topics-custom-block-render-map
   */
  const blockRenderMap = Map({
    [blockTypes.ATOMIC]: {
      element: 'figure',
    },
    [blockTypes.ORDERED_LIST_ITEM]: {
      element: 'li',
      wrapper: <ol />,
    },
    [blockTypes.UNORDERED_LIST_ITEM]: {
      element: 'li',
      wrapper: <ul />,
    },
    [blockTypes.UNSTYLED]: {
      element: 'div',
      aliasedElements: ['div'],
    },
  });

  const inlineToolbarPlugin = createInlineToolbarPlugin({
    theme: {
      toolbarStyles: {
        toolbar: 'inline-toolbar',
      },
      buttonStyles: {
        button: 'inline-toolbar-button',
        buttonWrapper: 'inline-toolbar-button-wrapper',
        active: 'inline-toolbar-button-active',
      },
    },
  });

  const plugins = [ inlineToolbarPlugin ];

  visibilityWatcher.init(setCopiedBlockFromStorage);


  useEffect(async () => {
    if (!blocks || !blocks.length) {
      return;
    }

    const copiedBlockJson = localStorage.getItem(COPIED_BLOCK_KEY);
    if (copiedBlockJson) {
      const copiedBlock = await JsonSerializer.deserialize(copiedBlockJson);
      setCopiedBlock(copiedBlock);
    }

    TextBlockV1 = await MessageResolver.resolveCurie('*:canvas:block:text-block:v1');
    const decodedBlocks = await Promise.all(blocks.map((block) => ObjectSerializer.decodeMessage(block)));
    // todo: simplify decorators
    const editorState = convertToEditorState(decodedBlocks, new CompositeDecorator(decorators));
    onChange(editorState);
  }, [ blocks ]);

  useEffect(() => {
    setReadOnly(!editMode);
  }, [ editMode ]);

  /**
   * If you try to get clever and do something with incoming editorState here, be very careful.
   * It is very easy to wipe out decorator/plugin behavior. You must maintain the same editorState
   * instance that is currently in state.
   *
   * @link https://github.com/draft-js-plugins/draft-js-plugins/issues/210
   */
  useEffect(async () => {
    const blocksToMixins = await Promise.all(blocks.map(block => ObjectSerializer.decodeMessage(block)));
    const convertedEditorState = convertToEditorState(blocksToMixins);
    const newEditorState = await pushEditorState(editorState, convertedEditorState.getCurrentContent(), 'arbitrary');

    setEditorState(newEditorState.editorState);
    setErrors(newEditorState.errors);
    setActiveBlockKey(normalizeKey(newEditorState.editorState.getCurrentContent().getFirstBlock().getKey()));
  }, [ blocks ]);

  // useEffect(async () => {
  //   console.log('Wtf is editor state?', editorState);
  //   window.editorState = editorState;
  //   const newEditorState = await pushEditorState(editorState, editorState.getCurrentContent());
  //   window.newEditorState = newEditorState;
  //   /**
  //    * Force editor to re-render when new editorState comes in via props. Required because the
  //    * error boundary can "restore" the editor after an error.
  //    */
  //   setEditorState(newEditorState.editorState);
  //   setErrors(newEditorState.errors);
  // }, [ editorState ]);

  // useEffect(async () => {
    // async componentDidUpdate({blocks: prevBlocks, editorState: prevPropsEditorState, editMode: prevEditMode}) {
    // const { editorState: currentPropsEditorState, editMode, blocks } = this.props;
    // const { editorState } = this.state;

    // if (prevEditMode !== editMode) {
    //   setReadOnly(!editMode);
    //   return;
    // }

    // This is for revert support
    // if (prevBlocks !==  blocks) {
    //   const blocksToMixins = await Promise.all(blocks.map(block => ObjectSerializer.decodeMessage(block)));
    //   const convertedEditorState = convertToEditorState(blocksToMixins);
    //   pushEditorState(editorState, convertedEditorState.getCurrentContent(), 'arbitrary').then(newEditorState => {
    //     setEditorState(newEditorState.editorState);
    //     setErrors(newEditorState.errors);
    //     setActiveBlockKey(normalizeKey(newEditorState.editorState.getCurrentContent().getFirstBlock().getKey()));
    //   });
    //   return;
    // }

    // if (
    //   currentPropsEditorState
    //   && prevPropsEditorState
    //   && prevPropsEditorState !== currentPropsEditorState
    // ) {
    //   const newEditorState = pushEditorState(editorState, currentPropsEditorState.getCurrentContent());
    //   /**
    //    * Force editor to re-render when new editorState comes in via props. Required because the
    //    * error boundary can "restore" the editor after an error.
    //    */
    //   setEditorState(newEditorState.editorState);
    //   setErrors(newEditorState.errors);
    // }
  // }, [ blocks, editMode, editorState ]);

  // componentWillUnmount() {
  //   blockParentNode.clearCache();
  //   selection.clearCache();
  //   sidebar.clearCache();
  //   updateBlocks.clearCache();
  //   visibilityWatcher.cleanup();
  // }

  /**
   * Tells the DraftJs editor how to render custom atomic blocks.
   *
   * @param {*} block - A DraftJs ContentBlock
   *
   * @link https://draftjs.org/docs/advanced-topics-block-components
   * @link https://github.com/draft-js-plugins/draft-js-plugins
   *
   * @returns {?Object} a React component and config, or null if borked
   */
  const blockRendererFn = (block) => {
    switch (block.getType()) {
      case blockTypes.ATOMIC: {
        const blockData = block.getData();
        let message;
        if (blockData && blockData.has('canvasBlock')) {
          message = blockData.get('canvasBlock').schema().getCurie().getMessage();
        }

        // test this idea, get placeholder config and pass to generic placeholder to reduce the number of files
        // todo: is this valid? can we simplify it even more?
        const placeholderConfig = getPlaceholderConfig(message);
        return {
          component: () => <GenericBlockPlaceholder
            block={block}
            config={placeholderConfig}
            blockProps={{ getReadOnly }}
          />,
          editable: false,
        };
      }
      case blockTypes.UNSTYLED:
        return {
          component: DraggableTextBlock,
          contentEditable: !readOnly,
          props: {
            getReadOnly,
            onMouseEnter: handleBlockMouseEnter,
          },
        };
      case blockTypes.ORDERED_LIST_ITEM:
      case blockTypes.UNORDERED_LIST_ITEM:
        return {
          component: ListBlockWrapper,
          contentEditable: !readOnly,
          props: {
            isFirst: isFirstListBlock(editorState.getCurrentContent(), block),
            isLast: isLastListBlock(editorState.getCurrentContent(), block),
            getReadOnly,
          },
        };
      default:
        return {
          component: () => <GenericBlockPlaceholder
            block={block}
            config={{}}
            blockProps={{ getReadOnly }}
          />,
        };
    }
  }

  /**
   * Adds the returned string as a class to the Draft block.
   *
   * todo: consider updating this to add other class names that could simplify the dom drilling
   * currently happening in styles.scss
   *
   * @link https://draftjs.org/docs/advanced-topics-block-styling/
   *
   * @param {ContentBlock} block
   *
   * @returns {string|null}
   */
  const blockStyleFn = (block) => {
    const hasError = block.getKey() in errors;
    switch (block.getType()) {
      case blockTypes.UNSTYLED:
        return `text-block${hasError ? ' block-invalid' : ''}`;
      case blockTypes.ORDERED_LIST_ITEM:
      case blockTypes.UNORDERED_LIST_ITEM:
        return `list-block${hasError ? ' block-invalid' : ''}`;
      default:
        return hasError ? 'block-invalid' : null;
    }
  }

  // for components inside the editor that do not receive props in the normal way
  const getEditorState = () => editorState;

  /**
   * for components returned by blockRendererFn that do not receive props in the normal way.
   * need to have this closure because blockRendererFn does not get called when changing view/edit
   * mode or other external events, so the blocks rendered there won't get an updated readOnly value
   */
  const getReadOnly = () => readOnly;

  /**
   * Calculates how the sidebar should be styled
   *
   * TODO: this whole thing can potentially be removed by refactoring the sidebar such that there
   * is one for each block and one at the beginning or end of the editor itself. would be a part of
   * the positionComponents refactor.
   *
   * @param {ContentBlock} activeBlock  - the active ContentBlock
   * @param {DOMRect}      blockBounds  - the block node's boundingClientRect
   * @param {ContentState} contentState - a ContentState instance of a DraftJs editor
   * @param {DOMRect}      editorBounds - the editor node's boundingClientRect
   *
   * @returns {object} - an object to be set as the sidebarHolderStyle state
   */
  const getSidebarHolderStyle = (activeBlock, blockBounds, contentState, editorBounds) => {
    const sidebarHolderStyle = { ...sidebarHolderStyle };
    const isSidebarVisible = isHoverInsertMode
      || (!readOnly && isBlockEmpty(activeBlock) && !isBlockAList(activeBlock))
      || !editorState.getCurrentContent().hasText();

    sidebarHolderStyle.top = (blockBounds.top - editorBounds.top) + 6;
    if (isHoverInsertMode) {
      sidebarHolderStyle.top += 2;
      if (isHoverInsertModeBottom === false) {
        // this is when the cursor is above the first block
        sidebarHolderStyle.top -= (hoverBlockNode.getBoundingClientRect().height + 4);
      }
    }
    sidebarHolderStyle.transform = `scale(${isSidebarVisible ? 1 : 0})`;

    let listBlockNodes;
    let finalListBlockNode;
    let finalListBlockBounds;
    if (isHoverInsertMode) {
      switch (activeBlock.getType()) {
        case blockTypes.ORDERED_LIST_ITEM:
        case blockTypes.UNORDERED_LIST_ITEM:
          listBlockNodes = getListBlockNodes(contentState, activeBlock);
          finalListBlockNode = listBlockNodes[listBlockNodes.length - 1];
          finalListBlockBounds = finalListBlockNode.getBoundingClientRect();
          sidebarHolderStyle.top = (finalListBlockBounds.top - editorBounds.top)
            + (finalListBlockBounds.height - 3);
          break;
        default:
          sidebarHolderStyle.top += (blockBounds.height - 23);
          break;
      }
    }

    return sidebarHolderStyle;
  }

  /**
   * Updates form value.
   */
  const updateCanvasBlocks = async (editorState) => {
    const canvasBlocks = await convertToCanvasBlocks(editorState);
    console.log('Updated canvas blocks:', canvasBlocks.map((canvasBlock) => canvasBlock.toJSON()));
    ffOnChange(canvasBlocks.map((canvasBlock) => canvasBlock.toJSON()));
  }

  /**
   * Adds a new empty block at the end.
   */
  const handleAddEmptyBlockAtEnd = () => {
    const contentState = editorState.getCurrentContent();
    const newBlockKey = genKey();
    const newContentState = insertEmptyBlock(
      contentState,
      contentState.getLastBlock().getKey(),
      constants.POSITION_AFTER,
      newBlockKey,
    );
    pushEditorState(editorState, newContentState, 'arbitrary').then((newEditorState) => {
      // this.setState(() => ({
      //   isHoverInsertMode: false,
      //   isHoverInsertModeBottom: null,
      //   editorState: selectBlock(newEditorState.editorState, newBlockKey),
      //   errors: newEditorState.errors,
      // }));
      setIsHoverInsertMode(false);
      setIsHoverInsertModeBottom(null);
      setEditorState(selectBlock(newEditorState.editorState, newBlockKey));
      setErrors(newEditorState.errors);
      positionComponents(newEditorState.editorState.getCurrentContent(), newBlockKey)
    });
  }

  /**
   * Given a canvas block, creates a DraftJs block (with data) for said block at the active block.
   *
   * @param {*} canvasBlock                - a triniti canvas block
   * @param {boolean} shouldSelectAndStyle - whether or not to select and style the new block
   */
  const handleAddCanvasBlock = (canvasBlock, shouldSelectAndStyle = false) => {
    const contentState = editorState.getCurrentContent();
    let newContentState;
    let newBlockKey;
    const activeBlock = getBlockForKey(contentState, activeBlockKey);
    if (isBlockEmpty(activeBlock)) {
      // active block is empty - just replace it with new block
      newContentState = replaceBlockAtKey(
        contentState,
        canvasBlock,
        activeBlockKey,
      );
    } else {
      // active block is not empty, add an empty and replace that with new block
      newBlockKey = genKey();
      newContentState = insertEmptyBlock(
        contentState,
        activeBlockKey,
        isHoverInsertModeBottom ? constants.POSITION_AFTER : constants.POSITION_BEFORE,
        newBlockKey,
      );
      newContentState = replaceBlockAtKey(
        newContentState,
        canvasBlock,
        newBlockKey,
      );
    }
    pushEditorState(editorState, newContentState, 'insert-characters').then((newEditorState) => {
      // this.setState(() => ({
      //   editorState: newEditorState.editorState,
      //   errors: newEditorState.errors,
      //   isDirty: true,
      //   sidebarResetFlag: +!sidebarResetFlag,
      // }), () => {
      //   removeActiveStyling();
      //   handleToggleSidebar();
      //   // if (!isDirty) {
      //   //   delegate.handleDirtyEditor();
      //   // }
      //   // /* eslint-disable react/destructuring-assignment */
      //   // if (!this.state.editorState.getSelection().getHasFocus()) {
      //   //   delegate.handleStoreEditor(this.state.editorState);
      //   // }
      //   // /* eslint-enable react/destructuring-assignment */
      //   if (shouldSelectAndStyle) {
      //     selectAndStyleBlock(newBlockKey || activeBlockKey);
      //   }
      //   updateCanvasBlocks(editorState);
      // });
      setEditorState(newEditorState.editorState);
      setErrors(newEditorState.errors);
      setIsDirty(true);
      setSidebarResetFlag(+!sidebarResetFlag);

      removeActiveStyling();
      handleToggleSidebar();

      if (shouldSelectAndStyle) {
        selectAndStyleBlock(newBlockKey || activeBlockKey);
      }
      updateCanvasBlocks(editorState);
    });

  }

  /**
   * Turns the currently selected text into a link. This is passed as a prop into the link
   * modal so it can have a super sweet button to add a link.
   */
  const handleAddLink = (target, url) => {
    // this.setState(() => ({
    //   editorState: createLinkAtSelection(editorState, target, url),
    //   isDirty: true,
    // }), () => {
    //   this.updateCanvasBlocks(this.state.editorState);
    // });
    setEditorState(createLinkAtSelection(editorState, target, url));
    setIsDirty(true);
    updateCanvasBlocks(editorState);
  }

  const handleBlockMouseEnter = (blockKey) => setActiveBlockKey(normalizeKey(blockKey));

  /**
   * Updates form value on blur.
   */
  const handleBlur = (syntheticEvent, pluginFunctions) => updateCanvasBlocks(pluginFunctions.getEditorState());

  /**
   * Closes any currently open modal.
   */
  const handleCloseModal = () => {
    setReadOnly(false);
    setModalComponent(null);
  }

  /**
   * Stores the triniti block payload in redux so that it is available for later pasting
   */
  const handleCopyBlock = () => {
    // todo: maybe update this to use actual clipboard and object de/serialization
    // const { delegate } = this.props;
    const draftJsBlock = editorState.getCurrentContent().getBlockForKey(activeBlockKey);
    const blockData = draftJsBlock.getData();
    const canvasBlock = blockData.get('canvasBlock');
    if (!blockData || !canvasBlock) {
      return;
    }

    if (copiedBlock && copiedBlock.get('etag') === canvasBlock.get('etag')) {
      return;
    }

    setCopiedBlock(canvasBlock);
    localStorage.setItem(COPIED_BLOCK_KEY, `${canvasBlock}`);
    // delegate.handleStoreEditor(editorState);
  }

  /**
   * Deletes the active block. A block's key is set as the active key (in positionComponents) when
   * the text indicator is moved into it or when the mouse is moved over it.
   */
  const handleDelete = () => {
    Blocksmith.confirmDelete().then((result) => {
      this.setState(() => ({ readOnly: false }), () => {
        if (!result.value) {
          return; // do nothing, user declined to delete
        }
        pushEditorState(
          editorState,
          deleteBlock(editorState.getCurrentContent(), activeBlockKey),
          'remove-range',
        ).then((newEditorState) => {
          this.setState(() => ({
            editorState: newEditorState.editorState,
            errors: newEditorState.errors,
            isDirty: isDirty,
          }), () => {
            updateCanvasBlocks(this.state.editorState);
          });
        });
      });
    });

    setReadOnly(false);
  }

  /**
   * Handles the drop part of a block drag and drop event. The event's data transfer
   * (populated in the drag and drop handle's startDrag function) is parsed to get the
   * key of the dragged block and the blocks are rearranged accordingly. Also, all styling
   * and event listeners added during the drag process are removed.
   *
   * @param {event} e - a drop event
   */
  const handleDrop = (e) => {
    clearDragCache();
    const raw = e.dataTransfer.getData('block');
    const data = raw ? raw.split(':') : [];

    if (data.length !== 2) {
      return undefined;
    }

    const [constant, draggedBlockKey] = data;
    if (constant !== constants.DRAFTJS_BLOCK_KEY) {
      return undefined;
    }

    document.querySelector('#block-editor').removeEventListener('dragover', styleDragTarget);
    document.removeEventListener('dragover', handleDocumentDragover);
    document.removeEventListener('drop', handleDocumentDrop);

    let draggedBlockListKeys;
    let dropTargetKey;
    let dropTargetPosition;
    let isDropTargetAList = false;
    const insertBlockMarkerNode = getInsertBlockMarkerNode();

    if (insertBlockMarkerNode && insertBlockMarkerNode.hasAttribute('data-drag-block-list-keys')) {
      draggedBlockListKeys = insertBlockMarkerNode.getAttribute('data-drag-block-list-keys').split(':');
    }
    if (insertBlockMarkerNode && insertBlockMarkerNode.hasAttribute('data-drop-target-is-list') && insertBlockMarkerNode.getAttribute('data-drop-target-is-list') === 'true') {
      isDropTargetAList = true;
    }

    if (insertBlockMarkerNode) {
      dropTargetKey = insertBlockMarkerNode.getAttribute('data-drop-target-key');
      dropTargetPosition = insertBlockMarkerNode.getAttribute('data-drop-target-position');
      insertBlockMarkerNode.remove();
    } else {
      // dropped on original spot, probably
      return 'handled';
    }

    let draggedBlock = getDraggedBlockNode();
    if (!draggedBlock) {
      return 'handled';
    }
    while (!blockParentNode.is(draggedBlock.parentNode)) {
      draggedBlock = draggedBlock.parentNode;
    }
    draggedBlock.classList.remove('hidden-block');

    const contentState = editorState.getCurrentContent();
    const newContentState = dropBlock(
      contentState,
      draggedBlockKey,
      dropTargetKey,
      dropTargetPosition,
      isDropTargetAList,
      draggedBlockListKeys,
    );
    pushEditorState(editorState, newContentState, 'move-block').then((newEditorState) => {
      if (blockTypes.ATOMIC !== newContentState.getBlockForKey(draggedBlockKey).getType()) {
        newEditorState = {
          editorState: selectBlock(
            newEditorState.editorState,
            draggedBlockKey,
            selectBlockSelectionTypes.END,
          ),
          errors: newEditorState.errors,
        };
      }

      setEditorState(newEditorState.editorState);
      setErrors(newEditorState.errors);
      setIsDirty(true);
      
      updateCanvasBlocks(editorState);
      // const { delegate } = this.props;
      // delegate.handleStoreEditor(newEditorState.editorState);
      // if (!isDirty) {
      //   delegate.handleDirtyEditor();
      // }
    });
    return 'handled';
  }

  /**
   * Opens the edit modal for the active block. A block's key is set as the active key
   * (in positionComponents) when the text indicator is moved into it or when the mouse
   * is moved over it.
   */
  const handleEdit = () => {
    const draftJsBlock = editorState.getCurrentContent().getBlockForKey(activeBlockKey);
    const blockData = draftJsBlock.getData();

    let canvasBlock;
    if (draftJsBlock.getType() === blockTypes.ATOMIC) {
      canvasBlock = blockData.get('canvasBlock');
    } else {
      canvasBlock = TextBlockV1.create();
      const blockDataCanvasBlock = blockData && blockData.has('canvasBlock') && blockData.get('canvasBlock');
      if (blockDataCanvasBlock && blockDataCanvasBlock.has('updated_date')) {
        canvasBlock.set('updated_date', blockDataCanvasBlock.get('updated_date'));
      } else {
        canvasBlock.set('updated_date', moment().toDate());
      }
    }
    handleToggleBlockModal(canvasBlock);
  }

  /**
   * Updates the data payload for an existing draft block using the provided canvas block.
   *
   * @link https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Entities.md
   *
   * @param {*}      canvasBlock - a triniti canvas block
   */
  const handleEditCanvasBlock = (canvasBlock) => {
    let newEditorState = editorState;
    const activeBlockPosition = newEditorState // used later to re-position
      .getCurrentContent()
      .getBlocksAsArray()
      .findIndex((block) => block.getKey() === activeBlockKey);
    newEditorState = selectBlock(newEditorState, activeBlockKey);
    const newContentState = Modifier.setBlockData(
      newEditorState.getCurrentContent(),
      newEditorState.getSelection(),
      new Map({ canvasBlock }),
    );
    pushEditorState(newEditorState, newContentState).then((newEditorState) => {
      this.setState(() => ({
        editorState: newEditorState.editorState,
        errors: newEditorState.errors,
        isDirty: true,
      }), () => {
        positionComponents(
          editorState.getCurrentContent(),
          findBlock(editorState.getCurrentContent(), activeBlockPosition).getKey(),
        );
        updateCanvasBlocks(editorState);
        // if (!isDirty) {
        //   delegate.handleDirtyEditor();
        // }
        // // eslint-disable-next-line react/destructuring-assignment
        // delegate.handleStoreEditor(this.state.editorState);
      });
    });
  }

  /**
   * Handles the custom command type(s) sent by keyBindingFn. This uses the editorState from the
   * argument instead of state to prevent race conditions.
   *
   * @link https://draftjs.org/docs/advanced-topics-key-bindings
   * @link https://draftjs.org/docs/advanced-topics-editorstate-race-conditions/
   *
   * @param {string} command          - a command type
   * @param {EditorState} editorState - an EditorState instance
   *
   * @returns {string} 'handled' (meaning we did something special) or 'not-handled' (meaning we
   *                   want to allow the editor to take over and resume default behavior).
   */
   const handleKeyCommand = (command, editorState) => {
    switch (command) {
      case constants.DOUBLE_ENTER_ON_LIST: {
        const selectionState = editorState.getSelection();
        let newContentState = editorState.getCurrentContent();
        newContentState = Modifier.setBlockType(
          newContentState,
          selectionState,
          blockTypes.UNSTYLED,
        );
        pushEditorState(editorState, newContentState, 'remove-range').then((newEditorState) => {
          setEditorState(newEditorState.editorState);
          setErrors(newEditorState.errors);
          positionComponents(newEditorState.editorState.getCurrentContent(), selectionState.getAnchorKey());
        });
        return 'handled';
      }
      case constants.SOFT_NEWLINE:
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      case constants.ATOMIC_BLOCKS_CUT:
        setEditorState(deleteSelectedBlocks(editorState));
        return 'handled';
      default:
        return 'not-handled';
    }
  }

  /**
   * Custom key bindings that cannot be part of keyBindingFn. Without this, you cannot
   * use the left/right arrow keys to get into or out of an atomic block.
   *
   * @link https://github.com/facebook/draft-js/issues/219
   *
   * @param {SyntheticKeyboardEvent} e - a synthetic keyboard event
   */
  const handleKeyDown = (e) => {
    setIsHoverInsertMode(false);

    const { isOptionKeyCommand, hasCommandModifier } = KeyBindingUtil;
    if (!editorState.getSelection().getHasFocus() || isOptionKeyCommand(e)) {
      return; // currently not intercepting ctrl/option combos (eg alt+shift+arrow to select word)
    }

    if (hasCommandModifier(e)) {
      switch (getDefaultKeyBinding(e)) {
        case 'bold':
          setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
          return;
        case 'italic':
          setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
          return;
        case 'underline':
          setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
          return;
        default:
          if (e.key === 'k') {
            this.handleToggleLinkModal();
          }
          return;
      }
    }

    if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key)) {
      return;
    }

    const anchorKey = editorState.getSelection().getAnchorKey();
    const contentState = editorState.getCurrentContent();
    const blocksAsArray = contentState.getBlocksAsArray();
    const currentBlock = getBlockForKey(contentState, anchorKey);
    const currentBlockIndex = blocksAsArray.findIndex((b) => b === currentBlock);
    const nextBlock = contentState.getBlockAfter(anchorKey);
    const previousBlock = contentState.getBlockBefore(anchorKey);
    const selectionState = editorState.getSelection();
    let areRestOfBlocksAtomic = false;

    /**
     * fixme: address left/right when on the first/last list item in a list block. it will just
     * keep going back to the start/end of the same line
     */
    switch (e.key) {
      case 'ArrowLeft':
        if (
          previousBlock
          && selectionState.getAnchorOffset() === 0
          && selectionState.getFocusOffset() === 0
        ) {
          if (previousBlock.getType() === blockTypes.ATOMIC) {
            e.preventDefault(); // would be going "into" an atomic block
          } else if (
            previousBlock.getType() === blockTypes.UNSTYLED
            || isBlockAList(previousBlock)
          ) {
            e.preventDefault();
            // native draft keyboard nav is often wonky, do it manually to avoid bugs
            setEditorState(selectBlock(editorState, previousBlock, selectBlockSelectionTypes.END));
          }
        }

        if (!previousBlock && selectionState.getAnchorOffset() === 0) {
          e.preventDefault(); // prevent text indicator from being misplaced
        }
        break;
      case 'ArrowRight':
        if (
          nextBlock
          && selectionState.getAnchorOffset() === currentBlock.getText().length
          && selectionState.getFocusOffset() === currentBlock.getText().length
        ) {
          if (nextBlock.getType() === blockTypes.ATOMIC) {
            e.preventDefault(); // would be going "into" an atomic block
          } else if (nextBlock.getType() === blockTypes.UNSTYLED || isBlockAList(nextBlock)) {
            e.preventDefault();
            // native draft keyboard nav is often wonky, do it manually to avoid bugs
            setEditorState(selectBlock(editorState, nextBlock, selectBlockSelectionTypes.START));
          }
        }

        if (!nextBlock && selectionState.getAnchorOffset() === currentBlock.getText().length) {
          e.preventDefault(); // prevent text indicator from being misplaced
        }
        break;
      case 'ArrowDown':
        areRestOfBlocksAtomic = !blocksAsArray
          .slice(currentBlockIndex + 1, blocksAsArray.length)
          .find((b) => b.getType() !== blockTypes.ATOMIC);
        if (
          (!nextBlock || areRestOfBlocksAtomic)
          && isOnLastLineOfBlock(editorState)
        ) {
          setEditorState(selectBlock(editorState, currentBlock.getKey(), selectBlockSelectionTypes.END));
          e.preventDefault(); // would be going "into" an atomic block
        }
        break;
      case 'ArrowUp':
        areRestOfBlocksAtomic = !blocksAsArray
          .slice(0, currentBlockIndex)
          .find((b) => b.getType() !== blockTypes.ATOMIC);
        if (
          (!previousBlock || areRestOfBlocksAtomic)
          && isOnFirstLineOfBlock(editorState)
        ) {
          e.preventDefault(); // would be going "into" an atomic block
        }
        break;
      default:
        break;
    }
  }

  /**
   * Inserts an empty block when the hover insert mode indicator is clicked.
   */
  const handleHoverInsert = () => {
    const newBlockKey = genKey();
    const newContentState = insertEmptyBlock(
      editorState.getCurrentContent(),
      activeBlockKey,
      isHoverInsertModeBottom ? constants.POSITION_AFTER : constants.POSITION_BEFORE,
      newBlockKey,
    );
    pushEditorState(editorState, newContentState, 'arbitrary').then((newEditorState) => {
      setIsHoverInsertMode(false);
      setIsHoverInsertModeBottom(null);
      setEditorState(selectBlock(newEditorState.editorState, newBlockKey));
      setErrors(newEditorState.errors);
      setSidebarResetFlag(+!sidebarResetFlag);
      positionComponents(newEditorState.editorState.getCurrentContent(), newBlockKey)
    });
  }

  /**
   * Opens the supplied modal component.
   *
   * @param {Component} modalComponent - a react modal component.
   */
  const handleOpenModal = (modalComponent) => {
    setReadOnly(true);
    setModalComponent(modalComponent);
  }

  /**
   * Allows copying advanced blocks to the clipboard, via serialization, to be pasted later.
   *
   * @param {SyntheticClipboardEvent} e - a synthetic clipboard event
   */
  const handleMouseCopy = (e) => {
    if (!isAtomicBlockSelected(editorState)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    selection.capture(editorState);
    copySelectedBlocksToClipboard(editorState);
    selection.restore();
  }

  /**
   * Allows cutting advanced blocks to the clipboard, via serialization, to be pasted later.
   *
   * @param {SyntheticClipboardEvent} e - a synthetic clipboard event
   */
  const handleMouseCut = (e) => {
    if (!isAtomicBlockSelected(editorState)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    copySelectedBlocksToClipboard(editorState);
  }

  /**
   * Remove any styling associated with an "active" editor
   */
  const handleMouseLeave = () => {
    if (modalComponent) {
      return
    }
    removeActiveStyling();
  }

  /**
   * Positions sidebar/button controls on blocks as the mouse is moved over them
   *
   * @param {SyntheticKeyboardEvent} e - a synthetic keyboard event
   */
  const handleMouseMove = (e) => {
    if (readOnly || isSidebarOpen) {
      return;
    }
    const { pageX, pageY } = e;
    let target = document.elementFromPoint(pageX, pageY);

    if (blockParentNode.is(target)) {
      setHoverInsertMode(editorState.getCurrentContent(), { pageX, pageY });
      positionComponents(editorState.getCurrentContent(), activeBlockKey);
    } else {
      const isOverSidebar = sidebar.isSidebar(target);
      setIsHoverInsertMode(isHoverInsertMode && isOverSidebar)
      if (blockParentNode.contains(target)) {
        while (!blockParentNode.is(target.parentNode)) {
          target = target.parentNode;
        }
        positionComponents(editorState.getCurrentContent(), target.getAttribute('data-offset-key'));
      }
    }
  }

  /**
   * If there is a copied block available, use it to
   * create a draft block with it as the data payload.
   */
  const handlePasteBlock = () => {
    if (!copiedBlock) {
      return;
    }
    handleAddCanvasBlock(copiedBlock, true);
  }

  /**
   * Intercepts paste events. Oftentimes the HTML is malformed and as a result empty blocks are
   * inserted. This prevents that from happening. This uses the editorState from the argument
   * instead of state to prevent race conditions.
   *
   * @link https://draftjs.org/docs/api-reference-editor#handlepastedtext
   * @link https://github.com/facebook/draft-js/blob/master/src/model/paste/DraftPasteProcessor.js
   * @link https://github.com/facebook/draft-js/blob/master/src/model/immutable/BlockMapBuilder.js
   * @link https://draftjs.org/docs/advanced-topics-editorstate-race-conditions/
   *
   * @param {string}      text        - pasted text
   * @param {HTMLElement} html        - pasted html
   * @param {EditorState} editorState - an EditorState instance
   *
   * @returns {string}
   */
   const handlePastedText = (text, html, editorState) => {
    if (html) {
      const { contentBlocks } = DraftPasteProcessor.processHTML(
        html,
        blockRenderMap.delete(blockTypes.ATOMIC),
      );
      if (contentBlocks) {
        const fragment = BlockMapBuilder
          .createFromArray(contentBlocks.filter((block) => !isBlockEmpty(block)));

        const newContentState = Modifier.replaceWithFragment(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          fragment,
        );

        const newEditorState = pushEditorState(editorState, newContentState, 'insert-characters');

        setEditorState(newEditorState.editorState);
        setErrors(newEditorState.errors);

        return 'handled';
      }
    } else if (text && text.startsWith(tokens.BLOCKSMITH_COPIED_CONTENT_TOKEN)) {
      const blocks = JSON.parse(text.replace(new RegExp(`^${tokens.BLOCKSMITH_COPIED_CONTENT_TOKEN}`), ''))
        .map(function(block) { return ObjectSerializer.deserialize(block); });

      const selectionState = editorState.getSelection();
      const insertionKey = selectionState.getIsBackward()
        ? selectionState.getAnchorKey()
        : selectionState.getFocusKey();

      setEditorState(insertCanvasBlocks(
        editorState,
        insertionKey,
        constants.POSITION_AFTER,
        blocks,
      ));
      removeActiveStyling();
      return 'handled';
    }
    return 'not-handled';
  }

  /**
   * This is needed to check if a click event occurred anywhere outside of the popover.
   * When a click event occurs outside of the popover, the popover will be toggled to close.
   *
   * @param {event} e
   */
  const handlePopoverClick = (e) => {
    if (popoverRef.current && popoverRef.current.contains(e.target)) {
      return;
    }
    handleToggleSidebar(e);
  }

  /**
   * Removes the currently selected link. This is passed as a prop into the link modal so it
   * can have a super sweet button to remove the link.
   */
  const handleRemoveLink = () => setEditorState(removeLinkAtSelection(editorState));

  /**
   * Inserts a special character, either at the position of the text indicator, or at the end of
   * the active block (if the text indicator is not in the active block)
   *
   * @param {string} specialCharacter
   */
  const handleSelectSpecialCharacter = (specialCharacter) => {
    const selectionState = editorState.getSelection();
    const insertingIntoNonActiveBlock = selectionState.getAnchorKey() !== activeBlockKey
      || selectionState.getFocusKey() !== activeBlockKey;
    setEditorState(addEmoji(
      editorState,
      specialCharacter,
      insertingIntoNonActiveBlock ? activeBlockKey : null,
    ));
  }

  /**
   * Shifts blocks up or down, used by the up/down reorder buttons
   *
   * @param {ContentBlock} block    - a DraftJs ContentBlock
   * @param {number}       position - a position (array index) to move the block to
   */
  const handleShiftBlock = (block, position) => {
    pushEditorState(
      editorState,
      shiftBlock(
        editorState.getCurrentContent(),
        block,
        position,
      ),
      'arbitrary',
    ).then((newEditorState) => {
      setEditorState(newEditorState.editorState);
      setErrors(newEditorState.errors);
      removeActiveStyling();
    });
  }

  /**
   * Toggles custom block modal components.
   *
   * @param {?*}      canvasBlock  - a triniti canvas block (freshly created, when creating new)
   * @param {boolean} isFreshBlock - whether or not a new block is being created.
   */
  const handleToggleBlockModal = (canvasBlock, isFreshBlock = false) => {
    if (modalComponent) {
      handleCloseModal();
    } else {
      const curie = canvasBlock.schema().getCurie();
      const message = curie.getMessage();
      const canvasBlockObject = isFreshBlock ? {} : canvasBlock.toObject();
      const ComponentWithPbj = curie && withPbj(getModalComponent(message), curie.toString(), canvasBlockObject);

      handleOpenModal(() => (
        <ComponentWithPbj
          isOpen
          isFreshBlock={isFreshBlock}
          pbj={canvasBlock}
          block={canvasBlock}
          onAddBlock={handleAddCanvasBlock}
          onEditBlock={handleEditCanvasBlock}
          toggle={handleCloseModal}
        />
      ));
    }
  }

  /**
   * Toggles the link modal, which will be populated by whatever url and openInNewTab values
   * are given, if any. If none are given, it is assumed that we are creating a new link.
   * If some are given, it is assumed that we are editing an existing link.
   */
  const handleToggleLinkModal = () => {
    if (modalComponent) {
      handleCloseModal();
    } else {
      const contentState = editorState.getCurrentContent();
      const entityKey = getSelectionEntity(editorState);
      const entity = entityKey ? contentState.getEntity(entityKey) : null;
      handleOpenModal(() => (
        <LinkModal
          isOpen
          onAddLink={handleAddLink}
          onRemoveLink={handleRemoveLink}
          openInNewTab={entity ? entity.getData().target === '_blank' : false}
          toggle={handleCloseModal}
          url={entity ? entity.getData().url : null}
        />
      ));
    }
  }

  /**
   * Toggles the sidebar open state/styles. The isDocumentClick is related to the Popover
   * behavior inside the sidebar - if this is a click on the sidebar button itself then e
   * will be defined.
   *
   * @param {SyntheticKeyboardEvent} e - a synthetic keyboard event
   */
  const handleToggleSidebar = (e) => {
    const isDocumentClick = typeof e === 'undefined';
    setIsSidebarOpen(!isSidebarOpen);
    setSidebarHolderStyle({
      ...sidebarHolderStyle,
      transform: `scale(${isDocumentClick ? 0 : 1})`,
    });
    if (isSidebarOpen) {
      document.addEventListener('click', handlePopoverClick);
    } else {
      document.removeEventListener('click', handlePopoverClick);
    }
  }

  /**
   * Toggles the special character modal.
   */
  const handleToggleSpecialCharacterModal = () => {
    if (modalComponent) {
      handleCloseModal();
    } else {
      handleOpenModal(() => (
        <SpecialCharacterModal
          isOpen
          onSelectSpecialCharacter={handleSelectSpecialCharacter}
          toggle={handleCloseModal}
        />
      ));
    }
  }

  /**
   * Custom key bindings.
   *
   * @link https://draftjs.org/docs/advanced-topics-key-bindings
   *
   * @param {SyntheticKeyboardEvent} e - a synthetic keyboard event
   *
   * @returns {string} a command type
   */
   const keyBindingFn = (e) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    // if nothing is selected
    if (selectionState.getAnchorOffset() === selectionState.getFocusOffset()) {
      const currentBlock = getBlockForKey(contentState, selectionState.getAnchorKey());
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          return constants.SOFT_NEWLINE;
        }
        if (currentBlock.getText() === '' && isBlockAList(currentBlock)) {
          return constants.DOUBLE_ENTER_ON_LIST;
        }
      }
    } else if (
      /^[cx]$/.test(e.key)
      && ((e.metaKey && isMacOS()) || (e.ctrlKey && isWindows()))
      && isAtomicBlockSelected(editorState)
    ) {
      if (e.key === 'c') {
        selection.capture(editorState);
        copySelectedBlocksToClipboard(editorState);
        selection.restore();
        return constants.ATOMIC_BLOCKS_COPIED; // just to prevent draft from doing anything
      }
      if (e.key === 'x') {
        copySelectedBlocksToClipboard(editorState);
        return constants.ATOMIC_BLOCKS_CUT;
      }
    }
    return getDefaultKeyBinding(e);
  }

  /**
   * Update the state with the new EditorState and position the sidebar/button components.
   * Whatever happens here, you MUST set the new EditorState. If you don't you can lose all
   * the decorators and whatever other black magic is happening behind the scenes.
   *
   * @param {EditorState} editorState - a state instance of a DraftJs Editor
   */
   const onChange = (editorState) => {
    console.log('onChange Called with', editorState);
    window.editorState = editorState;
    const lastChangeType = editorState.getLastChangeType();
    const selectionState = editorState.getSelection();
    let callback = noop;

    /**
     * just clicking around the editor counts as a change (of type null),
     * but is not enough to dirty the state, so check the change type.
     */
    if (!isDirty && lastChangeType !== null) {
      setIsDirty(true);
      callback = delegate.handleDirtyEditor;
    }

    if (lastChangeType === 'undo' && editorState.getUndoStack().size === 0 && isDirty) {
      setIsDirty(true);
      callback = delegate.handleCleanEditor;
    }

    setEditorState(editorState);
    setReadOnly(false);
    positionComponents(editorState.getCurrentContent(), selectionState.getAnchorKey());

    setEditorState(editorState);
    setIsDirty(isDirty);
    
    if (selectionState.getHasFocus()) {
      positionComponents(editorState.getCurrentContent(), selectionState.getAnchorKey());
    } else {
      removeActiveStyling();
    }
    callback();
  }

  /**
   * Positions the sidebar/button components.
   *
   * TODO: this whole thing can potentially be removed by refactoring the buttons to be a part of
   * each block's wrapper (GenericBlockPlaceholder, ListBlockWrapper, etc). would replace a lot of
   * dom querying and other non-react workflows with the preferred react onMouseEnter/onMouseLeave
   * way
   *
   * @param {ContentState} contentState - a state instance of a DraftJs Editor
   * @param {string} key - a block key
   * @param {?ContentBlock} block - a block
   */
  const positionComponents = (contentState, key, block = null) => {
    // fixme: this could take contentState only
    let activeBlock;
    let blockKey;
    if (!block) {
      blockKey = key;
      activeBlock = getBlockForKey(contentState, blockKey);
    } else {
      activeBlock = block;
      blockKey = activeBlock.getKey();
    }

    // if (!this.editor || !this.editor.editor) {
    //   return; // component is unmounting, let's get outta here
    // }
    if (!editorRef.current) {
      return; // component is unmounting, let's get outta here
    }

    // const { editor } = this.editor.editor;
    const { editor } = editorRef.current.editor;
    console.log('What is editor???', {
      editorRef,
    });
    window.editorRef = editorRef;
    const editorBounds = editor.getBoundingClientRect();
    let selectedBlockNode = getBlockNode(contentState, blockKey);
    if (!selectedBlockNode) {
      return; // the selected node is gone, probably deleted
    }
    if (blockParentNode.contains(selectedBlockNode)) {
      while (!blockParentNode.is(selectedBlockNode.parentNode)) {
        selectedBlockNode = selectedBlockNode.parentNode;
      }
    } else {
      blockParentNode.clearCache(); // todo: see if this is the right thing to be doing (used to just return)
      return; // invalid. can happen when cutting text out of the first/last block
    }

    const blockBounds = selectedBlockNode.getBoundingClientRect();

    const blockButtonsStyle = { ...blockButtonsStyle }; // eslint-disable-line
    blockButtonsStyle.top = (blockBounds.top - editorBounds.top) - 10;
    blockButtonsStyle.transform = `scale(${readOnly || isHoverInsertMode ? 0 : 1})`;

    if (!contentState.getBlockForKey(activeBlockKey)) {
      blockButtonsStyle.transform = 'scale(0)'; // escape hatch, buttons wont work without activeBlockKey
    }

    const isSidebarVisible = isHoverInsertMode
      || (!readOnly && !isBlockAList(activeBlock));

    if (activeBlockKey && contentState.getBlockForKey(activeBlockKey)) {
      styleActiveBlock(activeBlock);
    }

    const sidebarHolderStyle = getSidebarHolderStyle(
      activeBlock,
      blockBounds,
      contentState,
      editorBounds,
    );

    setActiveBlockKey(normalizeKey(blockKey));
    setBlockButtonsStyle(blockButtonsStyle);
    setIsSidebarOpen(isSidebarOpen && isSidebarVisible);
    setSidebarHolderStyle(sidebarHolderStyle);
  }

  /**
   * Removes active styling, some based on focus state.
   */
  const removeActiveStyling = () => {
    // eslint-disable-next-line
    const blockButtonsStyle = { ...blockButtonsStyle };
    blockButtonsStyle.transform = 'scale(0)';

    // eslint-disable-next-line
    const sidebarHolderStyle = { ...sidebarHolderStyle };
    if (editorState.getCurrentContent().hasText()) {
      if (!isSidebarOpen) {
        sidebarHolderStyle.transform = 'scale(0)';
      }
    } else {
      sidebarHolderStyle.top = 14;
    }

    const styledBlock = document.querySelector('.block-active');
    const selectionState = editorState.getSelection();
    if (selectionState.getHasFocus()) {
      // if the text indicator is in the editor, make sure that the
      // block with the text indicator is styled as active
      let anchorKey = selectionState.getAnchorKey();
      const block = getBlockForKey(editorState.getCurrentContent(), anchorKey);
      if (isBlockAList(block)) {
        const blockNode = getBlockNode(editorState.getCurrentContent(), block);
        if (!blockParentNode.is(blockNode.parentNode)) {
          anchorKey = blockNode.parentNode.getAttribute('data-offset-key');
        }
      }
      if (styledBlock && !areKeysSame(anchorKey, styledBlock.getAttribute('data-offset-key'))) {
        styledBlock.classList.remove('block-active');
        getBlockNode(editorState.getCurrentContent(), anchorKey).classList.add('block-active');
      }
    } else if (styledBlock) {
      // if the text indicator is not in the editor, remove any active block styling
      styledBlock.classList.remove('block-active');
    }

    setBlockButtonsStyle(blockButtonsStyle);
    setIsHoverInsertMode(false);
    setSidebarHolderStyle(sidebarHolderStyle);
  }

  /**
   * Selects and styles a block, and positions components over it. Useful for forcing
   * activeBlockKey and SelectionState after tricky operations.
   *
   * @param {(object|number|string)} id - a block, a block index, or a block key
   */
  const selectAndStyleBlock = (id) => {
    const block = findBlock(editorState.getCurrentContent(), id);
    setEditorState(selectBlock(editorState, block));    
    styleActiveBlock(block);
    positionComponents(editorState.getCurrentContent(), block.getKey());
  }

  const setCopiedBlockFromStorage = () => {
    const copiedBlockJson = localStorage.getItem(COPIED_BLOCK_KEY);
    if (!copiedBlockJson) {
      return;
    }

    if (copiedBlock && `${copiedBlock}` === copiedBlockJson) {
      return;
    }

    JsonSerializer.deserialize(copiedBlockJson).then((block) => setCopiedBlock(block));
  }

  /**
   * When moving the mouse, determine if it is "between" blocks and set state
   * accordingly.
   *
   * @param {ContentState} contentState - a state instance of a DraftJs Editor
   * @param {object} coords - mouse position coordinates
   */
  const setHoverInsertMode = (contentState, coords) => {
    const { pageX, pageY } = coords;
    // we are probably not around the first block, so check for the block above us
    let target = document.elementFromPoint(pageX, (pageY - 40));

    let isHoverInsertModeBottom = true;
    target = getValidBlockTarget(target);
    if (!target) {
      // we are probably around the first block, so look for one below where we are
      target = getValidBlockTarget(document.elementFromPoint(pageX, (pageY + 40)));
      if (!target) {
        return; // no valid target - we are on the side of a block or something weird happened
      }
      isHoverInsertModeBottom = false;
    }
    const blockKey = target.getAttribute('data-offset-key');
    const activeBlock = getBlockForKey(contentState, blockKey);

    let selectedBlockNode = getBlockNode(contentState, blockKey);
    while (!blockParentNode.is(selectedBlockNode.parentNode)) {
      selectedBlockNode = selectedBlockNode.parentNode;
    }

    const blockBounds = selectedBlockNode.getBoundingClientRect();
    const isHoverInsertMode = contentState.hasText()
      && (!hoverBlockNode || coords.pageX < (blockBounds.right - 50));

    setHoverBlockNode(selectedBlockNode);
    setIsHoverInsertMode(isHoverInsertMode);
    setIsHoverInsertModeBottom(isHoverInsertModeBottom);
    
    // oftentimes after clicking to insert a new empty text block, the button components
    // will be activated on the previous block. this check prevents that.
    if (isHoverInsertMode) {
      styleActiveBlockNode(); // remove active block styling
      positionComponents(contentState, 'ignore', activeBlock);
    } else {
      styleActiveBlock(activeBlock);
      const blockAfter = contentState.getBlockAfter(activeBlock.getKey());
      if (blockAfter) {
        positionComponents(contentState, 'ignore', blockAfter);
      }
    }
  }

  /**
   * Performs logic to decide if a new active block should be styled, and the old active
   * block should have its styling removed.
   *
   * @param {ContentBlock} activeBlock  - the active block
   */
  const styleActiveBlock = (activeBlock) => {
    const contentState = editorState.getCurrentContent();
    let activeBlockNode = getBlockNode(contentState, activeBlock);
    if (activeBlockNode.tagName === 'LI') {
      activeBlockNode = activeBlockNode.parentNode;
    }

    if (editMode && !activeBlockNode.classList.contains('block-active')) {
      styleActiveBlockNode(activeBlockNode);
    }
  }

  /**
   * Removes and (potentially) adds active block styles/turns hoverInsertMode off
   *
   * @param {Node} [activeBlockNode=null] - a dom node for an active block
   */
  const styleActiveBlockNode = (activeBlockNode = null) => {
    document.querySelectorAll('.block-active').forEach((node) => node.classList.remove('block-active'));

    if (activeBlockNode && !isHoverInsertMode) {
      setActiveBlockKey(activeBlockNode.getAttribute('data-offset-key'));
      activeBlockNode.classList.add('block-active');
    }
  }

  
  const Modal = modalComponent;
  let className = readOnly ? 'view-mode' : 'edit-mode';
  className = `${className}${!editorState.getCurrentContent().hasText() ? ' empty' : ''}`;
  console.log('what is modal?', modalComponent);

  const InlineToolbar = inlineToolbarPlugin.InlineToolbar;

  return (
    <>
      <div
        onCopy={handleMouseCopy}
        onCut={handleMouseCut}
        onDrop={handleDrop}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
        id="block-editor"
        className={className}
        role="presentation"
      >
        <Editor
          blockRendererFn={blockRendererFn}
          blockRenderMap={blockRenderMap}
          blockStyleFn={blockStyleFn}
          customStyleMap={customStyleMap}
          // decorators={decorators}
          defaultBlockRenderMap={false}
          editorState={editorState}
          handleDrop={() => 'handled'} // tell DraftJs that we want to handle our own onDrop event
          handleKeyCommand={handleKeyCommand}
          handlePastedText={handlePastedText}
          keyBindingFn={keyBindingFn}
          onBlur={handleBlur}
          onChange={onChange}
          plugins={plugins}
          readOnly={readOnly}
          ref={editorRef}
          spellCheck
        />
        <div style={blockButtonsStyle} className="block-buttons-holder">
          <BlockButtons
            activeBlockKey={activeBlockKey}
            copiedBlock={copiedBlock}
            editorState={editorState}
            onCopyBlock={handleCopyBlock}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPasteBlock={handlePasteBlock}
            onShiftBlock={handleShiftBlock}
            onToggleSpecialCharacterModal={handleToggleSpecialCharacterModal}
            resetFlag={blockButtonsStyle.top}
          />
        </div>
        <div style={sidebarHolderStyle} className="sidebar-holder">
          <Sidebar
            isHoverInsertMode={isHoverInsertMode}
            isOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
            onToggleBlockModal={handleToggleBlockModal}
            onHoverInsert={handleHoverInsert}
            resetFlag={sidebarResetFlag}
            popoverRef={popoverRef}
          />
        </div>
        {/* <InlineToolbar>
          {(props) => (
            <>
              <BoldInlineToolbarButton {...props} />
              <ItalicInlineToolbarButton {...props} />
              <UnderlineInlineToolbarButton {...props} />
              <LinkInlineToolbarButton
                {...props}
                onToggleLinkModal={handleToggleLinkModal}
                getEditorState={getEditorState}
              />
              <OrderedListInlineToolbarButton {...props} />
              <UnorderedListInlineToolbarButton {...props} />
              <StrikethroughInlineToolbarButton {...props} />
              <HighlightInlineToolbarButton {...props} />
            </>
          )}
        </InlineToolbar> */}
        {Modal && (
          <ErrorBoundary>
            {Modal}
          </ErrorBoundary>
        )}
      </div>
      {!readOnly && (
        <div className="text-center mt-2">
          <span className="btn-hover">
            <Button id="add-block-button" className="rounded-circle" color="success" size="sm" onClick={handleAddEmptyBlockAtEnd}>
              <Icon imgSrc="plus" size="md" />
            </Button>
          </span>
          <UncontrolledTooltip key="tooltip" placement="bottom" target="add-block-button">Add empty block at end</UncontrolledTooltip>
        </div>
      )}
    </>
  );
}
