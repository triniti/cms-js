/**
 * Slug formatting and validation for rename and create-article.
 *
 * Slug rules we care about (don’t regress these):
 *
 * - No trailing junk. We used to preserve a trailing space/dash/slash so you
 *   could keep typing. It caused validation errors and manual cleanup. Now we
 *   always store a clean slug.
 * - One format, no parse. Use formatSlug/formatDatedSlug with formatOnBlur.
 *   parse runs on every keystroke, stripping trailing dashes mid-word.
 * - Normalize on submit. Even if the user never blurs, trim and format before
 *   saving so we never persist whitespace or trailing chars.
 * - Create Article: Only fill slug from title when the slug field is empty.
 *   If they’ve already typed a slug, don’t overwrite it on title blur.
 * - Create Article: On title blur, save the trimmed title back so we don’t
 *   submit leading/trailing spaces.
 */

import { addDateToSlug, createSlug, isValidSlug } from '@gdbots/pbj/utils/index.js';

export const DATED_SLUG_PATTERN = /^\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+$/;

export const slugValidator = (value) => {
  return isValidSlug(value) ? undefined : 'Only use letters, numbers and dashes.';
};

export const isValidDatedSlug = (value) =>
  isValidSlug(value, true) && DATED_SLUG_PATTERN.test(value.trimStart());

export const datedSlugValidator = (value) => {
  return isValidDatedSlug(value) ? undefined : 'Expected format YYYY/MM/DD/some-title-here';
};

/** Normalizes to a valid slug with no trailing space/dash/slash. Use as format (with formatOnBlur), not parse. */
export function formatSlug(value, dated = false) {
  const trimmed = (value ?? '').trim().toLowerCase();
  const slug = createSlug(trimmed, dated);
  return slug ?? trimmed;
}

/** Normalizes to a valid dated slug (YYYY/MM/DD/slug) with no trailing space/dash/slash. Use as format (with formatOnBlur), not parse. */
export function formatDatedSlug(value) {
  const trimmed = (value ?? '').trim().toLowerCase();
  const slug = createSlug(trimmed, true);
  const dated = slug ? addDateToSlug(slug).toLowerCase() : '';
  return dated || trimmed;
}
