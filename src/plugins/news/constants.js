export const PLUGIN_PREFIX = '@triniti/news/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  ARTICLE_SUBSCRIBER: t('article_subscriber'),
  HEADLINE_FRAGMENTS_SUBSCRIBER: t('headline_fragments_subscriber'),
  PREFIX: PLUGIN_PREFIX,
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  INDEX: t('index'),
  SEARCH_ARTICLES: t('search_articles'),
  ARTICLE: t('article'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,
};

export const formNames = {
  ARTICLE: t('article'),
  CREATE_ARTICLE: t('create_article'),
};

export const formRules = {
  TITLE_LENGTH_LIMIT: 60,
  MAX_HF_NUM: 3,
  HF_STYLES_OPTIONS: [
    { label: 'UPPERCASE', value: 'uppercase' },
    { label: 'TitleCase', value: 'titlecase' },
    { label: 'no styling', value: 'none' },
  ],
  HF_SIZES_OPTIONS: [
    { label: 'XL', value: 1 },
    { label: 'L', value: 2 },
    { label: 'M', value: 3 },
    { label: 'S', value: 4 },
    { label: 'XS', value: 5 },
    { label: 'XXS', value: 6 },
  ],
};
