export const all_rights = {
	CUSTOMER_ACCESS: 'customer',
	ADMIN_ACCESS: 'admin',
	EMPLOYEE_ACCESS: 'employee'
};

export const checkRight = (rights, userRights) => {
	// rights can be a string with comma-separated or array of strings
	let rightArr = [];
	let userRightsArr = [];
	if (rights instanceof Array) {
		rightArr = rights;
	} else {
		rightArr = rights ? rights.split(',') : [];
	}
	if (userRights instanceof Array) {
		userRightsArr = userRights;
	} else {
		userRightsArr = userRights ? userRights.split(',') : [];
	}

	if (rightArr.length === 0) return true;

	return userRightsArr.some((itemU) => {
		return rightArr.some((item) => item === itemU);
	});
};
