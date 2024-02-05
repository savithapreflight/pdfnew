 /* eslint-disable */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Axios} from '../API-Axios/axios'
import { apiKeys } from '../API-Axios/endpoint';

export const LoginRequest = async (name, password) => {
  try {
    const body = {
      username: name,
      password: password,
    };
    const response = await Axios.post(apiKeys.loginkey, body);
    console.log(response.data, 'response in LoginRequest -----');
    const Data = {
      token: response.data.token,
     
      expiration: response.data.expiration,
      userName: name || '',
    };
    const jsonValue = JSON.stringify(Data);
    console.log("jsonvalue",jsonValue)
    await AsyncStorage.setItem('@auth', jsonValue);

    return {data: Data, message: ''};
  } catch (error) {
    let err;
    if (error.isAxiosError) {
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.errors && responseData.errors.Username) {
          err = responseData.errors.Username[0]; // Grab the first error message
        } else {
          err = 'An unknown validation error occurred';
        }
        console.log('Axios response data:', responseData);
      } else {
        err = 'An Axios error occurred';
        console.log('Axios error without response:', err);
      }
    } else if (error.request) {
      err = 'Request error';
      console.log('Request error from LoginRequest:', err);
    } else {
      err = error;
      console.log('Other error from LoginRequest:', err);
    }
    throw { error: false, data: '', message: err };
  }
  
};

// catch (error) {
//     let err;
//     if (error.isAxiosError) {
//       err = error.response?.data || 'Login Faild,Try Again';
//     //   console.log('error from LoginRequest response');
//     console.log('Axios error from LoginRequest:', err);
//     } else if (error.request) {
//       err = error.request;
//       console.log('Request error from LoginRequest:', err);
//     } else {
//       err = error;
//       console.log('Other error from LoginRequest:', err);
//     }
//     console.log(err, 'error from LoginRequest');
//     throw {error: false, data: '', message: err};
//   }