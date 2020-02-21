import isEqual from 'lodash/isEqual';
import { entityTypes, mutabilityTypes } from '../constants';

const MUTABILITY_TYPES = Object.values(mutabilityTypes);

/**
 * Util for getting entity keys for data payloads. When one does not already exist, one
 * is created. This is useful because each character in a ContentBlock has to be individually
 * assessed and given an entity - this determines if an entity already exists for a given
 * payload.
 *
 * @param {ContentState} contentState - A Draft.Js ContentState object.
 * @param {Object}       entity       - An object representing a Draft.Js entity.
 *
 * @returns {string}
 */
export default (contentState, entity) => {
  const { type, mutability, data } = entity;
  if (!type) {
    throw new Error(`Entities must have a type (eg '${Object.values(entityTypes)[0]}').`);
  }
  if (!mutability) {
    throw new Error(`Entities must have a mutability (eg '${MUTABILITY_TYPES[0]}').`);
  } else if (!MUTABILITY_TYPES.includes(mutability)) {
    throw new Error(`Entities must have a valid mutability (one of: ${MUTABILITY_TYPES}).`);
  }
  if (!data || !Object.keys(data).length) {
    throw new Error('Entities must have a data payload.');
  }
  let newContentState = contentState;
  let existingEntityKey;
  let existingEntity;

  const numberOfEntities = Number(newContentState.getLastCreatedEntityKey());
  for (let i = 1; i <= numberOfEntities; i += 1) {
    existingEntity = newContentState.getEntity(String(i));
    if (
      isEqual(
        {
          type: existingEntity.getType(),
          mutability: existingEntity.getMutability(),
          data: existingEntity.getData(),
        },
        entity,
      )
      && (
        // isEqual will confirm yes for atomic block payload because
        // it compares with keys so you have to compare more better.
        !entity.data.block
        || (
          existingEntity.getData().block
          && entity.data.block.generateEtag() === existingEntity.getData().block.generateEtag()
        )
      )
    ) {
      existingEntityKey = i;
    }
  }

  if (existingEntityKey) {
    return {
      entityKey: existingEntityKey.toString(),
      newContentState,
    };
  }

  newContentState = newContentState.createEntity(
    type,
    mutability,
    data,
  );
  return {
    entityKey: newContentState.getLastCreatedEntityKey(),
    newContentState,
  };
};
