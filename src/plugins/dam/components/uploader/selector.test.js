import test from 'tape';

import selector from './selector';
import { formNames, fileUploadStatuses } from '../../constants';

// mock an initial form data
const initialTitle = 'title1';
const initialCredit = 'credit1';
const initialExpiresAt = new Date('December 17, 2020 03:24:00');
const initialFormData = {
  initial: {
    title: initialTitle,
    credit: {
      value: initialCredit,
    },
    expiresAt: initialExpiresAt,
  },
};

const mockFormState = (activeHashName = 'file1', formData = {}) => {
  const formName = `${formNames.UPLOADER_FORM_PREFIX}${activeHashName}`;
  const form = {
    [formName]: formData,
  };
  return { form };
};

const mockDamState = (files = {}) => {
  const dam = {
    uploader: {
      files,
    },
  };
  return { dam };
};

const mockRest = () => {
  const adminUi = {
    alerts: [],
  };
  const utils = {
    counters: {},
  };
  return { adminUi, utils };
};

const mockDamFiles = (activeHashName, files = {}) => {
  const clonedFiles = { ...files };
  const activeFile = clonedFiles[activeHashName];
  if (activeFile) {
    activeFile.active = true;
  }
  return clonedFiles;
};

/**
 * assuming form is dirty, ff. tests ensure that:
 * 1. ONLY uploaded files are submitted for update/patch process
 * 2. save/patch buttons remain DISABLED if NO active item
 * 3. save/patch buttons remain DISABLED if active item has an error
 * 4. save/patch buttons remain DISABLED if active item is still in upload process
 * 4. save/patch buttons is ONLY ENABLED if active item is truly uploaded
 */

test('Uploader selector - initial', (t) => {
  const files = {};
  const mockState = {
    ...mockFormState(),
    ...mockDamState(files),
    ...mockRest(),
  };
  const {
    activeHashName,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    enableSaveChanges,
    uploadedFiles,
  } = selector(mockState);

  let actual = activeHashName;
  let expected = null;
  t.equal(actual, expected, 'it should have no active file');

  actual = enableCreditApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `credit apply all` button');

  actual = enableExpirationDateApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `exp. date apply all` button');

  actual = enableSaveChanges;
  expected = false;
  t.equal(actual, expected, 'it should disable `save changes` button');

  actual = Object.keys(uploadedFiles).length;
  expected = 0;
  t.equal(actual, expected, 'it should have no uploaded files');

  t.end();
});

test('Uploader selector - no uploaded files', (t) => {
  const activeFile = 'file3';
  const files = {
    file1: {
      status: fileUploadStatuses.PROCESSING,
      error: false,
    },
    file2: {
      status: fileUploadStatuses.PROCESSING,
      error: false,
    },
    file3: {
      status: fileUploadStatuses.ERROR,
      error: new Error('error'),
    },
  };

  const dirtyFormData = { ...initialFormData,
    values: {
      title: 'title2',
      credit: {
        value: 'credit2',
      },
      expiresAt: new Date('December 17, 2021 03:24:00'),
    } };

  const mockState = {
    ...mockFormState(activeFile, dirtyFormData),
    ...mockDamState(mockDamFiles(activeFile, files)),
    ...mockRest(),
  };
  const {
    activeHashName,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    enableSaveChanges,
    uploadedFiles,
  } = selector(mockState);

  let actual = activeHashName;
  let expected = activeFile;
  t.equal(actual, expected, 'it should have an active file');

  actual = enableCreditApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `credit apply all` button');

  actual = enableExpirationDateApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `exp. date apply all` button');

  actual = enableSaveChanges;
  expected = false;
  t.equal(actual, expected, 'it should disable `save changes` button');

  actual = Object.keys(uploadedFiles).length;
  expected = 0;
  t.equal(actual, expected, 'it should have no uploaded files');

  t.end();
});


test('Uploader selector - all files successfully uploaded', (t) => {
  const activeFile = 'file2';
  const files = {
    file1: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    file2: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    file3: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
  };

  // only title and expiresAt are updated
  const dirtyFormData = { ...initialFormData,
    values: {
      title: 'title2',
      credit: {
        value: initialCredit,
      },
      expiresAt: new Date('December 17, 2021 03:24:00'),
    } };

  const mockState = {
    ...mockFormState(activeFile, dirtyFormData),
    ...mockDamState(mockDamFiles(activeFile, files)),
    ...mockRest(),
  };
  const {
    activeHashName,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    enableSaveChanges,
    uploadedFiles,
  } = selector(mockState);

  let actual = activeHashName;
  let expected = activeFile;
  t.equal(actual, expected, 'it should have an active file');

  actual = enableCreditApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `credit apply all` button');

  actual = enableExpirationDateApplyAll;
  expected = true;
  t.equal(actual, expected, 'it should enable `exp. date apply all` button');

  actual = enableSaveChanges;
  expected = true;
  t.equal(actual, expected, 'it should enable `save changes` button');

  actual = Object.keys(uploadedFiles).length;
  expected = Object.keys(files).length;
  t.equal(actual, expected, 'it should have correct count of uploaded files');

  t.end();
});

