/* eslint-disable */
import React, { useContext } from 'react';
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
import colors from '../../constants/colors';

export default function TechLogComp(props) {
    const [currentFaultItem, setCurrentFaultItem] = useState('');
    const [country, setCountry] = useState('AP_amber_warning_annunciator_light');
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [numberOfRows, setNumberOfRows] = useState([1]);
    const [faultReportArr, setFaultReportArr] = useState([{ label: '', value: '', observation: [{ label: '', value: '' }], remarks: '' }]);
    const [selectedFaultObservationArr, setSelectedFaultObservationArr] = useState([{ label: '', value: '' }]);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(0);
    const [lastSelectedObservationIndex, setLastSelectedObservationIndex] = useState(0);
    const [faultSystemArr, setFaultSystemArr] = useState([]);
    const [faultReportMainData, setFaultReportMainData] = useState('');
    const [headerClickedIndex, setHeaderClickedIndex] = useState(5);
    const [subHeaderClickedIndex, setSubHeaderClickedIndex] = useState(1);
    const [titleData, setTitleData] = useState(['FLTNO', 'FROM', 'TO', 'OUT', 'OFF', 'ON', 'IN', 'BLK', 'NIGHT', 'DELAY', 'REASON']); // ConfigData.Titles.HeaderTitle
    const [subTitleData, setSubTitleData] = useState(['ABC1234', 'CCU', 'BLR', '0:00', '0:00', '0:00', '0:00', '', '', '', '']); // ConfigData.Titles.SubHeaderTitle
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

    const themeContext = useContext(ThemeContext);
        const { theme, Orientation } = themeContext;

    useEffect(() => {
        // const themeContext = useContext(ThemeContext);
        const { data } = props;
        loadInitialData();
        setIsDarkTheme(themeContext.theme === 'Dark');
        setHeaderClickedIndex(data.headerClickedIndex);
        setSubHeaderClickedIndex(data.subHeaderClickedIndex);
    }, []);

    
    const dropDownListHeight = numberOfRows.length * 40 + 300;

    const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;

    let bgColor = themeContext.theme == 'Dark' ? colors.Black : colors.White;
        let tableHeaderBgColor = themeContext.theme == 'Dark' ? colors.Black : colors.LighterGrey;
        let tableRowBgColor = themeContext.theme == 'Dark' ? colors.Black : colors.White;

    const loadInitialData = async () => {
        try {
            const { data, status, statusText } = await api.get(API + '/Fault_Mgt.json', '');
            console.log('techlog data===', Object.keys(data.MAIN).length);

            let keysArr = Object.keys(data.MAIN);
            let faultSystemModifiedArr = [];
            for (let i = 0; i < keysArr.length; i++) {QWE``
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
            let newArr = faultSystemModifiedArr

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
        } catch (err) {
            alert('techlog data err', err);
            console.log('techlog data err', err);
        }
    }

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
                default:
                    break;
            }
        }

        const renderFaultReportList = () => {
    //         const themeContext = useContext(ThemeContext);
    // const { theme, Orientation, isDarkTheme } = themeContext;

    let tableHeaderBgColor = themeContext.theme === 'Dark' ? colors.Black : colors.LighterGrey;
    let tableRowBgColor = themeContext.theme === 'Dark' ? colors.Black : colors.White;
    return (
        <View style={{ marginTop: 50, alignSelf: 'center', width: '90%', borderColor: colors.DarkerGrey, borderWidth: 0.5 }}>
            <FlatList
                data={[1]}
                keyExtractor={(index) => index.toString()}
                ListHeaderComponent={() => {
                    return (
                        <View style={{ flexDirection: 'row', backgroundColor: tableHeaderBgColor }}>
                            <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>SYSTEM</Text>
                            <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>OBSERVATION</Text>
                            <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>REMARKS</Text>
                        </View>
                    );
                }}
                renderItem={({ index, item }) => {
                    return (
                        <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                             <DropDownPicker
                                    items={[
                                        { label: 'USA', value: 'usa' },
                                        { label: 'UK', value: 'uk' },
                                        { label: 'France', value: 'france' },
                                    ]}
                                    defaultValue={country}
                                    containerStyle={{ height: 40, width: '40%', zIndex: 10000 }}
                                    style={{ backgroundColor: '#fafafa' }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                                    onChangeItem={item => setCountry(item.value)}
                                />

                            {/* <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text> */}
                            <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text>
                            <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}></Text>
                        </View>
                    );
                }}
            />
        </View>
    );
        }
   

        /**
     * 
     * @param {*} index 
     * @param {*} item 
     * @returns 
     */
        const addFaultReportRow = ({ item, flatListindex }) => {

            try {
            //     const themeContext = useContext(ThemeContext);
            // const { theme, Orientation } = themeContext;
        
            const tableHeaderBgColor = themeContext.theme === 'Dark' ? colors.Black : colors.LighterGrey;
            const tableRowBgColor = themeContext.theme === 'Dark' ? colors.Black : colors.White;
            const arrowClr = themeContext.theme === 'Dark' ? colors.FluorescentGreen : colors.DarkerGrey;
        
            let faultArrSelectionIndex = (flatListindex === 0 && numberOfRows.length > 1) ? numberOfRows.length - 1 : flatListindex;

            return (
        
                <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor, borderColor: colors.DarkerGrey, borderWidth: 0.5, zIndex: 1000 }}>
                <DropDownPicker
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
                    defaultValue={faultReportArr[flatListindex].value}
                    containerStyle={{ height: 35, width: '35%', borderColor: colors.LighterGrey, borderWidth: 0.5 }}
                    style={{ backgroundColor: tableRowBgColor, borderColor: colors.LighterGrey, borderWidth: 0.5 }}
                    arrowStyle={{ height: 35, marginTop: 18 }}
                    labelStyle={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], }}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    dropDownStyle={{ backgroundColor: tableRowBgColor, borderColor: colors.LighterGrey, borderWidth: 1 }}
                    onChangeItem={(item, index) => {
                        debugger;
                        console.log('faultSystemArr[index] ==', faultSystemArr[index]);
                        console.log('selected item =', item, 'index ==', index);
                        console.log('selected item observations ==', item.observation);
                        let faultArr = [];
                        faultArr = [...faultReportArr];
                        faultArr.splice(numberOfRows.length - 1, 1, item);
    
                        console.log('faultArr ==', faultArr);
    
                        console.log('selectedFaultObservationArr ==', faultArr[flatListindex].observation)
    
                        setCurrentFaultItem(item)
                        setFaultReportArr(faultArr);
                        setSelectedFaultObservationArr(faultArr[flatListindex].observation);
                        setLastSelectedIndex(index);
                        setLastSelectedObservationIndex(0);
                    }}
                />
                <DropDownPicker
                    searchable={true}
                    searchablePlaceholder="Search for an item"
                    searchablePlaceholderTextColor={colors.DarkerGrey}
                    seachableStyle={{}}
                    searchableError={() => <Text>Not Found</Text>}
                    onSearch={text => {
                        console.log('search term ==', text);
                    }}
                    items={selectedFaultObservationArr}
                    defaultValue={faultReportArr[flatListindex].observation[lastSelectedObservationIndex].value}
                    containerStyle={{ height: 35, width: '35%', borderColor: colors.LighterGrey, borderWidth: 0.5 }}
                    style={{ backgroundColor: tableRowBgColor, borderColor: colors.LighterGrey, borderWidth: 0.5 }}
                    arrowStyle={{ height: 35, marginTop: 18 }}
                    arrowColor={arrowClr}
                    dropDownMaxHeight={200}
                    activeItemStyle={{ alignSelf: 'center' }}
                    labelStyle={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    dropDownStyle={{ backgroundColor: tableRowBgColor, borderColor: colors.LighterGrey, borderWidth: 1 }}
                    onChangeItem={(item, index) => {
                        debugger;
                        console.log('sec dropdown selected item =', item, 'index ==', index);
                        setLastSelectedObservationIndex(index);
                    }}
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
                    value={faultReportArr[flatListindex].remarks}
                    style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 8, height: 35, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '30%' }}
                />
            </View>
        );
            } catch (error) {
                alert('Failed to add sec dropdown value =', err);
            }
            
        

        }

        const renderFooterItem = () => {
    //         const themeContext = useContext(ThemeContext);
    // const { theme, Orientation } = themeContext;
    const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;

    let itemWidth = 100 / 8;

        const themeStyle = theme == "Light" ? styles.tabStyleLight : styles.tabStyleDark;
        const textFieldTabBgColor = theme == "Light" ? '#fff' : '#000';
        const checkFontColor = theme == "Light" ? colors.Black : colors.FluorescentGreen;

        return(
            <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth * 2}%` }} onPress={() => {
                let arr = [...numberOfRows];
                arr.push(arr.length + 1);

                let faultTempArr = [...faultReportArr];
                faultTempArr.push({ label: '', value: '', observation: [{ label: '', value: '' }], remarks: '' });
                setNumberOfRows(arr);
                setFaultReportArr(faultTempArr);
                setLastSelectedObservationIndex(0);
            }}>
                <Text style={{ ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}> ADD NEW ROW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }}  >
                <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} >
                <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} >
                <Text style={headerClickedIndex === 1 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} >
                <Text style={headerClickedIndex === 2 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}></Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth * 2}%` }} onPress={() => {
                console.log('fault report array===', faultReportArr);
                alert('coming soon...');
            }} >
                <Text style={{ ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}> SUBMIT</Text>
            </TouchableOpacity>
        </View>
        )

        }

        return(
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 30, flex: 1, backgroundColor: bgColor }}>

            {/* Radio Buttons */}
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

                {isFaultReport && <View style={{ width: '100%', flex: 1, justifyContent: 'space-between' }}>
                    {/* <View style={{ alignSelf: 'center', marginTop: 50, width: '90%' }}>
                        <View style={{ flexDirection: 'row', backgroundColor: tableHeaderBgColor }}>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>SYSTEM</Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>OBSERVATION</Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>REMARKS</Text>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                            <Text style={{ padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>DROP LIST</Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>2ND LEVEL WITH RADIO BUTTONS</Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>TEXT BOX</Text>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                            <Text style={{ padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>DROP LIST</Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>2ND LEVEL WITH RADIO BUTTONS</Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>TEXT BOX</Text>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                            <Text style={{ padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>DROP LIST</Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}>2ND LEVEL WITH RADIO BUTTONS</Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}>TEXT BOX</Text>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                            <Text style={{ padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}></Text>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                            <Text style={{ padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}></Text>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: tableRowBgColor }}>
                            <Text style={{ padding: 10, textAlign: 'left', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '40%' }}></Text>
                            <Text style={{ padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '20%' }}></Text>
                        </View>

                    </View> */}

                    {/* {this.renderFaultReportList()} */}
                    <View style={{ width: '100%', marginTop: 30, height: dropDownListHeight, alignSelf: 'center' }}>
                        <FlatList
                            ListHeaderComponent={() => {
                                return <View style={{ flexDirection: 'row', backgroundColor: tableHeaderBgColor, borderRightColor: colors.DarkerGrey, borderRightWidth: 0.5 }}>
                                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '35%' }}>SYSTEM</Text>
                                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '35%' }}>OBSERVATION</Text>
                                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], padding: 10, textAlign: 'center', borderWidth: 0.5, borderColor: colors.DarkerGrey, width: '30%' }}>REMARKS</Text>
                                </View>
                            }}
                            data={this.state.numberOfRows}
                            keyExtractor={(index) => index.toString()}
                            renderItem={({ item, index }) => addFaultReportRow(item, index)}
                        >
                        </FlatList>

                        {/* <TouchableOpacity style={{ marginTop: 10 }} onPress={() => {
                            let arr = [...this.state.numberOfRows];
                            arr.push(arr.length + 1);

                            let faultTempArr = [...this.state.faultReportArr];
                            faultTempArr.push({ label: '', value: '', observation: '', remarks: '' });
                            this.setState({ numberOfRows: arr, faultReportArr: faultTempArr });
                        }}>
                            <LinearGradient colors={['#929292', '#929292', '#929292']} style={{ alignSelf: 'center', paddingHorizontal: 30, }} >
                                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], ...styles.radioBtnStyle, color: colors.Black }}>
                                    ADD NEW ROW
                            </Text>
                            </LinearGradient>
                        </TouchableOpacity> */}


                        {/* <TouchableOpacity style={{ marginTop: 30 }} onPress={() => {
                            console.log('fault report array===', this.state.faultReportArr);
                        }} >
                            <LinearGradient colors={['#929292', '#929292', '#929292']} style={{ alignSelf: 'center', paddingHorizontal: 30, }} >
                                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], ...styles.radioBtnStyle, color: colors.Black }}>
                                    SUBMIT
                            </Text>
                            </LinearGradient>
                        </TouchableOpacity> */}

                    </View>

                    {renderFooterItem()}
                </View>
                }
            </View>
        )
}

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