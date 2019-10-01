// const initialValues = getFormInitialValues(formName)(state);
import getFileList from '../../selectors/getFileList';

export default (state) => {
  const fileList = getFileList(state);

  // Return updated variants indexed by version
  const updatedVariants = Object.keys(fileList).reduce((accumulator, hashName) => {
    accumulator[fileList[hashName].version] = fileList[hashName];
    return accumulator;
  }, {});

  return {
    updatedVariants,
  };
};
