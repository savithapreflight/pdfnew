

import {Axios} from '../API-Axios/axios'
import { apiKeys } from '../API-Axios/endpoint';

export const RvsmApi = async (rvsmDetails) => {
    const {ALT1,ALT2,FlightNumber,STBYALT,Sector,Time}=rvsmDetails
    console.log('RDGJKL;',ALT1)
    try {
      const body = {
        FlightNumber:FlightNumber,
        ALT1:ALT1,
        STBYALT: STBYALT,
        ALT2: ALT2,
        Sector:Sector,
        Time:Time,

      };
    //   const response = await Axios.post(apiKeys.loginkey, body);
         return {response:"update"};
    } catch (error) {
      let err;
      if (error.isAxiosError) {
        if (error.response) {
         
          console.log('Axios response data:', responseData);
        } else {
          err = 'An Axios error occurred';
          console.log('Axios error without response:', err);
        }
      } else if (error.request) {
        err = 'Request error';
        console.log('Request error from Request:', err);
      } else {
        err = error;
        console.log('Other error from Request:', err);
      }
      throw { error: false, data: '', message: err };
    }
    
  };



