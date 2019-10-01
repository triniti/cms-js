import { getFormValues } from 'redux-form';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import NotificationSendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus';
import updateScreenSelector from '@triniti/cms/plugins/ncr/screens/node/selector';
import schemas from './schemas';
import { formConfigs, formNames } from '../../constants';

export default (state, ownProps) => {
  const updateScreenState = updateScreenSelector(state, ownProps, {
    schemas,
    formName: formNames.NOTIFICATION,
  });

  const formValues = getFormValues(formNames.NOTIFICATION)(state);
  const sendOption = formValues && formValues.sendOption;
  const showDatePicker = sendOption && sendOption.value === formConfigs.SEND_OPTIONS.SCHEDULE_SEND;
  const node = getNode(state, updateScreenState.nodeRef);
  const sendStatus = node && node.get('send_status', NotificationSendStatus.DRAFT);
  let alreadySent = false;

  if (sendStatus && (sendStatus === NotificationSendStatus.SENT
    || sendStatus === NotificationSendStatus.FAILED
    || sendStatus === NotificationSendStatus.CANCELED)
  ) {
    alreadySent = true;
  }

  return {
    ...updateScreenState,
    getNode: (nodeRef) => getNode(state, nodeRef),
    isDeleteDisabled: updateScreenState.isDeleteDisabled || alreadySent,
    isSaveDisabled: updateScreenState.isSaveDisabled || alreadySent,
    isToggleDisabled: updateScreenState.isToggleDisabled || alreadySent,
    showDatePicker,
  };
};
