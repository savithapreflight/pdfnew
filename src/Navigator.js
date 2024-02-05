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

  useEffect(() => {}, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="OFPLanding"
          component={OFPLanding}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="OFPComponent"
          component={OFPComponent}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    //  <NavigationContainer>
    // <Stack.Navigator>
    //         {isLoggedIn ? (
    //           <Stack.Screen name="OFPLanding" component={OFPLanding}  options={{ headerShown: false }} />
    //         ) : (
    //           <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    //         )}
    //         <Stack.Screen name="OFPComponent" component={OFPComponent} options={{ headerShown: false }} />
    //       </Stack.Navigator>
    // {/* {!isLoggedIn ?
    //     <Stack.Navigator screenOptions={{ headerShown: false }}>
    //         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    //     </Stack.Navigator>
    //     :
    //     <Stack.Navigator >
    //         <Stack.Screen name="OFPLanding" component={OFPLanding} options={{ headerShown: false }} />
    //     </Stack.Navigator>
    // }
    // <Stack.Screen name="OFPComponent" component={OFPComponent} options={{ headerShown: false }} /> */}
    // </NavigationContainer >
  );
};
