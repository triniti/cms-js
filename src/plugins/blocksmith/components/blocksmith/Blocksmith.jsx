// fixme: refactor this thing so it doesn't need so many eslint-disables. super smelly
// todo: wrap text blocks and position the buttons in the normal react way
/* eslint-disable import/no-named-as-default */
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import Editor from 'draft-js-plugins-editor';
import moment from 'moment';
import MultiDecorator from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import noop from 'lodash/noop';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import PropTypes from 'prop-types';
import React from 'react';
import swal from 'sweetalert2';
import { connect } from 'react-redux';
import { getSelectionEntity } from 'draftjs-utils';
import { Map } from 'immutable';
import {
  BlockMapBuilder,
  CompositeDecorator,
  EditorState,
  genKey,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  RichUtils,
} from 'draft-js';

import BlockButtons from '@triniti/cms/plugins/blocksmith/components/block-buttons';
import BoldButton from '@triniti/cms/plugins/blocksmith/components/bold-inline-toolbar-button';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import DraggableTextBlock from '@triniti/cms/plugins/blocksmith/components/draggable-text-block';
import HighlightButton
  from '@triniti/cms/plugins/blocksmith/components/highlight-inline-toolbar-button';
import isMacOS from '@triniti/cms/utils/isMacOS';
import isOnFirstLineOfBlock from '@triniti/cms/plugins/blocksmith/utils/isOnFirstLineOfBlock';
import isOnLastLineOfBlock from '@triniti/cms/plugins/blocksmith/utils/isOnLastLineOfBlock';
import isWindows from '@triniti/cms/utils/isWindows';
import ItalicButton from '@triniti/cms/plugins/blocksmith/components/italic-inline-toolbar-button';
import LinkButton from '@triniti/cms/plugins/blocksmith/components/link-inline-toolbar-button';
import LinkModal from '@triniti/cms/plugins/blocksmith/components/link-modal';
import ListBlockWrapper from '@triniti/cms/plugins/blocksmith/components/list-block-wrapper';
import Message from '@gdbots/pbj/Message';
import ModalErrorBoundary from '@triniti/cms/plugins/blocksmith/components/modal-error-boundary';
import OrderedListButton
  from '@triniti/cms/plugins/blocksmith/components/ordered-list-inline-toolbar-button';
import Sidebar from '@triniti/cms/plugins/blocksmith/components/sidebar';
import SpecialCharacterModal from '@triniti/cms/plugins/common/components/special-character-modal';
import StrikethroughButton
  from '@triniti/cms/plugins/blocksmith/components/strikethrough-inline-toolbar-button';
import TextBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/text-block/TextBlockV1Mixin';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import UnderlineButton
  from '@triniti/cms/plugins/blocksmith/components/underline-inline-toolbar-button';
import UnorderedListButton
  from '@triniti/cms/plugins/blocksmith/components/unordered-list-inline-toolbar-button';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormText,
  Icon,
} from '@triniti/admin-ui-plugin/components';

import './styles.scss';
import constants from './constants';
import customStyleMap from './customStyleMap';
import decorators from './decorators';
import delegateFactory from './delegate';
import InnerErrorBoundary from './inner-error-boundary';
import selector from './selector';
import { blockTypes, COPIED_BLOCK_KEY, tokens } from '../../constants';
import { clearDragCache } from '../../utils/styleDragTarget';
import { getModalComponent, getPlaceholder } from '../../resolver';
import {
  addEmoji,
  areKeysSame,
  blockParentNode,
  convertToEditorState,
  copySelectedBlocksToClipboard,
  createLinkAtSelection,
  deleteBlock,
  deleteSelectedBlocks,
  dropBlock,
  findBlock,
  getBlockForKey,
  getBlockNode,
  getDraggedBlockNode,
  getInsertBlockMarkerNode,
  getListBlockNodes,
  getValidBlockTarget,
  getWordCount,
  handleDocumentDragover,
  handleDocumentDrop,
  insertCanvasBlocks,
  insertEmptyBlock,
  isAtomicBlockSelected,
  isBlockAList,
  isBlockEmpty,
  isFirstListBlock,
  isLastListBlock,
  normalizeKey,
  pushEditorState,
  removeLinkAtSelection,
  replaceBlockAtKey,
  selectBlock,
  selectBlockSelectionTypes,
  selection,
  shiftBlock,
  sidebar,
  styleDragTarget,
  updateBlocks,
  validateBlocks,
} from '../../utils';

