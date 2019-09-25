import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Message from '@gdbots/pbj/Message';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Icon,
  Row,
} from '@triniti/admin-ui-plugin/components';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const PageCards = ({ nodes: pages }) => (
  <div>
    {pages.map((page) => (
      <Card key={page.get('_id')}>
        <CardBody>
          <Row className="mb-0">
            <Col sm="4">
              <CardImg
                top
                src="https://placeholdit.imgix.net/~text?txtsize=33&txt=300%C3%97225&w=300&h=225"
                alt={page.get('title')}
              />
            </Col>
            <Col sm="8">
              <CardTitle tag="h2">{page.get('title')}</CardTitle>
              <CardText>Description: {page.get('description')}</CardText>
              <CardText>Slug: {page.get('slug')}</CardText>
              <CardText>
                Active Date: {page.has('published_at') && moment(page.get('published_at')).format('YYYY-MM-DD h:mm A')}
              </CardText>
              <hr className="my-3" />
              <Link to={pbjUrl(page, 'cms')} href={pbjUrl(page, 'cms')} style={{ textDecoration: 'none' }}>
                <Button size="sm" className="mr-2 mb-0"><Icon imgSrc="eye" alt="view" className="mr-1" /> View</Button>
              </Link>
              <Link to={`${pbjUrl(page, 'cms')}/edit`} href={`${pbjUrl(page, 'cms')}/edit`} style={{ textDecoration: 'none' }}>
                <Button size="sm" className="mb-0"><Icon imgSrc="pencil" alt="edit" className="mr-1" /> Edit</Button>
              </Link>
              <a target="_blank" rel="noopener noreferrer" href={pbjUrl(page, 'canonical')} style={{ textDecoration: 'none', marginLeft: '.5rem' }}>
                <Button size="sm" className="mb-0"><Icon imgSrc="external" alt="external" className="mr-1" /> View In Site</Button>
              </a>
            </Col>
          </Row>
        </CardBody>
      </Card>
    ))}
  </div>
);

PageCards.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
};

export default PageCards;
