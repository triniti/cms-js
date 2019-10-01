import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Icon } from '@triniti/admin-ui-plugin/components';

import ImagePreview from './ImagePreview';

const handleToggleImagePreviewSrc = sinon.spy();
const wrapper = shallow(<ImagePreview onDismissImagePreview={handleToggleImagePreviewSrc} src="/some/path" />);

test('Blocksmith:component:generic-block-placeholder:ImagePreview - render', (t) => {
  const image = wrapper.find('img');
  let actual = image.length;
  let expected = 1;
  t.equal(actual, expected, 'it should render an image');

  actual = image.props().src;
  expected = '/some/path';
  t.equal(actual, expected, 'it should render correct image path');

  const icon = wrapper.find(Icon);
  actual = icon.length;
  expected = 1;
  t.equal(actual, expected, 'it should render an Icon component');

  t.end();
});

test('Blocksmith:component:generic-block-placeholder:ImagePreview - icon click', (t) => {
  wrapper.find(Icon).simulate('click');
  t.equal(handleToggleImagePreviewSrc.calledOnce, true, 'it should call the handleToggleImagePreviewSrc function');
  t.end();
});
