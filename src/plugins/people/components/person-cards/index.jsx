import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import Message from '@gdbots/pbj/Message';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
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

const PersonCards = ({ nodes: people }) => (
  <div>
    {people.map((person) => (
      <Card key={person.get('_id')}>
        <CardBody>
          <Row className="mb-0">
            <Col sm="5">
              <CardImg
                alt={person.get('title')}
                src={person.has('image_ref') ? damUrl(person.get('image_ref'), '3by2', 'sm') : ''}
                top
              />
            </Col>
            <Col sm="7">
              <CardTitle tag="h2">{person.get('title')}</CardTitle>
              <CardText><strong>Bio:</strong> {person.get('bio')}</CardText>
              <CardText><strong>Slug:</strong> {person.get('slug')}</CardText>
              <CardText>
                <strong>Created Date:</strong>
                {convertReadableTime(person.get('created_at'))}
              </CardText>
              <hr className="my-3" />
              <Link
                href={pbjUrl(person, 'cms')}
                style={{ textDecoration: 'none' }}
                to={pbjUrl(person, 'cms')}
              >
                <Button size="sm" className="mr-2 mb-0">
                  <Icon imgSrc="eye" alt="view" className="mr-1" /> View
                </Button>
              </Link>
              <Link
                href={`${pbjUrl(person, 'cms')}/edit`}
                style={{ textDecoration: 'none' }}
                to={`${pbjUrl(person, 'cms')}/edit`}
              >
                <Button size="sm" className="mb-0">
                  <Icon imgSrc="pencil" alt="edit" className="mr-1" /> Edit
                </Button>
              </Link>
            </Col>
          </Row>
        </CardBody>
      </Card>
    ))}
  </div>
);

PersonCards.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
};

export default PersonCards;
