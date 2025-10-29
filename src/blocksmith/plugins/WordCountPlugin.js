import React, { useEffect } from 'react';
import { $getRoot } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { $isBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';

const countWords = text => text.trim().split((/\s+/)).filter(word => word.length).length;

export default function WordCountPlugin({ onWordCountChanged, title = '', }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor) {
      return;
    }

    const titleWordCount = countWords(title);
    let paragraphWordCount = 0;
    let decoratorWordCount = 0;

    editor.read(() => {
      const root = $getRoot();
      paragraphWordCount = countWords(root.getTextContent());
      decoratorWordCount = (root.getChildren().filter(node => $isBlocksmithNode(node))).reduce((acc, curr) => {
        if (![`${APP_VENDOR}:canvas:block:quote-block`, `${APP_VENDOR}:canvas:block:heading-block`].includes(curr.getCurie())) {
          return acc;
        }
        return acc + countWords(curr.getPbj()?.text || '');
      }, 0);
      onWordCountChanged(paragraphWordCount + decoratorWordCount + titleWordCount);
    });

    return mergeRegister(
      editor.registerTextContentListener(textContent => {
        paragraphWordCount = countWords(textContent)
        onWordCountChanged(paragraphWordCount + decoratorWordCount + titleWordCount);
      }),
      editor.registerDecoratorListener(decorators => {
        decoratorWordCount = Object.values(decorators).reduce((acc, { props = {} }) => {
          if (![`${APP_VENDOR}:canvas:block:quote-block`, `${APP_VENDOR}:canvas:block:heading-block`].includes(props.curie)) {
            return acc;
          }
          return acc + countWords(props?.pbj?.text || '');
        }, 0);
        onWordCountChanged(paragraphWordCount + decoratorWordCount + titleWordCount);
      })
    );
  }, [editor, title]);
}
