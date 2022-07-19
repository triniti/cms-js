import React from 'react';
import { Col, Row } from 'reactstrap';
import { Screen } from '@triniti/cms/components';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';
import TopArticles from '../top-articles';

const HomePagePublished = withRequest(TopArticles, 'triniti:news:request:search-articles-request', {
  channel: 'homepage-published',
  initialData: {
    count: 20,
    status: NodeStatus.PUBLISHED,
    slotting_key: 'home',
    sort: SearchArticlesSort.ORDER_DATE_DESC.getValue(),
  }
});

const HomePageDraft = withRequest(TopArticles, 'triniti:news:request:search-articles-request', {
  channel: 'homepage-draft',
  initialData: {
    count: 10,
    q: '+is_homepage_news:true',
    status: NodeStatus.DRAFT,
    sort: SearchArticlesSort.ORDER_DATE_DESC.getValue(),
  }
});

export default function DashboardScreen() {
  return (
    <Screen
      title="Dashboard"
      header="Dashboard"
      contentWidth="100%"
    >
      <Row>
        <Col md={6}>
          <HomePagePublished title="Homepage Published" />
        </Col>
        <Col md={6}>
          <HomePageDraft title="Homepage Draft" />
        </Col>
      </Row>
    </Screen>
  );
}
