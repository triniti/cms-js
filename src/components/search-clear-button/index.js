import React from 'react';
import { Button } from 'reactstrap';
import Icon from '@triniti/cms/components/icon/index.js';

export default function SearchClearButton({ show, onClear, className }) {
  if (!show) return null;

  const handleClear = () => {
    onClear();
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="search"][name="q"]');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  return (
    <Button
      color="hover"
      className={className || 'btn-search-clear mb-0 rounded-circle'}
      aria-label="Clear search"
      type="button"
      onClick={handleClear}
    >
      <Icon imgSrc="close" />
    </Button>
  );
}
