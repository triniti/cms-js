import trim from 'lodash/trim';
import {
  CharacterMetadata,
  ContentBlock,
  ContentState,
  genKey,
} from 'draft-js';
import { List } from 'immutable';
import getListBlocks from './getListBlocks';
import isBlockAList from './isBlockAList';
import getEntityKey from './getEntityKey';

/**
 * Forces a block to render its new entity data payload. For the time being, Draft.Js does not treat
 * entities as immutable. This means that simply updating entity information for something (eg a
 * text block with an updatedDate) will not cause it to re-render according to that update. It is
 * truly vile. This function will force a render by re-creating ContentBlocks and Entities and
 * returning a new ContentState.
 *
 * @link https://github.com/facebook/draft-js/issues/1702
 * @link https://github.com/facebook/draft-js/issues/1256
 * @link https://github.com/facebook/draft-js/issues/1047
 *
 * @param {ContentState} contentState - A ContentState instance of a DraftJs Editor.
 * @param {string}       blockKey     - A ContentBlock key.
 * @param {string}       entityData   - An Entity key.
 * @param {string}       entityType   - An Entity type (eg 'UPDATE' or 'image-block').
 * @param {boolean}      isRemoval    - Whether or not an entity is being removed.
 *
 * @returns {ContentState} a ContentState instance
 */

export default (contentState, blockKey, entityData, entityType, isRemoval) => {
  let existingCharacterMetadata;
  let newContentState = contentState;
  const contentBlock = contentState.getBlockForKey(blockKey);
  const newContentBlocks = [];
  const contentBlocks = [];
  if (isBlockAList(contentBlock)) {
    contentBlocks.push(...getListBlocks(newContentState, contentBlock));
  } else {
    contentBlocks.push(contentBlock);
  }
  let existingEntity;
  let existingEntityKey;
  let existingEntityType = '';
  let existingEntityData = {};
  let existingEntityMutability = 'MUTABLE';
  let newEntityData;
  let newEntityType;
  const listArray = [];
  contentBlocks.forEach((block) => {
    for (let i = 0; i < block.getText().length; i += 1) {
      existingCharacterMetadata = block.getCharacterList().get(i);
      existingEntityKey = existingCharacterMetadata.getEntity();
      if (existingEntityKey) {
        existingEntity = newContentState.getEntity(existingEntityKey);
        existingEntityType = existingEntity.getType();
        existingEntityData = existingEntity.getData();
        existingEntityMutability = existingEntity.getMutability();
      }
      newEntityType = existingEntityType;
      if (isRemoval) {
        newEntityType = existingEntityType.replace(new RegExp(`${entityType}-?`), '');
      } else if (existingEntityType.indexOf(entityType) < 0) {
        newEntityType = trim(`${entityType}-${existingEntityType}`, '-');
      }
      if (!newEntityType) {
        listArray[i] = CharacterMetadata.applyEntity(existingCharacterMetadata, null);
      } else {
        newEntityData = {
          ...existingEntityData,
          ...entityData,
        };
        if (isRemoval && entityType === 'UPDATE') {
          delete newEntityData.updatedDate;
        }
        const updatedEntityState = getEntityKey(newContentState, {
          type: newEntityType,
          mutability: existingEntityMutability,
          data: newEntityData,
        });
        const entityKey = updatedEntityState.entityKey;
        newContentState = updatedEntityState.newContentState;
        listArray[i] = CharacterMetadata.applyEntity(existingCharacterMetadata, entityKey);
      }
      existingEntity = null;
      existingEntityKey = null;
      existingEntityType = '';
      existingEntityData = {};
      existingEntityMutability = 'MUTABLE';
      newEntityType = null;
      newEntityData = {};
    }
    newContentBlocks.push(new ContentBlock({
      key: genKey(),
      type: block.getType(),
      text: block.getText(),
      characterList: new List(listArray),
    }));
    listArray.length = 0;
  });
  const blocksAsArray = newContentState.getBlocksAsArray();
  const replaceBlockIndexStart = blocksAsArray // will differ from end when forcing a list render
    .findIndex((block) => block.getKey() === contentBlocks[0].getKey());
  const replaceBlockIndexEnd = blocksAsArray
    .findIndex((block) => block.getKey() === contentBlocks[contentBlocks.length - 1].getKey());
  newContentState = ContentState.createFromBlockArray(
    [
      ...blocksAsArray.slice(0, replaceBlockIndexStart),
      ...newContentBlocks,
      ...blocksAsArray.slice(replaceBlockIndexEnd + 1, blocksAsArray.length),
    ],
    newContentState.getEntityMap(),
  );

  return newContentState;
};
