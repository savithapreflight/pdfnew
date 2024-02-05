 /* eslint-disable */
 import {createSlice} from '@reduxjs/toolkit';
 import { LoginRequest } from '../../api/authApi';
 import AsyncStorage from '@react-native-async-storage/async-storage';
 
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
    
   },
 });
 
 export const {login} = AuthSlice.actions;
 
 export const loginAction = (name, password) => {
   return async Dispatch => {
     Dispatch(loading(true));
     try {
       const response = await LoginRequest(name, password);
       Dispatch(login(response.data));
          console.log(response.data, 'response in loginAction');
          
        
       return {error: false};
     } catch (error) {
       console.log(error, 'error in  loginAction');
       Dispatch(loading(false));
       throw {error: true};
     }
   };
 };
 
 
 
 

 
 
 export default AuthSlice.reducer;