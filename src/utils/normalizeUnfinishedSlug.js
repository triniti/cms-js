import createSlug from '@gdbots/common/createSlug';

const DATE_REGEX = /^\d{1,4}\/?(\d{1,2}\/?(\d{1,2}\/?)?)?/;
const DATE_NEEDS_SLASH_REGEX = /^(\d{4}(?!\/))|(\d{4}\/\d{2}(?!\/))|(\d{4}\/\d{2}\/\d{2}(?!\/))/;

const slashWasRemoved = (oldSlug, slug) => (oldSlug.replace(slug, '') === '/' && oldSlug[oldSlug.length - 1] === '/');

/**
 * Normalizes (deburrs etc) a slug. To be used while typing or copy/pasting, so can return
 * invalid slugs on the assumption that they will become valid before saving.
 *
 * @param {string}   oldSlug     - the existing slug value (used to determine what change happened)
 * @param {string}   newSlug     - the incoming/proposed slug value
 * @param {?boolean} isDatedSlug - whether or not the slug should allow dates/slashes
 *
 * @returns {string}
 */
export default (oldSlug, newSlug, isDatedSlug = false) => {
  let slug = newSlug;
  slug = createSlug(slug, isDatedSlug);

  if (isDatedSlug && DATE_REGEX.test(slug)) {
    const slugWithoutDate = slug.replace(DATE_REGEX, '');
    let date = slug.replace(new RegExp(`${slugWithoutDate}$`), '');
    slug = `/${createSlug(slugWithoutDate) || ''}`;
    date = createSlug(date, true);
    if (!slashWasRemoved(oldSlug, newSlug) && DATE_NEEDS_SLASH_REGEX.test(date)) {
      date += '/';
    }
    slug = `${date}${slug !== '/' ? slug || '' : ''}`.replace(/\/{2,}/, '/');
  }
  return slug || '';
};
