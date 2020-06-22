import { updateObject } from '../utility';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
	accessToken: null,
	loading: false
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START:
			return updateObject(state, { loading: true });
		case actionTypes.AUTH_FAIL:
			return updateObject(state, { loading: false });
		case actionTypes.AUTH_SUCCESS:
			return updateObject(state, { loading: false, accessToken: action.accessToken });
		case actionTypes.CHANGE_ACCESS_TOKEN:
			return updateObject(state, { accessToken: action.accessToken });
		default:
			return state;
	}
};

export default reducer;
