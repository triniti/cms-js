import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  //grow: 'column',
  position: 'top-end',
  showConfirmButton: false,
  //target: '.screen-main',
  timer: 3000,
  timerProgressBar: false,
});

export default options => {
  Toast.fire({ icon: 'success', ...options });
};
