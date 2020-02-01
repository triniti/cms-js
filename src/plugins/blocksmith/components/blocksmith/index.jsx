// fixme: refactor this thing so it doesn't need so many eslint-disables. super smelly
// todo: wrap text blocks and position the buttons in the normal react way

import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import swal from 'sweetalert2';
import decorateComponentWithProps from 'decorate-component-with-props';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import MultiDecorator from 'draft-js-plugins-editor/lib/Editor/MultiDecorator';
import { getSelectionEntity } from 'draftjs-utils';
import { connect } from 'react-redux';
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
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';

import { Badge, Button, Card, CardBody, CardHeader, Icon } from '@triniti/admin-ui-plugin/components';
import BlockButtons from '@triniti/cms/plugins/blocksmith/components/block-buttons';
import BoldButton from '@triniti/cms/plugins/blocksmith/components/bold-inline-toolbar-button';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import DraggableTextBlock from '@triniti/cms/plugins/blocksmith/components/draggable-text-block';
import HighlightButton from '@triniti/cms/plugins/blocksmith/components/highlight-inline-toolbar-button';
import ItalicButton from '@triniti/cms/plugins/blocksmith/components/italic-inline-toolbar-button';
import LinkButton from '@triniti/cms/plugins/blocksmith/components/link-inline-toolbar-button';
import LinkModal from '@triniti/cms/plugins/blocksmith/components/link-modal';
import ListBlockWrapper from '@triniti/cms/plugins/blocksmith/components/list-block-wrapper';
import Message from '@gdbots/pbj/Message';
import OrderedListButton from '@triniti/cms/plugins/blocksmith/components/ordered-list-inline-toolbar-button';
import Sidebar from '@triniti/cms/plugins/blocksmith/components/sidebar';
import SpecialCharacterModal from '@triniti/cms/plugins/common/components/special-character-modal';
import StrikethroughButton from '@triniti/cms/plugins/blocksmith/components/strikethrough-inline-toolbar-button';
import TextBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/text-block/TextBlockV1Mixin';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import UnderlineButton from '@triniti/cms/plugins/blocksmith/components/underline-inline-toolbar-button';
import UnorderedListButton from '@triniti/cms/plugins/blocksmith/components/unordered-list-inline-toolbar-button';

import decorators from './decorators';
import customStyleMap from './customStyleMap';
import createFocusPlugin, { getLines } from '../../plugins/focus';
import constants from './constants';
import delegateFactory from './delegate';
import selector from './selector';

