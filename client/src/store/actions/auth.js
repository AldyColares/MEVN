import axios from 'axios';

import * as actionsTypes from './actionTypes';

export const authStart = () => {
  return {
    type: this.actiontypes.AUTH_START
  };
};

export const authSuccess = (token, userId, typeUser) => {
  return {
    type: actionsTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId,
    typeUser: typeUser
  };
};

export const authFail = (error) => {
  return {
    type: actionsTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationsDate');
  localStorage.removeItem('userId');
  localStorage.removeItem('typeUser');
  return {
    type: actionsTypes.AUTH_LOGOUT
  };
}

export const checkAuthTimeout = (expirationsTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationsTime * 1000);
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
      dispatch(authStart());
      const authData = {
          email: email,
          password: password,
          returnSecureToken: true
      };
      let url = 'https:';
      if (!isSignup) {
          url = 'https:';
      }
      axios.post(url, authData)
          .then(response => {
              console.log(response);
              const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
              localStorage.setItem('token', response.data.idToken);
              localStorage.setItem('expirationDate', expirationDate);
              localStorage.setItem('userId', response.data.localId);
              localStorage.setItem('typeUser', response.data.typeUser);
              dispatch(authSuccess(response.data.idToken, response.data.localId));
              dispatch(checkAuthTimeout(response.data.expiresIn));
          })
          .catch(err => {
              dispatch(authFail(err.response.data.error));
          });
  };
};


export const setAuthRedirectPath = (path) => {
  return {
    type: actionsTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');

    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expiratinDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};
