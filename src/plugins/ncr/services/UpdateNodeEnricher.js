import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class UpdateNodeEnricher extends EventSubscriber {
  constructor() {
    super();
    this.onEnrich = this.onEnrich.bind(this);
  }

  /**
   * Determines what fields have actually changed and adds
   * paths to the command.
   *
   * @param {PbjxEvent} pbjxEvent
   */
  onEnrich(pbjxEvent) {
    const command = pbjxEvent.getMessage();
    if (!command.has('old_node') || !command.has('new_node') || command.isFrozen()) {
      return;
    }

    const oldNode = command.get('old_node');
    const newNode = command.get('new_node');

    command.clear('old_node');
    command.addToSet('paths', newNode.schema().getFields().reduce((paths, field) => {
      const path = field.getName();
      if (path === 'slug' || path === 'etag') {
        return paths;
      }

      if (path === 'blocks') {
        const removeEtags = (block) => {
          const obj = block.toObject();
          delete obj.etag;
          return obj;
        };

        const oldVal = JSON.stringify(oldNode.get(path, []).map(removeEtags));
        const newVal = JSON.stringify(newNode.get(path, []).map(removeEtags));
        if (oldVal !== newVal) {
          paths.push(path);
        }

        return paths;
      }

      const oldVal = JSON.stringify(oldNode.get(path));
      const newVal = JSON.stringify(newNode.get(path));
      if (oldVal !== newVal) {
        paths.push(path);
      }

      return paths;
    }, []));
  }

  getSubscribedEvents() {
    return {
      'gdbots:ncr:mixin:update-node.enrich': this.onEnrich,
    };
  }
}