import {
  addEmoji,
  areKeysSame,
  blockParentNode,
  convertToEditorState,
  createLinkAtSelection,
  deleteBlock,
  dropBlock,
  findBlock,
  forceRenderBlockEntity,
  getBlockForKey,
  getBlockNode,
  getDraggedBlockNode,
  getInsertBlockMarkerNode,
  getListBlockNodes,
  getValidBlockTarget,
  getWordCount,
  handleDocumentDragover,
  handleDocumentDrop,
  hasFocus,
  inlineToolbar,
  insertEmptyBlock,
  isBlockAList,
  isBlockEmpty,
  isFirstListBlock,
  isLastListBlock,
  normalizeKey,
  removeLinkAtSelection,
  replaceBlockAtKey,
  selectBlock,
  shiftBlock,
  sidebar,
  styleDragTarget,
} from '../../utils';
import { clearDragCache } from '../../utils/styleDragTarget';
import { getModalComponent, getPlaceholder } from '../../resolver';
import './styles.scss';

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
      handleCopyBlock: PropTypes.func.isRequired,
      handleDirtyEditor: PropTypes.func.isRequired,
      handleStoreEditor: PropTypes.func.isRequired,
    }).isRequired,
    formName: PropTypes.string,
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
      delegate,
      formName,
      node,
      isEditMode,
    } = props;

    const decorator = new MultiDecorator([new CompositeDecorator(decorators)]);
    let editorState = EditorState.createEmpty(decorator);

    if (blocksmithState) {
      editorState = EditorState.push(
        editorState,
        blocksmithState.editorState.getCurrentContent(),
        null,
      );
    } else {
      delegate.handleCleanEditor(formName);
      if (node && node.has('blocks')) {
        editorState = convertToEditorState(node.get('blocks'), decorator);
      }
    }

    this.state = {
      activeBlockKey: null,
      blockButtonsStyle: {
        transform: 'scale(0)',
      },
      hoverBlockNode: null,
      imagePreviewSrc: null,
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

    delegate.handleStoreEditor(formName, editorState);

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

    this.focusPlugin = createFocusPlugin({
      theme: {}, // don't want to use their default theme
      testClass: 'line-length-tester',
    });

    this.decorator = composeDecorators(this.focusPlugin.decorator);

    this.plugins = [
      this.focusPlugin,
      this.inlineToolbarPlugin,
    ];

    this.pluginComponents = [
      {
        key: 'inline-toolbar',
        PluginComponent: this.inlineToolbarPlugin.InlineToolbar,
      },
    ];

    this.popoverRef = React.createRef();

    this.blockRendererFn = this.blockRendererFn.bind(this);
    this.blockStyleFn = this.blockStyleFn.bind(this);
    this.getEditorState = this.getEditorState.bind(this);
    this.getReadOnly = this.getReadOnly.bind(this);
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
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handlePasteBlock = this.handlePasteBlock.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.handleSelectSpecialCharacter = this.handleSelectSpecialCharacter.bind(this);
    this.handleShiftBlock = this.handleShiftBlock.bind(this);
    this.handleToggleBlockModal = this.handleToggleBlockModal.bind(this);
    this.handleToggleLinkModal = this.handleToggleLinkModal.bind(this);
    this.handleToggleSidebar = this.handleToggleSidebar.bind(this);
    this.handleToggleSpecialCharacterModal = this.handleToggleSpecialCharacterModal.bind(this);
    this.keyBindingFn = this.keyBindingFn.bind(this);
    this.onChange = this.onChange.bind(this);
    this.selectAndStyleBlock = this.selectAndStyleBlock.bind(this);
  }

  componentDidMount() {
    this.editor.blur();
  }

  /**
   * If you try to get clever and do something with incoming editorState here, be very careful.
   * Getting new editorState as a prop has been the absolute worst headache of this
   * whole component. It is very easy to wipe out decorator/plugin behavior.
   *
   * @link https://github.com/draft-js-plugins/draft-js-plugins/issues/210
   */
  componentDidUpdate({ isEditMode: prevIsEditMode }) {
    const { isEditMode } = this.props;
    if (prevIsEditMode !== isEditMode) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({ readOnly: !isEditMode }));
    }
  }

  componentWillUnmount() {
    blockParentNode.clearCache();
    inlineToolbar.clearCache();
    sidebar.clearCache();
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
    const { delegate, formName } = this.props;
    const lastChangeType = editorState.getLastChangeType();
    const selectionState = editorState.getSelection();
    let callback = noop;

    /**
     * just clicking around the editor counts as a change (of type null),
     * but is not enough to dirty the state, so check the change type.
     */
    if (!isDirty && lastChangeType !== null) {
      isDirty = true;
      callback = () => delegate.handleDirtyEditor(formName);
    }

    if (lastChangeType === 'undo' && editorState.getUndoStack().size === 0 && isDirty) {
      isDirty = false;
      callback = () => delegate.handleCleanEditor(formName);
    }

    this.setState({
      editorState,
      isDirty,
    }, () => {
      this.positionComponents(editorState, selectionState.getAnchorKey());
      if (!hasFocus(selectionState)) {
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
        case 'ordered-list-item':
        case 'unordered-list-item':
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

    this.setState({
      hoverBlockNode: selectedBlockNode,
      isHoverInsertMode,
      isHoverInsertModeBottom,
    }, () => {
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
   * Given a canvas block, creates a DraftJs block (with entity) for said block at the active block.
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
    const { delegate, formName } = this.props;
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
    this.setState(() => ({
      editorState: EditorState.push(editorState, newContentState, 'insert-characters'),
      isDirty: true,
      sidebarResetFlag: +!sidebarResetFlag,
    }), () => {
      this.removeActiveStyling();
      if (!isDirty) {
        delegate.handleDirtyEditor(formName);
      }
      /* eslint-disable react/destructuring-assignment */
      if (!hasFocus(this.state.editorState.getSelection())) {
        delegate.handleStoreEditor(formName, this.state.editorState);
      }
      /* eslint-enable react/destructuring-assignment */
      if (shouldSelectAndStyle) {
        this.selectAndStyleBlock(newBlockKey || activeBlockKey);
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
      case 'atomic':
        if (!block.getEntityAt(0)) {
          return null;
        }
        return {
          component: getPlaceholder(
            editorState.getCurrentContent().getEntity(block.getEntityAt(0)).getType(),
            this.decorator,
          ),
          editable: false,
          props: {
            getReadOnly: this.getReadOnly,
          },
        };
      case 'unstyled':
        return {
          component: DraggableTextBlock,
          contentEditable: !readOnly,
          props: {
            getReadOnly: this.getReadOnly,
          },
        };
      case 'ordered-list-item':
      case 'unordered-list-item':
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
        return null;
    }
  }

  // TODO add docblock and refactor this so it
  // adds all the classnames we might want that are
  // currently being styled via dom drilling in styles.scss
  blockStyleFn(block) {
    switch (block.getType()) {
      case 'unstyled':
        return 'text-block';
      case 'ordered-list-item':
      case 'unordered-list-item':
        return 'list-block';
      default:
        return null;
    }
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
    const newEditorState = EditorState.push(editorState, newContentState, 'arbitrary');
    this.setState({
      isHoverInsertMode: false,
      isHoverInsertModeBottom: null,
      editorState: selectBlock(newEditorState, newBlockKey),
    }, () => this.positionComponents(newEditorState, newBlockKey));
  }

  /**
   * Turns the currently selected text into a link. This is passed as a prop into the link
   * modal so it can have a super sweet button to add a link.
   */
  handleAddLink(target, url) {
    const { editorState, isDirty } = this.state;
    const { delegate, formName } = this.props;
    this.setState({
      editorState: createLinkAtSelection(editorState, target, url),
    }, () => {
      if (!isDirty) {
        delegate.handleDirtyEditor(formName);
      }
    });
  }

  /**
   * Performs the delegated handleStoreEditor action, which sends the editorState to the
   * redux store.
   */
  handleBlur() {
    const { editorState } = this.state;
    const { formName, delegate } = this.props;
    delegate.handleStoreEditor(formName, editorState);
    // hide the inline toolbar. this is needed because of the
    // issue where the editor thinks it has focus but doesn't
    inlineToolbar.get().setAttribute('style', 'transform: translate(-50%) scale(0); visibility: hidden;');
  }

  /**
   * Closes any currently open modal.
   */
  handleCloseModal() {
    this.setState({
      readOnly: false,
      modalComponent: null,
    });
  }

  /**
   * Stores the triniti block payload in redux so that it is available for later pasting
   */
  handleCopyBlock() {
    const { activeBlockKey, editorState } = this.state;
    const { delegate, copiedBlock } = this.props;

    const draftJsBlock = editorState.getCurrentContent().getBlockForKey(activeBlockKey);
    const entityKey = draftJsBlock.getEntityAt(0);
    if (entityKey) {
      const entity = editorState.getCurrentContent().getEntity(entityKey);
      const canvasBlock = entity.getData().block;

      if (copiedBlock && copiedBlock.get('etag') === canvasBlock.get('etag')) {
        return;
      }

      delegate.handleCopyBlock(canvasBlock.clone());
    }
  }

  /**
   * Deletes the active block. A block's key is set as the active key (in positionComponents) when
   * the text indicator is moved into it or when the mouse is moved over it.
   */
  handleDelete() {
    const { activeBlockKey, editorState, isDirty } = this.state;
    const { delegate, formName } = this.props;

    this.setState({ readOnly: true }, () => {
      Blocksmith.confirmDelete().then((result) => {
        this.setState({ readOnly: false }, () => {
          if (result.value) {
            this.setState({
              editorState: EditorState.push(
                editorState,
                deleteBlock(editorState.getCurrentContent(), activeBlockKey), 'remove-range',
              ),
            }, () => {
              if (!isDirty) {
                delegate.handleDirtyEditor(formName);
              }
              // eslint-disable-next-line react/destructuring-assignment
              delegate.handleStoreEditor(formName, this.state.editorState);
            });
          } else {
            // do nothing, user declined to delete
          }
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
    while (!blockParentNode.is(draggedBlock.parentNode)) {
      draggedBlock = draggedBlock.parentNode;
    }
    draggedBlock.classList.remove('hidden-block');

    const { editorState, isDirty } = this.state;
    const newContentState = dropBlock(
      editorState.getCurrentContent(),
      draggedBlockKey,
      dropTargetKey,
      dropTargetPosition,
      isDropTargetAList,
      draggedBlockListKeys,
    );
    const newEditorState = selectBlock(
      EditorState.push(editorState, newContentState, 'move-block'),
      draggedBlockKey,
      'end',
    );
    this.setState({
      editorState: newEditorState,
    }, () => {
      const { formName, delegate } = this.props;
      delegate.handleStoreEditor(formName, newEditorState);
      if (!isDirty) {
        delegate.handleDirtyEditor(formName);
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
    const entityKey = draftJsBlock.getEntityAt(0);
    let entity;
    if (entityKey) {
      entity = editorState.getCurrentContent().getEntity(entityKey);
    }
    let canvasBlock;
    if (draftJsBlock.getType() === 'atomic') {
      canvasBlock = entity.getData().block;
    } else {
      canvasBlock = TextBlockV1Mixin.findOne().createMessage();
      if (entity) {
        canvasBlock.set('updated_date', entity.getData().updatedDate || moment().toDate());
      }
    }
    this.handleToggleBlockModal(canvasBlock);
  }

  /**
   * Updates the entity data payload for an existing draft entity using the provided canvas block.
   *
   * @link https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Entities.md
   *
   * @param {*}      canvasBlock - a triniti canvas block
   */
  handleEditCanvasBlock(canvasBlock) {
    const { activeBlockKey, isDirty, editorState } = this.state;
    const { delegate, formName } = this.props;
    const newContentState = editorState.getCurrentContent();
    const activeBlockPosition = newContentState.getBlocksAsArray() // used later to re-position
      .findIndex((block) => block.getKey() === activeBlockKey);

    let entityType;
    let isRemoval = false;
    const entityData = {};

    if (canvasBlock.schema().getCurie().getMessage() !== 'text-block') {
      entityData.block = canvasBlock;
      entityType = canvasBlock.schema().getCurie().getMessage();
    } else {
      entityType = 'UPDATE';
      if (canvasBlock.has('updated_date')) {
        entityData.updatedDate = canvasBlock.get('updated_date');
      } else {
        isRemoval = true;
      }
    }

    this.setState({
      editorState: EditorState.push(
        editorState,
        forceRenderBlockEntity(newContentState, activeBlockKey, entityData, entityType, isRemoval),
        'apply-entity',
      ),
    }, () => {
      this.positionComponents(
        this.state.editorState, // eslint-disable-line react/destructuring-assignment
        // eslint-disable-next-line react/destructuring-assignment
        findBlock(this.state.editorState.getCurrentContent(), activeBlockPosition).getKey(),
      );
      if (!isDirty) {
        delegate.handleDirtyEditor(formName);
      }
      // eslint-disable-next-line react/destructuring-assignment
      this.props.delegate.handleStoreEditor(this.props.formName, this.state.editorState);
    });
  }

  /**
   * Handles the custom command type(s) sent by keyBindingFn.
   *
   * @link https://draftjs.org/docs/advanced-topics-key-bindings
   *
   * @param {string} command - a command type
   *
   * @returns {string} 'handled' (meaning we did something special) or 'not-handled' (meaning we
   * want to allow the editor to take over and resume default behavior).
   */
  handleKeyCommand(command) {
    const { activeBlockKey, editorState } = this.state;
    let anchorKey;
    let currentBlock;
    let newBlockKey;
    let newContentState;
    let newEditorState;
    let nextBlock;
    let selectionState;
    let previousBlockKey;
    switch (command) {
      case constants.BACKSPACE_AFTER_ATOMIC_BLOCK:
        anchorKey = editorState.getSelection().getAnchorKey();
        currentBlock = getBlockForKey(
          editorState.getCurrentContent(),
          anchorKey,
        );
        if (currentBlock.getText() === '') {
          // if current block is empty, delete that block and select the previous atomic block
          previousBlockKey = editorState
            .getCurrentContent()
            .getBlockBefore(anchorKey)
            .getKey();
          newContentState = deleteBlock(
            editorState.getCurrentContent(),
            editorState.getSelection().getAnchorKey(),
          );
          newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
          this.setState({
            editorState: selectBlock(newEditorState, previousBlockKey),
          }, () => this.positionComponents(newEditorState, previousBlockKey));
        } else {
          // if current block is not empty, replace the previous block with a selected empty block
          currentBlock = getBlockForKey(
            editorState.getCurrentContent(),
            editorState.getSelection().getAnchorKey(),
          );
          previousBlockKey = editorState
            .getCurrentContent()
            .getBlockBefore(editorState.getSelection().getAnchorKey())
            .getKey();
          newBlockKey = genKey();
          newContentState = insertEmptyBlock(
            editorState.getCurrentContent(),
            previousBlockKey,
            constants.POSITION_AFTER,
            newBlockKey,
          );
          newEditorState = EditorState.push(editorState, deleteBlock(newContentState, previousBlockKey), 'remove-range');
          this.setState({
            editorState: selectBlock(newEditorState, newBlockKey),
          }, () => this.positionComponents(newEditorState, newBlockKey));
        }
        return 'handled';
      case constants.DOUBLE_ENTER_ON_LIST:
        selectionState = editorState.getSelection();
        newContentState = editorState.getCurrentContent();
        newContentState = Modifier.setBlockType(newContentState, selectionState, 'unstyled');
        newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
        this.setState({
          editorState: newEditorState,
        }, () => this.positionComponents(newEditorState, selectionState.getAnchorKey()));
        return 'handled';
      case constants.DELETE_BEFORE_ATOMIC_BLOCK:
        currentBlock = getBlockForKey(
          editorState.getCurrentContent(),
          editorState.getSelection().getAnchorKey(),
        );
        nextBlock = editorState.getCurrentContent().getBlockAfter(activeBlockKey);
        if (currentBlock.getText() === '') {
          this.setState({
            editorState: selectBlock(
              EditorState.push(editorState, deleteBlock(editorState.getCurrentContent(), activeBlockKey), 'remove-range'),
              nextBlock.getKey(),
            ),
          });
        } else if (editorState.getSelection().getAnchorOffset() === currentBlock.getText().length) {
          newEditorState = selectBlock(
            EditorState.push(editorState, deleteBlock(editorState.getCurrentContent(), nextBlock.getKey()), 'remove-range'),
            activeBlockKey,
            'end',
          );
          this.setState({
            editorState: newEditorState,
          }, () => this.positionComponents(newEditorState, activeBlockKey));
        }
        return 'handled';
      case constants.SOFT_NEWLINE:
        this.setState({
          editorState: RichUtils.insertSoftNewline(editorState),
        });
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
    this.setState({
      isHoverInsertMode: false,
    });

    const { isOptionKeyCommand, hasCommandModifier } = KeyBindingUtil;
    if (!hasFocus(editorState.getSelection()) || isOptionKeyCommand(e)) {
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

    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const anchorKey = editorState.getSelection().getAnchorKey();
    const currentBlock = getBlockForKey(contentState, anchorKey);
    const previousBlock = contentState.getBlockBefore(anchorKey);
    const nextBlock = contentState.getBlockAfter(anchorKey);
    const lines = getLines(editorState, 'line-length-tester');

    let offsetAtStartOfLastLine = 0;
    for (let i = 0; i < lines.length - 1; i += 1) {
      offsetAtStartOfLastLine += lines[i].length;
    }

    switch (e.key) {
      case 'ArrowLeft':
        if (currentBlock.getType() === 'atomic') {
          e.preventDefault();
          this.setState({
            editorState: selectBlock(editorState, previousBlock, 'end'),
          }, () => this.positionComponents(editorState, 'ignore', previousBlock));
        } else if (
          previousBlock
          && previousBlock.getType() === 'atomic'
          && selectionState.getAnchorOffset() === 0
          && selectionState.getFocusOffset() === 0
        ) {
          // if text indicator is at the first position
          e.preventDefault();
          if (previousBlock) {
            this.setState({
              editorState: selectBlock(editorState, previousBlock),
            });
          }
        }
        break;
      case 'ArrowRight':
        if (currentBlock.getType() === 'atomic') {
          e.preventDefault();
          this.setState({
            editorState: selectBlock(editorState, nextBlock, 'start'),
          }, () => this.positionComponents(editorState, 'ignore', nextBlock));
        } else if (
          nextBlock
          && nextBlock.getType() === 'atomic'
          && selectionState.getAnchorOffset() === currentBlock.getText().length
          && selectionState.getFocusOffset() === currentBlock.getText().length
        ) {
          // if text indicator is at the final position
          e.preventDefault();
          if (nextBlock) {
            this.setState({
              editorState: selectBlock(editorState, nextBlock),
            });
          }
        }
        break;
      case 'ArrowDown':
        if (!nextBlock && (lines.length <= 1 || editorState.getSelection().getAnchorOffset() + 1 > offsetAtStartOfLastLine)) {
          e.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (!previousBlock && (lines.length <= 1 || editorState.getSelection().getAnchorOffset() < lines[0].length)) {
          e.preventDefault();
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
    const newEditorState = EditorState.push(editorState, newContentState, 'arbitrary');
    this.setState({
      isHoverInsertMode: false,
      isHoverInsertModeBottom: null,
      editorState: selectBlock(newEditorState, newBlockKey),
      sidebarResetFlag: +!sidebarResetFlag,
    }, () => this.positionComponents(newEditorState, newBlockKey));
  }

  /**
   * Remove any styling associated with an "active" editor
   */
  handleMouseLeave() {
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
    this.setState({
      readOnly: true,
      modalComponent,
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
    this.setState({
      editorState: addEmoji(
        editorState,
        specialCharacter,
        insertingIntoNonActiveBlock ? activeBlockKey : null,
      ),
    });
  }

  /**
   * Shifts blocks up or down, used by the up/down reorder buttons
   *
   * @param {ContentBlock} block    - a DraftJs ContentBlock
   * @param {number}       position - a position (array index) to move the block to
   */
  handleShiftBlock(block, position) {
    const { editorState } = this.state;
    this.setState({
      editorState: EditorState.push(
        editorState,
        shiftBlock(
          editorState.getCurrentContent(),
          block,
          position,
        ),
        'arbitrary',
      ),
    }, () => {
      this.removeActiveStyling();
      const { delegate, formName } = this.props;
      const { editorState: newEditorState, isDirty } = this.state;
      if (!isDirty) {
        delegate.handleDirtyEditor(formName);
      }
      delegate.handleStoreEditor(formName, newEditorState);
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
      const message = canvasBlock.schema().getId().getCurie().getMessage();
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
   * If there is a copied block available in redux, use it to create a draft block with it as the
   * entity payload
   */
  handlePasteBlock() {
    const { copiedBlock } = this.props;
    if (!copiedBlock) {
      return;
    }

    this.handleAddCanvasBlock(copiedBlock, true);
  }

  /**
   * Intercepts paste events. Oftentimes the HTML is malformed and as a result empty blocks
   * are inserted. This prevents that from happening.
   *
   * @link https://draftjs.org/docs/api-reference-editor#handlepastedtext
   * @link https://github.com/facebook/draft-js/blob/master/src/model/paste/DraftPasteProcessor.js
   * @link https://github.com/facebook/draft-js/blob/master/src/model/immutable/BlockMapBuilder.js
   *
   * @param {string}       text - pasted text
   * @param {?HTMLElement} html - pasted html
   */
  handlePastedText(text, html) {
    const { editorState } = this.state;
    if (html) {
      const { contentBlocks } = DraftPasteProcessor.processHTML(html);
      if (contentBlocks) {
        const fragment = BlockMapBuilder
          .createFromArray(contentBlocks.filter((block) => !isBlockEmpty(block)));
        const newContentState = Modifier.replaceWithFragment(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          fragment,
        );
        this.setState({
          editorState: EditorState.push(editorState, newContentState, 'insert-characters'),
        });
        return 'handled';
      }
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
      const { delegate, formName } = this.props;
      const { isDirty } = this.state;
      if (!isDirty) {
        delegate.handleDirtyEditor(formName);
      }
    });
  }

  /**
   * For some reason (I suspect the focus plugin) the default behavior for pressing enter
   * while an atomic block is selected is to insert a new text block with a single space.
   * This overrides that and inserts an empty text block as one would expect.
   */
  handleReturn() {
    const { editorState, activeBlockKey, isHoverInsertMode } = this.state;
    if (isHoverInsertMode) {
      return 'not-handled';
    }
    const activeBlock = getBlockForKey(editorState.getCurrentContent(), activeBlockKey);
    if (activeBlock.getType() !== 'atomic') {
      return 'not-handled';
    }
    const newBlockKey = genKey();
    const newContentState = insertEmptyBlock(
      editorState.getCurrentContent(),
      activeBlockKey,
      constants.POSITION_AFTER,
      newBlockKey,
    );
    const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
    this.setState({
      editorState: selectBlock(newEditorState, newBlockKey, 'end'),
    }, () => this.positionComponents(newEditorState, newBlockKey));
    return 'handled';
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
   * Case 'Backspace' allows deleting an atomic button with the backspace key
   *  (without it the current block will be deleted instead).
   * Case 'Enter' allows breaking out of a list after pressing enter on an empty list item.
   * Case 'Delete' smooths out the process of deleting atomic blocks
   * Case ' ' is the spacebar. For some reason pressing this while an atomic block is selected
   * will delete said block. This case prevents that.
   *
   * @link https://draftjs.org/docs/advanced-topics-key-bindings
   *
   * @param {SyntheticKeyboardEvent} e - a synthetic keyboard event
   *
   * @returns {string} a command type
   */
  keyBindingFn(e) {
    const { activeBlockKey, editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    // if nothing is selected
    if (selectionState.getAnchorOffset() === selectionState.getFocusOffset()) {
      const previousBlock = contentState.getBlockBefore(selectionState.getAnchorKey());
      const currentBlock = getBlockForKey(contentState, selectionState.getAnchorKey());
      const nextBlock = contentState.getBlockAfter(activeBlockKey);
      switch (e.key) {
        case ' ':
          if (currentBlock.getType() === 'atomic') {
            e.preventDefault();
          }
          break;
        case 'Backspace':
          if (typeof previousBlock !== 'undefined' && currentBlock.getType() !== 'unstyled') {
            if (
              (previousBlock && previousBlock.getType() === 'atomic')
              && (currentBlock.getText() === '' || selectionState.getAnchorOffset() === 0)
            ) {
              return constants.BACKSPACE_AFTER_ATOMIC_BLOCK;
            }
          }
          break;
        case 'Enter':
          setTimeout(() => {
            // Under certain conditions (eg press enter while text indicator is at the start of an
            // UPDATE text block) there can be blocks that are styled as block-update when they
            // shouldn't be, so correct that here. The class is added by the Update component, which
            // is used as the decorator for characters with the 'UPDATE' entity.
            Array.from(document.querySelectorAll('.block-update:not(ol):not(ul)')).forEach((node) => {
              if (!node.firstChild.firstChild.hasAttribute('data-entity-key')) {
                node.classList.remove('block-update');
              }
            });
          }, 0);
          if (e.shiftKey) {
            return constants.SOFT_NEWLINE;
          }
          if (currentBlock.getText() === '' && isBlockAList(currentBlock)) {
            return constants.DOUBLE_ENTER_ON_LIST;
          }
          break;
        case 'Delete':
          if (
            nextBlock
            && nextBlock.getType() === 'atomic'
            && editorState.getSelection().getAnchorOffset() === currentBlock.getText().length
          ) {
            return constants.DELETE_BEFORE_ATOMIC_BLOCK;
          }
          break;
        default:
          break;
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

    const editorRef = this.editor.editor;
    if (!editorRef) {
      return; // component is unmounting, let's get outta here
    }
    const { editor } = editorRef;
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

    this.setState({
      activeBlockKey: normalizeKey(blockKey),
      blockButtonsStyle,
      // eslint-disable-next-line
      isSidebarOpen: this.state.isSidebarOpen && isSidebarVisible,
      sidebarHolderStyle,
    });
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
    if (hasFocus(selectionState)) {
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

    this.setState({
      blockButtonsStyle,
      isHoverInsertMode: false,
      sidebarHolderStyle,
    });
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
      this.setState({
        activeBlockKey: activeBlockNode.getAttribute('data-offset-key'),
      }, () => activeBlockNode.classList.add('block-active'));
    }
  }

  render() {
    const { copiedBlock } = this.props;
    const {
      activeBlockKey,
      blockButtonsStyle,
      editorState,
      isHoverInsertMode,
      isSidebarOpen,
      modalComponent: Modal,
      readOnly,
      sidebarHolderStyle,
      sidebarResetFlag,
    } = this.state;
    let className = readOnly ? 'view-mode' : 'edit-mode';
    className = `${className}${!editorState.getCurrentContent().hasText() ? ' empty' : ''}`;
    const InlineToolbar = this.inlineToolbarPlugin.InlineToolbar;

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
          <div
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
              blockStyleFn={this.blockStyleFn}
              customStyleMap={customStyleMap}
              decorators={decorators}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              handlePastedText={this.handlePastedText}
              handleReturn={this.handleReturn}
              handleDrop={() => 'handled'} // tell DraftJs that we want to handle our own onDrop event
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
            {Modal && <Modal />}
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
        </CardBody>
      </Card>
    );
  }
}


export default connect(selector, createDelegateFactory(delegateFactory))(Blocksmith);
