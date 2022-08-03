import Swal from 'sweetalert2';

// fixme: custom class is different now and general testing/adjustments

const defaults = {
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: false,
  stopKeydownPropagation: true,
  //keydownListenerCapture: true,
  customClass: 'swal-spinner',
  didOpen: () => {
    Swal.showLoading();
  },
  showConfirmButton: false,
  target: '.screen-main',
};

export default {
  show: (title = '') => {
    Swal.fire({ ...defaults, title });
  },

  update: (title) => {
    Swal.fire({ ...defaults, title });
  },

  close: Swal.close,
};
