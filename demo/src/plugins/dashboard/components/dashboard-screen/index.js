import React from 'react';
import { Col, Row, TabContent, TabPane } from 'reactstrap';
import { Screen } from '@triniti/cms/components/index.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort.js';
import TopArticles from '../top-articles/index.js';
import Collaborations from '@triniti/cms/plugins/raven/components/collaborations/index.js';

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

export default function DashboardScreen({ tab = 'news' }) {
  return (
    <Screen
      activeNav="Dashboard"
      title={tab === 'news' ? 'Dashboard' : 'Active Edits'}
      tabs={[
        { text: 'News', to: '/' },
        { text: 'Active Edits', to: '/active-edits' },
      ]}
      contentWidth={tab === 'news' ? '100%' : '1008px'}
    >
      <TabContent activeTab={tab}>
        <TabPane tabId="news">
          <Row>
            <Col md={6}>
              <HomePagePublished title="Homepage Published" />
            </Col>
            <Col md={6}>
              <HomePageDraft title="Homepage Draft" />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="active-edits">
          <Row>
            <Col lg="12">
              {tab === 'active-edits' && (
                <Collaborations />
              )}
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </Screen>
  );
}
