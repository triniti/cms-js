import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Table } from 'reactstrap';
import { ActionButton, Icon } from '@triniti/cms/components/index.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import useDelegate from '@triniti/cms/plugins/ncr/components/batch-operation-modal/useDelegate.js';
import noop from 'lodash-es/noop.js';

export { useDelegate };

export default function BatchOperationModal(props) {
  const {
    nodes,
    header = 'Batch Operation',
    runningText = 'Running',
    completedText = 'Completed',
    operation,
    size = 'xl',
    onComplete = noop,
  } = props;
  const delegate = useDelegate(nodes, operation);

  return (
    <Modal isOpen centered size={size} backdrop="static">
      <ModalHeader toggle={props.toggle}>{header}</ModalHeader>
      <ModalBody className="modal-scrollable p-0">
        <Table className="sticky-thead mb-0">
          <thead>
          <tr>
            <th className="ps-3">Title</th>
            <th className="col-sm-4">Status</th>
          </tr>
          </thead>
          <tbody>

          {nodes.map((node) => {
            const key = node.generateNodeRef().toString();
            const results = delegate.getResults(key);
            return (
              <tr key={key} className={`status-${results.status} ${results.ok ? '' : 'results-fail'}`}>
                <td className="ps-3">
                  <a href={nodeUrl(node, 'view')} rel="noopener noreferrer" target="_blank">
                    {node.get('title')}
                  </a>
                </td>
                <td className="col-sm-4">
                  {results.status === 'running' && (
                    <>
                      <Spinner color="secondary" size="sm" className="mt-0 me-2" />
                      <span>{runningText}</span>
                    </>
                  )}

                  {results.status === 'completed' && !results.ok && (
                    <>
                      <Icon imgSrc="warning-solid" color="danger" className="mt-0 me-2" />
                      <span>{results.result}</span>
                    </>
                  )}

                  {results.status === 'completed' && results.ok && (
                    <>
                      <Icon imgSrc="check-solid" color="success" className="mt-0 me-2" />
                      <span>{completedText}</span>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      </ModalBody>

      <ModalFooter>
        <ActionButton
          text={delegate.isCompleted ? 'Close' : 'Cancel'}
          onClick={() => {
            delegate.isCompleted ? onComplete() : props.toggle()
          }}
          color="light"
          icon="close-sm"
          tabIndex="-1"
        />
        {!delegate.isStarted && (
          <ActionButton
            text="Start"
            onClick={delegate.start}
            color="primary"
            icon="bolt-outline"
          />
        )}
        {delegate.isRunning && (
          <ActionButton
            text="Pause"
            onClick={delegate.pause}
            color="danger"
            icon="pause-outline"
          />
        )}
        {delegate.isPaused && (
          <ActionButton
            text="Resume"
            onClick={delegate.start}
            color="warning"
            icon="play-outline"
          />
        )}
      </ModalFooter>
    </Modal>
  );
}
