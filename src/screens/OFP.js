/* eslint-disable */
import React, {useRef, useState, useContext, useEffect} from 'react';
import {
  LogBox,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import api from '../API-Axios/axios';
import Spinner from 'react-native-loading-spinner-overlay';
import {API} from '../constants';
import HeaderComp from './Components/HeaderComp';
import OFPHeaderComp from './Components/OFPHeaderComp';
import FooterComp from './Components/FooterComp';
import RVSMComp from './Components/RVSMComp';
import MetricComp from './Components/MetricComp';
import FuelSumComp from './Components/FuelSumComp';
import {ThemeContext} from '../Utilis/ThemeManager';

import DateTimePicker from '@react-native-community/datetimepicker';
import {IS_IPAD, IS_TABLET, isTablet} from '../../src/constants';
import Sound from 'react-native-sound';
// import PDFView from 'react-native-view-pdf';
import {PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';

import {openDatabase} from 'react-native-sqlite-storage';
import {localDB} from '../dbmanager/dbconstants';
import {useNavigation} from '@react-navigation/native';
const db = openDatabase({name: localDB.dbName});

import {
  onCreateMainFlightDetailsTable,
  onInsertMainFlightDetailsData,
  onFetchMainFlightDetailsData,
  onUpdateMainFlightDetails,
  onDeleteFlightDetails,
} from '../dbmanager/main-flight-details-table';
import {
  onCreateALTFlightDetailsTable,
  onInsertALTFlightDetailsData,
  onFetchALTFlightDetailsData,
  onDeleteAltFlightDetails,
} from '../dbmanager/alt-flight-details-table';

import COLORS from '../constants/colors';
import {ScrollView} from 'react-native-gesture-handler';
import {MainTableApi} from '../api/mainTableApi';
import NetwotkAccess from '../Utilis/NetworkAccess';
const OFPComponent = props => {
  const navigation = useNavigation();
  console.log('props nbhgh ===', props.route.params);
  console.log('props nbhgh 12334 ===', props.route.params.selectedFlight);

  const [loading, setLoading] = useState(false);
  const [ofpFilePath, setOFPFilePath] = useState('');
  const [isAirborneTime, setIsAirborneTime] = useState(false);
  const [isMainFlightSelected, setIsMainFlightSelected] = useState(true);
  const [focusedItem, setFocusedItem] = useState('');
  const [focusedIndex, setFocusedIndex] = useState('');
  const [ATAFocusedIndex, setATAFocusedIndex] = useState('');
  const [isATATimer, setIsATATimer] = useState('');
  const [currentTimeForBeep, setCurrentTimeForBeep] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('0');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [headerSelectedIndex, setHeaderSelectedIndex] = useState(1);
  const [subHeaderSelectedIndex, setSubHeaderSelectedIndex] = useState(0);
  const [mainFlightTimeStamp, setMainFlightTimeStamp] = useState('');
  const [altFlightTimeStamp, setAltFlightTimeStamp] = useState('');
  const [listHeaderTitleLine, setListHeaderTitleLine] = useState([
    'TO',
    'MORA',
    'LAT',
    'LONG',
    'MTRK',
    'TAS',
    'OAT',
    'DIST',
    'EET',
    'EFB',
    'FUELRM',
    '',
    'FL',
    'WIND',
    'IAS',
    'MH',
    'GS',
    'TDV',
    'DRMG',
    'TRMG',
    'TTLB',
    'RQFUEL',
    '',
    'AFL',
    'AWND',
    '',
    '',
    'WC',
    'AD',
    'ATA',
    'ETA',
    'GWT',
    'DISC',
  ]);
  const [mainFlightData, setMainFlightData] = useState([]);
  const [altFlightData, setAltFlightData] = useState([]);
  const [approachTime, setApproachTime] = useState('');
  const [approachFuel, setApproachFuel] = useState('');
  const [TaxiFuel, setTaxiFuel] = useState('');
  const [lastTimeBurnt, setLastTimeBurnt] = useState('');
  const [totalBurnt, setTotalBurnt] = useState('');
  const [lastFuelRemaining, setLastFuelRemaining] = useState('');
  const [totalFuelRemaining, setTotalFuelRemaining] = useState('');
  const [totalGrossWeight, setTotalGrossWeight] = useState('');
  const [AltFlightApproachTime, setAltFlightApproachTime] = useState('');
  const [AltFlightApproachFuel, setAltFlightApproachFuel] = useState('');
  const [AltFlightTaxiFuel, setAltFlightTaxiFuel] = useState('');
  const [AltFlightLastTimeBurnt, setAltFlightLastTimeBurnt] = useState('');
  const [AltFlightTotalBurnt, setAltFlightTotalBurnt] = useState('');
  const [AltFlightLastFuelRemaining, setAltFlightLastFuelRemaining] =
    useState('');
  const [AltFlightTotalFuelRemaining, setAltFlightTotalFuelRemaining] =
    useState('');
  const [AltFlightTotalGrossWeight, setAltFlightTotalGrossWeight] =
    useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [networks, setNetworks] = useState(false);
  const themeContext = useContext(ThemeContext); // Replace 'ThemeContext' with the actual ThemeContext you have imported
  const {theme, Orientation, isDarkTheme, setIsLoggedInnValue} = themeContext;
  const dataFetch = NetwotkAccess();
  const network = dataFetch
    .then(e => {
      setNetworks(e.isConnected);
      return e.isConnected;
    })
    .catch(e => console.log('e', e));
  const accessFileSystem = async () => {
    let bundlePath =
      Platform.OS === 'android'
        ? '/storage/emulated/0/zapya/misc/'
        : RNFS.MainBundlePath;
    try {
      const result = await RNFS.readDir(bundlePath);
      //console.log('GOT RESULT===', result);

      var dateObj = new Date();
      var month1 = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0'); //months from 1-12
      var day1 = dateObj.getUTCDate().toString().padStart(2, '0');
      var year1 = dateObj.getUTCFullYear();

      let newdate = day1 + month1 + year1;

      let item = result.filter(item => {
        //console.log(item.name.indexOf(newdate) !== -1);
        return item.name.indexOf(newdate) !== -1;
      });

      if (item.length > 0) {
        //console.log('filePath===', item[0].path);
        setOFPFilePath(item[0].path); // Use the setter function to update the state
        // alert('Filepath ==' + item[0].path + 'username=' + global.userName);
      }
    } catch (err) {
      // //console.log(
      //   'Failed to read the file path from',
      //   bundlePath,
      //   'err=',
      //   err.message,
      //   err.code,
      // );
      // alert('Failed to read the file path from ' + bundlePath + ' and error is ' + err.message + err.code);
    }
  };

  /**
   *
   * @returns
   */
  const onConfirm = (hour, minute) => {
    setShowDatePicker(false);

    const hoursNeeded = new Date(minute).getHours().toString().padStart(2, '0');
    const minutesNeeded = new Date(minute)
      .getMinutes()
      .toString()
      .padStart(2, '0');
    setSelectedHour(hoursNeeded.toString().padStart(2, '0'));
    setSelectedMinute(minutesNeeded.toString().padStart(2, '0'));

    if (isATATimer) {
      updateATATimerValues(hoursNeeded, minutesNeeded);
      return;
    }

    const isMainFlight =
      headerSelectedIndex === 1 && subHeaderSelectedIndex === 0 ? true : false;

    if (isAirborneTime) {
      let hour = new Date(minute).getHours();
      let date = new Date();
      let currentHrs = date.getHours();
      let currentMins = date.getMinutes();
      let currentTimeSecs = currentHrs * 60 * 60 + currentMins * 60;
      let selectedTimeSecs = hour * 60 * 60 + minute * 60;
      //console.log('selectedtine', selectedTimeSecs);
      if (selectedTimeSecs > currentTimeSecs) {
        Alert.alert('Time should be less than current time');
        return;
      }
    }

    //console.log('data nededed', selectedHour, selectedMinute);
    if (!isAirborneTime) {
      let contentData = isMainFlight ? [...mainFlightData] : [...altFlightData];
      let item = contentData[focusedIndex];
      //console.log('item===', item);
      var date = new Date(minute);

      var hours = date.getHours().toString().padStart(2, '0'); // Get the hour (in 24-hour format)
      var minutes = date.getMinutes().toString().padStart(2, '0');
      setSelectedHour(hours);
      setSelectedMinute(minutes);
      item['ETA'] = `${hours}:${minutes}`;
      //console.log('first printimg eta', item['ETA']);
      contentData[focusedIndex] = item;

      if (isMainFlight) {
        setMainFlightData(contentData);
      } else {
        setAltFlightData(contentData);
      }

      if (focusedIndex < contentData.length - 1) {
        updateBelowTimeValues(hours, minutes);
      }
    } else {
      onAirborneClick(hours, minutes);
    }
  };
  const updateBelowTimeValues = (hours, minutes) => {
    const isMainFlight =
      headerSelectedIndex == 1 && subHeaderSelectedIndex == 0 ? true : false;

    // //console.log(
    //   'seleced time needed =',
    //   selectedHour,
    //   'selected needee minutes-=',
    //   selectedMinute,
    // );
    // //let contentData1 = [...mainFlightData];
    let contentData1 = isMainFlight ? [...mainFlightData] : [...altFlightData];

    let focusedItem = contentData1[focusedIndex];

    let date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));

    //console.log('hrsssss===', date.getHours(), 'minsssss==', date.getMinutes());
    //let focusedDate = new Date(date.getTime() + parseInt(focusedItem.EET) * 60000);

    let ETAMins = 0; //parseInt(contentData1[focusedIndex + 1].EET);
    //console.log('ETAMins ==', ETAMins, 'date===', date);
    for (let i = focusedIndex + 1; i < contentData1.length; i++) {
      let item = contentData1[i];
      ETAMins += parseInt(item.EET);
      let newDate = addMinutes(date, ETAMins);
      //console.log('new date', newDate);
      item['ETA'] = `${newDate.getHours().toString().padStart(2, '0')}:${newDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      //console.log('content data', item['ETA']);
      contentData1[i] = item;
    }

    if (isMainFlight) {
      setMainFlightData(contentData1);
    } else {
      setAltFlightData(contentData1);
    }
  };
  const addMinutes = (date, minutes) => {
    // let d2 = new Date(date);
    // d2.setMinutes(date.getMinutes() + minutes);
    // return d2;
    return new Date(date.getTime() + minutes * 60000);
  };
  const onAirborneClick = (hrs, mins) => {
    //console.log('onAirborneClick  hrs=', hrs, 'mins=', mins);
    // const { headerSelectedIndex, subHeaderSelectedIndex } = this.state;
    const isMainFlight =
      headerSelectedIndex == 1 && subHeaderSelectedIndex == 0 ? true : false;

    let date = new Date();
    if (hrs === undefined && mins === undefined) {
      hrs = date.getHours();
      mins = date.getMinutes();
    } else {
      date.setHours(parseInt(hrs));
      date.setMinutes(parseInt(mins));
    }
    setSelectedHour(hrs.toString().padStart(2, '0'));
    setSelectedMinute(mins.toString().padStart(2, '0'));
    //console.log('logging values', date, hrs, mins);
    let contentData = isMainFlight ? mainFlightData : altFlightData;

    //console.log('ismain', contentData);
    let ETAMins = 0;
    for (let i = 0; i < contentData.length; i++) {
      let item = contentData[i];
      ETAMins += parseInt(item.EET);
      let newDate = addMinutes(date, ETAMins);
      item['ETA'] = `${newDate.getHours().toString().padStart(2, '0')}:${newDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      contentData[i] = item;
      //console.log('eta', item['ETA']);
      global.voyReportOn = item.ETA;
      if (i === 0) {
        global.voyReportOff = item.ETA;
      }
    }
    if (isMainFlight) {
      setMainFlightTimeStamp(
        hrs.toString().padStart(2, '0') +
          ':' +
          mins.toString().padStart(2, '0'),
      );
    } else {
      setAltFlightTimeStamp(
        hrs.toString().padStart(2, '0') +
          ':' +
          mins.toString().padStart(2, '0'),
      );
    }

    if (isMainFlight) {
      //console.log('length', contentData.length);
      setMainFlightData(contentData);
    } else {
      setAltFlightData(contentData);
    }
  };

  const requestExternalStoreageRead = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool App ...',
          message: 'App needs access to external storage',
        },
      );
      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      //Handle this error
      return false;
    }
  };

  /**
   *
   */

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    loadInitialData();

    // const focusListener = props.navigation.addListener('focus', () => {
    //     // The screen is focused
    //     // Call any action
    //     loadInitialData();
    // requestExternalStoreageRead();
    //     accessFileSystem();
    // });

    // // Clean up the focus listener when the component unmounts
    // return () => {
    //     focusListener.remove();
    // };
  }, []);

  const loadInitialData = async () => {
    try {
      const {selectedFlight} = props.route.params;
      console.log('selected ', selectedFlight);
      global.selectedFlightName =
        selectedFlight.FlightNumber + ' - ' + selectedFlight.Sector; //+ ' - MAIN';

      if (selectedFlight.Status !== 'ACTIVE') {
        setIsClosed(true);
      }
      setLoading(true);

      const sqlQueryMainFlight = `SELECT * from ${localDB.tableName.mainFlightPlanTable1} WHERE FlightNumber='${selectedFlight.FlightNumber}'`;
      const mainFlightDetails = await onFetchMainFlightDetailsData(
        sqlQueryMainFlight,
      );

      const sqlQueryAltFlight = `SELECT * from ${localDB.tableName.altFlightPlanTable} WHERE FlightNumber='${selectedFlight.FlightNumber}'`;
      const altFlightDetails = await onFetchALTFlightDetailsData(
        sqlQueryAltFlight,
      );

      setMainFlightData(mainFlightDetails);
      setAltFlightData(altFlightDetails);
      updateFuelCalc(mainFlightDetails);
      updateAltFlightFuelCalc(altFlightDetails);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  // useEffect(() => {
  // //  updateFuelCalc(mainFlightData);
  // //  updateAltFlightFuelCalc(altFlightData);
  //   //  setBeerTimer();
  // }, [mainFlightData, altFlightData]);
  const isMainFlight =
    headerSelectedIndex == 1 && subHeaderSelectedIndex == 0 ? true : false;
  const isAltFlight =
    headerSelectedIndex == 1 && subHeaderSelectedIndex == 1 ? true : false;

  const isFuelSum =
    headerSelectedIndex == 1 && subHeaderSelectedIndex == 2 ? true : false;
  const isRVSM =
    headerSelectedIndex == 1 && subHeaderSelectedIndex == 3 ? true : false;
  const isMetric =
    headerSelectedIndex == 1 && subHeaderSelectedIndex == 4 ? true : false;
  const setBeerTimer = () => {
    const isMainFlight =
      headerSelectedIndex === 1 && subHeaderSelectedIndex === 0 ? true : false;
    let contentData = isMainFlight ? [...mainFlightData] : [...altFlightData];

    const interval = setInterval(() => {
      let date = new Date();
      let hrs = date.getHours().toString().padStart(2, '0');
      let mins = date.getMinutes().toString().padStart(2, '0');
      setCurrentTimeForBeep(hrs + ':' + mins);
    }, 1000 * 60);

    useEffect(() => {
      setDate(new Date());
      for (let i = 0; i < contentData.length; i++) {
        if (
          contentData[i].ETA === currentTimeForBeep &&
          (contentData[i].ATA === null || contentData[i].ATA === '')
        ) {
          const sound1 = new Sound(
            require('../Assets1/beep.wav'),
            (error, sound) => {
              if (error) {
                Alert.alert('error' + error.message);
                return;
              }
              sound1.play(() => {
                sound1.release();
              });
            },
          );
        }
      }
    }, [currentTimeForBeep, contentData]);
  };

  const updateFuelCalc = mainFlightDetails => {
    const length = mainFlightDetails.length;
    setApproachTime(mainFlightDetails[length - 1].ApproachTime);
    setApproachFuel(mainFlightDetails[length - 1].ApproachFuel);
    setTaxiFuel(mainFlightDetails[length - 1].TaxiFuel);
    setLastTimeBurnt(mainFlightDetails[length - 1].TTLB);
    setTotalBurnt(
      parseInt(mainFlightDetails[length - 1].TTLB) +
        parseInt(mainFlightDetails[length - 1].ApproachFuel) +
        parseInt(mainFlightDetails[length - 1].TaxiFuel),
    );
    setLastFuelRemaining(mainFlightDetails[length - 1].RQF);
    setTotalFuelRemaining(
      parseInt(mainFlightDetails[length - 1].RQF) -
        parseInt(mainFlightDetails[length - 1].ApproachFuel) -
        parseInt(mainFlightDetails[length - 1].TaxiFuel),
    );

    setTotalGrossWeight(
      parseInt(mainFlightDetails[length - 1].GWT) -
        (parseInt(mainFlightDetails[length - 1].ApproachFuel) +
          parseInt(mainFlightDetails[length - 1].TaxiFuel)) /
          1000,
    );
  };

  const updateAltFlightFuelCalc = altFlightDetails => {
    let length = altFlightDetails.length;
    setAltFlightApproachTime(altFlightDetails[length - 1].ApproachTime);
    setAltFlightApproachFuel(altFlightDetails[length - 1].ApproachFuel);
    setAltFlightTaxiFuel(altFlightDetails[length - 1].TaxiFuel);
    setAltFlightLastTimeBurnt(altFlightDetails[length - 1].TTLB);
    setAltFlightTotalBurnt(
      parseInt(altFlightDetails[length - 1].TTLB) +
        parseInt(altFlightDetails[length - 1].ApproachFuel) +
        parseInt(altFlightDetails[length - 1].TaxiFuel),
    );
    setAltFlightLastFuelRemaining(altFlightDetails[length - 1].RQF);
    setAltFlightTotalFuelRemaining(
      parseInt(altFlightDetails[length - 1].RQF) -
        parseInt(altFlightDetails[length - 1].ApproachFuel) -
        parseInt(altFlightDetails[length - 1].TaxiFuel),
    );
    // setAltFlightLastGrossWight(altFlightDetails[length - 1].GWT);
    setAltFlightTotalGrossWeight(
      parseInt(altFlightDetails[length - 1].GWT) -
        (parseInt(altFlightDetails[length - 1].ApproachFuel) +
          parseInt(altFlightDetails[length - 1].TaxiFuel)) /
          1000,
    );
  };

  const listHeader = () => {
    const {
      mainFlightData,
      altFlightData,
      headerSelectedIndex,
      subHeaderSelectedIndex,
    } = props;
    const isMainFlight =
      headerSelectedIndex === 1 && subHeaderSelectedIndex === 0 ? true : false;

    return (
      <View style={{marginTop: 5}}>
        <View style={{width: '100%', flexDirection: 'row', paddingVertical: 2}}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '12%',
                paddingLeft: 15,
                paddingVertical: 3,
              }}>
              {listHeaderTitleLine[0]}
            </Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}>
              {listHeaderTitleLine[1]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {listHeaderTitleLine[2]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {listHeaderTitleLine[3]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[4]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[5]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[6]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[7]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}>
              {listHeaderTitleLine[8]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[9]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {listHeaderTitleLine[10]}
            </Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '12%',
              }}>
              {listHeaderTitleLine[11]}
            </Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {' '}
              {listHeaderTitleLine[12]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {listHeaderTitleLine[13]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {listHeaderTitleLine[14]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[15]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[16]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[17]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[18]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[19]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {listHeaderTitleLine[20]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {listHeaderTitleLine[21]}
            </Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '12%',
              }}>
              {listHeaderTitleLine[22]}
            </Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[23]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[24]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {listHeaderTitleLine[25]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[26]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[27]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[28]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[29]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[30]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[31]}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textDecorationLine: 'underline',
              }}>
              {listHeaderTitleLine[32]}
            </Text>

            {/* <TextInput editable={!isClosed} keyboardType='numeric' style={{ ...styles[`textfieldUnderlineStyle${theme}`], ...styles[`textSize${Orientation}`], }} value={item.AFL} onChangeText={(text) => onUpdateFieldValues(index, text, 'AFL')}></TextInput>
                        <TextInput editable={!isClosed} keyboardType='numeric' style={{ ...styles[`textfieldUnderlineStyle${theme}`], ...styles[`textSize${Orientation}`], width: '10%' }} value={item.AWND} onChangeText={(text) => onUpdateFieldValues(index, text, 'AWND')}></TextInput>
                        <Text style={{ ...styles[`textfieldUnderlineStyle${theme}`], ...styles[`textSize${Orientation}`], borderBottomWidth: 0, width: '10%' }}>{ }</Text>
                        <Text style={{ ...styles[`textfieldUnderlineStyle${theme}`], ...styles[`textSize${Orientation}`], borderBottomWidth: 0 }}>{ }</Text>
                        <TextInput editable={!isClosed} keyboardType='numeric' style={{ ...styles[`textfieldUnderlineStyle${theme}`], ...styles[`textSize${Orientation}`], }} value={item.WC} onChangeText={(text) => onUpdateFieldValues(index, text, 'WC')}></TextInput>
                        <TextInput editable={!isClosed} keyboardType='numeric' style={{ ...styles[`textfieldUnderlineStyle${theme}`], ...styles[`textSize${Orientation}`], }} value={item.AD} onChangeText={(text) => onUpdateFieldValues(index, text, 'AD')}></TextInput> */}
            {/* <TextInput editable={!isClosed} keyboardType='numeric' style={{ ...styles[`textfieldUnderlineStyle${theme}`], ...styles[`textSize${Orientation}`], textAlign: 'right', }} value={item.ATA} onChangeText={(text) => this.OnUpdateFieldValues(index, text, 'ATA')}></TextInput> */}
          </View>
        </View>

        <View style={styles[`listHeaderSeperator${theme}`]}></View>
      </View>
    );
  };

  const renderItem = (item, index) => {
    const onUpdateFieldValues = (index, text, fieldName) => {
      try {
        let contentData = isMainFlight
          ? [...mainFlightData]
          : [...altFlightData];
        let item = contentData[index];
        //console.log('item item item', item);
        switch (fieldName) {
          case 'AFL':
            item['AFL'] = text;
            break;
          case 'AWND':
            item['AWND'] = text;
            break;
          case 'WC':
            item['WC'] = text;
            break;
          case 'AD':
            item['AD'] = text;
            break;
          case 'ATA':
            item['ATA'] = text;
            break;
          case 'DISC':
            item['DISC'] = text;
            break;
          default:
            break;
        }

        //console.log('item===', item);
        contentData[index] = item;

        if (isMainFlight) {
          setMainFlightData(contentData);
        } else {
          setAltFlightData(contentData);
        }
      } catch (err) {
        //console.err('OnUpdateFieldValues err', err);
      }
    };
    return (
      <View>
        <View style={{width: '100%', flexDirection: 'row', paddingVertical: 2}}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 5,
            }}>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '12%',
                fontWeight: 'bold',
                paddingLeft: 15,
              }}>
              {item.WPT}
            </Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}>
              {item.MORA}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {item.LAT}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {item.LON}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {item.TRK}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {item.TAS}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {item.OAT}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textAlign: 'right',
              }}>
              {item.DST}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textAlign: 'right',
                fontWeight: 'bold',
                fontStyle: 'italic',
              }}>
              {item.EET}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textAlign: 'right',
              }}>
              {item.EFB}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '7%',
                marginRight: '3%',
                textAlign: 'right',
              }}></Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                paddingLeft: 15,
                width: '12%',
              }}>
              {item.AWY}
            </Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {item.FL}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {item.WV}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}>
              {item.IAS}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {item.MH}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {item.GS}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {item.TDV}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textAlign: 'right',
              }}>
              {item.DRM}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textAlign: 'right',
              }}>
              {item.TRMG}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textAlign: 'right',
              }}>
              {item.TTLB}
            </Text>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '7%',
                marginRight: '3%',
                textAlign: 'right',
                paddingRight: 5,
              }}>
              {item.RQF}
            </Text>

            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                paddingLeft: 15,
                width: '12%',
                fontStyle: 'italic',
                paddingVertical: 0,
              }}>
              {item.FRE}
            </Text>

            <TextInput
              editable={!isClosed}
              keyboardType="numeric"
              style={{
                ...styles[`textfieldUnderlineStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}
              value={item.AFL}
              onChangeText={text =>
                onUpdateFieldValues(index, text, 'AFL')
              }></TextInput>
            <TextInput
              editable={!isClosed}
              keyboardType="numeric"
              style={{
                ...styles[`textfieldUnderlineStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '10%',
              }}
              value={item.AWND}
              onChangeText={text =>
                onUpdateFieldValues(index, text, 'AWND')
              }></TextInput>
            <Text
              style={{
                ...styles[`textfieldUnderlineStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                borderBottomWidth: 0,
                width: '10%',
              }}>
              {}
            </Text>
            <Text
              style={{
                ...styles[`textfieldUnderlineStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                borderBottomWidth: 0,
              }}>
              {}
            </Text>
            <TextInput
              editable={!isClosed}
              keyboardType="numeric"
              style={{
                ...styles[`textfieldUnderlineStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}
              value={item.WC}
              onChangeText={text =>
                onUpdateFieldValues(index, text, 'WC')
              }></TextInput>
            <TextInput
              editable={!isClosed}
              keyboardType="numeric"
              style={{
                ...styles[`textfieldUnderlineStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}
              value={item.AD}
              onChangeText={text =>
                onUpdateFieldValues(index, text, 'AD')
              }></TextInput>
            {/* <TextInput editable={!isClosed} keyboardType='numeric' style={{ ...styles[`textfieldUnderlineStyle${theme}`], ...styles[`textSize${Orientation}`], textAlign: 'right', }} value={item.ATA} onChangeText={(text) => this.OnUpdateFieldValues(index, text, 'ATA')}></TextInput> */}

            <TouchableOpacity
              disabled={isClosed}
              style={{flex: 1}}
              onPress={() => {
                setIsATATimer(true);
                setATAFocusedIndex(index);
                setShowDatePicker(true);
                //  timePickerRef.current.open();
                // this.setState({ isATATimer: true, ATAFocusedIndex: index });
                // this.TimePicker.open();
              }}>
              <TextInput
                pointerEvents="none"
                editable={false}
                showSoftInputOnFocus={false}
                style={{
                  ...styles[`textfieldUnderlineStyle${theme}`],
                  ...styles[`textSize${Orientation}`],
                  width: '90%',
                  textAlign: 'right',
                }}
                value={item.ATA}
                onChangeText={text =>
                  onUpdateFieldValues(index, text, 'ATA')
                }></TextInput>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isClosed}
              style={{
                flex: 1,
                backgroundColor:
                  (currentTimeForBeep == item.ETA && item.ATA == null) ||
                  item.ATA == ''
                    ? 'green'
                    : null,
              }}
              onPress={() => {
                setFocusedItem(item);
                setFocusedIndex(index);
                setIsAirborneTime(false);
                setIsATATimer(false);
                setShowDatePicker(true);
                setDate(new Date());
                if (
                  item.ETA !== '' &&
                  item.ETA !== null &&
                  item.ETA !== undefined
                ) {
                  //console.log('eta', item.ETA);
                  let currentValue = item.ETA.split(':');
                  //console.log('currentValue ==', currentValue);
                  setSelectedHour(currentValue[0].toString().padStart(2, '0'));
                  setSelectedMinute(
                    currentValue[1].toString().padStart(2, '0'),
                  );
                } else {
                  let date = new Date();
                  setSelectedHour(date.getHours().toString().padStart(2, '0'));
                  setSelectedMinute(
                    date.getMinutes().toString().padStart(2, '0'),
                  );
                }
              }}>
              <TextInput
                pointerEvents="none"
                editable={false}
                showSoftInputOnFocus={false}
                keyboardType="numeric"
                style={{
                  fontStyle: 'italic',
                  fontWeight: '600',
                  ...styles[`textfieldUnderlineStyle${theme}`],
                  ...styles[`textSize${Orientation}`],
                  width: '85%',
                  textAlign: 'right',
                }}
                value={item.ETA}></TextInput>
            </TouchableOpacity>
            <Text
              style={{
                ...styles[`headerTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                textAlign: 'right',
                alignSelf: 'flex-end',
                textDecorationLine: 'underline',
              }}>
              {item.GWT}
            </Text>
            <TextInput
              editable={!isClosed}
              keyboardType="numeric"
              style={{
                ...styles[`textfieldUnderlineStyle${theme}`],
                ...styles[`textSize${Orientation}`],
                width: '6%',
                marginLeft: '1%',
                marginRight: '3%',
                textAlign: 'right',
              }}
              value={item.DISC}
              onChangeText={text =>
                onUpdateFieldValues(index, text, 'DISC')
              }></TextInput>
          </View>
        </View>
      </View>
    );
  };

  /**
   *
   * @param {*} clickedIndex  - on close button
   */

  const onFooterClick = async clickedIndex => {
    const {selectedFlight} = props.route.params;
    const isMainFlight =
      headerSelectedIndex === 1 && subHeaderSelectedIndex === 0;
    //console.log('mainFlightData==', mainFlightData);

    if (selectedFlight.Status === 'ACTIVE' && clickedIndex == 0) {
      Alert.alert('Save Changes', 'Would you like to save changes?', [
        {
          text: 'No',
          onPress: () => {
            //console.log('Cancel Pressed');

            navigation.goBack();
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              let flightDataWithStatusUpdate = mainFlightData.map(item => {
                let newItem = {...item};
                const flight = mainFlightData.length;
                const lastFlight = mainFlightData[flight - 1];
                newItem.Status =
                  lastFlight.ATA !== null && lastFlight.ATA !== ''
                    ? 'CLOSED'
                    : 'ACTIVE';
                newItem.Remarks = remarks;
                return newItem;
              });
              // await onCreateMainFlightDetailsTable();

              if (flightDataWithStatusUpdate[0].ETA !== null) {
                global.voyReportOff = '' + flightDataWithStatusUpdate[0].ETA;
                global.voyReportOn =
                  '' +
                  flightDataWithStatusUpdate[
                    flightDataWithStatusUpdate.length - 1
                  ].ETA;
              }

              await onDeleteFlightDetails(selectedFlight.FlightNumber);
              await onInsertMainFlightDetailsData(flightDataWithStatusUpdate);

              for (
                let index = 0;
                index < flightDataWithStatusUpdate.length;
                index++
              ) {
                const updateMainTable = await onUpdateMainFlightDetails({
                  ...flightDataWithStatusUpdate[index],
                  isUpdated: 1,
                });
                if (updateMainTable == 'update success' && networks) {
                  const mainTableApi = await MainTableApi(
                    flightDataWithStatusUpdate[index],
                  );

                  if (mainTableApi.response == 'update') {
                    const dataNeeded = await onUpdateMainFlightDetails({
                      ...flightDataWithStatusUpdate[index],
                      isPushed: 1,
                    });
                  }
                }
              }

              let altFlightDataWithStatusUpdate = altFlightData.map(item => {
                let newItem = {...item};
                newItem.Status = 'CLOSED';
                return newItem;
              });
              // await onCreateMainFlightDetailsTable();

              if (altFlightDataWithStatusUpdate[0].ETA !== null) {
                global.voyReportOff = '' + altFlightDataWithStatusUpdate[0].ETA;
                global.voyReportOn =
                  '' +
                  altFlightDataWithStatusUpdate[
                    altFlightDataWithStatusUpdate.length - 1
                  ].ETA;
              }

              await onDeleteAltFlightDetails(selectedFlight.FlightNumber);
              await onInsertALTFlightDetailsData(altFlightDataWithStatusUpdate);

              setRemarks('');
              navigation.goBack();
            } catch (err) {
              //console.log('Failed to save the changes', err);
              Alert('Failed to save the changes');
            }
          },
        },
      ]);
    } else if (clickedIndex == 4) {
      global.screen = 'techlog';
      global.screenHeadder = 'techlog';
      await onDeleteFlightDetails(selectedFlight.FlightNumber);
      await onInsertMainFlightDetailsData(mainFlightData);

      await onDeleteAltFlightDetails(selectedFlight.FlightNumber);
      await onInsertALTFlightDetailsData(altFlightData);

      navigation.goBack();
    } else if (clickedIndex == 6) {
      global.screen = 'voy';
      global.screenHeadder = 'voy';
      await onDeleteFlightDetails(selectedFlight.FlightNumber);
      await onInsertMainFlightDetailsData(mainFlightData);

      await onDeleteAltFlightDetails(selectedFlight.FlightNumber);
      await onInsertALTFlightDetailsData(altFlightData);

      navigation.goBack();
    } else {
      // Save data before going to back
      await onDeleteFlightDetails(selectedFlight.FlightNumber);
      await onInsertMainFlightDetailsData(mainFlightData);

      await onDeleteAltFlightDetails(selectedFlight.FlightNumber);
      await onInsertALTFlightDetailsData(altFlightData);

      navigation.goBack();
    }
  };

  const onFooterExit = () => {
    navigation.goBack();
  };
  onCancel = () => {
    setShowDatePicker(false);
  };
  // const { mainFlightData, altFlightData } = props;
  // const { selectedFlight } = props.route.params;
  // const [headerSelectedIndex, setHeaderSelectedIndex] = useState(0);
  // const [subHeaderSelectedIndex, setSubHeaderSelectedIndex] = useState(0);
  // const [isMainFlightSelected, setIsMainFlightSelected] = useState(true);

  const handleHeaderIndexChange = async (
    clickedType,
    selectedIndex,
    isMainFlightSelected,
  ) => {
    console.log(
      'clickedType !!!!!!!!!!!!!!!!!!!!!!!',
      props.route.params.selectedFlight,
    );
    const neededFlightDetails = props.route.params.selectedFlight;
    if (clickedType === 'HEADER' && selectedIndex === 5) {
      // Save data before going to home
      await onDeleteFlightDetails(neededFlightDetails.FlightNumber);
      await onInsertMainFlightDetailsData(mainFlightData);

      await onDeleteAltFlightDetails(neededFlightDetails.FlightNumber);
      await onInsertALTFlightDetailsData(altFlightData);

      navigation.goBack();
      return;
    }

    if (clickedType === 'SUBHEADER') {
      //console.log('isMainFlightSelected ==', isMainFlightSelected);
      setIsMainFlightSelected(isMainFlightSelected);
    }

    switch (clickedType) {
      case 'HEADER': {
        setHeaderSelectedIndex(selectedIndex);
        break;
      }
      case 'SUBHEADER': {
        //console.log('needed header',selectedIndex)
        setSubHeaderSelectedIndex(selectedIndex);
        break;
      }
    }
  };
  const updateATATimerValues = (hour, minute) => {
    //console.log('coming coming cominf');
    // const { isATATimer, ATAFocusedIndex, focusedIndex, mainFlightData, altFlightData, isAirborneTime, headerSelectedIndex, subHeaderSelectedIndex } = this.state;
    const isMainFlight =
      headerSelectedIndex == 1 && subHeaderSelectedIndex == 0 ? true : false;
    // var date = new Date(minute);

    // var hours = date.getHours(); // Get the hour (in 24-hour format)
    // var minutes = date.getMinutes();
    //       setSelectedHour(hour.toString().padStart(2, '0'))
    // setSelectedMinute(minute.toString().padStart(2, '0'))
    //console.log('needed //console', hour, minute);
    if (isAirborneTime) {
      let date = new Date();
      let currentHrs = date.getHours();
      let currentMins = date.getMinutes();
      let currentTimeSecs = currentHrs * 60 * 60 + currentMins * 60;
      let selectedTimeSecs = hour * 60 * 60 + minute * 60;

      if (selectedTimeSecs > currentTimeSecs) {
        Alert.alert('Time should be less than current time');
        return;
      }
    }
    setSelectedHour(hour.toString().padStart(2, '0'));
    setSelectedMinute(minute.toString().padStart(2, '0'));
    if (!isAirborneTime) {
      let contentData = isMainFlight ? [...mainFlightData] : [...altFlightData];
      let item = contentData[ATAFocusedIndex];
      //console.log('item1', item);
      item['ATA'] = `${hour}:${minute}`;

      contentData[ATAFocusedIndex] = item;
      if (isMainFlight) {
        setMainFlightData(contentData);
      } else {
        setAltFlightData(contentData);
      }

      if (ATAFocusedIndex < contentData.length - 1) {
        updateBelowTimeValues(hour, minute);
      }
    } else {
      onAirborneClick(hour, minute);
    }
    setShowDatePicker(false);
  };

  return (
    <>
      <View style={[styles[`container${theme}`]]}>
        <Spinner visible={loading} textContent="Loading" size="large" />
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'clock'}
            onChange={(event, minute) => {
              if (event.type === 'set') {
                // Handle confirmation

                onConfirm(event, minute);
              } else if (event.type === 'dismissed') {
              }
            }}
          />
        )}

        <OFPHeaderComp
          onClick={handleHeaderIndexChange}
          // isDisableAltFuelSum={global.userName == "Suneet" ? true : false}
          data={{
            headerIndex: 1,
            subHeaderIndex: 1,
            headerClickedIndex: 1,
            subHeaderClickedIndex: subHeaderSelectedIndex,
          }}></OFPHeaderComp>

        {isMainFlight && !isRVSM && !isMetric && (
          <View style={{flex: 1, width: '100%'}}>
            {listHeader()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingRight: '18.7%',
                paddingVertical: 5,
                marginBottom: 5,
                height: 25,
              }}>
              <TouchableOpacity
                disabled={isClosed}
                onPress={() => {
                  onAirborneClick();
                }}>
                <Text
                  style={{
                    ...styles[`headerAirborneTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }}>
                  Diversion Time{' '}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isClosed}
                style={{width: '10%'}}
                onPress={() => {
                  let date = new Date();

                  setIsAirborneTime(true),
                    setSelectedHour(
                      date.getHours().toString().padStart(2, '0'),
                    );
                  setSelectedMinute(
                    date.getMinutes().toString().padStart(2, '0'),
                  );
                  setDate(new Date());
                  setShowDatePicker(true);
                }}>
                <TextInput
                  value={mainFlightTimeStamp}
                  pointerEvents="none"
                  editable={false}
                  style={{
                    ...styles[`headerAirborneTextStyle${theme}`],
                    ...styles[`textfieldUnderlineStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '87%',
                    marginRight: '2%',
                    textAlign: 'right',
                  }}></TextInput>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal="false">
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={mainFlightData}
                // ListHeaderComponent={this.listHeader}
                renderItem={({item, index}) =>
                  renderItem(item, index)
                }></FlatList>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  marginTop: 10,
                  width: '42%',
                }}>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '36.36%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  Approach
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '18.18%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  {approachTime}
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '20.18%',
                    textAlign: 'right',
                  }}>
                  {approachFuel}
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '25.27%',
                    textAlign: 'right',
                  }}></Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  width: '26.5%',
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '28.57%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  Taxi
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '30.57%',
                    textAlign: 'right',
                  }}>
                  {TaxiFuel}
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '40.85%',
                    textAlign: 'right',
                  }}></Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  width: '34.2%',
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '44.44%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  Total Burn Off
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '24.22%',
                    textAlign: 'right',
                  }}>
                  {totalBurnt}
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '23.33%',
                    marginRight: '8%',
                    textAlign: 'right',
                  }}>
                  {totalFuelRemaining}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  width: '26.5%',
                  marginTop: 5,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '28.57%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}></Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '31.57%',
                    textAlign: 'right',
                    textDecorationLine: 'underline',
                    textAlignVertical: 'bottom',
                    height: 20,
                  }}>
                  {totalGrossWeight}
                </Text>
                <TextInput
                  editable={!isClosed}
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '24.85%',
                    marginLeft: '6%',
                    marginRight: '10%',
                    textAlign: 'right',
                    borderBottomColor: COLORS.LighterBlue,
                    borderBottomWidth: 0.5,
                    paddingVertical: 0,
                    height: 15,
                  }}></TextInput>
              </View>
              <View>
                <Text
                  style={{
                    marginLeft: 10,
                    color: 'black',
                    marginBottom: 5,
                  }}>
                  Remarks :
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: 'black',
                    marginHorizontal: 10,
                    height: 20,
                    marginBottom: 10,
                  }}
                  onChangeText={e => {
                    console.log('value', e);
                    setRemarks(e);
                  }}></TextInput>
              </View>
            </ScrollView>
          </View>
        )}

        {isAltFlight && (
          <View style={{flex: 1, width: '100%'}}>
            {listHeader()}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingRight: '18.7%',
                paddingVertical: 5,
                height: 25,
              }}>
              <TouchableOpacity
                disabled={isClosed}
                onPress={() => {
                  onAirborneClick();
                }}>
                <Text
                  style={{
                    ...styles[`headerAirborneTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }}>
                  Airborne{' '}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isClosed}
                style={{width: '10%'}}
                onPress={() => {
                  let date = new Date();
                  // console.log(
                  //   'selected hours ==',
                  //   date.getHours().toString().padStart(2, '0'),
                  //   'selectedMinute==',
                  //   date.getMinutes().toString().padStart(2, '0'),
                  // );
                  setIsAirborneTime(true);
                  setSelectedHour(date.getHours().toString().padStart(2, '0'));
                  setSelectedMinute(
                    date.getMinutes().toString().padStart(2, '0'),
                  );
                  setDate(new Date());
                  setShowDatePicker(true);
                }}>
                <TextInput
                  value={altFlightTimeStamp}
                  pointerEvents="none"
                  editable={false}
                  style={{
                    ...styles[`headerAirborneTextStyle${theme}`],
                    ...styles[`textfieldUnderlineStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '87%',
                    marginRight: '2%',
                    textAlign: 'right',
                  }}></TextInput>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal="false">
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={altFlightData}
                renderItem={({item, index}) =>
                  renderItem(item, index)
                }></FlatList>

              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  marginTop: 10,
                  width: '42%',
                }}>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '36.36%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  Approach
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '20.18%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  {AltFlightApproachTime}
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '18.18%',
                    textAlign: 'right',
                  }}>
                  {AltFlightApproachFuel}
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '27.27%',
                    textAlign: 'right',
                  }}></Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  width: '26.5%',
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '28.57%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  Taxi
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '30.57%',
                    textAlign: 'right',
                  }}>
                  {AltFlightTaxiFuel}
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '40.85%',
                    textAlign: 'right',
                  }}></Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  width: '34.2%',
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '44.44%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}>
                  Total Burn Off
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '24.22%',
                    textAlign: 'right',
                  }}>
                  {AltFlightTotalBurnt}
                </Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '23.33%',
                    marginRight: '8%',
                    textAlign: 'right',
                  }}>
                  {AltFlightTotalFuelRemaining}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  width: '26.5%',
                  marginTop: 5,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '28.57%',
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}></Text>
                <Text
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '31.57%',
                    textAlign: 'right',
                    textDecorationLine: 'underline',
                    textAlignVertical: 'bottom',
                    height: 20,
                  }}>
                  {AltFlightTotalGrossWeight}
                </Text>
                <TextInput
                  editable={!isClosed}
                  style={{
                    ...styles[`approachTaxiTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                    width: '24.85%',
                    marginLeft: '6%',
                    marginRight: '12%',
                    textAlign: 'right',
                    borderBottomColor: COLORS.LighterBlue,
                    borderBottomWidth: 0.5,
                    paddingVertical: 0,
                    height: 15,
                  }}></TextInput>
              </View>
            </ScrollView>
          </View>
        )}

        
        {isFuelSum && !isMainFlight && !isAltFlight && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <FuelSumComp
              onClick={onFooterExit}
              data={{
                headerIndex: 1,
                subHeaderIndex: 1,
                headerClickedIndex: 1,
                subHeaderClickedIndex: 2,
                isMainFlightSelected,
                FlightNumber: isMainFlightSelected
                  ? mainFlightData[0].FlightNumber
                  : altFlightData[0].FlightNumber,
              }}></FuelSumComp>
          </View>
        )}

        {isRVSM && !isMainFlight && !isAltFlight && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <RVSMComp
              onClick={onFooterExit}
              data={{
                headerIndex: 1,
                subHeaderIndex: 1,
                headerClickedIndex: 1,
                subHeaderClickedIndex: 3,
                isMainFlightSelected,
                FlightNumber: isMainFlightSelected
                  ? mainFlightData[0].FlightNumber
                  : altFlightData[0].FlightNumber,
                Sector: isMainFlightSelected
                  ? mainFlightData[0].Sector
                  : altFlightData[0].Sector,
              }}></RVSMComp>
          </View>
        )}

        {isMetric && !isMainFlight && !isAltFlight && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <MetricComp
              onClick={onFooterExit}
              data={{
                headerIndex: 1,
                subHeaderIndex: 1,
                headerClickedIndex: 1,
                subHeaderClickedIndex: 4,
                isMainFlightSelected,
                FlightNumber: isMainFlightSelected
                  ? mainFlightData[0].FlightNumber
                  : altFlightData[0].FlightNumber,
              }}></MetricComp>
          </View>
        )}

        {/* <Text style={{ ...styles[`approachTaxiTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}>Coming soon</Text> */}

        {(isMainFlight || isAltFlight) && (
          <FooterComp onFooterClick={onFooterClick}></FooterComp>
        )}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  containerLight: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  containerDark: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  listHeaderSeperatorLight: {
    backgroundColor: COLORS.Black,
    height: 1.5,
    paddingVertical: 0,
  },
  listHeaderSeperatorDark: {
    backgroundColor: COLORS.FluorescentGreen,
    height: 1.5,
    paddingVertical: 0,
  },
  headerTextStyleLight: {
    width: '7%',
    marginRight: '0.8%',
    // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 7,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: COLORS.Black,
  },
  headerTextStyleDark: {
    width: '7%',
    marginRight: '0.8%',
    // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 7,
    textAlign: 'left',
    textAlignVertical: 'center',
    color: COLORS.FluorescentGreen,
  },
  headerAirborneTextStyleLight: {
    //  fontSize: (IS_IPAD || IS_TABLET) ? 10 : 7,
    fontWeight: 'bold',
    paddingTop: 3,
    textAlignVertical: 'bottom',
    height: 24,
    color: COLORS.Black,
  },
  headerAirborneTextStyleDark: {
    // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 7,
    fontWeight: 'bold',
    textAlignVertical: 'bottom',
    paddingTop: 3,
    height: 24,
    color: COLORS.LighterBlue,
  },
  textfieldUnderlineStyleLight: {
    width: '7.5%',
    marginRight: '0.5%',
    borderBottomColor: COLORS.LighterGrey,
    borderBottomWidth: 1,
    // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 7,
    height: 24,
    paddingVertical: 0,
    paddingRight: 0,
    color: COLORS.Black,
  },
  textfieldUnderlineStyleDark: {
    width: '7.5%',
    marginRight: '0.5%',
    borderBottomColor: COLORS.LighterBlue,
    borderBottomWidth: 1,
    // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 7,
    height: 24,
    paddingVertical: 0,
    paddingRight: 0,
    color: COLORS.LighterBlue,
  },
  approachTaxiTextStyleLight: {
    // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 7,
    color: COLORS.Black,
  },
  approachTaxiTextStyleDark: {
    // fontSize: (IS_IPAD || IS_TABLET) ? 10 : 7,
    color: COLORS.FluorescentGreen,
  },
  textSizePortrait: {
    // fontSize: 14,
    fontSize: isTablet ? 14 : 6,
  },
  textSizeLandscape: {
    // fontSize: 18,
    fontSize: isTablet ? 18 : 14,
  },
});
export default OFPComponent;
