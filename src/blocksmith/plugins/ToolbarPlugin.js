import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin(props) {
  const { onCreateBlock } = props;
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, $updateToolbar]);

  // we don't want buttons submitting the main form
  const createHandler = (command, payload) => {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();
      editor.dispatchCommand(command, payload);
    };
  };

  return (
    <div className="toolbar" ref={toolbarRef}>
      {/*<button*/}
      {/*  disabled={!canUndo}*/}
      {/*  onClick={() => {*/}
      {/*    editor.dispatchCommand(UNDO_COMMAND, undefined);*/}
      {/*  }}*/}
      {/*  className="toolbar-item spaced"*/}
      {/*  aria-label="Undo">*/}
      {/*  <i className="format undo" />*/}
      {/*</button>*/}
      {/*<button*/}
      {/*  disabled={!canRedo}*/}
      {/*  onClick={() => {*/}
      {/*    editor.dispatchCommand(REDO_COMMAND, undefined);*/}
      {/*  }}*/}
      {/*  className="toolbar-item"*/}
      {/*  aria-label="Redo">*/}
      {/*  <i className="format redo" />*/}
      {/*</button>*/}
      {/*<Divider />*/}

      <button
        onClick={createHandler(FORMAT_TEXT_COMMAND, 'bold')}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold">
        <i className="format bold" />
      </button>
      <button
        onClick={createHandler(FORMAT_TEXT_COMMAND, 'italic')}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Format Italics">
        <i className="format italic" />
      </button>
      <button
        onClick={createHandler(FORMAT_TEXT_COMMAND, 'underline')}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline">
        <i className="format underline" />
      </button>
      <button
        onClick={createHandler(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Format Strikethrough">
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
        onClick={createHandler(FORMAT_ELEMENT_COMMAND, 'left')}
        className="toolbar-item spaced"
        aria-label="Left Align">
        <i className="format left-align" />
      </button>
      <button
        onClick={createHandler(FORMAT_ELEMENT_COMMAND, 'center')}
        className="toolbar-item spaced"
        aria-label="Center Align">
        <i className="format center-align" />
      </button>
      <button
        onClick={createHandler(FORMAT_ELEMENT_COMMAND, 'right')}
        className="toolbar-item spaced"
        aria-label="Right Align">
        <i className="format right-align" />
      </button>
      <button
        onClick={createHandler(FORMAT_ELEMENT_COMMAND, 'justify')}
        className="toolbar-item"
        aria-label="Justify Align">
        <i className="format justify-align" />
      </button>
      <button
        onClick={onCreateBlock}
        data-type="youtube-video-block"
        className="toolbar-item"
        aria-label="YoutubeVideoBlock">
        youtube video
      </button>
      <button
        onClick={onCreateBlock}
        data-type="article-block"
        className="toolbar-item"
        aria-label="ArticleBlock">
        article
      </button>
      {' '}
    </div>
  );
}