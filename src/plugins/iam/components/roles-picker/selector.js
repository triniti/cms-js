import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import schemas from './schemas';

export default (state) => ({
  listAllRolesRequestState: getRequest(state, schemas.listAllRolesRequest.getCurie()),
});
