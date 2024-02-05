/* eslint-disable */
import React, { useState, useContext, useRef,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,Image
} from 'react-native';
import { IS_IPAD, IS_TABLET, isTablet } from '../constants/index';
import { ThemeContext } from '../Utilis/ThemeManager';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../constants/colors';
import { getData, storeData } from '../Utilis/AsyncStorage';
import { LoginRequest } from '../api/authApi';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const backgroundImg = require('../assets/flightimage.png');
// const API_URL = 'http://122.166.251.167/Identity.API/Authentication/Login';
const API_URL='http://20.204.102.191/Identity.API/Authentication/Login'
const LoginScreen = () => { 
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext);
  const { theme, Orientation, isDarkTheme, setIsLoggedInnValue ,isLoggedIn} = themeContext;

  const [username, setUsername] = useState('8500369');
  const [employeeCode, setEmployeeCode] = useState('Test@223');
  const [scanned, setScanned] = useState(false);
  const [showPassword, setshowPassword] = useState(false);

  const scannerRef = useRef(null);

  const onSubmit = async(isQRLogin) => {
    try {
      setIsLoggedInnValue(true);
      storeData('isAutoLogin', 'true');
  
      let token;
  console.log(username,employeeCode)
      if (!isQRLogin) {
        console.log('class!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
         token = await authenticateUser(username, employeeCode);
        console.log("token", token)
        storeData('employeeCode', employeeCode);
        storeData('userName', username);
        global.userName = username;
        global.empCode = employeeCode
        
      navigation.navigate('OFPLanding')
      } else {
        console.log('name!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        global.userName = username
        global.empCode =employeeCode
        
      // navigation.navigate('OFPLanding')
         token = await authenticateUser(global.userName, global.empCode);
        console.log('token neededd',token)
        console.log('negative',global.userName)
         navigation.navigate('OFPLanding')
      }

      // navigation.navigate('Home');
  
      // Now you have the JWT token, you can use it for authenticated requests
      // For example, you can store it in AsyncStorage or use Redux to manage it globally.
    } catch (error) {
      console.error('Authentication error:', error.message);
      // Handle authentication error, show an error message, etc.
    }
    // setIsLoggedInnValue(true);
    // storeData('isAutoLogin', 'true');
    // if (!isQRLogin) {
    //   storeData('employeeCode', employeeCode);
    //   storeData('userName', username);
    //   global.userName = username;
    //   global.empCode = employeeCode;
    // }
  };

  // const handleLogin = async () => {
  //   try {
  //     const response = await LoginRequest(username, employeeCode);
  //    console.log("response", response)
  //   } catch (error) {
  //       console.error("Login error:", error); 
  //       Alert.alert('Error', 'Login failed. Please try again.');
  //   }
  // }

  
  

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
  useEffect(() => {
    console.log('login value ',isLoggedIn)
if(isLoggedIn){
// navigation.navigate('OFPLanding')
} 
},[isLoggedIn])
  
  return (
   
    <View style={styles.container}>
    <View style={styles.bannerBlock}>
      <Image style={styles.img} source={backgroundImg}   resizeMode='cover' />
    </View>
    <View color="rgb(245,245,245)"></View>
    <View style={styles.signInBlock}>
      <View style={styles.OptBlock}>
      <Text alignSelf="center" h1  style={{fontSize:24,color:'#007acc',fontWeight:'500'}}>
           PILOT APP
          </Text>
        {/* <TouchableOpacity
          style={[
            styles.optBtn,
           
          ]}
          onPress={() => {
           
          }}>
          <Text h5 bold primary  style={{color:"black"}}>PILOT APP
          </Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.inputBlock}>
        <View style={styles.inputBox}>
          <TextInput
            onChangeText={() => setUsername(value)}
            placeholder="User ID"
            style={styles.input}
            value={username}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            onChangeText={() => setEmployeeCode(value)}
            placeholder="Password"
            style={styles.input}
            value={employeeCode}
          />
        </View>
      </View>
      <View style={styles.btnBlock}>
        <View style={styles.mainBtn}>
      
          <TouchableOpacity
             style={styles.touchMainBtn}
            onPress={() =>  onSubmit(true) }>
            <Text h5 style={{color:'white',fontSize:20}} >
              Login
            </Text>
          </TouchableOpacity>
        </View>
       
     
   
      </View>
  {/* <TouchableOpacity
  style={{ marginTop: 20, width: '35%', justifyContent:'center', height: 35, backgroundColor: colors.DarkModeBtnInActiveBg ,alignContent:'center'}}
   onPress={onLoginByQR}
>
  <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', fontSize: 10 }}>Scan QR Code</Text>
</TouchableOpacity> */}
    </View>
    {/* {(scanned) && (
          <QRCodeScanner
            ref={(node) => { scanner = node; }}
          onRead={onSuccess}
           topContent={
              <Text style={styles.centerText}>
               <Text style={styles.textBold}>Scan the QR code</Text>
             </Text>
           }
        />
        )} */}
  
  </View>
   
  );
};

const authenticateUser = async (username, password) => {
  console.log('fkgkl',username, password,)
  try {
    console.log('asdfj',API_URL)
    const response = await axios.post(API_URL, {
      username: username,
      password:password,
    });
console.log('response####################',response)
    if (response.data && response.data.token) {
      return response.data.token; // Return the JWT token
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    console.log('error error ',error)
    throw error;
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240,240,240)',
  },
  bannerBlock: {
    backgroundColor: '#7FB6C6',
    // flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    flex: 0.65,
  },
  img: {width: '100%', height: '100%'},
  //   signIncontainer: {
  //     position: "absolute",
  //     top: hp("55"),
  //     width: "100%",
  //   },
  signInBlock: {
    backgroundColor: 'white',
    width: '88%',
    borderRadius: 8,
    alignSelf: 'center',
    paddingVertical: hp('3'),
    paddingHorizontal: wp('2'),
    position: 'absolute',
    bottom: hp('6'),
  },
  OptBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: hp('6'),
  },
  optBtn: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  active: {
    borderBottomWidth: 2,
     borderColor: '#007acc',
  },
  inputBlock: {
    marginVertical: hp('3'),
    paddingVertical: hp('1'),
    alignItems: 'center',
  },
  inputBox: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('1'),
     borderBottomWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: wp('0'),
    height: hp('5'),
   borderWidth: 1,
borderRadius:2
  },
  input: {
    height: '100%',
    paddingHorizontal: wp('1'),
    flex: 1,
    fontSize: 15,
    color:'black'
  },
  btnBlock: {
    width: '100%',
    alignItems: 'center',
  },
  mainBtn: {
    width: '90%',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: hp('1'),
  },
  touchMainBtn: {
    paddingVertical: hp('0.7'),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
   backgroundColor: '#007acc',
   height:40
  },
});

export default LoginScreen;



