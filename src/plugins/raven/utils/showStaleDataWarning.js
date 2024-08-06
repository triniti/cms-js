import Swal from 'sweetalert2';

export default async (nodeRef, username) => {
  if (Swal.isVisible()) {
    return;
  }

  await Swal.fire({
    title: 'STALE DATA',
    html: `<strong>${username}</strong> updated this ${nodeRef.getLabel()}.<br/>If you save, you may overwrite their changes.`,
    position: 'top-end',
    grow: 'row',
    icon: 'warning',
    toast: true,
    showCloseButton: true,
    showConfirmButton: false,
  });
};
