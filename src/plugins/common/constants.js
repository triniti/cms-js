export const PLUGIN_PREFIX = '@triniti/common/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const fieldRules = {
  DESCRIPTION_MAX_CHARACTERS: 500,
  DESCRIPTION_WARNING_CHARACTERS: 300,
};

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,

  ADVERTISING_SUBSCRIBER: t('advertising_subscriber'),
  CUSTOM_CODE_SUBSCRIBER: t('custom_code_subscriber'),
  HAS_RELATED_TEASERS_SUBSCRIBER: t('has_related_teasers_subscriber'),
  SEO_SUBSCRIBER: t('seo_subscriber'),
  SWIPEABLE_SUBSCRIBER: t('swipeable_subscriber'),
  TAGGABLE_SUBSCRIBER: t('taggable_subscriber'),
  THEMEABLE_SUBSCRIBER: t('themeable_subscriber'),
};
