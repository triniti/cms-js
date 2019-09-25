import md5 from 'md5';

export default (file) => md5(file.uniqueS3UploadUrlFilename);
