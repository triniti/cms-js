import { useEffect, useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import clamp from 'lodash-es/clamp.js';
import incrementer from '@triniti/cms/utils/incrementer.js';

/**
 * Things to know:
 * - galleries are sorted by the gallery_seq in descending order.
 * - when new images are added the seq is increased by 500 for each new image.
 * - gallery seq is not contiguous intentionally to allow for more efficient reordering (fewer writes to db)
 * - order of nodes is not guaranteed to be 0, 500, 1000, etc.
 * - all nodes could be the same seq (not likely but possible)
 * - all nodes could be 0.
 * - the page of nodes you're sorting might need to expand its range of seq numbers
 *    if it is determined that the high/low can't contain all the possible nodes.
 *    unlikely, but possible.
 * - users shouldn't need to know anything about seq no, in nearly all cases,
 *   just fix it for them.
 */

export const SEQ_STEP = 500;
const MAX_RECURSION = 500;

const getNewSeq = (upper, lower, direction) => {
  if (direction === 'up') {
    const newSeq = Math.ceil(upper - ((upper - lower) / 2));
    return clamp(newSeq, lower, upper);
  }

  const newSeq = Math.floor(upper - ((upper - lower) / 2));
  return clamp(newSeq, lower, upper);
};

const setSeq = (seqs, newSeq, index, config) => {
  if (seqs[index] === newSeq) {
    return;
  }

  config.changes++;
  seqs[index] = newSeq;
};

const resequence = (seqs, ids, config) => {
  let i = 0;
  do {
    i++;
    if (i > MAX_RECURSION) {
      return;
    }

    config.changes = 0;
    config.iterations = 0;
    resequenceDown(seqs, ids, 0, config);
    resequenceUp(seqs, ids, seqs.length - 1, config);
  } while (config.changes > 0);
};

const resequenceUp = (seqs, ids, index, config) => {
  if (config.iterations > MAX_RECURSION) {
    console.error('resequenceUp.recursion', { seqs, ids, index, config });
    throw new Error('Too Much Recursion');
  }

  config.iterations++;

  const upperIndex = index - 1;
  const lowerIndex = index + 1;
  const isFirst = index <= 0;
  const isLast = index >= seqs.length - 1;

  if (isLast) {
    setSeq(seqs, clamp(seqs[index], config.low, config.min), index, config);
    resequenceUp(seqs, ids, upperIndex, config);
    return;
  }

  if (isFirst) {
    setSeq(seqs, clamp(seqs[index], config.high, config.max), index, config);
    return;
  }

  const oldSeq = config.images[ids[index]].get('gallery_seq');
  const upper = seqs[upperIndex];
  const lower = seqs[lowerIndex];

  if (oldSeq < upper && oldSeq > lower) {
    setSeq(seqs, oldSeq, index, config);
  } else if (seqs[index] < upper && seqs[index] > lower) {
    // do nothing
  } else {
    setSeq(seqs, getNewSeq(upper, lower, 'up'), index, config);
  }

  resequenceUp(seqs, ids, upperIndex, config);
};

const resequenceDown = (seqs, ids, index, config) => {
  if (config.iterations > MAX_RECURSION) {
    console.error('resequenceDown.recursion', { seqs, ids, index, config });
    throw new Error('Too Much Recursion');
  }

  config.iterations++;

  const upperIndex = index - 1;
  const lowerIndex = index + 1;
  const isFirst = index <= 0;
  const isLast = index >= seqs.length - 1;

  if (isLast) {
    setSeq(seqs, clamp(seqs[index], config.low, config.min), index, config);
    return;
  }

  if (isFirst) {
    setSeq(seqs, clamp(seqs[index], config.high, config.max), index, config);
    resequenceDown(seqs, ids, lowerIndex, config);
    return;
  }

  const oldSeq = config.images[ids[index]].get('gallery_seq');
  const upper = seqs[upperIndex];
  const lower = seqs[lowerIndex];

  if (oldSeq < upper && oldSeq > lower) {
    setSeq(seqs, oldSeq, index, config);
  } else if (seqs[index] < upper && seqs[index] > lower) {
    // do nothing
  } else {
    setSeq(seqs, getNewSeq(upper, lower, 'down'), index, config);
  }

  resequenceDown(seqs, ids, lowerIndex, config);
};

const resetSeq = (seqs, config) => {
  for (let i = seqs.length - 1; i >= 0; i--) {
    seqs[i] = config.low + ((seqs.length - i - 1) * SEQ_STEP);
  }
};

const isValidSeq = (seqs) => {
  let lastSeq = seqs[0];
  for (let i = 1; i < seqs.length; i++) {
    if (seqs[i] >= lastSeq) {
      return false;
    }

    lastSeq = seqs[i];
  }

  return true;
};

const move = (seqs, ids, oldIndex, newIndex, config) => {
  if (oldIndex === newIndex || oldIndex < 0 || newIndex < 0 || newIndex >= seqs.length) {
    return;
  }

  config.iterations = 0;

  try {
    if (newIndex === 0) {
      seqs[0] = config.high;
    } else if (newIndex >= seqs.length - 1) {
      seqs[seqs.length - 1] = config.low;
    } else if (oldIndex < newIndex) {
      resequenceDown(seqs, ids, newIndex, config);
    } else {
      resequenceUp(seqs, ids, newIndex, config);
    }
  } catch (e) {
    console.error(e, { seqs, ids, oldIndex, newIndex, config });
    resetSeq(seqs, config);
  }

  resequence(seqs, ids, config);
  if (!isValidSeq(seqs)) {
    resetSeq(seqs, config);
    resequence(seqs, ids, config);
  }
};

export default (response) => {
  const [ids, setIds] = useState([]);
  const [seqs, setSeqs] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const config = useMemo(() => {
    const cfg = { ready: false, ids: [], seqs: [], images: {}, high: 0, low: 0 };
    if (!response) {
      cfg.incrementer = incrementer(0, SEQ_STEP);
      cfg.min = 0;
      cfg.max = SEQ_STEP;
      return cfg;
    }

    cfg.ready = true;
    const nodes = response.get('nodes', []);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const id = node.get('_id').toString();
      const seq = node.get('gallery_seq');
      cfg.ids.push(id);
      cfg.seqs.push(seq);
      cfg.images[id] = node;

      if (i === 0) {
        cfg.high = seq;
      } else if (i === nodes.length - 1) {
        cfg.low = seq;
      }
    }

    const start = cfg.high > 0 ? cfg.high + SEQ_STEP : 0;
    cfg.incrementer = incrementer(start, SEQ_STEP);
    cfg.min = clamp(cfg.low, 0, cfg.low);
    cfg.max = clamp(cfg.high, cfg.min + (SEQ_STEP * nodes.length), cfg.high);

    return cfg;
  }, [response]);

  useEffect(() => {
    if (!config.ready) {
      setIds([]);
      setSeqs([]);
      setIsDirty(false);
      return;
    }

    setIds([...config.ids]);
    setSeqs([...config.seqs]);
    setIsDirty(false);
  }, [config]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) {
      return;
    }

    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);

    if (oldIndex !== newIndex) {
      const newIds = arrayMove(ids, oldIndex, newIndex);
      const changed = !fastDeepEqual(config.ids, newIds);
      setIsDirty(changed);

      if (!changed) {
        if (isDirty) {
          delete config.used;
          setIds([...config.ids]);
          setSeqs([...config.seqs]);
        }
      } else {
        const newSeqs = arrayMove(seqs, oldIndex, newIndex);
        move(newSeqs, newIds, oldIndex, newIndex, config);
        delete config.used;
        setIds(newIds);
        setSeqs(newSeqs);
      }
    }
  };

  const handleRevert = () => {
    setIds([...config.ids]);
    setSeqs([...config.seqs]);
    setIsDirty(false);
  };

  const results = () => {
    const result = {};
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const seq = seqs[i];
      const oldSeq = config.images[id].get('gallery_seq');
      if (seq !== oldSeq) {
        result[id] = seq;
      }
    }

    return result;
  };

  return {
    isDirty,
    ids: ids,
    seqs: seqs,
    images: config.images,
    incrementer: config.incrementer,
    handleDragEnd,
    handleRevert,
    results,
  };
};


