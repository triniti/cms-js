import { v4 as uuid } from 'uuid';
import fileExtension from 'plugins/dam/utils/fileExtension';

export default (file) => {
  const extension = fileExtension(file).toLowerCase();
  return `${uuid()}${extension ? `.${extension}` : ''}`;
}