test('Uploader selector - files successfully uploaded [only title field updated]', (t) => {
  const activeFile = 'file3';
  const files = {
    file1: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    file2: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    file3: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
  };

  // only title field is updated
  const dirtyFormData = { ...initialFormData,
    values: {
      title: 'title2',
      credit: {
        value: initialCredit,
      },
      expiresAt: initialExpiresAt,
    } };

  const mockState = {
    ...mockFormState(activeFile, dirtyFormData),
    ...mockDamState(mockDamFiles(activeFile, files)),
    ...mockRest(),
  };
  const {
    activeHashName,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    enableSaveChanges,
    uploadedFiles,
  } = selector(mockState);

  let actual = activeHashName;
  let expected = activeFile;
  t.equal(actual, expected, 'it should have an active file');

  actual = enableCreditApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `credit apply all` button');

  actual = enableExpirationDateApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `exp. date apply all` button');

  actual = enableSaveChanges;
  expected = true;
  t.equal(actual, expected, 'it should enable `save changes` button');

  actual = Object.keys(uploadedFiles).length;
  expected = Object.keys(files).length;
  t.equal(actual, expected, 'it should have correct count of uploaded files');

  t.end();
});

test('Uploader selector - files successfully uploaded but no active file', (t) => {
  const activeFile = undefined;
  const files = {
    file1: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    file2: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    file3: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
  };

  const dirtyFormData = { ...initialFormData,
    values: {
      title: 'title2',
      credit: {
        value: 'credit2',
      },
      expiresAt: new Date('December 17, 2022 03:24:00'),
    } };

  const mockState = {
    ...mockFormState(activeFile, dirtyFormData),
    ...mockDamState(mockDamFiles(activeFile, files)),
    ...mockRest(),
  };
  const {
    activeHashName,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    enableSaveChanges,
    uploadedFiles,
  } = selector(mockState);

  let actual = activeHashName;
  let expected = null;
  t.equal(actual, expected, 'it should have no active file');

  actual = enableCreditApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `credit apply all` button');

  actual = enableExpirationDateApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `exp. date apply all` button');

  actual = enableSaveChanges;
  expected = false;
  t.equal(actual, expected, 'it should disable `save changes` button');

  actual = Object.keys(uploadedFiles).length;
  expected = Object.keys(files).length;
  t.equal(actual, expected, 'it should have correct count of uploaded files');

  t.end();
});

test('Uploader selector - all files uploaded except active file', (t) => {
  const activeFile = 'file2';
  const files = {
    file1: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    // mock an active file that has error
    file2: {
      status: fileUploadStatuses.ERROR,
      error: new Error('error'),
    },
    file3: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    file4: {
      status: fileUploadStatuses.COMPLETED,
    },
  };

  const dirtyFormData = { ...initialFormData,
    values: {
      title: 'title2',
      credit: {
        value: 'credit2',
      },
      expiresAt: new Date('December 17, 2021 03:24:00'),
    } };

  const mockState = {
    ...mockFormState(activeFile, dirtyFormData),
    ...mockDamState(mockDamFiles(activeFile, files)),
    ...mockRest(),
  };
  const {
    activeHashName,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    enableSaveChanges,
    uploadedFiles,
  } = selector(mockState);

  let actual = activeHashName;
  let expected = activeFile;
  t.equal(actual, expected, 'it should have an active file');

  actual = enableCreditApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `credit apply all` button');

  actual = enableExpirationDateApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `exp. date apply all` button');

  actual = enableSaveChanges;
  expected = false;
  t.equal(actual, expected, 'it should disable `save changes` button');

  actual = Object.keys(uploadedFiles).length;
  expected = Object.values(files).filter(({ error, status }) => !error && status === fileUploadStatuses.COMPLETED).length;
  t.equal(actual, expected, 'it should have correct count of uploaded files');

  t.end();
});

test('Uploader selector - all files NOT uploaded except active file', (t) => {
  const activeFile = 'file2';
  const files = {
    file1: {
      status: fileUploadStatuses.ERROR,
      error: new Error('error'),
    },
    // mock an active file that is uploaded
    file2: {
      status: fileUploadStatuses.COMPLETED,
      error: false,
    },
    file3: {
      status: fileUploadStatuses.ERROR,
      error: new Error('error'),
    },
    file4: {
      status: fileUploadStatuses.ERROR,
      error: new Error('error'),
    },
  };

  const dirtyFormData = { ...initialFormData,
    values: {
      title: 'title2',
      credit: {
        value: initialCredit,
      },
    } };

  const mockState = {
    ...mockFormState(activeFile, dirtyFormData),
    ...mockDamState(mockDamFiles(activeFile, files)),
    ...mockRest(),
  };
  const {
    activeHashName,
    enableCreditApplyAll,
    enableExpirationDateApplyAll,
    enableSaveChanges,
    uploadedFiles,
  } = selector(mockState);

  let actual = activeHashName;
  let expected = activeFile;
  t.equal(actual, expected, 'it should have an active file');

  actual = enableCreditApplyAll;
  expected = false;
  t.equal(actual, expected, 'it should disable `credit apply all` button');

  actual = enableExpirationDateApplyAll;
  expected = true;
  t.equal(actual, expected, 'it should enable `exp. date apply all` button');

  actual = enableSaveChanges;
  expected = true;
  t.equal(actual, expected, 'it should enable `save changes` button');

  actual = Object.keys(uploadedFiles).length;
  expected = Object.values(files).filter(({ error, status }) => !error && status === fileUploadStatuses.COMPLETED).length;
  t.equal(actual, expected, 'it should have correct count of uploaded files');

  t.end();
});
