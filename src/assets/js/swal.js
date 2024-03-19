import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.6/+esm'

export function toast (state = 'error', title = '') {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: false
  })
  Toast.fire({
    icon: state ? 'success' : 'error',
    title
  })
}

export function removeAlert () {
  return Swal.fire({
    title: '你確定刪除嗎?',
    text: '刪除後無法恢復',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '刪除',
    cancelButtonAriaLabel: '取消',
    reverseButtons: true
  })
}

export function alert (state = 'error', text = '') {
  return Swal.fire({
    icon: state ? 'success' : 'error',
    text,
    showConfirmButton: false,
    timer: 1500
  })
}
