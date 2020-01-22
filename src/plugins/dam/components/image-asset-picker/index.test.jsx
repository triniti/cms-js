import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import {
  Button,
} from '@triniti/admin-ui-plugin/components';
import ImageAssetPickerModal from '@triniti/cms/plugins/dam/components/image-asset-picker-modal';

import { ImageAssetPicker } from './index';

const handleClearImage = sinon.spy();
const handleSelectImage = sinon.spy();
const handleToggleImageAssetPickerModal = sinon.spy();

const wrapper = shallow(<ImageAssetPicker
  onClearImage={handleClearImage}
  onSelectImage={handleSelectImage}
  onToggleImageAssetPickerModal={handleToggleImageAssetPickerModal}
/>);

test('ImageAssetPicker render', (t) => {
  let actual = wrapper.find(Button).length;
  let expected = 2;
  t.equal(actual, expected, 'it should render correct count of buttons');

  actual = wrapper.find(ImageAssetPickerModal).length;
  expected = 1;
  t.equal(actual, expected, 'it should render an ImageAssetPickerModal');

  actual = wrapper.find(Button).at(0).props().disabled;
  expected = true;
  t.equal(actual, expected, 'it should render a disabled select image button');

  actual = wrapper.find(Button).at(1).props().disabled;
  expected = true;
  t.equal(actual, expected, 'it should render a disabled clear image button');

  t.end();
});

test('ImageAssetPicker render[isDisabled = false]', (t) => {
  wrapper.setProps({ isDisabled: false, isImageSelected: true });
  wrapper.update();

  let actual = wrapper.find(Button).at(0).props().disabled;
  let expected = false;
  t.equal(actual, expected, 'it should render an active/enabled select image button');

  actual = wrapper.find(Button).at(1).props().disabled;
  expected = false;
  t.equal(actual, expected, 'it should render an active/enabled clear image button');

  t.end();
});

test('ImageAssetPicker onToggleImageAssetPickerModal', (t) => {
  wrapper.find(Button).at(0).simulate('click');
  t.true(handleToggleImageAssetPickerModal.calledOnce, 'it should call the handleToggleImageAssetPickerModal function');
  t.end();
});

test('ImageAssetPicker onClearImage', (t) => {
  wrapper.find(Button).at(1).simulate('click');
  t.true(handleClearImage.calledOnce, 'it should call the handleClearImage function');
  t.end();
});

test('ImageAssetPicker onCloseUploader [with newly uploaded asset]', (t) => {
  const asset = 'mocked-new-uploaded-asset';
  wrapper.find(ImageAssetPickerModal).props().onCloseUploader({ asset });
  t.true(handleSelectImage.calledOnce, 'it should call the handleSelectImage function');
  t.end();
});

test('ImageAssetPicker onCloseUploader [with no uploaded asset]', (t) => {
  const asset = null;
  wrapper.find(ImageAssetPickerModal).props().onCloseUploader({ asset });
  t.false(handleSelectImage.calledOnce, 'it should not call the handleSelectImage function');
  t.end();
});
