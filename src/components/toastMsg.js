import {ToastAndroid} from 'react-native';

const ToastMsg = msg => {
  ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER);
};

export default ToastMsg;
