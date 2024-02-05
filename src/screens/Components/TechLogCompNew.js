/* eslint-disable */
import React, { useContext,useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
import ConfigData from '../../ConfigData/ConfigJson';
import { ThemeContext } from '../../Utilis/ThemeManager';
import { IS_IPAD, IS_TABLET, isTablet } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import { API } from '../../constants/index';
import api from '../../API-Axios/axios';
import DropDownPicker from 'react-native-dropdown-picker';

import SegmentedControlTab from "react-native-segmented-control-tab";
import { FlatList, TextInput } from 'react-native-gesture-handler';

import { onInsertFaultReportData, onFetchFaultReportData, onUpdateFaultReportDetails } from '../../dbmanager/fault-report-table';
import colors from '../../constants/colors';

const TechLogCompNew = (props) => {
    const themeContext = useContext(ThemeContext);
    const { theme, Orientation } = themeContext;

    const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;

    let bgColor = themeContext.theme == 'Dark' ? colors.Black : colors.White;
        let tableHeaderBgColor = themeContext.theme == 'Dark' ? colors.Black : colors.LighterGrey;
        let tableRowBgColor = themeContext.theme == 'Dark' ? colors.Black : colors.White;

    const [currentFaultItem, setCurrentFaultItem] = useState('');
    const [country, setCountry] = useState('AP_amber_warning_annunciator_light');
    const [numberOfRows, setNumberOfRows] = useState([1]);
    const [submittedArr, setSubmittedArr] = useState([]);
    const [faultReportArr, setFaultReportArr] = useState([{ label: '', value: '', observation: [{ label: '', value: '' }], remarks: '' }]);
    const [selectedFaultObservationArr, setSelectedFaultObservationArr] = useState([{ label: '', value: '' }]);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(0);

    const [isVisibleA, setIsVisibleA] = useState(false);
    const [isVisibleB, setIsVisibleB] = useState(false);

    const [lastSelectedObservationIndex, setLastSelectedObservationIndex] = useState(0);
    const [faultSystemArr, setFaultSystemArr] = useState([]);
    const [faultReportMainData, setFaultReportMainData] = useState('');
    const [headerClickedIndex, setHeaderClickedIndex] = useState(5);
    const [subHeaderClickedIndex, setSubHeaderClickedIndex] = useState(1);
    const [titleData, setTitleData] = useState(['FLTNO', 'FROM', 'TO', 'OUT', 'OFF', 'ON', 'IN', 'BLK', 'NIGHT', 'DELAY', 'REASON']);
    const [subTitleData, setSubTitleData] = useState(['ABC1234', 'CCU', 'BLR', '0:00', '0:00', '0:00', '0:00', '', '', '', '']);
    const [isDMR, setIsDMR] = useState(true);
    const [isTechLog, setIsTechLog] = useState(false);
    const [isFaultReport, setIsFaultReport] = useState(false);
    const [tableHead, setTableHead] = useState(['', 'Head1', 'Head2']);
    const [tableTitle, setTableTitle] = useState(['Title', 'Title2', 'Title3', 'Title4']);
    const [tableData, setTableData] = useState([
        ['1', '2', '3'],
        ['a', 'b', 'c'],
        ['1', '2', '3'],
        ['1', '2', '3'],
    ]);
    const [isDarkTheme,setIsDarkTheme] = useState('');
    useEffect(() => {
        // const themeContext = useContext(ThemeContext);
        const { data } = props;
        loadInitialData();

     setIsDarkTheme(themeContext.theme === 'Dark');
        setHeaderClickedIndex(data.headerClickedIndex);
        setSubHeaderClickedIndex(data.subHeaderClickedIndex);
    }, []);
    const changeVisibility = (state) => {
        setIsVisibleA(false);
        setIsVisibleB(false);
        setState(state);
    };

    const loadInitialData = async () => {
        try {
            const { data, status, statusText } = await api.get(API + '/Fault_Mgt.json', '');
            console.log("api", API)
            console.log('techlog data===', Object.keys(data.MAIN).length);
    
            let keysArr = Object.keys(data.MAIN);
            let faultSystemModifiedArr = [];
            for (let i = 0; i < keysArr.length; i++) {
                let item = {
                    label: keysArr[i],
                    value: keysArr[i],
                    observation: data.MAIN[keysArr[i]].L,
                    remarks: ''
                }
                faultSystemModifiedArr.push(item);
            }
    
            //modify observations array required for dropdown controller
            //let newArr = faultSystemModifiedArr.splice(0, 20);
            let newArr = faultSystemModifiedArr;
    
            console.log('newArr before observations ==', newArr);
    
            let newArrObservationsJson = [...newArr];
    
            for (let i = 0; i < newArr.length; i++) {
                for (let j = 0; j < newArrObservationsJson[i].observation.length; j++) {
    
                    console.log('newArrObservationsJson[i].observation[j]==', newArrObservationsJson[i].observation[j]);
                    if (typeof newArrObservationsJson[i].observation[j] === 'object' && newArrObservationsJson[i].observation[j] !== null) {
                        console.log('Errrrrrrr');
                    } else {
                        let item = {
                            label: newArr[i].observation[j],
                            value: newArr[i].observation[j]
                        }
                        console.log('item =', item);
                        newArr[i].observation.splice(j, 1, item);
                    }
    
                    // newArrObservationsJson[i].observation[j] = null;
                    // newArrObservationsJson[i].observation[j] = item;
                    // newArr[i].observation[j].label = item.label;
                    // newArr[i].observation[j].value = item.value;
                }
            }
            console.log('newArrObservationsJson ==', newArrObservationsJson);
    
            setFaultSystemArr(newArrObservationsJson); // faultSystemModifiedArr.splice(0, 10)
            setFaultReportMainData(data.MAIN);
    
            //console.log('faultSystemModifiedArr ==', faultSystemModifiedArr.splice(0, 10));
    
            // Get fault report data from the database
            let previousFaultReportData = await onFetchFaultReportData();
            console.log(' previousFaultReportData length = ', previousFaultReportData.length);
            let lt = previousFaultReportData.length;
            let newArrdB = [...submittedArr];
            for (var i = 0; i < lt; i++) {
                let previousFaultReportDataItem = previousFaultReportData[i];
                console.log('Fligt Number = ', previousFaultReportDataItem.FlightNumber);
                // if(previousFaultReportDataItem.FlightNumber === global.activeFlightNumber){
                let submitObj = {
                    flightNumber: previousFaultReportDataItem.FlightNumber,
                    systemValue: previousFaultReportDataItem.SystemValue,
                    observationValue: previousFaultReportDataItem.ObservationValue,
                    remarksValue: previousFaultReportDataItem.RemarksValue
                }
                newArrdB.push(submitObj);
                // }
                setSubmittedArr(newArrdB);
                setCurrentFaultItem('');
                setSelectedFaultObservationArr([{ value: '', label: '' }]);
                setLastSelectedObservationIndex(0);
            }
        } catch (err) {
           
            console.log('techlog data err', err);
        }
    };
    
    /**
     * 
     * @param {*} clickdButton 
     */

    const onRadioButtonsClick = (clickdButton) => {
        switch (clickdButton) {
            case 'DMR': {
                setIsDMR(true);
                setIsTechLog(false);
                setIsFaultReport(false);
                break;
            }
    
            case 'TECHLOG': {
                setIsDMR(false);
                setIsTechLog(true);
                setIsFaultReport(false);
                break;
            }
    
            case 'FAULTREPORT': {
                setIsDMR(false);
                setIsTechLog(false);
                setIsFaultReport(true);
                break;
            }
        }
    };

    const addFaultReportRowNew = (item, flatListindex) => {
    //     const themeContext = useContext(ThemeContext);
    // const { theme } = themeContext;
    // const Orientation = themeContext.Orientation;
     const isDarkTheme = themeContext.theme === 'Dark';

    
        console.log('lastSelectedIndex ==', lastSelectedIndex, 'lastSelectedObservationIndex ==', lastSelectedObservationIndex, 'flatListIndex ===', flatListindex);
        console.log('numberOfRows ==', numberOfRows);
        console.log('selectedFaultObservationArr == ', selectedFaultObservationArr);

    let tableHeaderBgColor = isDarkTheme ? colors.Black : colors.LighterGrey;
    let tableRowBgColor = isDarkTheme ? colors.Black : colors.White;
    let arrowClr = isDarkTheme ? colors.FluorescentGreen : colors.DarkerGrey;

    console.log('faultReportArr before render ==', faultReportArr);
        console.log('faultReportArr[flatListindex].observation ==', faultReportArr[flatListindex].observation)
        console.log('faultReportArr[flatListindex].observation[lastSelectedObservationIndex] ==', faultReportArr[flatListindex].observation[lastSelectedObservationIndex]);

        let faultArrSelectionIndex = (flatListindex == 0 && numberOfRows.length > 1) ? numberOfRows.length - 1 : flatListindex;
        console.log('faultArrSelectionIndex ==', faultArrSelectionIndex);


        console.log('valueee=====', faultReportArr[flatListindex].observation[lastSelectedObservationIndex].value);
        let secDropDownValue = faultReportArr[flatListindex].observation[lastSelectedObservationIndex].value;

        return (
            <View style={{ flexDirection: 'row', paddingBottom: 200 }}>
        
                <View style={{ backgroundColor: tableHeaderBgColor, borderRightColor: colors.DarkerGrey, borderRightWidth: 0.5, width: '30%' }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], height: Platform.OS === 'ios' ? null : 35, paddingVertical: 8.5, borderWidth: 0.5, borderColor: colors.DarkerGrey }}>SYSTEM</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], height: Platform.OS === 'ios' ? null : 35, paddingVertical: 8.5, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey }}>OBSERVATION</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], height: Platform.OS === 'ios' ? null : 35, paddingVertical: 8.5, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey }}>REMARKS</Text>
                </View>
        
                <View style={{ width: '70%' }}>
        
                    <DropDownPicker
                        isVisible={isVisibleA}
                        onOpen={() => changeVisibility({ isVisibleA: true })}
                        onClose={() => changeVisibility({ isVisibleA: false })}
                        searchable={true}
                        searchablePlaceholder="Search for an item"
                        searchablePlaceholderTextColor={colors.DarkerGrey}
                        seachableStyle={{}}
                        searchableError={() => <Text>Not Found</Text>}
                        onSearch={text => {
                            console.log('search term ==', text);
                        }}
                        dropDownMaxHeight={250}
                        arrowColor={arrowClr}
                        items={faultSystemArr}
                        defaultValue={currentFaultItem.value}
                        // containerStyle={{ height: 35 }}
                        style={{
                            backgroundColor: tableRowBgColor, borderColor: colors.LighterGrey, borderWidth: 0.5, height: 35,
                            borderTopLeftRadius: 0, borderTopRightRadius: 0,
                            borderBottomLeftRadius: 0, borderBottomRightRadius: 0
                        }}
                        arrowStyle={{ height: 35, marginTop: 18 }}
                        labelStyle={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], textAlign: 'left' }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: tableRowBgColor, borderColor: colors.LighterGrey, borderWidth: 1 }}
                        onChangeItem={(item, index) => {
        
                            
                            console.log('faultSystemArr[index] ==', faultSystemArr[index]);
                            console.log('selected item =', item, 'index ==', index);
                            console.log('selected item observations ==', item.observation);
                            let faultArr = [];
                            faultArr = [...faultReportArr];
                            faultArr.splice(numberOfRows.length - 1, 1, item);
        
                            console.log('faultArr ==', faultArr);
        
                            console.log('selectedFaultObservationArr ==', faultArr[flatListindex].observation)
        
                            setCurrentFaultItem(item);
                            setFaultReportArr(faultArr);
                            setSelectedFaultObservationArr(faultArr[flatListindex].observation); //faultSystemArr[index].observation,
                            setLastSelectedIndex(index);
                            setLastSelectedObservationIndex(0);
                        }
                        }
                    />
        
                    <DropDownPicker
        
                        isVisible={isVisibleB}
                        onOpen={() => changeVisibility({ isVisibleB: true })}
                        onClose={() => changeVisibility({ isVisibleB: false })}
                        searchable={true}
                        searchablePlaceholder="Search for an item"
                        searchablePlaceholderTextColor={colors.DarkerGrey}
                        seachableStyle={{}}
                        searchableError={() => <Text>Not Found</Text>}
                        onSearch={text => {
                            console.log('search term ==', text);
                        }}
                        items={selectedFaultObservationArr}
                        defaultValue={selectedFaultObservationArr[lastSelectedObservationIndex].value}
                        // containerStyle={{ height: 35, borderColor: colors.LighterGrey, borderWidth: 0.5 }}
                        style={{
                            backgroundColor: tableRowBgColor, borderColor: colors.LighterGrey, borderWidth: 0.5, height: 35, borderTopLeftRadius: 0, borderTopRightRadius: 0,
                            borderBottomLeftRadius: 0, borderBottomRightRadius: 0
                        }}
                        arrowStyle={{ height: 35, marginTop: 18 }}
                        arrowColor={arrowClr}
                        dropDownMaxHeight={200}
                        labelStyle={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], textAlign: 'left' }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: tableRowBgColor, borderColor: colors.LighterGrey, borderWidth: 1 }}
                        onChangeItem={(item, index) => {
                        
                            console.log('sec dropdown selected item =', item, 'index ==', index);
                            setLastSelectedObservationIndex(index);
                        }
                        }
                    />
        
                    <TextInput
                        placeholder='Enter remarks'
                        onChangeText={(text) => {
                            let data = [...faultReportArr];
                            let item = data[flatListindex];
                            item.remarks = text;
                            data[flatListindex] = item;
                            setFaultReportArr(data);
                        }}
                        placeholderTextColor={colors.DarkerGrey}
                        value={currentFaultItem.remarks}
                        style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, height: 35, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey }}
                    />
                </View>
            </View>
        )
        
    }
    
     /**
     * 
     * @param {*} item 
     * @param {*} index 
     */

    const renderFaultReportValues = (item, index) => {

        // const themeContext = useContext(ThemeContext);
        // const { theme, Orientation } = themeContext;

        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>{item.flightNumber}</Text>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>{item.systemValue}</Text>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>{item.observationValue}</Text>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>{item.remarksValue}</Text>
            </View>
        )
    }

     /**
     * 
     */

     const renderFooterItem = () => {
        // const themeContext = useContext(ThemeContext)
        // const { theme, Orientation } = themeContext;
        const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;

        let itemWidth = 100 / 8;

        const themeStyle = theme == "Light" ? styles.tabStyleLight : styles.tabStyleDark;
        const textFieldTabBgColor = theme == "Light" ? '#fff' : '#000';
        const checkFontColor = theme == "Light" ? colors.Black : colors.FluorescentGreen;

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
                <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth * 2}%` }} onPress={async() => {


let submitObj = {
    flightNumber: global.activeFlightNumber,
    systemValue: currentFaultItem.value,
    observationValue: selectedFaultObservationArr[lastSelectedObservationIndex].value,
    remarksValue: currentFaultItem.remarks
};

console.log('submitObj ==', submitObj);

let faultReportDbData = [{
    FlightNumber: global.activeFlightNumber,
    SystemValue: currentFaultItem.value,
    ObservationValue: selectedFaultObservationArr[lastSelectedObservationIndex].value,
    RemarksValue: currentFaultItem.remarks
}];

const insertToFaultReportTable = await onInsertFaultReportData(faultReportDbData);

let newArr = [...submittedArr];
newArr.push(submitObj);

setSubmittedArr(prevSubmittedArr => [...prevSubmittedArr, submitObj]);
        setCurrentFaultItem('');
        setSelectedFaultObservationArr([{ value: '', label: '' }]);
        setLastSelectedObservationIndex(0);
}} >
<Text style={{ ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}>SUBMIT</Text>
</TouchableOpacity>
            </View>
        )
     }

    return (
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 30, flex: 1, backgroundColor: bgColor }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '80%' }}>
            <TouchableOpacity style={{ width: '25%' }} onPress={() => onRadioButtonsClick('DMR')} >
                        <LinearGradient colors={isDMR ? ['#2f4f4f', '#2f4f4f', '#2f4f4f'] : ['#929292', '#929292', '#929292']} style={{ alignSelf: 'center', width: '100%' }} >
                            <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], ...styles.radioBtnStyle, color: isDMR ? colors.FluorescentGreen : colors.Black }}>
                                DMR
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '25%' }} onPress={() => onRadioButtonsClick('TECHLOG')} >
                        <LinearGradient colors={isTechLog ? ['#2f4f4f', '#2f4f4f', '#2f4f4f'] : ['#929292', '#929292', '#929292']} style={{ alignSelf: 'center', width: '100%' }} >
                            <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], ...styles.radioBtnStyle, color: isTechLog ? colors.FluorescentGreen : colors.Black }}>
                                TECH LOG
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '25%' }} onPress={() => onRadioButtonsClick('FAULTREPORT')} >
                        <LinearGradient colors={isFaultReport ? ['#2f4f4f', '#2f4f4f', '#2f4f4f'] : ['#929292', '#929292', '#929292']} style={{ alignSelf: 'center', width: '100%' }} >
                            <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], ...styles.radioBtnStyle, color: isFaultReport ? colors.FluorescentGreen : colors.Black, }}>
                                FAULT REPORT
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
            </View>

            {isDMR && <View style={{ alignSelf: 'center', marginTop: 30, width: '100%' }}>
                    <View style={{ flexDirection: 'row', backgroundColor: tableHeaderBgColor }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>Date</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '55%' }}>SNAG</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>DEFFERED TILL</Text>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>22 JAN 21</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '55%' }}></Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}></Text>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>12 JAN 21</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '55%' }}></Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}></Text>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>24 JAN 21</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '55%' }}></Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}></Text>
                    </View>
                </View>}

                {isTechLog && <View style={{ alignSelf: 'center', marginTop: 30, width: '100%' }}>
                    <View style={{ flexDirection: 'row', backgroundColor: tableHeaderBgColor, justifyContent: 'center' }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>ITEM</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>VALIDITY</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>REMARKS</Text>
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor, justifyContent: 'center' }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%', textAlignVertical: 'center' }}>DAILY INSPECTION</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%', textAlignVertical: 'center' }}>DATE</Text>
                        {/* <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>TEXT</Text> */}
                        <TextInput style={{ ...styles[`textSize${Orientation}`], ...styles[`textInputHeight${Orientation}`], paddingLeft: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }} placeholder='Enter Remarks'></TextInput>

                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor, justifyContent: 'center' }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%', textAlignVertical: 'center' }}>WEEKLY INSPECTION</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%', textAlignVertical: 'center' }}></Text>
                        {/* <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text> */}
                        <TextInput style={{ ...styles[`textSize${Orientation}`], ...styles[`textInputHeight${Orientation}`], textAlignVertical: 'top', paddingLeft: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }} placeholder='Enter Remarks'></TextInput>

                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor, justifyContent: 'center' }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%', textAlignVertical: 'center' }}>RVSM</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%', textAlignVertical: 'center' }}></Text>
                        {/* <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text> */}
                        <TextInput style={{ ...styles[`textSize${Orientation}`], ...styles[`textInputHeight${Orientation}`], textAlignVertical: 'top', paddingLeft: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }} placeholder='Enter Remarks'></TextInput>

                    </View>

                    <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor, justifyContent: 'center' }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%', textAlignVertical: 'center' }}>AUTO-LAND CAT 3</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%', textAlignVertical: 'center' }}></Text>
                        {/* <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text> */}
                        <TextInput style={{ ...styles[`textSize${Orientation}`], ...styles[`textInputHeight${Orientation}`], textAlignVertical: 'top', paddingLeft: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }} placeholder='Enter Remarks'></TextInput>

                    </View>

                    <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor, justifyContent: 'center' }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%', textAlignVertical: 'center' }}>RNP</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%', textAlignVertical: 'center' }}></Text>
                        {/* <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text> */}
                        <TextInput style={{ ...styles[`textSize${Orientation}`], ...styles[`textInputHeight${Orientation}`], textAlignVertical: 'top', paddingLeft: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }} placeholder='Enter Remarks'></TextInput>

                    </View>
                </View>}

                {isFaultReport && <View style={{ width: '100%', flex: 1 }}>

                    <View style={{ width: '100%', marginTop: 30, height: 100 }}>

                        <FlatList
                            style={{ zIndex: 100000 }}
                            data={numberOfRows}
                            keyExtractor={(index) => index.toString()}
                            renderItem={({ item, index }) => addFaultReportRowNew(item, index)}
                        >
                        </FlatList>
                        {renderFooterItem()}
                    </View>

                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], alignSelf: 'flex-start', paddingBottom: 10 }}>Previous Values:</Text>
                    {/* <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 10, marginBottom: 20 }} onPress={() => {

                                const { currentFaultItem, submittedArr, selectedFaultObservationArr, lastSelectedObservationIndex } = this.state;
                                console.log('fault report array===', this.state.faultReportArr);
                                console.log('current ', this.state.currentFaultItem);
                                console.log('second==', this.state.selectedFaultObservationArr[this.state.lastSelectedObservationIndex]);
                                let submitObj = {
                                    systemValue: currentFaultItem.value,
                                    observationValue: selectedFaultObservationArr[lastSelectedObservationIndex].value,
                                    remarksValue: currentFaultItem.remarks
                                }

                                console.log('submitObj ==', submitObj);

                                let newArr = [...submittedArr];
                                newArr.push(submitObj);

                                this.setState({
                                    submittedArr: newArr,
                                    currentFaultItem: '',
                                    selectedFaultObservationArr: [{ value: '', label: '' }],
                                    lastSelectedObservationIndex: 0
                                });
                            }} >
                                <LinearGradient colors={['#929292', '#929292', '#929292']} style={{ alignSelf: 'center', paddingHorizontal: 30, }} >
                                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], ...styles.radioBtnStyle, color: colors.Black }}>
                                        SUBMIT
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity> */}

                    <FlatList
                        ListHeaderComponent={() => {
                            return <View style={{ flexDirection: 'row', backgroundColor: tableHeaderBgColor, borderRightColor: colors.DarkerGrey, borderRightWidth: 0.5 }}>
                                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>FLIGHT NO</Text>
                                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>SYSTEM</Text>
                                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>OBSERVATION</Text>
                                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '25%' }}>REMARKS</Text>
                            </View>
                        }}
                        data={submittedArr}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => renderFaultReportValues(item, index)}
                    >
                    </FlatList>

                </View>
                }

            </View>
    );
};


const styles = StyleSheet.create({

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
    },
    radioBtnStyle: {
        margin: 8,
        fontWeight: '600'
    },
    textInputHeightPortrait: {
        height: (isTablet) ? null : 32
    },
    textInputHeightLandscape: {
        // height:10
    },


    head: { height: 40, alignContent: 'center', justifyContent: 'center', backgroundColor: '#f1f8ff' },
    text: { margin: 6, alignSelf: 'center' },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: { height: 28 },
    buttonText: {
        // fontSize: 18,
        // fontFamily: 'Gill Sans',
        // textAlign: 'center',
        // margin: 8,
        // color: '#ffffff',
        // backgroundColor: 'transparent',
    },

})

export default TechLogCompNew;
