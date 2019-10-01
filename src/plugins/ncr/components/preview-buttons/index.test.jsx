import React from 'react';
import test from 'tape';
import isEmpty from 'lodash/isEmpty';
import { shallow } from 'enzyme';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import { registerTemplates } from '@gdbots/pbjx/pbjUrl';
import PreviewButtons from './index';

const mockNode = ArticleV1Mixin.findOne().createMessage().set('slug', 'test');
registerTemplates({
  'acme:article.canonical': 'http://test.com/{slug}/',
});

const wrapper = shallow(<PreviewButtons
  node={null}
/>);

test('PreviewButtons render [node is null]', (t) => {
  const expected = true;
  const actual = isEmpty(wrapper);
  t.equal(actual, expected, 'it should not render');
  t.end();
});

test('PreviewButtons render [node is is not null]', (t) => {
  wrapper.setProps({ node: mockNode });
  wrapper.update();
  const expected = 'http://test.com/test/';
  const actual = wrapper.find('a').props().href;
  t.equal(actual, expected, 'it should render correct href');
  t.end();
});


test('PreviewButtons render [template doesn\'t exist]', (t) => {
  wrapper.setProps({ template: 'test' });
  wrapper.update();
  const expected = true;
  const actual = isEmpty(wrapper);
  t.equal(actual, expected, 'it should not render');
  t.end();
});
