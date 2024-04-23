/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import {
    Alert,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
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
// import { onCreateALTFlightDetailsTable, onFetchALTFlightDetailsData, onInsertALTFlightDetailsData } from '../dbmanager/alt-flight-details-table';
// import { onCreateAltFlightRVSMTable } from '../dbmanager/alt-rvsm-details-table';
// import { onCreateMainRVSMTable } from '../dbmanager/main-rvsm-details-table';
// import { onCreateFaultReportTable } from '../dbmanager/fault-report-table';
import { useNavigation } from '@react-navigation/native';

const OffLand = ( props ) => {
    const themeContext = useContext(ThemeContext);
    const { theme, OFPData, Orientation, setOFPDataMethod, headerClickedIndex } = themeContext;

    const navigation = useNavigation()
  
    const [headerSelectedIndex, setHeaderSelectedIndex] = useState(0);
    const [subHeaderSelectedIndex, setSubHeaderSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [allFlights, setAllFlights] = useState([]);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [scanned, setScanned] = useState(false);

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
    })
        

    /**
     * 
     * @param {*} selectedIndex 
     */

      // Helper function to set the selected header index
  const handleHeaderIndexChange = (clickedType, selectedIndex) => {
    console.log('clickedType=', clickedType, 'selectedIndex ==', selectedIndex);

    switch (clickedType) {
      case "HEADER":
        setHeaderSelectedIndex(selectedIndex);
        break;
      case "SUBHEADER":
        setScanned(false);
        if (selectedIndex === 7) {
          syncAllData();
        }
        setSubHeaderSelectedIndex(selectedIndex, () => {
          if(selectedIndex === 4){
              global.screenHeadder = 'techlog';
          } else if(selectedIndex === 3){
              global.screenHeadder = 'voy'
          }
        });
        //Alert.alert("Data", ""+subHeaderSelectedIndex);
        break;
    }
  };

// Sync data function
  const syncAllData = async () => {

    try {
      setLoading(true);

      await onCreateMainFlightDetailsTable();
    //   await onCreateALTFlightDetailsTable();
    //   await onCreateMainRVSMTable();
    //   await onCreateAltFlightRVSMTable();
    //   await onCreateFaultReportTable();

      const { data, status, statusText } = await api.get(API + '/Latest_CFP.json', '');

      console.log('data===', data.FLIGHTFOLDER.OPR_ID[0]);

      const newModifiedFlightData = createJsonWithStatus(data.FLIGHTFOLDER.OPR_ID);
      console.log('newModifiedFlightData ==', newModifiedFlightData);

      //Use this data throughout the app
      themeContext.setOFPDataMethod(data);

      const { MAINFLTPLAN, ALT1FP } = data.FLIGHTFOLDER.OPR_ID[0];

      const insertTable = await onInsertMainFlightDetailsData(newModifiedFlightData.MAINFLIGHTDATA);
    //   const insertAltFlightTable = await onInsertALTFlightDetailsData(newModifiedFlightData.ALTFLIGHTDATA);

      const sql = `SELECT DISTINCT FlightNumber, Sector, Status from mainFlightFlightPlanTable1 ORDER BY LOWER(FlightNumber)`;
      const allFlightDetails = await onFetchMainFlightDetailsData(sql);
      setAllFlights(allFlightDetails);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('sync all data error==', err);
      alert('Sync failed');
    }
  };

  /**
   * 
   * @param {*} url 
   */

  const syncAllQRCodeData = async (url) => {

    try {
      setLoading(true);

      const createMainFlightTable = await onCreateMainFlightDetailsTable();
    //   const createALTFlightTable = await onCreateALTFlightDetailsTable();
    //   const createMainFlightRVSMTable = await onCreateMainRVSMTable();
    //   const createAltFlightRVSMTable = await onCreateAltFlightRVSMTable();
    //   const createFaultReportTable = await onCreateFaultReportTable();

      const { data, status, statusText } = await api.get(url, '');

      console.log('data===', data.FLIGHTFOLDER.OPR_ID[0]);

      const newModifiedFlightData = createJsonWithStatus(data.FLIGHTFOLDER.OPR_ID);
      console.log('newModifiedFlightData ==', newModifiedFlightData);

      // Use this data throughout the app
      setOFPDataMethod(data);

      const { MAINFLTPLAN, ALT1FP } = data.FLIGHTFOLDER.OPR_ID[0];
      // console.log('MAINFLTPLAN==', MAINFLTPLAN.ROW);

      // const insertTable = await onInsertMainFlightDetailsData(MAINFLTPLAN.ROW);
      const insertTable = await onInsertMainFlightDetailsData(newModifiedFlightData.MAINFLIGHTDATA);

      // const insertAltFlightTable = await onInsertALTFlightDetailsData(ALT1FP.ROW);
    //   const insertAltFlightTable = await onInsertALTFlightDetailsData(newModifiedFlightData.ALTFLIGHTDATA);

      let sql = `SELECT DISTINCT FlightNumber, Sector, Status from mainFlightPlanTable ORDER BY LOWER(FlightNumber)`;
      const allFlightDetails = await onFetchMainFlightDetailsData(sql);
      // console.log('mainFlightDetails==', mainFlightDetails);

      // const altFlightDetails = await onFetchALTFlightDetailsData();
      // console.log('altFlightDetails==', altFlightDetails);

      setAllFlights(allFlightDetails);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('sync all data error==', err);
      alert('Sync failed');
    }
  };

  /**
     * 
     */

  const loadInitialData = async () => {
    try {
      let sql = `SELECT DISTINCT FlightNumber, Sector, Status from mainFlightPlanTable ORDER BY LOWER(FlightNumber)`;
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
      debugger;
      setAllFlights(allFlightDetails, () => {
        console.log('called set allFlights method');
      });
    } catch (err) {
      console.log('loadInitialData error', err);
    }
  };

//   // useEffect to load initial data when the component mounts
//   useEffect(() => {
//     loadInitialData();
//   }, []);

/**
     * 
     */

const createJsonWithStatus = (flightData) => {
    let newMainFlightData = [];
    for (let i = 0; i < flightData.length; i++) {
      let modifiedFlightData = {};
      modifiedFlightData['FlightNumber'] = flightData[i]._FLTNO;
      modifiedFlightData['Sector'] = `${flightData[i]._DEPARPT} - ${flightData[i]._ARRARPT}`;
      modifiedFlightData['Status'] = i === 0 ? 'ACTIVE' : 'AVAILABLE'; // Make first record active by default
      modifiedFlightData['ApproachTime'] = flightData[i].MAINFLTPLAN._APPROACHTIME;
      modifiedFlightData['ApproachFuel'] = flightData[i].MAINFLTPLAN._APPROACHFUEL;
      modifiedFlightData['TaxiFuel'] = flightData[i].FUEL.TAXI.FUEL;
      for (let j = 0; j < flightData[i].MAINFLTPLAN.ROW.length; j++) {
        newMainFlightData.push({ ...modifiedFlightData, ...flightData[i].MAINFLTPLAN.ROW[j] });
      }
    }

    let newAltFlightData = [];
    for (let i = 0; i < flightData.length; i++) {
      let modifiedFlightData = {};
      modifiedFlightData['FlightNumber'] = flightData[i]._FLTNO;
      modifiedFlightData['Sector'] = `${flightData[i]._DEPARPT} - ${flightData[i]._ARRARPT}`;
      modifiedFlightData['Status'] = i === 0 ? 'ACTIVE' : 'AVAILABLE';
      modifiedFlightData['ApproachTime'] = flightData[i].ALT1FP._APPROACHTIME;
      modifiedFlightData['ApproachFuel'] = flightData[i].ALT1FP._APPROACHFUEL;
      modifiedFlightData['TaxiFuel'] = flightData[i].FUEL.TAXI.FUEL;
      for (let j = 0; j < flightData[i].ALT1FP.ROW.length; j++) {
        newAltFlightData.push({ ...modifiedFlightData, ...flightData[i].ALT1FP.ROW[j] });
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
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 2}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}>NOTAM</Text>
        </View>
        <View style={{ ...styles[`listHeaderStyle${theme}`], width: `${itemWidth * 4}%`, justifyContent: 'center' }}>
          <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600', textAlignVertical: 'center' }}></Text>
        </View>
      </View>
    );
  };

  
    /**
     * 
     */
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
          <TouchableOpacity style={{ ...styles[`listItemContainer${theme}`], borderTopColor: index === 0 ? borderColor : null, borderTopWidth: index === 0 ? 1 : 0 }}>
            <View style={{ ...styles[`listItemStyle${theme}`, `firstListItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : firstItemNonActiveBgColor }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '600' }}>{item.FlightNumber}</Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>VT-ABC</Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> CCUBLR </Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 3}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>12:35/14:45</Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}></Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> CHECK </Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 2}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>NIL</Text>
            </View>
            <View style={{ ...styles[`listItemStyle${theme}`], width: `${itemWidth * 4}%`, backgroundColor: isActiveItem ? activeItemBgColor : null }}>
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> </Text>
            </View>
          </TouchableOpacity>
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
    const renderListItem = ({ item, index, navigation }) => {
      
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
              navigation.navigate('Pdf', { selectedFlight: item });
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
              <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>{ }</Text>
            </View>
          </TouchableOpacity>
        );
      };

      
    /**
     * 
     * @param {*} e 
     */

      const onSuccess = (e) => {
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
        // const themeContext = useContext(ThemeContext);
        // const { theme, Orientation, setIsLoggedInnValue } = themeContext;
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

                setIsLoggedInnValue(false);
                storeData('isAutoLogin', 'false');

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
          {subHeaderSelectedIndex === 6 && (
            <View style={{ flex: 1 }}>
              {!scanned && (
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
              )}
              {scanned && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>Scanned</Text>
                </View>
              )}
            </View>
          )}
          {renderFooterItem()}
        </View>
        // <View>
        //     <Text>OFP Landing</Text>
        // </View>
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

export default OffLand;

