import 'jsdom-global/register';
import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import GalleryBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/gallery-block/GalleryBlockV1Mixin';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import GalleryV1Mixin from '@triniti/schemas/triniti/curator/mixin/gallery/GalleryV1Mixin';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import {
  Icon,
} from '@triniti/admin-ui-plugin/components';

import { GalleryBlockPreview } from './index';

const galleryBlockSchema = GalleryBlockV1Mixin.findOne();
const gallerySchema = GalleryV1Mixin.findOne();
const assetSchemas = AssetV1Mixin.findAll();
const imageAssetSchema = assetSchemas[4];

const fakeImageNode1 = imageAssetSchema.createMessage().set('_id', AssetId.fromString('image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6501'));
const fakeImageNode2 = imageAssetSchema.createMessage().set('_id', AssetId.fromString('image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6502'));

let galleryBlock = galleryBlockSchema.createMessage()
  .set('poster_image_ref', NodeRef.fromNode(fakeImageNode1))
  .set('launch_text', 'test');
const gallery = gallerySchema.createMessage()
  .set('image_ref', NodeRef.fromNode(fakeImageNode2))
  .set('launch_text', 'test description');

const handleGetNode = (nodeRef) => resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request').createMessage().set('node_ref', nodeRef);

const wrapper = shallow(<GalleryBlockPreview
  block={galleryBlock}
  galleryNode={gallery}
  handleGetNode={handleGetNode}
/>);

// test will intentionally check for bug on componentDidMount lifecycle
test('Blocksmith:component:gallery-block-preview - render', (t) => {
  let actual = wrapper.find('p').props().children;
  let expected = 'test';
  t.equal(actual, expected, 'it should render correct launch text');

  actual = wrapper.find(Icon).length;
  expected = 1;
  t.equal(actual, expected, 'it should render icon');

  galleryBlock = galleryBlockSchema.createMessage()
    .set('poster_image_ref', NodeRef.fromNode(fakeImageNode1));
  wrapper.setProps({ block: galleryBlock });
  wrapper.update();

  actual = wrapper.find('p').props().children;
  expected = 'test description';
  t.equal(actual, expected, 'it should render correct launch description');

  // Icon still there?
  actual = wrapper.find(Icon).length;
  expected = 1;
  t.equal(actual, expected, 'it should render icon');
  t.end();
});
