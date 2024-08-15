import AspectRatio from '@triniti/schemas/triniti/common/enums/AspectRatio.js';

export default class BlockSubscriber {
  /**
   * Defaults for canvas block fields (used in blocksmith)
   *
   * @param {FormEvent} formEvent
   */
  initForm(formEvent) {
    const data = formEvent.getData();
    const pbj = formEvent.getMessage();
    const schema = pbj.schema();

    if (schema.hasField('aspect_ratio') && (!data.aspect_ratio || data.aspect_ratio === AspectRatio.UNKNOWN.getValue())) {
      data.aspect_ratio = AspectRatio.AUTO.getValue();
    }
  }
}
