import test from 'tape';
import snakeCase from 'lodash/snakeCase';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import CodeBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/code-block/CodeBlockV1Mixin';
import TextBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/text-block/TextBlockV1Mixin';
import ImageBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/image-block/ImageBlockV1Mixin';
import convertToCanvasBlocks from './convertToCanvasBlocks';
import convertToEditorState from './convertToEditorState';

// eslint-disable-next-line max-len
// fixme: something truly unholy is happening here. can't really add more configs, or certain fields to configs, because of an immutable bug that only happens during testing.
// it worked before https://github.com/wb-apps/bachelornation/commit/fa50ed1ed50a91236443f35a598d9ee987b3269c

test('Blocksmith:util:convert', (t) => {
  const canvasBlockConfigs = [
    {
      mixin: CodeBlockV1Mixin,
      data: {
        code: '<script>window.alert(\'sweet code bro\');</script>',
        updatedDate: new Date(),
      },
    },
    {
      mixin: TextBlockV1Mixin,
      data: {
        text: '<p><a href="http://www.bachelornation.com/" rel="noopener noreferrer" target="_blank">bachelornation</a> <del>yo</del></p>',
      },
    },
    {
      mixin: ImageBlockV1Mixin,
      data: {
        isNsfw: false,
        nodeRef: NodeRef.fromString('bachelornation:image-asset:image_gif_20180508_8f1a4389056843548bfa9689e790ae72'),
        updatedDate: new Date(),
      },
    },
  ];

  const canvasBlocks = canvasBlockConfigs.map(({ mixin, data }) => {
    const canvasBlock = mixin.findOne().createMessage();
    Object.keys(data).forEach((key) => {
      canvasBlock.set(snakeCase(key), data[key]);
    });
    return canvasBlock;
  });

  const convertedCanvasBlocks = convertToCanvasBlocks(convertToEditorState(canvasBlocks));

  let actual;
  let expected;
  canvasBlockConfigs.forEach((canvasBlockConfig, i) => {
    Object.keys(canvasBlockConfig.data).forEach((key) => {
      actual = convertedCanvasBlocks[i].get(snakeCase(key));
      expected = canvasBlockConfig.data[key];
      t.same(actual, expected, `convertedCanvasBlocks[${i}]: type: ${canvasBlockConfig.mixin.findOne().getCurie().getMessage()}, key: ${key}`);
    });
  });

  t.end();
});
