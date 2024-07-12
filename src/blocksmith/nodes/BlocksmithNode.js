import React, { Suspense } from 'react';
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode.js';
import { ErrorBoundary, Loading } from '@triniti/cms/components/index.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';

function BlocksmithComponent(props) {
  const { className, nodeKey, curie, pbj = {}, ...rest } = props;
  if (!curie) {
    return null;
  }

  const type = curie.split(':').pop();
  const Component = resolveComponent(curie, 'preview');
  return (
    <div key={nodeKey} className={`${className} blocksmith-${type}`}>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <Component curie={curie} pbj={pbj} nodeKey={nodeKey} {...rest} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default class BlocksmithNode extends DecoratorBlockNode {
  static getType() {
    return 'blocksmith';
  }

  static clone(node) {
    return new BlocksmithNode(node.__curie, node.__pbj, node.__key);
  }

  static importJSON(serializedNode) {
    return $createBlocksmithNode(serializedNode.__curie, serializedNode.__pbj);
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'blocksmith',
      version: 1,
      __curie: this.__curie,
      __pbj: this.__pbj,
    };
  }

  constructor(curie, pbj, key) {
    super('', key);
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
    return (
      <BlocksmithComponent
        className="blocksmith-block"
        nodeKey={this.getKey()}
        pbj={this.getPbj()}
        curie={this.getCurie()}
      />
    );
  }

  isTopLevel() {
    return true;
  }
}

export function $createBlocksmithNode(curie, pbj = {}) {
  return new BlocksmithNode(curie, pbj);
}

export function $isBlocksmithNode(node) {
  return node instanceof BlocksmithNode;
}
