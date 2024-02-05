/* eslint-disable */
import React, { useEffect,useContext } from 'react';
import { ThemeProvider } from './src/Utilis/ThemeManager';
import {
  SafeAreaView,
  StatusBar,
  View,
  Dimensions,
  Text
} from 'react-native';
import { ThemeContext } from './src/Utilis/ThemeManager';
import { Provider } from 'react-redux';
import { DataStore,PersistDataStore } from './src/redux';
import AppNavigator from "./src/Navigator";
import { PersistGate } from 'redux-persist/integration/react';
import { useNavigation } from '@react-navigation/native';
const App = () => {
  

  

  return (
    <Provider store={DataStore}>
    <ThemeProvider>
    <PersistGate loading={null} persistor={PersistDataStore}>
    <View style={{ flex: 1 }}>
      
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <AppNavigator></AppNavigator>
      </SafeAreaView>
    </View>
    </PersistGate>
    </ThemeProvider>
    </Provider>
   
    
    
  );
};

export default App;
