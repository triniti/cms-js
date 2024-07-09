import React, { lazy, Suspense } from 'react';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents.js';
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js';
import startCase from 'lodash-es/startCase.js';
import SchemaCurie from '@gdbots/pbj/SchemaCurie.js';
import { ErrorBoundary, Loading, withPbj } from '@triniti/cms/components/index.js';

const components = {};
const resolveComponent = (curie) => {
  if (components[curie]) {
    return components[curie];
  }

  const file = startCase(SchemaCurie.fromString(curie).getMessage()).replace(/\s/g, '');
  console.log('resolveComponent', file);
  components[curie] = lazy(() => import(`@triniti/cms/blocksmith/nodes/${file}Preview.js`));
  return components[curie];
};

function CanvasBlockComponent(props) {
  const { className, nodeKey, curie, pbj = {} } = props;
  if (!curie) {
    return null;
  }

  const Component = withPbj(resolveComponent(curie), curie, pbj);
  return (
    <BlockWithAlignableContents className={className} nodeKey={nodeKey}>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </Suspense>
    </BlockWithAlignableContents>
  );
}

export default class CanvasBlockNode extends DecoratorBlockNode {
  static getType() {
    return 'canvas-block';
  }

  static clone(node) {
    return new CanvasBlockNode(node.curie, node.pbj, node.__format, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createCanvasBlockNode(serializedNode.curie, serializedNode.pbj);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'canvas-block',
      version: 1,
      curie: this.__curie,
      pbj: this.__pbj,
    };
  }

  constructor(curie, pbj, format, key) {
    super(format, key);
    this.__curie = curie;
    this.__pbj = pbj || {};
  }

  updateDOM() {
    return false;
  }

  getCurie() {
    return this.__curie;
  }

  getPbj() {
    return this.__pbj;
  }

  decorate(_editor, config) {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return (
      <CanvasBlockComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        pbj={this.__pbj}
        curie={this.__curie}
      />
    );
  }

  isTopLevel() {
    return true;
  }
}

export function $createCanvasBlockNode(curie, pbj = {}) {
  return new CanvasBlockNode(curie, pbj);
}

export function $isCanvasBlockNode(node) {
  return node instanceof CanvasBlockNode;
}
