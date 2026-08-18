import { matchPath } from 'react-router';

const EDIT_PATHS = [
  { path: '/ncr/:label/:id/:tab/edit', end: true, caseSensitive: false },
  { path: '/ncr/:label/:id/edit', end: true, caseSensitive: false },
];

export default function isInEditMode(pathname = typeof window !== 'undefined' ? window.location.pathname : '') {
  return EDIT_PATHS.some((pattern) => matchPath(pattern, pathname) != null);
}
