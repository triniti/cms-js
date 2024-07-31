import fastDeepEqual from 'fast-deep-equal/es6/index.js';

const styleDefaults = ['uppercase', 'uppercase', 'uppercase'];
const sizeDefaults = [3, 1, 1];

export default class HeadlineFragmentsSubscriber {
  /**
   * Default the hf_* fields
   * @param {FormEvent} formEvent
   */
  initForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (!formEvent.getName()) {
      // from new modal most likely, ignore
      return;
    }

    if (!node.has('hf')) {
      data.hf_styles = styleDefaults;
      data.hf_sizes = sizeDefaults;
      return;
    }

    data.hf = [];
    data.hf_styles = [];
    data.hf_sizes = [];

    for (let i = 0; i < 3; i++) {
      const text = `${node.getFromListAt('hf', i, '')}`.trim();
      if (text) {
        data.hf.push(text);
        data.hf_styles.push(node.getFromListAt('hf_styles', i, styleDefaults[i]));
        data.hf_sizes.push(node.getFromListAt('hf_sizes', i, sizeDefaults[i]));
      } else {
        data.hf_styles.push(node.getFromListAt('hf_styles', i, styleDefaults[i]));
        data.hf_sizes.push(node.getFromListAt('hf_sizes', i, sizeDefaults[i]));
      }
    }
  }

  /**
   * Ensures hf_* arrays match the size of hf
   *
   * @param {PbjxEvent} pbjxEvent
   */
  validate(pbjxEvent) {
    if (!pbjxEvent.hasParentEvent()) {
      return;
    }

    const command = pbjxEvent.getParentEvent().getMessage();
    const oldNode = command.get('old_node');
    const newNode = command.get('new_node');
    if (!newNode || newNode.isFrozen()) {
      return;
    }

    const hf = newNode.get('hf', []);
    const styles = newNode.get('hf_styles', []);
    const sizes = newNode.get('hf_sizes', []);
    newNode.clear('hf').clear('hf_styles').clear('hf_sizes');

    for (let i = 0; i < 3; i++) {
      const text = `${hf[i] || ''}`.trim();
      if (text) {
        newNode.addToList('hf', [text]);
        newNode.addToList('hf_styles', [styles[i] || styleDefaults[i]]);
        newNode.addToList('hf_sizes', [sizes[i] || sizeDefaults[i]]);
      }
    }

    const paths = [];
    if (!fastDeepEqual(oldNode.get('hf'), newNode.get('hf'))) {
      paths.push('hf');
    }

    if (!fastDeepEqual(oldNode.get('hf_styles'), newNode.get('hf_styles'))) {
      paths.push('hf_styles');
    }

    if (!fastDeepEqual(oldNode.get('hf_sizes'), newNode.get('hf_sizes'))) {
      paths.push('hf_sizes');
    }

    command.addToSet('paths', paths);
  }
}
