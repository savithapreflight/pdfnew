/* eslint-disable */
import { Dimensions, Platform } from 'react-native';
import Device from 'react-native-device-detection';
import DeviceInfo from 'react-native-device-info';
export const DeviceWidth = Dimensions.get('window').width;
export const DeviceHeight = Dimensions.get('window').height;
export const API_VERSION = '';
export const IS_IPAD = Platform.isPad;
export const IS_TABLET = Device.isTablet;
export const isTablet = DeviceInfo.isTablet();
export const isAndroid = Platform.OS === 'android' ? true : false;
export const API = 'http://122.166.251.167';
//https://plot-app.onrender.com/api/mainFlightPlan
