/* eslint-disable */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        // saving error
        alert('Local storage failed');
    }
}

export const getData = async (key) => {
    try {

        const value = AsyncStorage.getItem(key);
        console.log('value', value);
        return value;
        // const value = await AsyncStorage.getItem(key)
        // console.log(`getData ${key} and value is ${value}`);
        // if (value !== null) {
        //     // value previously stored
        //     return value;
        // } else {
        //     return null;
        // }
    } catch (e) {
        // error reading value
        alert('Failed to get Local storage value');
    }
}


