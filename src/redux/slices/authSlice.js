 /* eslint-disable */
 import {createSlice} from '@reduxjs/toolkit';
 import { LoginRequest } from '../../api/authApi';
import { personalDetailsApi } from '../../api/user/userDetailsApi';
 
 import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearRosterTable } from '../../dbmanager/roster-table';


 
 
 const AuthSlice = createSlice({
   name: 'authentication',
   initialState: {
     loading: false,
     data: {},
     error: false,
     message: '',
   },
   reducers: {
     login: (state, {payload}) => {
       state.error = false;
       state.data = payload;
       state.loading = false;
       return state;
     },
     logOut: state => {
       state.error = false;
       state.data = {};
       state.loading = false;
       return state;
     },
     loading: (state, {payload}) => {
       state.loading = payload;
       return state;
     },
   },
 });
 
 export const {login, loading, logOut} = AuthSlice.actions;
 
 export const loginAction = (name, password) => {
  
  return async (dispatch) => {
    dispatch(loading(true));
    try {
      const response = await LoginRequest(name, password);
      let userData = response.data;
      console.log("ussseeerData",userData)
 
      if (!userData.empCode) {
        
        const personalDetailsResponse = await personalDetailsApi(userData.userName);
        console.log('personal  data ',personalDetailsResponse)
        userData = {
          ...userData,
          empCode: personalDetailsResponse.data.empCode,
empName:personalDetailsResponse.data.empName,
empNo:personalDetailsResponse.data.empNo
         
        };
        
      }

      

      // Set the "empcode" immediately upon successful login
      await AsyncStorage.setItem('@userIds', userData.empCode);
   

      dispatch(login(userData));
      console.log(userData, 'response in loginAction');
      return { error: false };
    } catch (error) {
      console.log(error, 'error in loginAction');
      dispatch(loading(false));
      // ToastMsg(error.message)
      
      // alert(error.message);
      // throw { error: true };
     
      return { error: true };
   
      throw { error: true, message: error.message };
      
    }
  };
};
export const loginError = (message) => {
  return (dispatch) => {
    dispatch({
      type: 'authentication/loginError',
      payload: { message },
    });
  };
};

export const logOutAction = () => {
  return async (dispatch) => {
   
    await AsyncStorage.clear();
    await AsyncStorage.removeItem('@auth');
   
    await AsyncStorage.removeItem('@userIds');
    clearRosterTable();
    dispatch(logOut());
    navigation.navigate('login');
  };
};
 


 
 
 

 
 
 export default AuthSlice.reducer;