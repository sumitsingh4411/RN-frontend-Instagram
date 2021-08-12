import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOGIN_FAIL,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
} from '../../../constants/actionTypes';
import axiosInstance from '../../../helpers/axiosInstance';

export default ({ password, email }) => (dispatch) => {
  dispatch({
    type: LOGIN_LOADING,
  });
  axiosInstance
    .post('https://rnbackendinsta.herokuapp.com/user/login', {
      password,
      email
    })
    .then((res) => {
      AsyncStorage.setItem('token', res.data.refreshtoken);
      AsyncStorage.setItem('user', JSON.stringify(res.data.refreshtoken));
      AsyncStorage.setItem('email', JSON.stringify(email));
  dispatch({
    type: LOGIN_SUCCESS,
    payload: res.data,
  });
})
    .catch ((err) => {
  dispatch({
    type: LOGIN_FAIL,
    payload: err.response
      ? (err.response.data || err.response.data.msg)
      : { error: 'Something went wrong, try agin' },
  });
});
};
