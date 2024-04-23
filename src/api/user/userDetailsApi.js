import AsyncStorage from "@react-native-async-storage/async-storage";
import { Axios } from "../../API-Axios/config";
import { apiKeys } from "../../API-Axios/endpoint";
import { Alert } from "react-native";
import axios from "axios";

export const personalDetailsApi = async (userName) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await Axios.get(
        apiKeys.personalDetailsKey + userName + '?ModifiedDate=10/30/2022',
      );
      const Data = response.data;

      if (Data?.empCode) {
        await AsyncStorage.setItem('@userId', Data.empCode);
        
      }

      return { data: Data, message: '' };
    } catch (error) {
      console.error('Error from personalDetailsApi:', error);

      if (axios.isAxiosError(error)) {
        const responseStatus = error.response?.status;

        if (responseStatus === 404) {
          throw { error: true, data: null, message: 'User not found' };
        } else {
          throw { error: true, data: null, message: `Request failed with status code ${responseStatus}` };
        }
      } else {
        throw { error: true, data: null, message: 'Unexpected error' };
      }
    }
  }
  throw { error: true, data: null, message: 'Max retries reached' };
};



  
