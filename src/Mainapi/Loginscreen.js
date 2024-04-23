/* eslint-disable */
import React, { useState, useContext, useRef,useEffect } from 'react';
import {
  View, 
  StyleSheet,
  TouchableOpacity,
  Alert,Image, ActivityIndicator,KeyboardAvoidingView
} from 'react-native';
import { Text } from '../components';
import { TextInput } from '../components';
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
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import { Block, Button } from '../components';
import RenderIf from '../components/renderIf';
import { _colors } from '../constants/css/colors';
import { loginAction } from '../redux/slices/authSlice';
import { addPersonalDetailsReducer } from '../redux/slices/profileSlice';



const backgroundImg = require('../assets/flightimage.png');
// const API_URL = 'http://122.166.251.167/Identity.API/Authentication/Login';
const API_URL='http://20.204.102.191/Identity.API/Authentication/Login'
const LoginScreen = () => { 
  const navigation = useNavigation();
  const {auth} = useSelector(_state => _state);
  const Dispatch = useDispatch();
  const {sizes,colors }= useTheme();

  const themeContext = useContext(ThemeContext);
  const { theme, Orientation, isDarkTheme, setIsLoggedInnValue ,isLoggedIn} = themeContext;

  const [username, setUsername] = useState('8500369');
  const [employeeCode, setEmployeeCode] = useState('Test@223');
  const [scanned, setScanned] = useState(false);
  const [sendOtp, setsendOtp] = useState(false);
  const [userName, setuserName] = useState('8502410');
  const [password, setpassword] = useState('Test@223');
  const [loading, setloading] = useState(false);
  const [emailId, setemailId] = useState('');
  const [showPassword, setshowPassword] = useState(false);
  const [authMode, setauthMode] = useState('login');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [backendError, setBackendError] = useState('');

  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const scannerRef = useRef(null);

  const _onPress = ({key,data})=>{
    const fun = {
      login:()=>LoginFun(),
      loginType:()=>setauthMode('login')
    };
    fun [key](data)
  }

  

  const LoginFun = async () => {
    // console.log('Start of LoginFun');
    // setUsernameError(null);
    // setPasswordError(null);
    // setBackendError(null);
  
    if (!userName || userName.length < 3) {
      setUsernameError('Please enter a valid username');
      return;
    }
  
    if (!password || password.length < 3) {
      setPasswordError('Please enter a valid Password');
      return;
    } 
    setloading(true);
    try { 
      await Dispatch(loginAction(userName, password));
      await Dispatch(addPersonalDetailsReducer(userName))
navigation.navigate('OFPLanding')
    } catch (e) {
      
      console.error('Error during login:', e);
      const errorMessage = e.message || 'An error occurred';
      setBackendError(errorMessage);
    }
  
    setloading(false);
  };
  
  
  
  const _onChange = ({key, data}) => {
    const fun = {
      nameInput: txt => setuserName(txt),
      passwordInput: txt => setpassword(txt),
      email: txt => setemailId(txt),
    };
    fun[key](data);
  };

  useEffect(() => {
    if (auth?.data?.token) {
console.log('auth token  passed')
      navigation.navigate('OFPLanding');
      
    }
  }, []);

  
  
  
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">


      <View style={styles.container}>   
      
      <View style={styles.bannerBlock}>
        <Image style={styles.img} source={backgroundImg} resizeMode="cover" />
      </View>
      <View style={styles.signInBlock}>
        <Block white margin={sizes.sm} radius padding>
          <Text alignSelf="center" h5 bold primary uppercase margin={sizes.s}>
            pilot app
          </Text>
          <Block
            height={2}
            primary
            width={'45%'}
            marginBottom={sizes.s}
            alignSelf="center"
          />
          <TextInput
            flex={1}
            value={userName}
            borderRadius
            h5
            row
            alignItems="center"
            placeholder="User ID"
            margin={sizes.s}
            // onChangeText={txt => _onChange({key: 'nameInput', data: txt})}
            onChangeText={(text) => setuserName(text)}
          />
          {usernameError ? <Text style={{ color: 'red' }}>{usernameError}</Text> : null}
          <RenderIf isTrue={authMode === 'register'}>
            <TextInput
              flex={1}
              h5
              value={emailId}
              row
              alignItems="center"
              borderRadius
              placeholder="Email ID"
              margin={sizes.s}
              onChangeText={txt => _onChange({key: 'email', data: txt})}
            />
          </RenderIf>
          <TextInput
            flex={1}
            h5
            row
            value={password}
            alignItems="center"
            borderRadius
            placeholder="Password"
            margin={sizes.s}
            password
            secure={!showPassword}
            onIconPress={() => setshowPassword(!showPassword)}
            onChangeText={(text) => setpassword(text)}
            // onChangeText={txt => _onChange({key: 'passwordInput', data: txt})}
          />
          {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
          <RenderIf isTrue={authMode === 'login'}>
            <Button
              center
              primary
              radius
              margin={sizes.s}
              onPress={() => _onPress({key: 'login'})}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text h5 white capitalize>
                  login
                </Text>
              )}
            </Button>
          </RenderIf>
          <RenderIf isTrue={authMode === 'register'}>
            <Button
              center
              primary
              radius
              margin={sizes.s}
              onPress={() => _onPress({key: 'signup'})}>
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text h5 white capitalize>
                  Sign Up
                </Text>
              )}
            </Button>
          </RenderIf>
          {/* <RenderIf isTrue={authMode === 'login'}>
            <Text alignSelf="center">
              Don't have account ?{' '}
              <Text
                p
                primary
                bold
                onPress={() => _onPress({key: 'registerType'})}>
                Register
              </Text>
            </Text>
          </RenderIf> */}
          {/* <RenderIf isTrue={authMode === 'register'}>
            <Text alignSelf="center">
              Do you have account ?{' '}
              <Text p primary bold onPress={() => _onPress({key: 'loginType'})}>
                Login
              </Text>
            </Text>
          </RenderIf> */}
        </Block>
      </View>
    </View>
     
    </KeyboardAvoidingView>
   
  );
};

const authenticateUser = async (username, password) => {
  console.log('fkgkl',username, password,)
  try {
    // console.log('asdfj',API_URL)
    const response = await axios.post(API_URL, {
      username: username,
      password:password,
    });
// console.log('response####################',response)
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
    flex: 0.7,
  },
  img: {width: '100%', height: '100%'},
  signInBlock: {
    width: '100%',
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
    borderColor: _colors.primary,
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
  },
  input: {
    height: '100%',
    paddingHorizontal: wp('1'),
    flex: 1,
    fontSize: 15,
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
    backgroundColor: _colors.primary,
  },
});

export default LoginScreen;



