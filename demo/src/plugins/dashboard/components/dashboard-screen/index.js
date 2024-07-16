import React from 'react';
import { Col, Row, TabContent, TabPane } from 'reactstrap';
import { Screen } from '@triniti/cms/components/index.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort.js';
import TopArticles from '../top-articles/index.js';
//import ActiveEditsTable from '@triniti/cms/plugins/raven/components/active-edits-table/index.js';

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

export default function DashboardScreen({ tab = 'default' }) {
  return (
    <Screen
      title="Dashboard"
      tabs={[
        { to: '/', text: 'News' },
        { to: '/active-edits', text: 'Active Edits' },
      ]}
      contentWidth="100%"
    >
      <TabContent activeTab={tab}>
        <TabPane tabId='default'>
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
              <p>active edits coming soon.</p>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </Screen>
  );
}
