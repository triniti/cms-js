import { useEffect } from 'react';
import joinCollaboration from '@triniti/cms/plugins/raven/actions/joinCollaboration.js';
import leaveCollaboration from '@triniti/cms/plugins/raven/actions/leaveCollaboration.js';
import setCurrentNodeRef from '@triniti/cms/plugins/raven/actions/setCurrentNodeRef.js';
import sendHeartbeat from '@triniti/cms/plugins/raven/actions/sendHeartbeat.js';
import { getInstance } from '@triniti/app/main.js';

/**
 * When the user switches between tabs in the browser
 * we must restart the monitor since not doing so
 * may take 20 seconds or more for it to start again.
 *
 * @Type {?Function}
 */
let handleVisibilityChange;
/**
 * When the user closes the browser or hits refresh we
 * must ensure they leave the collaboration.  Every
 * time we run startMonitor we create a new listener
 * and bind it to "beforeunload".
 *
 * @Type {Function}
 */
let leaveCollaborationOnUnload;

export default ({ editMode, node, nodeRef }) => {
  const app = getInstance();
  const dispatch = app.getRedux().dispatch;

  /**
   * When a user leaves the screen (component gets unmounted)
   * this should be called.  Even if the user is merely going
   * to a separate tab on the same node screen this still must
   * be called to ensure that the monitor is stopped.
   *
   * This is important because we don't know if the user is
   * leaving the node entirely or just going to a different
   * tab.  This method MUST NOT control the join/leave of
   * the collaboration itself as that creates an infinite
   * loop when all the user was doing was going to a different
   * tab on the same screen.
   */
  const stopCollaborationMonitors = () => {
    if (handleVisibilityChange) {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleVisibilityChange = null;
    }

    if (leaveCollaborationOnUnload) {
      window.removeEventListener('beforeunload', leaveCollaborationOnUnload);
    }
  }

  // Join / Leave Collaboration
  useEffect(() => {
    if (editMode) {
      dispatch(setCurrentNodeRef(nodeRef));
      dispatch(joinCollaboration(nodeRef));
    } else {
      stopCollaborationMonitors();
      dispatch(setCurrentNodeRef(''));
      dispatch(leaveCollaboration(nodeRef));
    }
    return () => {
      stopCollaborationMonitors();
      dispatch(setCurrentNodeRef(''));
      dispatch(leaveCollaboration(nodeRef));
    }
  }, [ editMode, nodeRef ]);


  // Heartbeat
  useEffect(() => {
    dispatch(sendHeartbeat(`${nodeRef}`, node ? node.get('etag') : null)); // Initial so we dont wait for interval
    const monitor = setInterval(() => dispatch(sendHeartbeat(`${nodeRef}`, node ? node.get('etag') : null)), 8000);
    return () => {
      stopCollaborationMonitors();
      clearInterval(monitor);
    }
  }, [ editMode, nodeRef ]);


  // Handle visibility change
  useEffect(() => {
    handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log(`SEND HEARTBEAT!!! Not hidden anymore!!! ${Date.now()}`);
        dispatch(sendHeartbeat(`${nodeRef}`, node ? node.get('etag') : null));
        // startCollaborationMonitor();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
  });


  // Leave Collaboration On UnLoad
  /* eslint-disable no-param-reassign */
  leaveCollaborationOnUnload = (event) => {
    // don't desctructure isPristine so it uses latest value, required for Chrome prompt
    // if (this.component.props.isPristine) {
    //   stopCollaborationMonitors();
    //   return dispatch(leaveCollaboration(nodeRef));
    // }
    event.preventDefault();
    const start = setTimeout(() => {
      const cancel = setTimeout(() => {
        clearTimeout(cancel);
        // user cancels leaving/closing the page so re-join
        dispatch(setCurrentNodeRef(nodeRef));
        dispatch(joinCollaboration(nodeRef));
      }, 0);
      clearTimeout(start);
    }, 0);
    event.returnValue = 'Unsaved changes detected.'; // required to work in Chrome
    dispatch(setCurrentNodeRef(''));
    dispatch(leaveCollaboration(nodeRef));
    return event.returnValue;
  };

  window.addEventListener('beforeunload', leaveCollaborationOnUnload);
}
