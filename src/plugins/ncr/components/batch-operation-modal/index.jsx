import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import {
  Button,
  Col,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row,
} from '@triniti/admin-ui-plugin/components';
import selector from './selector';
import delegateFactory from './delegate';
import { batchOperationMessageTypes, batchOperationStatuses } from '../../constants';

const {
  PAUSED,
  DESTROYED,
  ENDED,
  PENDING,
  STARTED,
} = batchOperationStatuses;
const {
  ERROR,
} = batchOperationMessageTypes;

export const BatchOperationModal = ({ batchOperation, delegate }) => (
  <div>
    {(batchOperation && batchOperation.status !== DESTROYED)
    && (
      <Modal key="modal" isOpen size="xl" maxWidth="1000px">
        <ModalHeader
          toggle={() => delegate.handleDestroyBatchOperation(batchOperation)}
        >
          Batch Operation Results - <b className="text-danger">{batchOperation.operation}</b>
        </ModalHeader>
        <ModalBody className="pb-5">
          <Row>
            <Col>
              <Progress multi>
                <Progress bar value={Math.round(batchOperation.progress)}>
                  <b>
                    {Math.round(batchOperation.progress)}% Complete
                    - {batchOperation.operation}
                  </b>
                </Progress>
                <Progress
                  bar
                  animated
                  color={(batchOperation.status === PENDING
                  || batchOperation.status === STARTED) ? 'danger' : 'dark'}
                  value={100 - Math.round(batchOperation.progress)}
                />
              </Progress>
              <hr />
            </Col>
          </Row>
          <Row>
            <Col>
              {(batchOperation.status === PENDING
              || batchOperation.status === STARTED)
              && (
                <Button
                  style={{ marginTop: '9px', marginBottom: '7px' }}
                  className="float-right"
                  color="dark"
                  key="cancel"
                  onClick={delegate.handlePauseBatchOperation}
                >
                  Pause
                </Button>
              )}
              <ul style={{ listStyleType: 'none' }}>
                {batchOperation.messages.map((message, index) => (
                  <li
                    style={{ padding: '5px' }}
                    className={message.type === ERROR ? 'text-danger' : ''}
                    key={`${message.nodeRef.id}`}
                  >
                    <Icon
                      imgSrc={message.type === ERROR ? 'warning-solid' : 'check-solid'}
                      id={`icon-${index + 1}`}
                      size="md"
                      color={message.type === ERROR ? 'danger' : 'success'}
                    />
                    &nbsp;&nbsp;
                    <b style={{ textTransform: 'uppercase' }}>{message.title}</b> : <em>{message.message}</em>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {((batchOperation.status === ENDED
          || batchOperation.status === PAUSED)
          && batchOperation.progress < 100)
          && (
          <Button
            className="float-left"
            color="danger"
            key="resume"
            onClick={delegate.handleResumeBatchOperation}
          >
            Resume
          </Button>
          )}
          {(batchOperation.status === ENDED
          || batchOperation.status === PAUSED)
          && (
          <Button
            color="success"
            key="done"
            onClick={() => delegate.handleDestroyBatchOperation(batchOperation)}
          >
            Done
          </Button>
          )}
        </ModalFooter>
      </Modal>
    )}
  </div>
);

BatchOperationModal.propTypes = {
  batchOperation: PropTypes.shape({}),
  delegate: PropTypes.shape({
    handleDestroyBatchOperation: PropTypes.func.isRequired,
    handlePauseBatchOperation: PropTypes.func.isRequired,
    handleResumeBatchOperation: PropTypes.func.isRequired,
  }).isRequired,
};

BatchOperationModal.defaultProps = {
  batchOperation: null,
};

export default connect(selector, createDelegateFactory(delegateFactory))(BatchOperationModal);