class Blocksmith extends React.Component {
  static async confirmDelete() {
    return swal.fire({
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

  static propTypes = {
    blocksmithState: PropTypes.shape({
      editorState: PropTypes.instanceOf(EditorState),
      isDirty: PropTypes.bool.isRequired,
    }),
    copiedBlock: PropTypes.instanceOf(Message),
    delegate: PropTypes.shape({
      handleCleanEditor: PropTypes.func.isRequired,
      handleDirtyEditor: PropTypes.func.isRequired,
      handleGetNode: PropTypes.func.isRequired,
      handleStoreEditor: PropTypes.func.isRequired,
    }).isRequired,
    editorState: PropTypes.instanceOf(EditorState).isRequired,
    formName: PropTypes.string,
    getNode: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    node: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    blocksmithState: null,
    copiedBlock: null,
    formName: '',
    node: null,
  };

  constructor(props) {
    super(props);
    const {
      blocksmithState,
      copiedBlock,
      delegate,
      isEditMode,
      node,
    } = props;

    const decorator = new MultiDecorator([new CompositeDecorator(decorators)]);
    let editorState = EditorState.createEmpty(decorator);
    let errors;

    if (blocksmithState) {
      const pushedEditorState = pushEditorState(
        editorState,
        blocksmithState.editorState.getCurrentContent(),
        null,
      );
      editorState = pushedEditorState.editorState;
      errors = pushedEditorState.errors;
    } else {
      delegate.handleCleanEditor();
      if (node && node.has('blocks')) {
        editorState = convertToEditorState(node.get('blocks'), decorator);
      }
      errors = validateBlocks(editorState).errors;
    }

    if (copiedBlock) {
      this.derefCopiedBlockNodes();
    }

    this.state = {
      activeBlockKey: null,
      blockButtonsStyle: {
        transform: 'scale(0)',
      },
      errors,
      hoverBlockNode: null,
      isDirty: false,
      isHoverInsertMode: false,
      isHoverInsertModeBottom: null,
      isSidebarOpen: false,
      sidebarHolderStyle: {
        transform: 'scale(1)',
        top: 14,
      },
      sidebarResetFlag: 0,
      editorState,
      readOnly: !isEditMode,
      modalComponent: null,
    };

    delegate.handleStoreEditor(editorState);

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

    this.pluginComponents = [
      {
        key: 'inline-toolbar',
        PluginComponent: this.inlineToolbarPlugin.InlineToolbar,
      },
    ];

    /**
     * allows to overwrite the default block render map, this will ensure the pasted text will
     * only convert to Draft block types if the element is listed in the map below.
     *
     * e.g., when a h3 element is pasted into  blocksmith, it will be converted to <p> tags
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
        element: 'p',
        aliasedElements: ['div'],
      },
    });

    this.popoverRef = React.createRef();

    this.blockRendererFn = this.blockRendererFn.bind(this);
    this.blockStyleFn = this.blockStyleFn.bind(this);
    this.derefCopiedBlockNodes = this.derefCopiedBlockNodes.bind(this);
    this.getEditorState = this.getEditorState.bind(this);
    this.getReadOnly = this.getReadOnly.bind(this);
    this.getSidebarHolderStyle = this.getSidebarHolderStyle.bind(this);
    this.handleAddCanvasBlock = this.handleAddCanvasBlock.bind(this);
    this.handleAddEmptyBlockAtEnd = this.handleAddEmptyBlockAtEnd.bind(this);
    this.handleAddLink = this.handleAddLink.bind(this);
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
    this.setHoverInsertMode = this.setHoverInsertMode.bind(this);
    this.styleActiveBlock = this.styleActiveBlock.bind(this);
    this.styleActiveBlockNode = this.styleActiveBlockNode.bind(this);
  }

  componentDidMount() {
    this.editor.blur();
  }

  /**
   * If you try to get clever and do something with incoming editorState here, be very careful.
   * It is very easy to wipe out decorator/plugin behavior. You must maintain the same editorState
   * instance that is currently in state.
   *
   * @link https://github.com/draft-js-plugins/draft-js-plugins/issues/210
   */
  componentDidUpdate({ copiedBlock: prevCopiedBlock, editorState: prevPropsEditorState, isEditMode: prevIsEditMode }) {
    const { copiedBlock, editorState: currentPropsEditorState, isEditMode } = this.props;
    const { editorState } = this.state;
    const copiedBlockEtag = copiedBlock ? copiedBlock.get('etag') : null;
    const prevCopiedBlockEtag = prevCopiedBlock ? prevCopiedBlock.get('etag') : null;

    if (copiedBlock && copiedBlockEtag !== prevCopiedBlockEtag) {
      this.derefCopiedBlockNodes();
    }

    if (prevIsEditMode !== isEditMode) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({ readOnly: !isEditMode }));
      return;
    }

    if (
      currentPropsEditorState
      && prevPropsEditorState
      && prevPropsEditorState !== currentPropsEditorState
    ) {
      const newEditorState = pushEditorState(
        editorState,
        currentPropsEditorState.getCurrentContent(),
      );
      /**
       * Force editor to re-render when new editorState comes in via props. Required because the
       * error boundary can "restore" the editor after an error.
       */
      this.setState(() => ({ // eslint-disable-line react/no-did-update-set-state
        editorState: newEditorState.editorState,
        errors: newEditorState.errors,
      }));
    }
  }

  componentWillUnmount() {
    blockParentNode.clearCache();
    sidebar.clearCache();
    selection.clearCache();
    updateBlocks.clearCache();
  }

  /**
   * Update the state with the new EditorState and position the sidebar/button components.
   * Whatever happens here, you MUST set the new EditorState. If you don't you can lose all
   * the decorators and whatever other black magic is happening behind the scenes.
   *
   * @param {EditorState} editorState - a state instance of a DraftJs Editor
   */
  onChange(editorState) {
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
      callback = delegate.handleDirtyEditor;
    }

    if (lastChangeType === 'undo' && editorState.getUndoStack().size === 0 && isDirty) {
      isDirty = false;
      callback = delegate.handleCleanEditor;
    }

    this.setState(() => ({
      editorState,
      isDirty,
    }), () => {
      this.positionComponents(editorState, selectionState.getAnchorKey());
      if (!selectionState.getHasFocus()) {
        this.removeActiveStyling();
      }
      callback();
    });
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
    // eslint-disable-next-line react/destructuring-assignment
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
   * When moving the mouse, determine if it is "between" blocks and set state
   * accordingly.
   *
   * @param {EditorState}   editorState - a state instance of a DraftJs Editor
   * @param {object}        coords      - mouse position coordinates
   */
  setHoverInsertMode(editorState, coords) {
    // eslint-disable-next-line max-len
    // fixme: this could take contentState only (if positionComponents takes contentState only, which it can)
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

    const contentState = editorState.getCurrentContent();
    const activeBlock = getBlockForKey(contentState, blockKey);

    let selectedBlockNode = getBlockNode(contentState, blockKey);
    while (!blockParentNode.is(selectedBlockNode.parentNode)) {
      selectedBlockNode = selectedBlockNode.parentNode;
    }
    const blockBounds = selectedBlockNode.getBoundingClientRect();

    const isHoverInsertMode = editorState.getCurrentContent().hasText()
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
        this.positionComponents(editorState, 'ignore', activeBlock);
      } else {
        this.styleActiveBlock(activeBlock);
        const blockAfter = contentState.getBlockAfter(activeBlock.getKey());
        if (blockAfter) {
          this.positionComponents(editorState, 'ignore', blockAfter);
        }
      }
    });
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
    const { editorState, readOnly } = this.state;
    switch (block.getType()) {
      case blockTypes.ATOMIC: {
        const blockData = block.getData();
        let message;
        if (blockData && blockData.has('canvasBlock')) {
          message = blockData.get('canvasBlock').schema().getCurie().getMessage();
        }
        return {
          component: getPlaceholder(message),
          editable: false,
          props: {
            getReadOnly: this.getReadOnly,
          },
        };
      }
      case blockTypes.UNSTYLED:
        return {
          component: DraggableTextBlock,
          contentEditable: !readOnly,
          props: {
            getReadOnly: this.getReadOnly,
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
          component: getPlaceholder(),
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
    const { errors } = this.state;
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
    const { delegate } = this.props;
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
    const newEditorState = pushEditorState(editorState, newContentState, 'insert-characters');
    this.setState(() => ({
      editorState: newEditorState.editorState,
      errors: newEditorState.errors,
      isDirty: true,
      sidebarResetFlag: +!sidebarResetFlag,
    }), () => {
      this.removeActiveStyling();
      if (!isDirty) {
        delegate.handleDirtyEditor();
      }
      /* eslint-disable react/destructuring-assignment */
      if (!this.state.editorState.getSelection().getHasFocus()) {
        delegate.handleStoreEditor(this.state.editorState);
      }
      /* eslint-enable react/destructuring-assignment */
      if (shouldSelectAndStyle) {
        this.selectAndStyleBlock(newBlockKey || activeBlockKey);
      }
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
    const newEditorState = pushEditorState(editorState, newContentState, 'arbitrary');
    this.setState(() => ({
      isHoverInsertMode: false,
      isHoverInsertModeBottom: null,
      editorState: selectBlock(newEditorState.editorState, newBlockKey),
      errors: newEditorState.errors,
    }), () => this.positionComponents(newEditorState.editorState, newBlockKey));
  }

  /**
   * Turns the currently selected text into a link. This is passed as a prop into the link
   * modal so it can have a super sweet button to add a link.
   */
  handleAddLink(target, url) {
    const { editorState, isDirty } = this.state;
    const { delegate } = this.props;
    this.setState(() => ({
      editorState: createLinkAtSelection(editorState, target, url),
    }), () => {
      if (!isDirty) {
        delegate.handleDirtyEditor();
      }
    });
  }

  /**
   * Performs the delegated handleStoreEditor action, which sends the editorState to the
   * redux store.
   */
  handleBlur() {
    const { editorState } = this.state;
    const { delegate } = this.props;
    delegate.handleStoreEditor(editorState);
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
    // todo: update this to use actual clipboard and object de/serialization
    const { activeBlockKey, editorState } = this.state;
    const { delegate, copiedBlock } = this.props;

    const draftJsBlock = editorState.getCurrentContent().getBlockForKey(activeBlockKey);
    const blockData = draftJsBlock.getData();
    if (!blockData || !blockData.get('canvasBlock')) {
      return;
    }

    if (copiedBlock && copiedBlock.get('etag') === blockData.get('canvasBlock').get('etag')) {
      return;
    }

    localStorage.setItem(COPIED_BLOCK_KEY, `${blockData.get('canvasBlock').clone()}`);
    delegate.handleStoreEditor(editorState);
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
          const newEditorState = pushEditorState(
            editorState,
            deleteBlock(editorState.getCurrentContent(), activeBlockKey),
            'remove-range',
          );
          this.setState(() => ({
            editorState: newEditorState.editorState,
            errors: newEditorState.errors,
          }), () => {
            if (!isDirty) {
              delegate.handleDirtyEditor();
            }
            // eslint-disable-next-line react/destructuring-assignment
            delegate.handleStoreEditor(this.state.editorState);
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
    let newEditorState = pushEditorState(editorState, newContentState, 'move-block');
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
    }), () => {
      const { delegate } = this.props;
      delegate.handleStoreEditor(newEditorState.editorState);
      if (!isDirty) {
        delegate.handleDirtyEditor();
      }
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
      canvasBlock = TextBlockV1Mixin.findOne().createMessage();
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
    const { delegate } = this.props;
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
    newEditorState = pushEditorState(newEditorState, newContentState);
    this.setState(() => ({
      editorState: newEditorState.editorState,
      errors: newEditorState.errors,
    }), () => {
      this.positionComponents(
        this.state.editorState, // eslint-disable-line react/destructuring-assignment
        // eslint-disable-next-line react/destructuring-assignment
        findBlock(this.state.editorState.getCurrentContent(), activeBlockPosition).getKey(),
      );
      if (!isDirty) {
        delegate.handleDirtyEditor();
      }
      // eslint-disable-next-line react/destructuring-assignment
      delegate.handleStoreEditor(this.state.editorState);
    });
  }

  /**
   * Handles the custom command type(s) sent by keyBindingFn. This uses the editorState from the
   * argument instead of state to prevent race conditions.
   *
   * @link https://draftjs.org/docs/advanced-topics-key-bindings
   * @link https://draftjs.org/docs/advanced-topics-editorstate-race-conditions/
   *
   * @param {string} command - a command type
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
        const newEditorState = pushEditorState(editorState, newContentState, 'remove-range');
        this.setState(() => ({
          editorState: newEditorState.editorState,
          errors: newEditorState.errors,
        }), () => {
          this.positionComponents(newEditorState.editorState, selectionState.getAnchorKey());
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
    const newEditorState = pushEditorState(editorState, newContentState, 'arbitrary');
    this.setState(() => ({
      isHoverInsertMode: false,
      isHoverInsertModeBottom: null,
      editorState: selectBlock(newEditorState.editorState, newBlockKey),
      errors: newEditorState.errors,
      sidebarResetFlag: +!sidebarResetFlag,
    }), () => this.positionComponents(newEditorState.editorState, newBlockKey));
  }

  /**
   * Remove any styling associated with an "active" editor
   */
  handleMouseLeave() {
    this.removeActiveStyling();
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
    const { editorState } = this.state;
    if (!isAtomicBlockSelected(editorState)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    copySelectedBlocksToClipboard(editorState);
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
      this.setHoverInsertMode(editorState, { pageX, pageY });
      this.positionComponents(editorState, activeBlockKey);
    } else {
      const isOverSidebar = sidebar.isSidebar(target);
      this.setState(({ isHoverInsertMode }) => ({
        // eslint-disable-next-line max-len
        // fixme: this could be problematic - isHoverInsertMode is set outside of setHoverInsertMode. seems smelly
        isHoverInsertMode: isHoverInsertMode && isOverSidebar,
      }), () => {
        if (blockParentNode.contains(target)) {
          while (!blockParentNode.is(target.parentNode)) {
            target = target.parentNode;
          }
          this.positionComponents(editorState, target.getAttribute('data-offset-key'));
        }
      });
    }
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
    const newEditorState = pushEditorState(
      editorState,
      shiftBlock(
        editorState.getCurrentContent(),
        block,
        position,
      ),
      'arbitrary',
    );
    this.setState(() => ({
      editorState: newEditorState.editorState,
      errors: newEditorState.errors,
    }), () => {
      this.removeActiveStyling();
      const { delegate } = this.props;
      const { isDirty } = this.state;
      if (!isDirty) {
        delegate.handleDirtyEditor();
      }
      // eslint-disable-next-line react/destructuring-assignment
      delegate.handleStoreEditor(this.state.editorState);
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
      const { node } = this.props;
      const message = canvasBlock.schema().getCurie().getMessage();
      const ModalComponent = getModalComponent(message);
      this.handleOpenModal(() => (
        <ModalComponent
          block={canvasBlock}
          isFreshBlock={isFreshBlock}
          isOpen
          node={node}
          onAddBlock={this.handleAddCanvasBlock}
          onEditBlock={this.handleEditCanvasBlock}
          toggle={this.handleCloseModal}
        />
      ));
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
   * Dereferences any nodes in the copied block that are referenced
   */
  derefCopiedBlockNodes() {
    const { copiedBlock, delegate, getNode } = this.props;
    const fields = ['node_ref', 'node_refs', 'image_ref', 'poster_image_ref'];
    fields.forEach((field) => {
      if (!copiedBlock.has(field)) {
        return;
      }

      let nodeRefs = copiedBlock.get(field);
      if (!Array.isArray(nodeRefs)) {
        nodeRefs = [nodeRefs];
      }

      nodeRefs.forEach((nodeRef) => {
        if (!getNode(nodeRef)) {
          delegate.handleGetNode(nodeRef);
        }
      });
    });
  }

  /**
   * If there is a copied block available in local storage, use it to
   * create a draft block with it as the data payload.
   */
  handlePasteBlock() {
    const { copiedBlock } = this.props;

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
   * @param {string}       text - pasted text
   * @param {?HTMLElement} html - pasted html
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
        .map(ObjectSerializer.deserialize);

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
   * Removes the currently selected link. This is passed as a prop into the link modal so it
   * can have a super sweet button to remove the link.
   */
  handleRemoveLink() {
    this.setState(({ editorState }) => ({
      editorState: removeLinkAtSelection(editorState),
    }), () => {
      const { delegate } = this.props;
      const { isDirty } = this.state;
      if (!isDirty) {
        delegate.handleDirtyEditor();
      }
    });
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
   * This is needed to check if a click event occured anywhere outside of the popover.
   * When a click event occurs outside of the popover, the popover will be toggled to close.
   *
   * @param {event} e
   */
  handlePopoverClick(e) {
    if (this.popoverRef.current.contains(e.target)) {
      return;
    }
    this.handleToggleSidebar();
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
   * Positions the sidebar/button components.
   *
   * TODO: this whole thing can potentially be removed by refactoring the buttons to be a part of
   * each block's wrapper (GenericBlockPlaceholder, ListBlockWrapper, etc). would replace a lot of
   * dom querying and other non-react workflows with the preferred react onMouseEnter/onMouseLeave
   * way
   *
   * @param {EditorState}   editorState - a state instance of a DraftJs Editor
   * @param {string}        key         - a block key
   * @param {?ContentBlock} block       - a block
   */
  positionComponents(editorState, key, block = null) {
    // fixme: this could take contentState only
    const { activeBlockKey, isHoverInsertMode, readOnly } = this.state;
    const contentState = editorState.getCurrentContent();
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
      // eslint-disable-next-line
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
      // eslint-disable-next-line react/destructuring-assignment
      this.positionComponents(this.state.editorState, block.getKey());
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
    const { isEditMode } = this.props;
    const contentState = editorState.getCurrentContent();
    let activeBlockNode = getBlockNode(contentState, activeBlock);
    if (activeBlockNode.tagName === 'LI') {
      activeBlockNode = activeBlockNode.parentNode;
    }
    if (
      isEditMode
      && !activeBlockNode.classList.contains('block-active')
    ) {
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
    const { copiedBlock, delegate, formName } = this.props;
    const {
      activeBlockKey,
      blockButtonsStyle,
      editorState,
      errors,
      isHoverInsertMode,
      isSidebarOpen,
      modalComponent: Modal,
      readOnly,
      sidebarHolderStyle,
      sidebarResetFlag,
    } = this.state;

    const InlineToolbar = this.inlineToolbarPlugin.InlineToolbar;

    let className = readOnly ? 'view-mode' : 'edit-mode';
    className = `${className}${!editorState.getCurrentContent().hasText() ? ' empty' : ''}`;

    updateBlocks.style(editorState);

    return (
      <Card>
        <CardHeader>
          Content
          <kbd
            className="text-dark bg-white text-uppercase"
            style={{ fontFamily: 'inherit', fontSize: '15px' }}
          >
            <span style={{ fontSize: '11px' }}>Word Count</span>
            <Badge color="light" className="ml-1 font-weight-normal" style={{ fontSize: '11.25px' }}>
              {getWordCount(editorState)}
            </Badge>
          </kbd>
        </CardHeader>
        <CardBody indent>
          <InnerErrorBoundary
            editorState={editorState}
            formName={formName}
            onDirtyEditor={delegate.handleDirtyEditor}
            onStoreEditor={delegate.handleStoreEditor}
          >
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
                decorators={decorators}
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
                    <BoldButton {...props} />
                    <ItalicButton {...props} />
                    <UnderlineButton {...props} />
                    <LinkButton
                      {...props}
                      onToggleLinkModal={this.handleToggleLinkModal}
                      getEditorState={this.getEditorState}
                    />
                    <OrderedListButton {...props} />
                    <UnorderedListButton {...props} />
                    <StrikethroughButton {...props} />
                    <HighlightButton {...props} />
                  </>
                )}
              </InlineToolbar>
              {Modal && (
                <ModalErrorBoundary onCloseModal={this.handleCloseModal}>
                  <Modal />
                </ModalErrorBoundary>
              )}
            </div>
            {!readOnly && (
              <div className="text-center mt-2">
                <span className="btn-hover">
                  <Button id="add-block-button" radius="circle" color="success" size="sm" onClick={this.handleAddEmptyBlockAtEnd}>
                    <Icon imgSrc="plus" size="md" />
                  </Button>
                </span>
                <UncontrolledTooltip key="tooltip" placement="bottom" target="add-block-button">Add empty block at end</UncontrolledTooltip>
              </div>
            )}
          </InnerErrorBoundary>
          {!!Object.keys(errors).length && (
            <>
              <p>One or more errors have occurred. Please check your work, save, and report the issue to support.</p>
              {Object.values(errors).map(({ block, error }) => (
                <div key={block.getKey()}>
                  <FormText color="danger">{error}</FormText>
                  <FormText color="danger">{block.toString()}</FormText>
                </div>
              ))}
            </>
          )}
        </CardBody>
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(Blocksmith);
