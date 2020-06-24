import { notification } from 'antd';

export const toastSuccess = (message) => {
	notification.success({ message: message, placement: 'bottom' });
};

export const toastError = (message) => {
	notification.error({ message: message, placement: 'bottom' });
};

export const toastWarning = (message) => {
	notification.warning({ message: message, placement: 'bottom' });
};
