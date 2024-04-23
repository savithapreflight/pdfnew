/* eslint-disable */
import React, {useState, useContext,useEffect} from 'react';
import {ThemeContext} from './Utilis/ThemeManager';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text, TouchableOpacity} from 'react-native';
import Login from './screens/Login';
import {getData, storeData} from './Utilis/AsyncStorage';
import OFPLanding from './screens/OFFLanding';
import {localDB} from './dbmanager/dbconstants';
import LoginScreen from './Mainapi/Loginscreen';
import {RvsmApi} from './api/rvsmApi';
import OFPComponent from './screens/OFP';
import App from '../App';
import {MainTableApi} from './api/mainTableApi';
import {
  onFetchMainFlightDetailsData,
  onUpdateMainFlightDetailsNetwork,
  onUpdateMainFlightRVSMDetails,
} from './dbmanager/main-flight-details-table';
import {onFetchMainRVSMData} from './dbmanager/main-rvsm-details-table';
import FuelSheet from './screens/pages/fuel';
import PdfDocuments from './pdf/dummypdf';
 import Sign from './pdf/Signature';
import Trimsheet from './pdf/Trimsheet';
import HTMLtoPDFExample from './pdf/html';
import PdfDesignTwo from './pdf/pdfDesignTwo';
import Signature from './pdf/Sign';
const Stack = createStackNavigator();


export default AppNavigator = () => {
  const themeContext = useContext(ThemeContext);
  const {isLoggedIn, setIsLoggedInnValue} = themeContext;
  console.log('AppNavigator isLoggedIn ==', isLoggedIn);
  console.log('isLoggedIn == false ', isLoggedIn, '!isLoggedIn==', !isLoggedIn);

  const getAsyncValue = async () => {
    const value = await getData('isAutoLogin');
    const userid = await getData('employeeCode');
    global.userID = userid;

    global.userName =
      (await getData('userName')) != null ? await getData('userName') : '';
    global.empCode =
      (await getData('employeeCode')) != null ? getData('employeeCode') : '';

    console.log('global userID', global.userID);
    console.log('value====', value);
    if (value !== null) {
      setIsLoggedInnValue(value == 'true' ? true : false);
    }
  };
  getAsyncValue();
  const updateValues = async () => {
    const sqlquery = `SELECT * FROM ${localDB.tableName.mainFlightPlanTable1} WHERE  isUpdated='1' AND isPushed='0'`;
    const mainFlightDetails = await onFetchMainFlightDetailsData(sqlquery);
    for (let index = 0; index < mainFlightDetails.length; index++) {
      const mainTableApi = await MainTableApi(mainFlightDetails[index]);
      if (mainTableApi.response == 'update') {
        const dataNeeded = await onUpdateMainFlightDetailsNetwork({
          ...mainFlightDetails[index],
          isPushed: 1,
        });
      }
    }
    const rvsmDetails = await onFetchMainRVSMData();

    const rvsmApi = await RvsmApi(rvsmDetails[0]);

    if (rvsmApi.response == 'update') {
      const dataNeeded = await onUpdateMainFlightRVSMDetails({
        ...rvsmDetails[0],
        isPushed: 1,
      });
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
     
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Pdf"
          component={Trimsheet}
          options={{headerShown: false}}
        />
    
        <Stack.Screen
          name="Sign"
          component={Sign}
          options={{headerShown: true,headerTitle: null }}
        />
        
        <Stack.Screen name="PDFTWO" component={PdfDesignTwo} />
      

        <Stack.Screen
          name="OFPLanding"
          component={OFPLanding}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Fuel Briefing"
          component={FuelSheet}
          options={{headerShown: true}}
        />

     
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};
