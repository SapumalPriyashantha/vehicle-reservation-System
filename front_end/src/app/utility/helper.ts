import Swal, { SweetAlertResult } from 'sweetalert2';
import { ISWALAlert } from '../interface/ISWALAlert';

export const showSuccess = (
  object: ISWALAlert,
  callback?: () => void
): Promise<void | SweetAlertResult<any>> => {
  return Swal.fire(object.title, object.html ?? object.text, 'success').then(
    (result: SweetAlertResult) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    }
  );
};

export const showError = (
  object: ISWALAlert,
  callback?: () => void
): Promise<void | SweetAlertResult<any>> => {
  return Swal.fire({
    title: object.title,
    html: object.html ?? object.text,
    icon: 'error',
    confirmButtonText: object.confirmButtonText ?? 'Ok',
  }).then((result: SweetAlertResult) => {
    if (result.isConfirmed && callback) {
      callback();
    }
  });
};

export const showWarning = (
  obj: ISWALAlert,
  callback: (confirmed: boolean) => void
): Promise<void | SweetAlertResult<any>> => {
  return Swal.fire({
    title: obj.title ? obj.title : '',
    html: obj.html ?? obj.text,
    icon: 'warning',
    showCancelButton: obj.showCancelButton ?? false,
    confirmButtonText: obj.confirmButtonText ?? 'Yes',
    cancelButtonText: obj.cancelButtonText ?? 'No',
  }).then((result: SweetAlertResult) => {
    callback(result.isConfirmed);
  });
};

export const showQuestion = (
  obj: ISWALAlert,
  callback: (confirmed: boolean) => void
): Promise<void | SweetAlertResult<any>> => {
  return Swal.fire({
    title: obj.title,
    html: obj.html ?? obj.text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: obj.confirmButtonText ?? 'Yes',
    cancelButtonText: obj.cancelButtonText ?? 'No',
  }).then((result: SweetAlertResult) => {
    callback(result.isConfirmed);
  });
};
