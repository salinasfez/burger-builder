//setting up authenthication
import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
}
}
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}
//log out

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
}

//async

export const auth = (email, password, isSignedUp) => {
    return dispatch => {
        //autheticate the user
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCEWgEowj9r9T6cZjirC49MCj_BeBLJtZo";
        if (!isSignedUp) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCEWgEowj9r9T6cZjirC49MCj_BeBLJtZo';
        }
        axios.post(url, authData)
        .then(response => {
            console.log(response);
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            //in order for the auth state to persist
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
        })
        .catch(err => {
            console.log(err);
            dispatch(authFail(err.response.data.error))
        })
    }
}

export const setAuthRedirectPath = (path) => {
    return{
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () => {
    return dispatch => {
            const token = localStorage.getItem('token');
            if(!token){
                dispatch(logout())
            }
            else{
                //new Date() will convert into a date object because we're getting a string
                const expirationDate = new Date(localStorage.getItem('expirationDate'));
                if (expirationDate <= new Date()){
                    dispatch(logout());
                }
                else {
                    const userId = localStorage.getItem('userId');
                    dispatch(authSuccess(token, userId));
                    dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
                }
            }
        }
    }