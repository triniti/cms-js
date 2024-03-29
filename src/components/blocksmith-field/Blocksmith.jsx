import React, { lazy } from 'react';
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
import { ErrorBoundary, Icon, withPbj, UncontrolledTooltip } from 'components';
import BlocksmithFieldComponents from 'components/blocksmith-field/components';
import convertToEditorState from 'components/blocksmith-field/utils/convertToEditorState';
import { getPlaceholderConfig } from 'components/blocksmith-field/placeholderConfig';
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
import startCase from 'lodash-es/startCase';

const {
  BlockButtons,
  BoldInlineToolbarButton,
  GenericBlockPlaceholder,
  ItalicInlineToolbarButton,
  HighlightInlineToolbarButton,
  LinkInlineToolbarButton,
  ListBlockWrapper,
  LinkModal,
  StrikethroughInlineToolbarButton,
  SpecialCharacterModal,
  Sidebar,
  OrderedListInlineToolbarButton,
  UnderlineInlineToolbarButton,
  UnorderedListInlineToolbarButton,
} = BlocksmithFieldComponents;

let TextBlockV1;
const getModalComponent = (message) => BlocksmithFieldComponents[`${startCase(message).replace(' ', '')}Modal`];

class Blocksmith extends React.Component {
  static async confirmDelete() {
    return Swal.fire({
      title: 'Are you sure?',
      text: 'This block will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
    });
  }

