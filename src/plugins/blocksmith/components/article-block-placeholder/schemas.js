import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  getArticleNodeRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-request'),
  getImageNodeRequest: resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request'),
};
