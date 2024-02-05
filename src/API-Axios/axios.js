 /* eslint-disable */
// import axios from 'axios';
// import { cacheAdapterEnhancer } from 'axios-extensions';
// import { API } from '../constants';

// const api = axios.create({
//     // cache will be enabled by default
//     adapter: cacheAdapterEnhancer(axios.defaults.adapter),
//     baseURL: API,
    
    
//     transformResponse: [function (data, headers) {

//         // console.log('axios api headers ==', headers);
//         // Do whatever you want to transform the data
//         const response = data instanceof Object ? data : JSON.parse(data);
//         console.log('axios api response ==', response);

//         // const { Message } = response;
//         // if (Message) {
//         //   throw new Error(Message)
//         // }
//         return response;
//     }],
// });


// export default api;


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = '';
const productionURL = '';
const testURL = 'http://20.204.102.191'

export const Axios = axios.create({
  baseURL: testURL,
});

Axios.interceptors.request.use(async config => {
  console.log('testr url',testURL)
  const jsonValue = await AsyncStorage.getItem('@auth');
  const user = await JSON.parse(jsonValue);
  console.log("user",user)
  if (user != null && config.headers['Authorization'] === undefined) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  
  return config;
});