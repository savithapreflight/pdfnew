

import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { IS_IPAD, IS_TABLET, isTablet } from '../constants/index';
import { ThemeContext } from '../Utilis/ThemeManager';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../constants/colors';
import { getData, storeData } from '../Utilis/AsyncStorage';

const Login = () => {
  const themeContext = useContext(ThemeContext);
  const { theme, Orientation, isDarkTheme, setIsLoggedInnValue } = themeContext;

  const [username, setUsername] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [scanned, setScanned] = useState(false);

  const scannerRef = useRef(null);

  const onSubmit = (isQRLogin) => {
    setIsLoggedInnValue(true);
    storeData('isAutoLogin', 'true');
    if (!isQRLogin) {
      storeData('employeeCode', employeeCode);
      storeData('userName', username);
      global.userName = username;
      global.empCode = employeeCode;
    }
  };

  /**
     * 
     * @param {*} e 
     * @returns 
     */


  const onSuccess = (e) => {
    if (e.data.includes('Emp. Code')) {
      setScanned(true);
      var userData = e.data;
      userData = userData.replace(/\n/g, ':');
      let userDataArr = userData.split(':');
      let userName = userDataArr[1];
      let empCode = userDataArr[9];
      global.userName = userName;
      global.empCode = empCode;
      onSubmit(true);
      return;
    } else {
      Alert.alert(
        'Error',
        'No Emp. Code Detected',
        [
          {
            text: 'Scan again',
            onPress: () => scannerRef.current.reactivate(),
          },
        ]
      );
    }
  };

  const onLoginByQR = () => {
    setScanned(true);
  };
  return (
    // <View style={{ ...[styles[`container${theme}`]], flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.White }}>
    //   {(!scanned) && (
    //     <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
    //       <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', fontSize: 30, }}>LOGIN</Text>
    //       <TextInput
    //         placeholder='User Name'
    //         style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], textAlign: 'left', marginTop: 30, paddingLeft: 10, height: 40, borderColor: colors.LighterGrey, borderWidth: 2, fontWeight: 'bold', fontSize: 20, width: '60%' }}
    //         onChangeText={(text) => setUsername(text)}
    //       />
    //       <TextInput
    //         placeholder='Employee Number'
    //         style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], textAlign: 'left', marginTop: 10, paddingLeft: 10, height: 40, borderColor: colors.LighterGrey, borderWidth: 2, fontWeight: 'bold', fontSize: 20, width: '60%' }}
    //         onChangeText={(text) => setEmployeeCode(text)}
    //       />
    //       <TouchableOpacity
    //         style={{ marginTop: 30, width: '35%', height: 35, justifyContent: 'center', backgroundColor: colors.DarkModeBtnInActiveBg }}
    //         onPress={() => {              
    //           if (username === '' || employeeCode === '') {
    //             Alert.alert(   
    //               'Alert',
    //               'Please enter username and employee code',
    //               [
    //                 {
    //                   text: 'Cancel',
    //                   onPress: () => console.log('Cancel Pressed'),
    //                   style: 'cancel',
    //                 },
    //                 { text: 'OK', onPress: () => console.log('OK Pressed') },
    //               ]
    //             );
    //           } else {
    //             onSubmit(false);
    //           }
    //         }}
    //       >
    //         <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', fontSize: 20 }}>Submit</Text>
    //       </TouchableOpacity>
    //       <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
    //         <View style={{ height: 0.5, width: '20%', backgroundColor: colors.LighterGrey }} />
    //         <Text style={{ marginHorizontal: 15, ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', fontSize: 20 }}>OR Login By QR Code</Text>
    //         <View style={{ height: 0.5, width: '15%', backgroundColor: colors.LighterGrey }} />
    //       </View>
    //       <TouchableOpacity
    //         style={{ marginTop: 20, width: '35%', justifyContent: 'center', height: 35, backgroundColor: colors.DarkModeBtnInActiveBg }}
    //         onPress={onLoginByQR}
    //       >
    //         <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', fontSize: 20 }}>Scan QR Code</Text>
    //       </TouchableOpacity>
    //     </View>
    //   )}
    //   {(scanned) && (
    //     <QRCodeScanner
    //       ref={(node) => { scanner = node; }}
    //       onRead={onSuccess}
    //       topContent={
    //         <Text style={styles.centerText}>
    //           <Text style={styles.textBold}>Scan the QR code</Text>
    //         </Text>
    //       }
    //     />
    //   )}
    // </View>
     <View style={styles.container}>
     <View style={styles.bannerBlock}>
       {/* <Image style={styles.img} source={backgroundImg} resizeMode="cover" /> */}
     </View>
     <View color="rgb(245,245,245)"></View>
     <View style={styles.signInBlock}>
       <View style={styles.OptBlock}>
         <TouchableOpacity
           style={[
             styles.optBtn,
             registerStage === 'sign-in' && styles.active,
           ]}
           onPress={() => {
             setRegisterStage('sign-in');
             setsendOtp(false);
           }}>
           <Text h5 bold primary>
             CREW PORTAL
           </Text>
         </TouchableOpacity>
       </View>
       <View style={styles.inputBlock}>
         <View style={styles.inputBox}>
           <TextInput
             onChangeText={() => {}}
             placeholder="User ID"
             style={styles.input}
           />
         </View>
         <View style={styles.inputBox}>
           <TextInput
             onChangeText={() => {}}
             placeholder="Password"
             style={styles.input}
           />
         </View>
       </View>
       <View style={styles.btnBlock}>
         <View style={styles.mainBtn}>
           <TouchableOpacity
             style={styles.touchMainBtn}
             onPress={() => _onPress({key: 'login'})}>
             <Text h5 white>
               Login
             </Text>
           </TouchableOpacity>
         </View>
       </View>
     </View>
   </View>
  );
};

const styles = StyleSheet.create({

  containerLight: {
      flex: 1,
      backgroundColor: colors.White
  },
  containerDark: {
      flex: 1,
      backgroundColor: colors.Black
  },
  textStyleLight: {
      color: colors.Black,
      textAlign: 'center',
  },
  textStyleDark: {
      color: colors.FluorescentGreen,
      textAlign: 'center',
  },
  textSizePortrait: {
      // fontSize: 14,
      fontSize: (isTablet) ? 14 : 6
  },
  textSizeLandscape: {
      // fontSize: 18,
      fontSize: (isTablet) ? 18 : 14
  }
})

export default Login;
