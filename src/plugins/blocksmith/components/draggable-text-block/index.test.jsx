import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import { List } from 'immutable';
import {
  ContentBlock,
  EditorBlock,
  genKey,
} from 'draft-js';

import { blockTypes } from '../../constants';
import { DraggableTextBlock } from './index';

const blockData = {
  key: genKey(),
  type: blockTypes.UNSTYLED,
  text: 'i am a great test block',
  characterList: List(),
};
const offsetKey = 'americanninja2';
const block = new ContentBlock(blockData);
const wrapper = shallow(<DraggableTextBlock
  offsetKey={offsetKey}
  block={block}
  draggable
/>);

test('Blocksmith:component:draggable-text-block - render', (t) => {
  const draftEditorBlock = wrapper.find(EditorBlock);
  let actual = draftEditorBlock.length;
  let expected = 1;
  t.equal(actual, expected, 'it should render an EditorBlock');

  actual = draftEditorBlock.props().block.getType();
  expected = blockData.type;
  t.equal(actual, expected, 'it should render correct type');

  actual = draftEditorBlock.props().block.getText();
  expected = blockData.text;
  t.equal(actual, expected, 'it should render correct text');

  actual = wrapper.find('div[draggable=true]').length;
  expected = 2;
  t.equal(actual, expected, 'it should render 2 draggable handles');

  actual = wrapper.find(`span[data-offset-key="${offsetKey}"]`).length;
  expected = 1;
  t.equal(actual, expected, 'it should render a span with correct data-offset-key attribute');

  t.end();
});

test('Blocksmith:component:draggable-text-block - set draggable prop', (t) => {
  wrapper.setProps({ draggable: true });
  wrapper.update();

  let actual = wrapper.find('div[draggable=true]').length;
  let expected = 2;
  t.equal(actual, expected, 'it should render 2 divs with draggable=true when draggable is TRUE');

  wrapper.setProps({ draggable: false });
  wrapper.update();

  actual = wrapper.find('div[draggable=true]').length;
  expected = 0;
  t.equal(actual, expected, 'it should render 0 divs with draggable=true when draggable is FALSE');

  t.end();
});