  constructor(props) {
    super(props);
    const { blocks, editMode } = this.props;

    let editorState = EditorState.createEmpty(new CompositeDecorator(decorators));
    if (blocks && blocks.length) {
      convertToCanvasBlocks(editorState).then((canvasBlocks) => {
        editorState = convertToEditorState(canvasBlocks);
      });
    }

    this.state = {
      blockButtonsStyle: {
        transform: 'scale(0)',
      },
      editorState,
      errors: {}, // todo: update
      isHoverInsertMode: false,
      isSidebarOpen: false,
      readOnly: !editMode,
      sidebarResetFlag: 0,
      sidebarHolderStyle: {
        transform: 'scale(1)',
        top: 14,
      },
    };

    this.popoverRef = React.createRef();

    /**
     * allows to overwrite the default block render map, this will ensure the pasted text will
     * only convert to Draft block types if the element is listed in the map below.
     *
     * e.g., when a h3 element is pasted into blocksmith, it will be converted to <p> tags
     *
     * @link https://draftjs.org/docs/advanced-topics-custom-block-render-map
     */
     this.blockRenderMap = Map({
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

    this.inlineToolbarPlugin = createInlineToolbarPlugin({
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

    this.plugins = [
      this.inlineToolbarPlugin,
    ];

    this.blockRendererFn = this.blockRendererFn.bind(this);
    this.blockStyleFn = this.blockStyleFn.bind(this);
    this.getEditorState = this.getEditorState.bind(this);
    this.getReadOnly = this.getReadOnly.bind(this);
    this.getSidebarHolderStyle = this.getSidebarHolderStyle.bind(this);
    this.handleAddCanvasBlock = this.handleAddCanvasBlock.bind(this);
    this.handleAddEmptyBlockAtEnd = this.handleAddEmptyBlockAtEnd.bind(this);
    this.handleAddLink = this.handleAddLink.bind(this);
    this.handleBlockMouseEnter = this.handleBlockMouseEnter.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCopyBlock = this.handleCopyBlock.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditCanvasBlock = this.handleEditCanvasBlock.bind(this);
    this.handleHoverInsert = this.handleHoverInsert.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseCopy = this.handleMouseCopy.bind(this);
    this.handleMouseCut = this.handleMouseCut.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handlePasteBlock = this.handlePasteBlock.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
    this.handleSelectSpecialCharacter = this.handleSelectSpecialCharacter.bind(this);
    this.handleShiftBlock = this.handleShiftBlock.bind(this);
    this.handleToggleBlockModal = this.handleToggleBlockModal.bind(this);
    this.handleToggleLinkModal = this.handleToggleLinkModal.bind(this);
    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
    this.handleToggleSpecialCharacterModal = this.handleToggleSpecialCharacterModal.bind(this);
    this.keyBindingFn = this.keyBindingFn.bind(this);
    this.onChange = this.onChange.bind(this);
    this.positionComponents = this.positionComponents.bind(this);
    this.removeActiveStyling = this.removeActiveStyling.bind(this);
    this.selectAndStyleBlock = this.selectAndStyleBlock.bind(this);
    this.setCopiedBlockFromStorage = this.setCopiedBlockFromStorage.bind(this);
    this.setHoverInsertMode = this.setHoverInsertMode.bind(this);
    this.styleActiveBlock = this.styleActiveBlock.bind(this);
    this.styleActiveBlockNode = this.styleActiveBlockNode.bind(this);

    visibilityWatcher.init(this.setCopiedBlockFromStorage);
  }

  async componentDidMount() {
    const { blocks } = this.props;
    if (!blocks || !blocks.length) {
      return;
    }

    const copiedBlockJson = localStorage.getItem(COPIED_BLOCK_KEY);
    if (copiedBlockJson) {
      const copiedBlock = await JsonSerializer.deserialize(copiedBlockJson);
      this.setState(() => ({ copiedBlock }));
    }

    TextBlockV1 = await MessageResolver.resolveCurie('*:canvas:block:text-block:v1');
    const decodedBlocks = await Promise.all(blocks.map((block) => ObjectSerializer.decodeMessage(block)));
    // todo: simplify decorators
    const editorState = convertToEditorState(decodedBlocks, new CompositeDecorator(decorators));
    this.onChange(editorState);
  }

  /**
   * If you try to get clever and do something with incoming editorState here, be very careful.
   * It is very easy to wipe out decorator/plugin behavior. You must maintain the same editorState
   * instance that is currently in state.
   *
   * @link https://github.com/draft-js-plugins/draft-js-plugins/issues/210
   */
  async componentDidUpdate({blocks: prevBlocks, editorState: prevPropsEditorState, editMode: prevEditMode}) {
    const { editorState: currentPropsEditorState, editMode, blocks } = this.props;
    const { editorState } = this.state;

    if (prevEditMode !== editMode) {
      this.setState(() => ({ readOnly: !editMode }));
      return;
    }

    // This is for revert support
    if (prevBlocks !==  blocks) {
      const blocksToMixins = await Promise.all(blocks.map(block => ObjectSerializer.decodeMessage(block)));
      const convertedEditorState = convertToEditorState(blocksToMixins);
      pushEditorState(editorState, convertedEditorState.getCurrentContent(), 'arbitrary').then(newEditorState => {
        this.setState(() => ({
          editorState: newEditorState.editorState, // Updates editorState with new content
          errors: newEditorState.errors,
          activeBlockKey: normalizeKey(newEditorState.editorState.getCurrentContent().getFirstBlock().getKey()), // Resets the activeBlockKey to a valid one
        }));
      });
      return;
    }

    if (
      currentPropsEditorState
      && prevPropsEditorState
      && prevPropsEditorState !== currentPropsEditorState
    ) {
      const newEditorState = pushEditorState(editorState, currentPropsEditorState.getCurrentContent());
      /**
       * Force editor to re-render when new editorState comes in via props. Required because the
       * error boundary can "restore" the editor after an error.
       */
      this.setState(() => ({
        editorState: newEditorState.editorState,
        errors: newEditorState.errors,
      }));
    }
  }

  componentWillUnmount() {
    blockParentNode.clearCache();
    selection.clearCache();
    sidebar.clearCache();
    updateBlocks.clearCache();
    visibilityWatcher.cleanup();
  }

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
  blockRendererFn(block) {
    const {editorState, readOnly} = this.state;
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
            blockProps={{getReadOnly: this.getReadOnly}}
          />,
          editable: false,
        };
      }
      case blockTypes.UNSTYLED:
        return {
          component: DraggableTextBlock,
          contentEditable: !readOnly,
          props: {
            getReadOnly: this.getReadOnly,
            onMouseEnter: this.handleBlockMouseEnter,
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
            getReadOnly: this.getReadOnly,
          },
        };
      default:
        return {
          component: () => <GenericBlockPlaceholder
            block={block}
            config={{}}
            blockProps={{getReadOnly: this.getReadOnly}}
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
  blockStyleFn(block) {
    const {errors} = this.state;
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
  getEditorState() {
    const { editorState } = this.state;
    return editorState;
  }

  /**
   * for components returned by blockRendererFn that do not receive props in the normal way.
   * need to have this closure because blockRendererFn does not get called when changing view/edit
   * mode or other external events, so the blocks rendered there won't get an updated readOnly value
   */
  getReadOnly() {
    const { readOnly } = this.state;
    return readOnly;
  }

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
  getSidebarHolderStyle(activeBlock, blockBounds, contentState, editorBounds) {
    const {
      editorState,
      hoverBlockNode,
      isHoverInsertMode,
      isHoverInsertModeBottom,
      readOnly,
    } = this.state;
    const sidebarHolderStyle = { ...this.state.sidebarHolderStyle };
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
  updateCanvasBlocks(editorState) {
    const { onChange } = this.props;
    convertToCanvasBlocks(editorState).then((canvasBlocks) => {
      onChange(canvasBlocks.map((canvasBlock) => canvasBlock.toJSON()));
    });
  }

  /**
   * Adds a new empty block at the end.
   */
  handleAddEmptyBlockAtEnd() {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const newBlockKey = genKey();
    const newContentState = insertEmptyBlock(
      contentState,
      contentState.getLastBlock().getKey(),
      constants.POSITION_AFTER,
      newBlockKey,
    );
    pushEditorState(editorState, newContentState, 'arbitrary').then((newEditorState) => {
      this.setState(() => ({
        isHoverInsertMode: false,
        isHoverInsertModeBottom: null,
        editorState: selectBlock(newEditorState.editorState, newBlockKey),
        errors: newEditorState.errors,
      }), () => this.positionComponents(newEditorState.editorState.getCurrentContent(), newBlockKey));
    });
  }

  /**
   * Given a canvas block, creates a DraftJs block (with data) for said block at the active block.
   *
   * @param {*} canvasBlock                - a triniti canvas block
   * @param {boolean} shouldSelectAndStyle - whether or not to select and style the new block
   */
  handleAddCanvasBlock(canvasBlock, shouldSelectAndStyle = false) {
    const {
      activeBlockKey,
      editorState,
      isDirty,
      isHoverInsertModeBottom,
      sidebarResetFlag,
    } = this.state;
    // const { delegate } = this.props;
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
      this.setState(() => ({
        editorState: newEditorState.editorState,
        errors: newEditorState.errors,
        isDirty: true,
        sidebarResetFlag: +!sidebarResetFlag,
      }), () => {
        this.removeActiveStyling();
        this.handleToggleSidebar();
        // if (!isDirty) {
        //   delegate.handleDirtyEditor();
        // }
        // /* eslint-disable react/destructuring-assignment */
        // if (!this.state.editorState.getSelection().getHasFocus()) {
        //   delegate.handleStoreEditor(this.state.editorState);
        // }
        // /* eslint-enable react/destructuring-assignment */
        if (shouldSelectAndStyle) {
          this.selectAndStyleBlock(newBlockKey || activeBlockKey);
        }
        this.updateCanvasBlocks(this.state.editorState);
      });
    });
  }

  /**
   * Turns the currently selected text into a link. This is passed as a prop into the link
   * modal so it can have a super sweet button to add a link.
   */
  handleAddLink(target, url) {
    const { editorState } = this.state;
    this.setState(() => ({
      editorState: createLinkAtSelection(editorState, target, url),
      isDirty: true,
    }), () => {
      this.updateCanvasBlocks(this.state.editorState);
    });
  }

  handleBlockMouseEnter(blockKey) {
    this.setState(() => ({
      activeBlockKey: normalizeKey(blockKey),
    }));
  }

  /**
   * Updates form value on blur.
   */
  handleBlur(syntheticEvent, pluginFunctions) {
    const { onChange } = this.props;
    this.updateCanvasBlocks(pluginFunctions.getEditorState());
  }

  /**
   * Closes any currently open modal.
   */
  handleCloseModal() {
    this.setState(() => ({
      readOnly: false,
      modalComponent: null,
    }));
  }

  /**
   * Stores the triniti block payload in redux so that it is available for later pasting
   */
  handleCopyBlock() {
    // todo: maybe update this to use actual clipboard and object de/serialization
    const { activeBlockKey, copiedBlock, editorState } = this.state;
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

    this.setState(() => ({ copiedBlock: canvasBlock }));
    localStorage.setItem(COPIED_BLOCK_KEY, `${canvasBlock}`);
    // delegate.handleStoreEditor(editorState);
  }

  /**
   * Deletes the active block. A block's key is set as the active key (in positionComponents) when
   * the text indicator is moved into it or when the mouse is moved over it.
   */
  handleDelete() {
    const { activeBlockKey, editorState, isDirty } = this.state;
    const { delegate } = this.props;

    this.setState(() => ({ readOnly: true }), () => {
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
              this.updateCanvasBlocks(this.state.editorState);
            });
          });
        });
      });
    });
  }

  /**
   * Handles the drop part of a block drag and drop event. The event's data transfer
   * (populated in the drag and drop handle's startDrag function) is parsed to get the
   * key of the dragged block and the blocks are rearranged accordingly. Also, all styling
   * and event listeners added during the drag process are removed.
   *
   * @param {event} e - a drop event
   */
  handleDrop(e) {
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

    const { editorState, isDirty } = this.state;
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
      this.setState(() => ({
        editorState: newEditorState.editorState,
        errors: newEditorState.errors,
        isDirty: true,
      }), () => {
        this.updateCanvasBlocks(this.state.editorState);
        // const { delegate } = this.props;
        // delegate.handleStoreEditor(newEditorState.editorState);
        // if (!isDirty) {
        //   delegate.handleDirtyEditor();
        // }
      });
    });
    return 'handled';
  }

  /**
   * Opens the edit modal for the active block. A block's key is set as the active key
   * (in positionComponents) when the text indicator is moved into it or when the mouse
   * is moved over it.
   */
  handleEdit() {
    const { activeBlockKey, editorState } = this.state;
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
    this.handleToggleBlockModal(canvasBlock);
  }

  /**
   * Updates the data payload for an existing draft block using the provided canvas block.
   *
   * @link https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Entities.md
   *
   * @param {*}      canvasBlock - a triniti canvas block
   */
  handleEditCanvasBlock(canvasBlock) {
    const { activeBlockKey, isDirty, editorState } = this.state;
    const { onChange } = this.props;

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
        this.positionComponents(
          this.state.editorState.getCurrentContent(),
          findBlock(this.state.editorState.getCurrentContent(), activeBlockPosition).getKey(),
        );
        this.updateCanvasBlocks(this.state.editorState);
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
   handleKeyCommand(command, editorState) {
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
          this.setState(() => ({
            editorState: newEditorState.editorState,
            errors: newEditorState.errors,
          }), () => {
            this.positionComponents(newEditorState.editorState.getCurrentContent(), selectionState.getAnchorKey());
          });
        });
        return 'handled';
      }
      case constants.SOFT_NEWLINE:
        this.setState(() => ({
          editorState: RichUtils.insertSoftNewline(editorState),
        }));
        return 'handled';
      case constants.ATOMIC_BLOCKS_CUT:
        this.setState(() => ({
          editorState: deleteSelectedBlocks(editorState),
        }));
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
  handleKeyDown(e) {
    const { editorState } = this.state;
    this.setState(() => ({
      isHoverInsertMode: false,
    }));

    const { isOptionKeyCommand, hasCommandModifier } = KeyBindingUtil;
    if (!editorState.getSelection().getHasFocus() || isOptionKeyCommand(e)) {
      return; // currently not intercepting ctrl/option combos (eg alt+shift+arrow to select word)
    }

    if (hasCommandModifier(e)) {
      switch (getDefaultKeyBinding(e)) {
        case 'bold':
          this.setState(() => ({
            editorState: RichUtils.toggleInlineStyle(editorState, 'BOLD'),
          }));
          return;
        case 'italic':
          this.setState(() => ({
            editorState: RichUtils.toggleInlineStyle(editorState, 'ITALIC'),
          }));
          return;
        case 'underline':
          this.setState(() => ({
            editorState: RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'),
          }));
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
            this.setState(() => ({
              editorState: selectBlock(editorState, previousBlock, selectBlockSelectionTypes.END),
            }));
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
            this.setState(() => ({
              editorState: selectBlock(editorState, nextBlock, selectBlockSelectionTypes.START),
            }));
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
          this.setState(() => ({
            editorState: selectBlock(editorState, currentBlock.getKey(), selectBlockSelectionTypes.END),
          }));
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
  handleHoverInsert() {
    const {
      activeBlockKey,
      editorState,
      isHoverInsertModeBottom,
      sidebarResetFlag,
    } = this.state;
    const newBlockKey = genKey();
    const newContentState = insertEmptyBlock(
      editorState.getCurrentContent(),
      activeBlockKey,
      isHoverInsertModeBottom ? constants.POSITION_AFTER : constants.POSITION_BEFORE,
      newBlockKey,
    );
    pushEditorState(editorState, newContentState, 'arbitrary').then((newEditorState) => {
      this.setState(() => ({
        isHoverInsertMode: false,
        isHoverInsertModeBottom: null,
        editorState: selectBlock(newEditorState.editorState, newBlockKey),
        errors: newEditorState.errors,
        sidebarResetFlag: +!sidebarResetFlag,
      }), () => this.positionComponents(newEditorState.editorState.getCurrentContent(), newBlockKey));
    });
  }

  /**
   * Opens the supplied modal component.
   *
   * @param {Component} modalComponent - a react modal component.
   */
  handleOpenModal(modalComponent) {
    this.setState(() => ({
      readOnly: true,
      modalComponent,
    }));
  }

  /**
   * Allows copying advanced blocks to the clipboard, via serialization, to be pasted later.
   *
   * @param {SyntheticClipboardEvent} e - a synthetic clipboard event
   */
  handleMouseCopy(e) {
    const { editorState } = this.state;
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
  handleMouseCut(e) {
    const { editorState } = this.statthis.handleMouseCut = this.handleMouseCut.bind(this);e;
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
  handleMouseLeave() {
    const { modalComponent } = this.state

    if (modalComponent) {
      return
    }

    this.removeActiveStyling();
  }

  /**
   * Positions sidebar/button controls on blocks as the mouse is moved over them
   *
   * @param {SyntheticKeyboardEvent} e - a synthetic keyboard event
   */
  handleMouseMove(e) {
    const { activeBlockKey, editorState, isSidebarOpen, readOnly } = this.state;
    if (readOnly || isSidebarOpen) {
      return;
    }
    const { pageX, pageY } = e;
    let target = document.elementFromPoint(pageX, pageY);

    if (blockParentNode.is(target)) {
      this.setHoverInsertMode(editorState.getCurrentContent(), { pageX, pageY });
      this.positionComponents(editorState.getCurrentContent(), activeBlockKey);
    } else {
      const isOverSidebar = sidebar.isSidebar(target);
      this.setState(({ isHoverInsertMode }) => ({
        // fixme: this could be problematic - isHoverInsertMode is set outside of setHoverInsertMode. seems smelly
        isHoverInsertMode: isHoverInsertMode && isOverSidebar,
      }), () => {
        if (blockParentNode.contains(target)) {
          while (!blockParentNode.is(target.parentNode)) {
            target = target.parentNode;
          }
          this.positionComponents(editorState.getCurrentContent(), target.getAttribute('data-offset-key'));
        }
      });
    }
  }

  /**
   * If there is a copied block available, use it to
   * create a draft block with it as the data payload.
   */
  handlePasteBlock() {
    const { copiedBlock } = this.state;

    if (!copiedBlock) {
      return;
    }

    this.handleAddCanvasBlock(copiedBlock, true);
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
   handlePastedText(text, html, editorState) {
    if (html) {
      const { contentBlocks } = DraftPasteProcessor.processHTML(
        html,
        this.blockRenderMap.delete(blockTypes.ATOMIC),
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

        this.setState(() => ({
          editorState: newEditorState.editorState,
          errors: newEditorState.errors,
        }));

        return 'handled';
      }
    } else if (text && text.startsWith(tokens.BLOCKSMITH_COPIED_CONTENT_TOKEN)) {
      const blocks = JSON.parse(text.replace(new RegExp(`^${tokens.BLOCKSMITH_COPIED_CONTENT_TOKEN}`), ''))
        .map(function(block) { return ObjectSerializer.deserialize(block); });

      const selectionState = editorState.getSelection();
      const insertionKey = selectionState.getIsBackward()
        ? selectionState.getAnchorKey()
        : selectionState.getFocusKey();

      this.setState(() => ({
        editorState: insertCanvasBlocks(
          editorState,
          insertionKey,
          constants.POSITION_AFTER,
          blocks,
        ),
      }), this.removeActiveStyling);
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
  handlePopoverClick(e) {
    if (this.popoverRef && this.popoverRef.current) {
      if (this.popoverRef.current.contains(e.target)) {
        return;
      }
    }
    this.handleToggleSidebar(e);
  }

  /**
   * Removes the currently selected link. This is passed as a prop into the link modal so it
   * can have a super sweet button to remove the link.
   */
  handleRemoveLink() {
    this.setState(({ editorState }) => ({
      editorState: removeLinkAtSelection(editorState),
    }), () => {
      // const { delegate } = this.props;
      // const { isDirty } = this.state;
      // if (!isDirty) {
      //   delegate.handleDirtyEditor();
      // }
    });
  }

  /**
   * Inserts a special character, either at the position of the text indicator, or at the end of
   * the active block (if the text indicator is not in the active block)
   *
   * @param {string} specialCharacter
   */
  handleSelectSpecialCharacter(specialCharacter) {
    const { activeBlockKey, editorState } = this.state;
    const selectionState = editorState.getSelection();
    const insertingIntoNonActiveBlock = selectionState.getAnchorKey() !== activeBlockKey
      || selectionState.getFocusKey() !== activeBlockKey;
    this.setState(() => ({
      editorState: addEmoji(
        editorState,
        specialCharacter,
        insertingIntoNonActiveBlock ? activeBlockKey : null,
      ),
    }));
  }

  /**
   * Shifts blocks up or down, used by the up/down reorder buttons
   *
   * @param {ContentBlock} block    - a DraftJs ContentBlock
   * @param {number}       position - a position (array index) to move the block to
   */
  handleShiftBlock(block, position) {
    const { editorState } = this.state;
    pushEditorState(
      editorState,
      shiftBlock(
        editorState.getCurrentContent(),
        block,
        position,
      ),
      'arbitrary',
    ).then((newEditorState) => {
      this.setState(() => ({
        editorState: newEditorState.editorState,
        errors: newEditorState.errors,
      }), () => {
        this.removeActiveStyling();
        // const { delegate } = this.props;
        // const { isDirty } = this.state;
        // if (!isDirty) {
        //   delegate.handleDirtyEditor();
        // }
        // // eslint-disable-next-line react/destructuring-assignment
        // delegate.handleStoreEditor(this.state.editorState);
      });
    });
  }

  /**
   * Toggles custom block modal components.
   *
   * @param {?*}      canvasBlock  - a triniti canvas block (freshly created, when creating new)
   * @param {boolean} isFreshBlock - whether or not a new block is being created.
   */
  handleToggleBlockModal(canvasBlock, isFreshBlock = false) {
    const { modalComponent } = this.state;

    if (modalComponent) {
      this.handleCloseModal();
    } else {
      const curie = canvasBlock.schema().getCurie();
      const message = curie.getMessage();
      const canvasBlockObject = isFreshBlock ? {} : canvasBlock.toObject();
      const ComponentWithPbj = curie && withPbj(getModalComponent(message), curie.toString(), canvasBlockObject);

      this.handleOpenModal(() => 
        <ComponentWithPbj
          isOpen
          isFreshBlock={isFreshBlock}
          pbj={canvasBlock}
          block={canvasBlock}
          onAddBlock={this.handleAddCanvasBlock}
          onEditBlock={this.handleEditCanvasBlock}
          toggle={this.handleCloseModal}
        />
      );
    }
  }

  /**
   * Toggles the link modal, which will be populated by whatever url and openInNewTab values
   * are given, if any. If none are given, it is assumed that we are creating a new link.
   * If some are given, it is assumed that we are editing an existing link.
   */
  handleToggleLinkModal() {
    const { modalComponent } = this.state;
    if (modalComponent) {
      this.handleCloseModal();
    } else {
      const { editorState } = this.state;
      const contentState = editorState.getCurrentContent();
      const entityKey = getSelectionEntity(editorState);
      const entity = entityKey ? contentState.getEntity(entityKey) : null;
      this.handleOpenModal(() => (
        <LinkModal
          isOpen
          onAddLink={this.handleAddLink}
          onRemoveLink={this.handleRemoveLink}
          openInNewTab={entity ? entity.getData().target === '_blank' : false}
          toggle={this.handleCloseModal}
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
  handleToggleSidebar(e) {
    const isDocumentClick = typeof e === 'undefined';
    this.setState(({ isSidebarOpen, sidebarHolderStyle }) => ({
      isSidebarOpen: !isSidebarOpen,
      sidebarHolderStyle: {
        ...sidebarHolderStyle,
        transform: `scale(${isDocumentClick ? 0 : 1})`,
      },
    }), () => {
      const { isSidebarOpen } = this.state;

      if (isSidebarOpen) {
        document.addEventListener('click', this.handlePopoverClick);
      } else {
        document.removeEventListener('click', this.handlePopoverClick);
      }
    });
  }

  /**
   * Toggles the special character modal.
   */
  handleToggleSpecialCharacterModal() {
    const { modalComponent } = this.state;

    if (modalComponent) {
      this.handleCloseModal();
    } else {
      this.handleOpenModal(() => (
        <SpecialCharacterModal
          isOpen
          onSelectSpecialCharacter={this.handleSelectSpecialCharacter}
          toggle={this.handleCloseModal}
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
   keyBindingFn(e) {
    const { editorState } = this.state;
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
   onChange(editorState) {
    // todo: this method name and the onChange from redux form may be confusing

    let { isDirty } = this.state;
    const { delegate } = this.props;
    const lastChangeType = editorState.getLastChangeType();
    const selectionState = editorState.getSelection();
    let callback = noop;

    /**
     * just clicking around the editor counts as a change (of type null),
     * but is not enough to dirty the state, so check the change type.
     */
    if (!isDirty && lastChangeType !== null) {
      isDirty = true;
      // callback = delegate.handleDirtyEditor;
    }

    if (lastChangeType === 'undo' && editorState.getUndoStack().size === 0 && isDirty) {
      isDirty = false;
      callback = delegate.handleCleanEditor;
    }
    this.setState(() => ({
      editorState,
      readOnly: false, // todo: update
    }), () => {
      this.positionComponents(editorState.getCurrentContent(), selectionState.getAnchorKey());
    });

    this.setState(() => ({
      editorState,
      isDirty,
    }), () => {
      if (selectionState.getHasFocus()) {
        this.positionComponents(editorState.getCurrentContent(), selectionState.getAnchorKey());
      } else {
        this.removeActiveStyling();
      }
      callback();
    });
    
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
  positionComponents(contentState, key, block = null) {
    // fixme: this could take contentState only
    const { activeBlockKey, isHoverInsertMode, readOnly } = this.state;

    let activeBlock;
    let blockKey;
    if (!block) {
      blockKey = key;
      activeBlock = getBlockForKey(contentState, blockKey);
    } else {
      activeBlock = block;
      blockKey = activeBlock.getKey();
    }

    if (!this.editor || !this.editor.editor) {
      return; // component is unmounting, let's get outta here
    }

    const { editor } = this.editor.editor;
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

    const blockButtonsStyle = { ...this.state.blockButtonsStyle }; // eslint-disable-line
    blockButtonsStyle.top = (blockBounds.top - editorBounds.top) - 10;
    blockButtonsStyle.transform = `scale(${readOnly || isHoverInsertMode ? 0 : 1})`;

    if (!contentState.getBlockForKey(activeBlockKey)) {
      blockButtonsStyle.transform = 'scale(0)'; // escape hatch, buttons wont work without activeBlockKey
    }

    const isSidebarVisible = isHoverInsertMode
      || (!readOnly && !isBlockAList(activeBlock));

    if (activeBlockKey && contentState.getBlockForKey(activeBlockKey)) {
      this.styleActiveBlock(activeBlock);
    }

    const sidebarHolderStyle = this.getSidebarHolderStyle(
      activeBlock,
      blockBounds,
      contentState,
      editorBounds,
    );

    this.setState(() => ({
      activeBlockKey: normalizeKey(blockKey),
      blockButtonsStyle,
      isSidebarOpen: this.state.isSidebarOpen && isSidebarVisible,
      sidebarHolderStyle,
    }));
  }

  /**
   * Removes active styling, some based on focus state.
   */
  removeActiveStyling() {
    const { editorState, isSidebarOpen } = this.state;
    // eslint-disable-next-line
    const blockButtonsStyle = { ...this.state.blockButtonsStyle };
    blockButtonsStyle.transform = 'scale(0)';

    // eslint-disable-next-line
    const sidebarHolderStyle = { ...this.state.sidebarHolderStyle };
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

    this.setState(() => ({
      blockButtonsStyle,
      isHoverInsertMode: false,
      sidebarHolderStyle,
    }));
  }

  /**
   * Selects and styles a block, and positions components over it. Useful for forcing
   * activeBlockKey and SelectionState after tricky operations.
   *
   * @param {(object|number|string)} id - a block, a block index, or a block key
   */
  selectAndStyleBlock(id) {
    const { editorState } = this.state;
    const block = findBlock(editorState.getCurrentContent(), id);
    this.setState(() => ({
      editorState: selectBlock(editorState, block),
    }), () => {
      this.styleActiveBlock(block);
      this.positionComponents(editorState.getCurrentContent(), block.getKey());
    });
  }

  setCopiedBlockFromStorage() {
    const copiedBlockJson = localStorage.getItem(COPIED_BLOCK_KEY);
    if (!copiedBlockJson) {
      return;
    }

    const { copiedBlock } = this.state;
    if (copiedBlock && `${copiedBlock}` === copiedBlockJson) {
      return;
    }

    JsonSerializer.deserialize(copiedBlockJson).then((block) => {
      this.setState(() => ({ copiedBlock: block }));
    });
  }

  /**
   * When moving the mouse, determine if it is "between" blocks and set state
   * accordingly.
   *
   * @param {ContentState} contentState - a state instance of a DraftJs Editor
   * @param {object} coords - mouse position coordinates
   */
  setHoverInsertMode(contentState, coords) {
    const { hoverBlockNode } = this.state;
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

    this.setState(() => ({
      hoverBlockNode: selectedBlockNode,
      isHoverInsertMode,
      isHoverInsertModeBottom,
    }), () => {
      // oftentimes after clicking to insert a new empty text block, the button components
      // will be activated on the previous block. this check prevents that.
      if (isHoverInsertMode) {
        this.styleActiveBlockNode(); // remove active block styling
        this.positionComponents(contentState, 'ignore', activeBlock);
      } else {
        this.styleActiveBlock(activeBlock);
        const blockAfter = contentState.getBlockAfter(activeBlock.getKey());
        if (blockAfter) {
          this.positionComponents(contentState, 'ignore', blockAfter);
        }
      }
    });
  }

  /**
   * Performs logic to decide if a new active block should be styled, and the old active
   * block should have its styling removed.
   *
   * @param {ContentBlock} activeBlock  - the active block
   */
  styleActiveBlock(activeBlock) {
    const { editorState } = this.state;
    const { editMode } = this.props;
    const contentState = editorState.getCurrentContent();

    let activeBlockNode = getBlockNode(contentState, activeBlock);
    if (activeBlockNode.tagName === 'LI') {
      activeBlockNode = activeBlockNode.parentNode;
    }

    if (editMode && !activeBlockNode.classList.contains('block-active')) {
      this.styleActiveBlockNode(activeBlockNode);
    }
  }

  /**
   * Removes and (potentially) adds active block styles/turns hoverInsertMode off
   *
   * @param {Node} [activeBlockNode=null] - a dom node for an active block
   */
  styleActiveBlockNode(activeBlockNode = null) {
    const { isHoverInsertMode } = this.state;
    document.querySelectorAll('.block-active').forEach((node) => node.classList.remove('block-active'));

    if (activeBlockNode && !isHoverInsertMode) {
      this.setState(() => ({
        activeBlockKey: activeBlockNode.getAttribute('data-offset-key'),
      }), () => activeBlockNode.classList.add('block-active'));
    }
  }

  render() {
    const {
      activeBlockKey,
      blockButtonsStyle,
      copiedBlock,
      editorState,
      isHoverInsertMode,
      isSidebarOpen,
      modalComponent: Modal,
      readOnly,
      sidebarHolderStyle,
      sidebarResetFlag
    } = this.state;

    let className = readOnly ? 'view-mode' : 'edit-mode';
    className = `${className}${!editorState.getCurrentContent().hasText() ? ' empty' : ''}`;

    const InlineToolbar = this.inlineToolbarPlugin.InlineToolbar;

    return (
      <>
        <div
          onCopy={this.handleMouseCopy}
          onCut={this.handleMouseCut}
          onDrop={this.handleDrop}
          onMouseLeave={this.handleMouseLeave}
          onMouseMove={this.handleMouseMove}
          onKeyDown={this.handleKeyDown}
          id="block-editor"
          className={className}
          role="presentation"
        >
          <Editor
            blockRendererFn={this.blockRendererFn}
            blockRenderMap={this.blockRenderMap}
            blockStyleFn={this.blockStyleFn}
            customStyleMap={customStyleMap}
            // decorators={decorators}
            defaultBlockRenderMap={false}
            editorState={editorState}
            handleDrop={() => 'handled'} // tell DraftJs that we want to handle our own onDrop event
            handleKeyCommand={this.handleKeyCommand}
            handlePastedText={this.handlePastedText}
            keyBindingFn={this.keyBindingFn}
            onBlur={this.handleBlur}
            onChange={this.onChange}
            plugins={this.plugins}
            readOnly={readOnly}
            ref={(ref) => { this.editor = ref; }}
            spellCheck
          />
          <div style={blockButtonsStyle} className="block-buttons-holder">
            <BlockButtons
              activeBlockKey={activeBlockKey}
              copiedBlock={copiedBlock}
              editorState={editorState}
              onCopyBlock={this.handleCopyBlock}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
              onPasteBlock={this.handlePasteBlock}
              onShiftBlock={this.handleShiftBlock}
              onToggleSpecialCharacterModal={this.handleToggleSpecialCharacterModal}
              resetFlag={blockButtonsStyle.top}
            />
          </div>
          <div style={sidebarHolderStyle} className="sidebar-holder">
            <Sidebar
              isHoverInsertMode={isHoverInsertMode}
              isOpen={isSidebarOpen}
              onToggleSidebar={this.handleToggleSidebar}
              onToggleBlockModal={this.handleToggleBlockModal}
              onHoverInsert={this.handleHoverInsert}
              resetFlag={sidebarResetFlag}
              popoverRef={this.popoverRef}
            />
          </div>
          <InlineToolbar>
            {(props) => (
              <>
                <BoldInlineToolbarButton {...props} />
                <ItalicInlineToolbarButton {...props} />
                <UnderlineInlineToolbarButton {...props} />
                <LinkInlineToolbarButton
                  {...props}
                  onToggleLinkModal={this.handleToggleLinkModal}
                  getEditorState={this.getEditorState}
                />
                <OrderedListInlineToolbarButton {...props} />
                <UnorderedListInlineToolbarButton {...props} />
                <StrikethroughInlineToolbarButton {...props} />
                <HighlightInlineToolbarButton {...props} />
              </>
            )}
          </InlineToolbar>
          {Modal && (
            <ErrorBoundary>
              <Modal />
            </ErrorBoundary>
          )}
        </div>
        {!readOnly && (
          <div className="text-center mt-2">
            <span className="btn-hover">
              <Button id="add-block-button" className="rounded-circle" color="success" size="sm" onClick={this.handleAddEmptyBlockAtEnd}>
                <Icon imgSrc="plus" size="md" />
              </Button>
            </span>
            <UncontrolledTooltip key="tooltip" placement="bottom" target="add-block-button">Add empty block at end</UncontrolledTooltip>
          </div>
        )}
      </>
    );
  }
}

export default Blocksmith;
