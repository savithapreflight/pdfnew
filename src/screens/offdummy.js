/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import {
    Alert,
    View,
    Text,
    FlatList,                                       
    StyleSheet,
    TouchableOpacity,
   Dimensions
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Spinner from 'react-native-loading-spinner-overlay';
import { API } from '../constants';
import { PermissionsAndroid } from 'react-native'
import { ThemeContext } from '../Utilis/ThemeManager';
import { IS_IPAD, IS_TABLET, isTablet, isAndroid } from '../../src/constants';
import api from '../API-Axios/axios';
import colors from '../constants/colors';
import { storeData } from '../Utilis/AsyncStorage';
import HeaderComp from './Components/HeaderComp';
import VoyageRepComp from './Components/VoyageReportComp';
import TechLogComp from './Components/TechLogComp';
import TechLogCompNew from './Components/TechLogCompNew';
import { onCreateMainFlightDetailsTable, onFetchMainFlightDetailsData, onInsertMainFlightDetailsData } from '../dbmanager/main-flight-details-table';
import { onCreateALTFlightDetailsTable, onFetchALTFlightDetailsData, onInsertALTFlightDetailsData } from '../dbmanager/alt-flight-details-table';
import { onCreateAltFlightRVSMTable } from '../dbmanager/alt-rvsm-details-table';
import { onCreateMainRVSMTable } from '../dbmanager/main-rvsm-details-table';
import { onCreateFaultReportTable } from '../dbmanager/fault-report-table';
import { useNavigation } from '@react-navigation/native';
import Details  from '../screens/Latest'
import NetwotkAccess from '../Utilis/NetworkAccess';
import YourComponent, { InsertData, createTableAndInsertData, insertDataToTable, insertrosterData, logTableLength, onCreateRosterTable, onFetchRosterData } from '../dbmanager/roster-table';
import { openDatabase } from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';
import { getRosterDetailsApi } from '../api/rosterApi';
import { apiKeys } from '../API-Axios/endpoint';
import { Axios } from '../API-Axios/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const OFPLanding = ( props ) => {
 createTableAndInsertData();
 InsertData();
 logTableLength();
  const navigation = useNavigation()
    const themeContext = useContext(ThemeContext);
    const { theme, OFPData, Orientation, setOFPDataMethod, headerClickedIndex } = themeContext;
    const [headerSelectedIndex, setHeaderSelectedIndex] = useState(0);
    const [subHeaderSelectedIndex, setSubHeaderSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [allFlights, setAllFlights] = useState([]);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [scanned, setScanned] = useState(false);
    const [flightNo,setFlightNo] = useState('');
    const [depart,setDepart] = useState('');
    const [arriv,setArriv] = useState('');
    const [acType,setAcType] = useState('');
    const [acR,setAcR] = useState('');
    const [etA,setEtA] = useState('');
    const [etD,setEtD] = useState('');

    
    const handlefuel = (flightNo, depart,arriv,acType) => {
      console.log(`Handling fuel for Flight ${flightNo} departing from ${depart},${arriv}`);
      navigation.navigate('Fuel Briefing', { flightNo, depart,arriv,acType });
    };
    useEffect(()=>{
      fetchData();
    })


    const openDatabase = () => {
      return new Promise((resolve, reject) => {
        const db = SQLite.openDatabase({ name: 'Database.db', createFromLocation: 1 }, resolve, reject);
      });
    };
  
    

    const rosterdata =  async () => {
  
      const authData = await AsyncStorage.getItem('@auth');
      const authObject = JSON.parse(authData);
      const tokens = authObject?.token
        
          try {
             
            const empCode = await AsyncStorage.getItem('@userIds');
            console.log(empCode, "empcode");

            
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            // Start Date (today's date)
            const startDate = `${String(currentMonth).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}/${currentYear}`;

            // End Date (today's date)
            const endDate = startDate;

            // Modified Date (yesterday's date in the previous year)
            const lastDateOfPreviousYear = new Date(currentYear - 1, currentMonth - 1, currentDate.getDate());
            const modifiedDate = `${String(lastDateOfPreviousYear.getMonth() + 1).padStart(2, '0')}/${String(lastDateOfPreviousYear.getDate()).padStart(2, '0')}/${currentYear - 1}`;

            console.log("Start Date:", startDate);
            console.log("End Date:", endDate);
            console.log("Modified Date:", modifiedDate);


           
            const token = tokens
            
            const apiUrl = `http://20.204.102.191/cstar.API/RosterAppDetails/${empCode}?StartDate=${startDate}&EndDate=${endDate}&ModifiedDate=${modifiedDate}`;
            console.log(apiUrl,"roster url")
            
            
            const response = await Axios.get(apiUrl, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
       
            if (response.status === 200) {
              const data = response.data;
              console.log("Response data roster:", data);
              const today = new Date().toISOString().split('T')[0];
              const filteredData = data.filter(item => item.flightDate.split('T')[0] === today);

              // console.log("Response data for today's flights:", filteredData);

              const flightNos = filteredData.map(item => item.flightNo);
              const departure = filteredData.map(item => item.flightFrom);
              const arrival = filteredData.map(item => item.flightTo);
              const aircraft = filteredData.map(item => item.aircraftType);
              // console.log("Flight Numbers for today's flights:", flightNos);
              setFlightNo(flightNos)
              setDepart(departure);
              setArriv(arrival);
              setAcType(aircraft);


  return filteredData;
 
            } else {
              console.error('Error fetching data. Unexpected response:', response.status);            
              return null; 
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            return null; 
          }
        };


        const fetchData = async () => {
          const rosterDataResult = await rosterdata();
          if (rosterDataResult !== null) {
            // If rosterdata is successful, update state and call loadsheet
            setDepart(rosterDataResult.map(item => item.flightFrom));
            setArriv(rosterDataResult.map(item => item.flightTo));
            setFlightNo(rosterDataResult.map(item => item.flightNo));
            setAcType(rosterDataResult.map(item => item.aircraftType));
          }
        };
        
        useEffect(() => {
          fetchData();
        }, []); // Empty dependency array to ensure the effect runs only once on mount
        
        useEffect(() => {
          if (depart.length > 0 && arriv.length > 0 && flightNo.length > 0) {
            // If depart, arriv, and flightNo have values, call loadsheet
            loadsheet();
          }
        }, [depart, arriv, flightNo]); // Run this effect whenever depart, arriv, or flightNo change
        
        


        const loadsheet = async () => {
          console.log('acreg')
          const authData = await AsyncStorage.getItem('@auth');
          const authObject = JSON.parse(authData);
          const tokens = authObject?.token;
        
          try {
            const currentDate = new Date().toISOString().split('T')[0] + 'T00:00:00';
            const etaValues = [];  
            const acreg = [];
            const etdValues =[];
        
            for (let i = 0; i < depart.length; i++) {
              const source = depart[i];
              const destination = arriv[i];
              const flightno = flightNo[i];
              console.log(source, "sourcesss");
        
              const apiUrl = `http://20.204.102.191/lOADSHEET.API/LoadSheet/FlightData?FlightDate=${currentDate}&FlightNo=${flightno}&Source=${source}&Destination=${destination}`;
              console.log(apiUrl, "urlll");
        
              const token = tokens;
        
              const response = await axios.get(apiUrl, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
        
              if (response.status === 200) {
                const data = response.data;
                console.log(data, "data loadsheet");
        
                // Extract and log the eta value from each data item
                data.forEach(item => {
                  // const eta = item.eta;
                  const etaDate = new Date(item.eta);
                  const hours = etaDate.getHours().toString().padStart(2, '0');
                  const minutes = etaDate.getMinutes().toString().padStart(2, '0');
                  const eta = `${hours}:${minutes}`;
                  const etdDate = new Date(item.etd);
                  const hoursetd = etdDate.getHours().toString().padStart(2, '0');
                  const minutesetd = etdDate.getMinutes().toString().padStart(2, '0');
                  const etd = `${hoursetd}:${minutesetd}`;
                  const reg = item.regnNo;
                  console.log(`ETA for Flight ${flightno}: ${eta} : ${etd}`);
                  etaValues.push(eta); 
                  etdValues.push(etd)
                  acreg.push(reg) // Store eta values in the array
                });
              } else {
                console.error('Error fetching data. Unexpected response:', response.status);
              }
            }
        
            console.log("All ETA Values:", etaValues); 
            console.log('all etd',etdValues)
            console.log('all regno',acreg)
            console.log(acreg[0],"0thacreg") 
            setAcR(acreg);
            setEtA(etaValues);
            setEtD(etdValues);
            console.log("eta 0th value",etaValues[0])
            console.log('etd',etdValues[1])
        
            return etaValues;  // Return the array of all eta values
          } catch (error) {
            console.error('Error fetching data acreg:', error);
            return null;
          }
        };
        
        
        
        



    /**
   * Request external storage read permission
   * @returns {boolean} granted
   */
  const requestExternalStoreageRead = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          'title': 'Cool App ...',
          'message': 'App needs access to external storage',
        }
      );
      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      //Handle this error
      return false;
    }
  };

    useEffect(()=>{
   
   
        global.voyReportOff = '0:00';
        global.voyReportOn = '0:00';
        global.screen = '';
        global.screenHeadder = '';
        global.activeFlightNumber = '';
    
        console.log('OFPLanding Name===', global.userName);
        console.log('OFPLanding empCode===', global.empCode);
    
        // const themeContext = useContext(ThemeContext)
        console.log('theme==', themeContext.theme);
        console.log('details',Details)
        syncAllData();
    
        const focusListener = navigation.addListener('focus', () => {
          loadInitialData();
          requestExternalStoreageRead();
    
          if (global.screen === 'techlog') {
            global.screen = '';
            handleHeaderIndexChange('SUBHEADER', 4);
          } else if (global.screen === 'voy') {
            global.screen = '';
            handleHeaderIndexChange('SUBHEADER', 3);
          }
        });

        const isPortrait = () => {
          const dim = Dimensions.get('screen');
          return dim.height >= dim.width;
        };

        themeContext.setOrientationValue(isPortrait() ? 'Portrait' : 'Landscape');

         // Event Listener for orientation changes
         Dimensions.addEventListener('change', () => {
            themeContext.setOrientationValue(isPortrait() ? 'Portrait' : 'Landscape');
        });
    },[])
        


      // Helper function to set the selected header index
  const handleHeaderIndexChange = (clickedType, selectedIndex) => {
    console.log('clickedType!!!!!!!=', clickedType, 'selectedIndex ==', selectedIndex);

    switch (clickedType) {
      case "HEADER":
        setHeaderSelectedIndex(selectedIndex);
        break;
      case "SUBHEADER":
        setScanned(false);
        if (selectedIndex === 7) {
          syncAllData();
        }
        setSubHeaderSelectedIndex(selectedIndex
        //   , () => {
        //   if(selectedIndex === 4){
        //       global.screenHeadder = 'techlog';
        //   } else if(selectedIndex === 3){
        //       global.screenHeadder = 'voy'
        //   }
        // }
        );
        console.log(' setSubHeaderSelectedIndex', subHeaderSelectedIndex)
        //Alert.alert("Data", ""+subHeaderSelectedIndex);
        break;
    }
  };

// Sync data function
  const syncAllData = async () => {
 
    try {
       setLoading(true);

      await onCreateMainFlightDetailsTable();
      await onCreateALTFlightDetailsTable();
     await onCreateMainRVSMTable();
    await onCreateAltFlightRVSMTable();


      // const { data, status, statusText } = await api.get(API + '/Latest_CFP.json', '')
const arrDetails=[Details]
console.log('detailss',arrDetails)
        const newModifiedFlightData = createJsonWithStatus(arrDetails);
      


      //Use this data throughout the app
      // themeContext.setOFPDataMethod(data);

      // const { MAINFLTPLAN, ALT1FP } = data.FLIGHTFOLDER.OPR_ID[0];
// console.log('details needede needed ',Details)
       const insertTable = await onInsertMainFlightDetailsData(newModifiedFlightData.MAINFLIGHTDATA);
       const insertAltFlightTable = await onInsertALTFlightDetailsData(newModifiedFlightData.ALTFLIGHTDATA);

    const sql = `SELECT DISTINCT FlightNumber,Sector,Status,ApproachTime FROM mainFlightFlightPlanTable1 ORDER BY LOWER(FlightNumber)`
      const allFlightDetails = await onFetchMainFlightDetailsData(sql);
      console.log('details needede needed ',allFlightDetails)
     
        setAllFlights(allFlightDetails);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('sync all data error==', err);
    
    }
  };

 

  /**
     * 
     */

  const loadInitialData = async () => {
    try {
      let sql = `SELECT DISTINCT FlightNumber,Sector,Status from mainFlightFlightPlanTable1 ORDER BY LOWER(FlightNumber)`;
      const allFlightDetails = await onFetchMainFlightDetailsData(sql);

      console.log('loadInitialData allFlightDetails=', allFlightDetails);

      let closedIndex = -1;
      for (let i = 0; i < allFlightDetails.length; i++) {
        if (allFlightDetails[i].Status === 'CLOSED') {
          closedIndex = i;
        }
      }

      console.log('closedIndex ==', closedIndex);
      let len = allFlightDetails.length;
      if (closedIndex !== -1) {
        if (closedIndex < len && closedIndex !== len - 1) {
          allFlightDetails[closedIndex + 1].Status = 'ACTIVE';
        }
      }
      
      setAllFlights(allFlightDetails, () => {
        console.log('called set allFlights method');
      });
    } catch (err) {
      console.log('loadInitialData error', err);
    }
  };



const createJsonWithStatus = (flightData) => {

    let newMainFlightData = [];
    for (let i = 0; i < flightData.length; i++) {
      let modifiedFlightData = {};
      modifiedFlightData['FlightNumber'] = flightData[i].OPR_ID.FLTDET.FLTNO;
      modifiedFlightData['Sector'] = `${flightData[i].OPR_ID.FLTDET.SRC} - ${flightData[i].OPR_ID.FLTDET.DES}`;
      modifiedFlightData['Status']  =i == 0 ? 'ACTIVE' : "AVAILABLE";// Make first record active by default
      modifiedFlightData['ApproachTime'] = flightData[i].OPR_ID.FLTDET.DATE;
      modifiedFlightData['ApproachFuel'] = flightData[i].OPR_ID.FUEL.TRIP.FUEL;
      modifiedFlightData['TaxiFuel'] = flightData[i].OPR_ID.FUEL.TAXI.FUEL;
      for (let j = 0; j < flightData[i].OPR_ID.MAINFLTPLAN.ROW.length; j++) {
        newMainFlightData.push({ ...modifiedFlightData, ...flightData[i].OPR_ID.MAINFLTPLAN.ROW[j] });
      }
    }
 console.log(newMainFlightData)
    let newAltFlightData = [];
    for (let i = 0; i < flightData.length; i++) {
      let modifiedFlightData = {};
      modifiedFlightData['FlightNumber'] = flightData[i].OPR_ID.FLTDET.FLTNO;
      modifiedFlightData['Sector'] = `${flightData[i].OPR_ID.FLTDET.SRC} - ${flightData[i].OPR_ID.FLTDET.DES}`;
      modifiedFlightData['Status'] = i === 0 ? 'ACTIVE' : 'AVAILABLE';
      modifiedFlightData['ApproachTime'] = flightData[i].OPR_ID.FLTDET.DATE;
      modifiedFlightData['ApproachFuel'] = flightData[i].OPR_ID.FUEL.TRIP.FUEL;
      modifiedFlightData['TaxiFuel'] = flightData[i].OPR_ID.FUEL.TAXI.FUEL;
      for (let j = 0; j < flightData[i].OPR_ID.ALT1FP.ROW.length; j++) {
        newAltFlightData.push({ ...modifiedFlightData, ...flightData[i].OPR_ID.ALT1FP.ROW[j] });
      }
    }

    return {
      'MAINFLIGHTDATA': newMainFlightData,
       'ALTFLIGHTDATA': newAltFlightData
    };
  };

  /**
     * 
     * @returns 
     */

  const renderBriefHeader = () => {

    let itemWidth = 100 / 18;

    return (
      <View style={{ flexDirection: 'row', marginTop: 20, borderBottomColor: colors.DarkerGrey, borderBottomWidth: 1 }}>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 2}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>FLT  NO</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 2}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>AC REG</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 2}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>SECTOR</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 3}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>ETD-ETA</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>SI</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 2}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>WX</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 3}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>FUEL BRIEFING</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 2}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>NOTAM</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 2}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}></Text>
        </View>
      </View>
    );
  };

  
    /**
     * 
     */
    console.log('navigation',navigation)
    const renderBriefListItem = ({ item, index }) => {
        const itemWidth = 100 / 18;
      
        let borderColor = colors.Black;
        if (theme === 'Dark') {
          borderColor = colors.DarkerGrey;
        }
      
        console.log('renderBriefListItem item ==', item);
        if (item.Status === 'ACTIVE') {
          console.log('Active Flight number = ', item.FlightNumber);
          global.activeFlightNumber = item.FlightNumber;
        }
      
        let isActiveItem = item.Status === 'ACTIVE';
        let firstItemNonActiveBgColor = theme === 'Dark' ? '#000' : colors.LighterGrey;
        let activeItemBgColor = theme === 'Dark' ? '#333' : colors.LightestBlue;
      
        return (
          <View>
            {flightNo[0] && (

          <TouchableOpacity style={{ ...styles[`listItemContainer${theme}`], borderTopColor: index === 0 ? borderColor : null, borderTopWidth: index === 0 ? 1 : 0 }}>
          <View style={{ ...styles[`listItemStyle${theme}`, `firstListItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : firstItemNonActiveBgColor }}>
  <Text key={index} style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600' }}>
        {flightNo[0]}
      </Text>
</View>

            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
                {acR[0]}
                </Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>

 <Text key={index} style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
        {depart[0]}-{arriv[0]}
      </Text>


              
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
                {etD[0]}-{etA[0]}
                </Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>{}</Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {} </Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <TouchableOpacity 
                onPress={() => handlefuel(flightNo[0], depart[0],arriv[0],acType[0])}

              
              >

              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>AVAILABLE</Text>
              </TouchableOpacity>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 4}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> </Text>
            </View>
          </TouchableOpacity>
            )}

      {flightNo[1] && (

                <TouchableOpacity style={{ ...styles[`listItemContainer${theme}`], borderTopColor: index === 0 ? borderColor : null, borderTopWidth: index === 0 ? 1 : 0 }}>
                <View style={{ ...styles[`listItemStyle${theme}`, `firstListItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : firstItemNonActiveBgColor }}>

      <Text key={index} style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600' }}>
              {flightNo[1]}
            </Text>
      </View>

                  <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
                      {acR[1]}
                      </Text>
                  </View>
                  <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                  
       
      <Text key={index} style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
              {depart[1]}-{arriv[1]}
            </Text>

                    
                  </View>
                  <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
                    {etD[1]}-{etA[1]}
                      </Text>
                  </View>
                  <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>{}</Text>
                  </View>
                  <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {} </Text>
                  </View>
                  <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                    <TouchableOpacity 
                    onPress={() => handlefuel(flightNo[1], depart[1],arriv[1],acType[1])}
                    >

                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>AVAILABLE</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 4}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> </Text>
                  </View>
                </TouchableOpacity>
      )}

      {flightNo[2] && (

            <TouchableOpacity style={{ ...styles[`listItemContainer${theme}`], borderTopColor: index === 0 ? borderColor : null, borderTopWidth: index === 0 ? 1 : 0 }}>
            <View style={{ ...styles[`listItemStyle${theme}`, `firstListItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : firstItemNonActiveBgColor }}>


            <Text key={index} style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600' }}>
            {flightNo[2]}
            </Text>
            </View>

              <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
                  {acR[2]}
                  </Text>
              </View>
              <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>


            <Text key={index} style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
            {depart[2]}-{arriv[2]}
            </Text>

                
              </View>
              <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
                {etD[2]}-{etA[2]}
                  </Text>
              </View>
              <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>{}</Text>
              </View>
              <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {} </Text>
              </View>
              <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                <TouchableOpacity 
                onPress={() => handlefuel(flightNo[2], depart[2],arriv[2],acType[2])}
                >

                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>AVAILABLE</Text>
                </TouchableOpacity>
              </View>
              <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 4}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> </Text>
              </View>
            </TouchableOpacity>
      )}


      {flightNo[3] && (

              <TouchableOpacity style={{ ...styles[`listItemContainer${theme}`], borderTopColor: index === 0 ? borderColor : null, borderTopWidth: index === 0 ? 1 : 0 }}>
              <View style={{ ...styles[`listItemStyle${theme}`, `firstListItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : firstItemNonActiveBgColor }}>
              

              <Text key={index} style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600' }}>
              {flightNo[3]}
              </Text>
              </View>

                <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                  <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
                    {acR[3]}
                    </Text>
                </View>
                <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                
              

              <Text key={index} style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
              {depart[3]}-{arriv[3]}
              </Text>

                  
                </View>
                <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                  <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>
                  {etD[3]}-{etA[3]}
                    </Text>
                </View>
                <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                  <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>{}</Text>
                </View>
                <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                  <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {} </Text>
                </View>
                <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                  <TouchableOpacity 
                 onPress={() => handlefuel(flightNo[3], depart[3],arriv[3],acType[3])}
                  >

                  <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>AVAILABLE</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 4}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
                  <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> </Text>
                </View>
              </TouchableOpacity>
      )}

          {/* {showFuelSheet && <FuelSheet />} */}
          
         
          </View>
        );
    }

    /**
     * 
     */
    const renderHeader = () => {

        return (
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <View style={{ ...styles[`listHeaderStyle${theme}`], width: '20%' }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center', paddingVertical: (isAndroid ? null : 5) }} >FLT  NO</Text>
                </View>
                <View style={{ ...styles[`listHeaderStyle${theme}`], width: '30%' }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center', paddingVertical: (isAndroid ? null : 5) }}>SECTOR</Text>
                </View>
                <View style={{ ...styles[`listHeaderStyle${theme}`], width: '25%' }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center', paddingVertical: (isAndroid ? null : 5) }}>STATUS</Text>
                </View>
                <View style={{ ...styles[`listHeaderStyle${theme}`], width: '25%' }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center', paddingVertical: (isAndroid ? null : 5) }} >REMARKS</Text>
                </View>
            </View>
        )
    }

    /**
     * 
     */
    const renderListItem = ({ item, index,}) => {
     
        let borderColor = colors.Black;
        if (theme === 'Dark') {
          borderColor = colors.DarkerGrey;
        }
      
        console.log('renderListItem item ==', item);
        if (item.Status === 'ACTIVE') {
          console.log('Active Flight number = ', item.FlightNumber);
          global.activeFlightNumber = item.FlightNumber;
        }
      
        let isActiveItem = item.Status === 'ACTIVE';
        let firstItemNonActiveBgColor = theme === 'Dark' ? '#000' : colors.LighterGrey;
        let activeItemBgColor = theme === 'Dark' ? '#333' : colors.LightestBlue;
      
        return (
          <TouchableOpacity
            style={{ ...styles[`listItemContainer${theme}`], borderTopColor: index === 0 ? borderColor : null, borderTopWidth: index === 0 ? 1 : 0 }}
            onPress={() => {
              navigation.navigate('OFPComponent',{ selectedFlight: item });
            }}
          >
            <View style={{ ...styles[`listItemStyle${theme}`], ...styles[`firstListItemStyle${theme}`], width: '20%', backgroundColor: isActiveItem ? activeItemBgColor : firstItemNonActiveBgColor }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600' }}>{item.FlightNumber}</Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: '30%', backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>{item.Sector}</Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: '25%', backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {item.Status} </Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: '25%', backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>{item.Remarks}</Text>
            </View>
          </TouchableOpacity>
        );
      };

      
   

      const onSuccess = (e, syncAllQRCodeData) => {
        if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(e.data)) {
          setScanned(true);
          syncAllQRCodeData('' + e.data);
        } else {
          Alert.alert('Error', 'No URL detected',
            [
              { text: 'Scan again', onPress: () => setScanned(false) }
            ]
          );
        }
      };

       /**
     * 
     */
       const renderFooterItem = () => {
        const themeContext = useContext(ThemeContext);
        const { theme, Orientation, setIsLoggedInnValue } = themeContext;
        const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;
      
        // Destructure headerClickedIndex and isDarkTheme from the state, assuming they are part of your state
        // const { headerClickedIndex, isDarkTheme } = themeContext
      
        let itemWidth = 100 / 8;
      
        const themeStyle = theme === "Light" ? styles.tabStyleLight : styles.tabStyleDark;
        const textFieldTabBgColor = theme === "Light" ? '#fff' : '#000';
        const checkFontColor = theme === "Light" ? colors.Black : colors.FluorescentGreen;
      
        return (
            <View style={{ flexDirection: 'row', marginBottom: 20, borderColor: colors.LighterGrey, borderWidth: 1 }}>
            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }}>
                <Text style={{ ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}></Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }}  >
                <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }}  >
                <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} >
                <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} >
                <Text style={headerClickedIndex == 1 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} >
                <Text style={headerClickedIndex == 2 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}></Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth * 2}%` }} onPress={() => {

                // setIsLoggedInnValue(false);
                // storeData('isAutoLogin', 'false');
                navigation.navigate('Login');

            }} >
                <Text style={{ ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}>LOGOUT</Text>
            </TouchableOpacity>
        </View>
        );
      };

      return (
        <View style={{ ...[styles[`container${theme}`]], height: '100%', borderColor: 'green', borderWidth: 1 }}>
          <Spinner visible={loading} textContent="Loading" size="large" />
          <HeaderComp
            onClick={handleHeaderIndexChange}
            data={{
              headerIndex: 0,
              subHeaderIndex: 0,
              headerClickedIndex: 5,
              subHeaderClickedIndex: 0,
            }}
            navigation={props.navigation}
          />
          {subHeaderSelectedIndex === 0 && (
            <View style={{ flex: 1 }}>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={allFlights}
                ListHeaderComponent={renderBriefHeader}
                renderItem={renderBriefListItem}
              />
            </View>
          )}
          {subHeaderSelectedIndex === 1 && (
            <View style={{ flex: 1 }}>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={allFlights}
                ListHeaderComponent={renderHeader}
                renderItem={renderListItem}
              />
            </View>
          )}
          {(subHeaderSelectedIndex == 2) && <View style={{ flex: 1, alignItems:"center",justifyContent:'center'}}>
           <Text style={{ color:"black"}} >
          Coming soon
         
          </Text>
         
      </View>}
          {subHeaderSelectedIndex === 4 && (
            <View style={{ flex: 1 }}>
                   <TechLogCompNew
                        onClick={handleHeaderIndexChange}
                        data={
                            {
                                headerIndex: 0,
                                subHeaderIndex: 0,
                                headerClickedIndex: null,
                                subHeaderClickedIndex: null
                            }
                        }></TechLogCompNew>
              {/* Your TechLogComp or TechLogCompNew components here */}
            </View>
          )}
            {(subHeaderSelectedIndex == 3) && <View style={{ flex: 1 }}>
          
                    <VoyageRepComp
                        onClick={handleHeaderIndexChange}
                        data={
                            {
                                headerIndex: 0,
                                subHeaderIndex: 0,
                                headerClickedIndex: null,
                                subHeaderClickedIndex: null
                            }
                        }></VoyageRepComp>
                </View>}
                {(subHeaderSelectedIndex == 5) && <View style={{ flex: 1, alignItems:"center",justifyContent:'center'}}>
           <Text style={{ color:"black"}} >
          Coming soon
         
          </Text>
         
      </View>}
          {subHeaderSelectedIndex === 6 && (
            <View style={{ flex: 1 }}>
              {/* {!scanned && (
                <QRCodeScanner
                  ref={(node) => {
                    scanner = node;
                  }}
                  onRead={onSuccess}
                  topContent={
                    <Text style={styles.centerText}>
                      <Text style={styles.textBold}>Scan the QR code</Text>
                    </Text>
                  }
                />
              )} */}
              {/* {scanned && ( */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>Coming soon</Text>
                </View>
              {/* )} */}
            </View>
          )}
           {(subHeaderSelectedIndex == 7) && <View style={{ flex: 1, alignItems:"center",justifyContent:'center'}}>
           <Text style={{ color:"black"}} >
          Coming soon
         
          </Text>
         
      </View>}

          {renderFooterItem()}
        </View>
        
      );
 }

 const styles = StyleSheet.create({
    containerLight: {
        flex: 1,
        backgroundColor: colors.White
    },
    containerDark: {
        flex: 1,
        backgroundColor: colors.Black
    },
    listHeaderStyleLight: {
        paddingVertical: (isAndroid ? 5.5 : 5),//8
        alignItems: 'center',
        backgroundColor: colors.BackgroundGrey,
        borderRightColor: colors.DarkerGrey,
        borderRightWidth: 0.5,
        borderTopColor: colors.DarkerGrey,
        borderTopWidth: 0.5
    },
    listHeaderStyleDark: {
        paddingVertical: (isAndroid ? 5.5 : 5),//8
        alignItems: 'center',
        backgroundColor: colors.Black,
        borderRightColor: colors.DarkerGrey,
        borderRightWidth: 0.5,
        borderTopColor: colors.DarkerGrey,
        borderTopWidth: 0.5
    },
    listItemContainerLight: {
        flexDirection: 'row',
        backgroundColor: colors.White
    },
    listItemContainerDark: {
        flexDirection: 'row',
        backgroundColor: colors.Black
    },
    listItemStyleLight: {
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.DarkerGrey,
        borderWidth: 0.25
    },
    listItemStyleDark: {
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.DarkerGrey,
        borderWidth: 0.25
    },
    firstListItemStyleLight: {
        backgroundColor: colors.LighterGrey,
        borderRightColor: colors.Black,
        borderRightWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: colors.DarkerGrey,
        borderBottomWidth: 0.5
    },
    firstListItemStyleDark: {
        backgroundColor: colors.Black,
        borderRightColor: colors.DarkerGrey,
        borderRightWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: colors.DarkerGrey,
        borderBottomWidth: 0.5
    },


    tabStyleLight: {
        borderColor: colors.DarkerGrey,
        backgroundColor: colors.LighterGrey,//'#929292',
        borderWidth: 0.5,
        borderBottomWidth: 0,
        paddingVertical: 5,
    },
    tabStyleDark: {
        borderColor: colors.LighterGrey, //colors.DarkGrey,
        backgroundColor: colors.Black,
        borderWidth: 0.5,
        borderBottomWidth: 0,
        paddingVertical: 5,
    },
    activeTabStyleLight: {
        backgroundColor: colors.DarkModeBtnInActiveBg,
        borderColor: colors.DarkerGrey,
        borderWidth: 1
    },
    activeTabStyleDark: {
        backgroundColor: colors.DarkModeBtnActiveBg,
        borderColor: colors.DarkerGrey,
        borderWidth: 1
    },
    tabTextStyleLight: {
        color: colors.Black,
        textAlign: 'center',
        // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    tabTextStyleDark: {
        color: colors.FluorescentGreen,
        textAlign: 'center',
        // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    activeTabTextStyleLight: {
        color: colors.Black,
        textAlign: 'center',
        // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    activeTabTextStyleDark: {
        color: colors.FluorescentGreen,
        textAlign: 'center',
        // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    textStyleLight: {
        // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 8,
        color: '#000'
    },
    textStyleDark: {
        // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 8,
        color: colors.FluorescentGreen
    },
    textSizePortrait: {
        // fontSize: 16,
        fontSize: (isTablet) ? 16 : 6
    },
    textSizeLandscape: {
        // fontSize: 20,
        fontSize: (isTablet) ? 20 : 16
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    }

})

export default OFPLanding;




