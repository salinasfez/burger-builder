import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/'
}

const authStart = (state, action) => {
    //state is old state... {error: null} is whatever parts of the state youre going to update
    return updateObject(state, {error: null, loading: true})
}
//you have to change all the state in this case when authenthication is successful
const authSuccess = (state, action) => {
    return updateObject(state, { 
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
    })
}
const authFail = (state, action) => {
    return updateObject(state, {error: action.error, loading: false})
}
//logout
const authLogout = (state, action) => {
    return updateObject(state, {
        token: null, userId: null
    });
}
const setAuthRedirectPath = (state, action) => {
    return updateObject(state, {authRedirectPath: action.path})
}


const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
        default: return state;
    }
}

export default reducer;