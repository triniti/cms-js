import { useState } from 'react';

const useBatchSelection = (nodes) => {
  const [selected, setSelected] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(nodes.map((node) => `${node.get('_id')}`));
    }
    setAllSelected(!allSelected);
  };

  const isSelected = (id) => selected.includes(id);

  const isIndeterminate = () => selected.length > 0 && selected.length < nodes.length;

  const isAllSelected = () => selected.length === nodes.length;

  return {
    selected,
    setSelected,
    allSelected,
    setAllSelected,
    toggle,
    toggleAll,
    isSelected,
    isIndeterminate,
    isAllSelected,
  };
}

export default useBatchSelection;