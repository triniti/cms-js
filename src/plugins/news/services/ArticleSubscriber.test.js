import sinon from 'sinon';
import test from 'tape';

import ArticleId from '@triniti/schemas/triniti/news/ArticleId';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import FormEvent from '@triniti/app/events/FormEvent';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import ArticleSubscriber from './ArticleSubscriber';
import { formNames } from '../constants';

global.APP_VENDOR = 'triniti';
const subscriber = new ArticleSubscriber();
const assetSchemas = AssetV1Mixin.findAll();
const imageAssetSchema = assetSchemas[4];

const imageNode = imageAssetSchema
  .createMessage()
  .set('title', 'fake-image')
  .set('_id', AssetId.fromString('image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6502'))
  .set('mime_type', 'image/jpeg');

test('ArticleSubscriber onInitForm', (t) => {
  const command = ArticleV1Mixin.findOne().createMessage();
  command.set('_id', ArticleId.fromString('68d93e8d-a191-47e9-8bff-bea2ada151e2'));
  command.set('title', 'fake-title');
  command.set('is_homepage_news', true);
  command.set('allow_comments', false);
  command.set('amp_enabled', false);
  command.set('allow_comments', false);
  command.set('show_related_articles', true);
  command.set('image_ref', NodeRef.fromNode(imageNode));
  command.set('related_articles_heading', 'some related articles heading');

  const formEvent = new FormEvent(command, formNames.ARTICLE);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:news:mixin:article.init_form'](formEvent);

  const data = formEvent.getData();
  const { _id } = data;
  t.equal(_id.toString(),
    '68d93e8d-a191-47e9-8bff-bea2ada151e2',
    'it should set the correct value for _id field');
  t.equal(data.title, 'fake-title', 'it should set the correct value for title field');
  t.equal(data.imageRef.toString(),
    'bachelornation:image-asset:image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6502',
    'it should set the correct value for image_ref field');
  t.equal(data.isHomepageNews, true, 'it should set the correct value for isHomepageNews field');
  t.equal(data.showRelatedArticles,
    true,
    'it should set the correct value for showRelatedArticles field');
  t.equal(data.allowComments, false, 'it should set the correct value for allowComments field');
  t.equal(data.relatedArticlesHeading,
    'some related articles heading',
    'it should set the correct value for relatedArticlesHeading field');
  t.equal(data.relatedArticleRefs.length,
    0,
    'it should set the correct value for relatedArticleRefs field');
  t.end();
});

test('ArticleSubscriber onValidateForm[invalid title]', (t) => {
  const command = ArticleV1Mixin.findOne().createMessage();

  const formEvent = new FormEvent(command, formNames.ARTICLE);
  formEvent.getRedux = () => ({
    getState: () => {},
  });
  formEvent.addError = sinon.spy();

  const subscribedEvents = subscriber.getSubscribedEvents();
  const data = formEvent.getData();
  data.title = null;

  subscribedEvents['triniti:news:mixin:article.validate_form'](formEvent);

  t.equal(formEvent.addError.calledOnce, true, 'it should call addError');

  t.end();
});


test('ArticleSubscriber onSubmitForm', (t) => {
  const command = ArticleV1Mixin.findOne().createMessage();
  command.set('_id', ArticleId.fromString('68d93e8d-a191-47e9-8bff-bea2ada151e2'));
  command.set('title', 'fake-title');
  command.set('is_homepage_news', true);
  command.set('allow_comments', false);
  command.set('amp_enabled', false);
  command.set('allow_comments', false);
  command.set('show_related_articles', true);
  command.set('image_ref', NodeRef.fromNode(imageNode));
  command.set('related_articles_heading', 'some related articles heading');

  const formEvent = new FormEvent(command, formNames.ARTICLE);
  const subscribedEvents = subscriber.getSubscribedEvents();

  subscribedEvents['triniti:news:mixin:article.init_form'](formEvent);

  subscribedEvents['triniti:news:mixin:article.submit_form'](formEvent);

  const node = formEvent.getMessage();
  t.equal(node.get('_id').toString(),
    '68d93e8d-a191-47e9-8bff-bea2ada151e2',
    'it should set the correct node\'s _id');
  t.equal(node.get('title'), 'fake-title', 'it should set the correct node\'s title');
  t.equal(node.get('image_ref').toString(),
    'bachelornation:image-asset:image_jpg_20151201_cb9c3c8c5c88453b960933a59ede6502',
    'it should set the correct imageRef value');
  t.equal(node.get('is_homepage_news'), true, 'it should set the correct isHomepageNews value');
  t.equal(node.get('show_related_articles'),
    true,
    'it should set the correct showRelatedArticles value');
  t.equal(node.get('allow_comments'), false, 'it should set the correct allowComments value');
  t.equal(node.get('related_articles_heading'),
    'some related articles heading',
    'it should set the correct relatedArticlesHeading value');
  t.end();
});
