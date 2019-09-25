import test from 'tape';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import deriveNodeOperationStatuses from './deriveNodeOperationStatuses';


const opsGrantStatuses = {
  isPublishNodeGranted: true,
  isUnpublishNodeGranted: true,
  isMarkNodeAsDraftGranted: false,
  isMarkNodeAsPendingGranted: false,
};

test('deriveNodeOperationStatuses tests', (t) => {
  let actual = deriveNodeOperationStatuses(NodeStatus.PENDING, opsGrantStatuses);
  let expected = {
    canPublish: true,
    canUnpublish: false,
    canMarkAsPending: false,
    canMarkAsDraft: false,
  };
  t.same(actual, expected, 'should have the correct ops statuses on pending node');

  opsGrantStatuses.isMarkNodeAsPendingGranted = true;
  actual = deriveNodeOperationStatuses(NodeStatus.DELETED, opsGrantStatuses);
  expected = {
    canPublish: false,
    canUnpublish: false,
    canMarkAsPending: false,
    canMarkAsDraft: false,
  };
  t.same(actual, expected, 'should have the correct ops statuses on deleted node');
  opsGrantStatuses.isMarkNodeAsPendingGranted = false; // return to original

  actual = deriveNodeOperationStatuses(NodeStatus.PUBLISHED, opsGrantStatuses);
  expected = {
    canPublish: false,
    canUnpublish: true,
    canMarkAsPending: false,
    canMarkAsDraft: false,
  };
  t.same(actual, expected, 'should have the correct ops statuses on published node');

  actual = deriveNodeOperationStatuses(NodeStatus.SCHEDULED, opsGrantStatuses);
  expected = {
    canPublish: true,
    canUnpublish: false,
    canMarkAsPending: false,
    canMarkAsDraft: false,
  };
  t.same(actual, expected, 'should have the correct ops statuses on scheduled node');

  opsGrantStatuses.isMarkNodeAsPendingGranted = true;
  actual = deriveNodeOperationStatuses(NodeStatus.EXPIRED, opsGrantStatuses);
  expected = {
    canPublish: false,
    canUnpublish: false,
    canMarkAsPending: false,
    canMarkAsDraft: false,
  };
  t.same(actual, expected, 'should have the correct ops statuses on expired node');
  opsGrantStatuses.isMarkNodeAsPendingGranted = false;

  opsGrantStatuses.isMarkNodeAsPendingGranted = true;
  opsGrantStatuses.isUnpublishNodeGranted = true;
  opsGrantStatuses.isPublishNodeGranted = true;
  opsGrantStatuses.isMarkNodeAsDraftGranted = true;
  actual = deriveNodeOperationStatuses('UNSAVED', opsGrantStatuses);
  expected = {
    canPublish: false,
    canUnpublish: false,
    canMarkAsPending: false,
    canMarkAsDraft: false,
  };
  t.same(actual, expected, 'should have the no UI ops when node is null or unsaved');

  t.end();
});
