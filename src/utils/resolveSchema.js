import MessageResolver from '@gdbots/pbj/MessageResolver';

/**
 * Returns the schema from a resolved curie.
 *
 * @param mixin    - a mixin eg PageV1Mixin
 * @param category - a category eg 'command'
 * @param message  - a message eg 'create-page'
 */
export default (mixin, category, message) => {
  const schemas = mixin.findAll();
  const mixinId = schemas[0].getId();
  return MessageResolver.resolveCurie(`${mixinId.getVendor()}:${mixinId.getPackage()}:${category}:${message}`).schema();
};
