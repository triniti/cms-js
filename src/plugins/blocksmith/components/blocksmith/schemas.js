import ArticleV1Mixin from "@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin";
import AudioAssetV1Mixin from "@triniti/schemas/triniti/dam/mixin/audio-asset/AudioAssetV1Mixin";
import DocumentAssetV1Mixin from "@triniti/schemas/triniti/dam/mixin/document-asset/DocumentAssetV1Mixin";
import GalleryV1Mixin from "@triniti/schemas/triniti/curator/mixin/gallery/GalleryV1Mixin";
import PollV1Mixin from "@triniti/schemas/triniti/apollo/mixin/poll/PollV1Mixin";
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchArticlesRequestV1Mixin from "@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin";
import VideoV1Mixin from "@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin";

export default {
  getNodeRequest: resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request'),
  getArticleNodeRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-request'),
  getAudioAssetNodeRequest: resolveSchema(AudioAssetV1Mixin, 'request', 'get-asset-request'),
  getDocumentAssetNodeRequest: resolveSchema(DocumentAssetV1Mixin, 'request', 'get-asset-request'),
  getImageAssetNodeRequest: resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request'),
  getGalleryNodeRequest: resolveSchema(GalleryV1Mixin, 'request', 'get-gallery-request'),
  getPollNodeRequest: resolveSchema(PollV1Mixin, 'request', 'get-poll-request'),
  getVideoNodeRequest: resolveSchema(VideoV1Mixin, 'request', 'get-video-request'),
  searchArticles: SearchArticlesRequestV1Mixin.findOne(),
};
