/* eslint-disable */
import React,{useContext,useState,useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import ConfigData from '../../ConfigData/ConfigJson'
import {ThemeContext} from '../../Utilis/ThemeManager'
import {IS_IPAD, IS_TABLET, isTablet} from '../../constants/index'

import SegmentedControlTab from 'react-native-segmented-control-tab'
import {TextInput} from 'react-native-gesture-handler'

import {
  onInsertMainRVSMData,
  onFetchMainRVSMData,
  onUpdateMainFlightRVSMDetails,
} from '../../dbmanager/main-rvsm-details-table'
import {
  onInsertAltFlightRVSMData,
  onFetchAltFlightRVSMData,
  onUpdateAltFlightRVSMDetails,
} from '../../dbmanager/alt-rvsm-details-table'
import colors from '../../constants/colors'
import { RvsmApi } from '../../api/rvsmApi'
import NetwotkAccess from '../../Utilis/NetworkAccess';
const RVSMComp = (props) => {

    const dataFetch= NetwotkAccess()
 const network=dataFetch.then((e)=>{
  setNetworks(e.isConnected)
return e.isConnected
} ).catch((e)=>console.log('e',e))

    const {data}=props
    const {FlightNumber,isMainFlightSelected,Sector}=data

  const themeContext = useContext(ThemeContext)
  const {theme,Orientation} = themeContext
const [networks,setNetworks] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [alt1Value, setAlt1Value] = useState('')
  const [stbyaltValue, setStbyaltValue] = useState('')
  const [alt2Value, setAlt2Value] = useState('')
  const [diffCalcMessage, setDiffCalcMessage] = useState('')
  const [headerClickedIndex, setHeaderClickedIndex] = useState(5)
  const [subHeaderClickedIndex, setSubHeaderClickedIndex] = useState(1)

  const titleData = ['', 'ALT1', '', 'STBYALT', '', 'ALT2', '', 'CHECK'] //ConfigData.Titles.HeaderTitle,
  const subTitleData = [
    'ABC1234',
    'CCU',
    'BLR',
    '0:00',
    '0:00',
    '0:00',
    '0:00',
    '',
    '',
    '',
    '',
  ] //ConfigData.Titles.SubHeaderTitle

  const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;
  let itemWidth = 100 / 8;

  const themeStyle = theme == "Light" ? styles.tabStyleLight : styles.tabStyleDark;
        const textFieldTabBgColor = theme == "Light" ? '#fff' : '#333';
        const checkFontColor = theme == "Light" ? colors.Black : colors.FluorescentGreen;

  useEffect(() => {
    console.log('RVSM did mount data==', data)

    setIsDarkTheme(theme === 'Dark')
    setHeaderClickedIndex(headerClickedIndex)
    setSubHeaderClickedIndex(subHeaderClickedIndex)

    loadInitialData()
  }, [])

  const loadInitialData = async isMainFlightSelected => {
    let previousRVSMData = []

    try {
      if (isMainFlightSelected) {
        previousRVSMData = await onFetchMainRVSMData()
      } else {
        previousRVSMData = await onFetchAltFlightRVSMData()
      }
    } catch (err) {
      console.log('Error to load the RVSM initial data', err)
    }
    console.log('previousRVSMData =', previousRVSMData)

    if (previousRVSMData.length > 0) {
      const [RVSMData] = previousRVSMData
      console.log('RVSMData ==,', RVSMData)

      setAlt1Value(RVSMData.ALT1)
      setStbyaltValue(RVSMData.STBYALT)
      setAlt2Value(RVSMData.ALT2)
    }
  }

   /**
     * 
     */

   const headerTitleSelectionHandler = (clickedIndex) => {
    setHeaderClickedIndex(clickedIndex);
   }

   /**
     * 
     * @param {*} clickedIndex 
     */

   const footerTitleSelectionHandler = async (clickedIndex) => {
   
    try {
        //Exit button, should navigate back to home screen
        if(clickedIndex === 3){
            props.onClick()
        }

        //Submit button functionality
        if(clickedIndex === 5){
            let rvsmDbData = [{
                "FlightNumber": FlightNumber,
                "ALT1": alt1Value,
                "STBYALT": stbyaltValue,
                "ALT2": alt2Value,
                "Sector":Sector,
                "Time":new Date().toISOString(),
                "isPushed":0
            }];

            console.log('rvsmDbData ==', isMainFlightSelected,rvsmDbData);

            if (isMainFlightSelected) {
                let previousRVSMData = await onFetchMainRVSMData();
                console.log('previousRVSMData ==', previousRVSMData.length);

     if (previousRVSMData.length > 0) {
        const mainRvsmUpdateRes = await onUpdateMainFlightRVSMDetails(rvsmDbData[0]);
    
console.log('update data',mainRvsmUpdateRes)
if(mainRvsmUpdateRes=='update success' && networks) {
   const rvsmApi=await  RvsmApi(rvsmDbData[0])
   console.log('1234567890',rvsmApi)
   if(rvsmApi.response=='update'){
    console.log('coming here')
   const dataNeeded= await onUpdateMainFlightRVSMDetails({...rvsmDbData[0],"isPushed":1})
   console.log('data neede d123',dataNeeded)
   }
}
 
abcdefghojklmnopqrstuv




 } else {
                    const mainRvsmInsertRes = await onInsertMainRVSMData(rvsmDbData);
                }
            } else {
                let previousRVSMData = await onFetchAltFlightRVSMData();
                if (previousRVSMData.length > 0) {
                    const mainRvsmUpdateRes = await onUpdateAltFlightRVSMDetails(rvsmDbData[0]);
                    if(mainRvsmUpdateRes=='update success'&& networks) {
                        const rvsmApi=await  RvsmApi(rvsmDbData[0])
                        console.log('1234567890',rvsmApi)
                        if(rvsmApi.response=='update'){
                         
                        const dataNeeded= await onUpdateAltFlightRVSMDetails({...rvsmDbData[0],"isPushed":1})
                        console.log('data neede d123',dataNeeded)
                        }
                     }
                    
                } else {
                    const altRvsmInsertRes = await onInsertAltFlightRVSMData(rvsmDbData);
                }
            }
        }
        }
     catch (error) {
        console.log('footerTitleSelectionHandler err', error);
    }
   }

   /**
     * 
     * @param {*} text 
     */

   const onALT1 = (text) => {
    setAlt1Value(text);
   }

   /**
     * 
     */
   const validateALT1 = () => {
    if (alt1Value < 29000 || alt1Value > 43000) {
        alert('Please enter a value in the range of 29000 - 43000');
        setAlt1Value('');
    }
};

/**
    * 
    * @param {*} text 
    */
const onALT2 = (text) => {
    setAlt2Value(text);
}

 /**
     * 
     */
 const validateALT2 = () => {
    if (alt2Value < 29000 || alt2Value > 43000) {
        alert('Please enter value in the range of 29000 - 43000');
        setAlt2Value( '' )
    }
}

 /**
     * 
     */
 const validateSTBYALT = () => {
    if (stbyaltValue < 29000 || stbyaltValue > 43000) {
        alert('Please enter value in the range of 29000 - 43000');
        setStbyaltValue( '' )
    }

}




/**
     * 
     * @param {*} text 
     */

const onSTBYALT = (text) => {
    console.log('onSTBYALT ==', text);
    setStbyaltValue(text)
}
const onValidateCheck = () => {
        console.log('values for check',alt1Value,alt2Value,stbyaltValue)
        const alt1StbDiff = parseInt(alt1Value) - parseInt(stbyaltValue);
        const alt1Alt2Diff = parseInt(alt1Value) - parseInt(alt2Value);
        const alt2StbDiff = parseInt(alt2Value) - parseInt(stbyaltValue);

        setDiffCalcMessage(`
            The difference between Alt1 and STBYL is ${alt1StbDiff}
            The difference between Alt1 and Alt2 is ${alt1Alt2Diff}
            The difference between Alt2 and STBYL is ${alt2StbDiff}
        `);
    }

    /**
     * 
     */
    const renderHeaderItem = () => {
        const isCheckDisabled = (alt1Value === '' || stbyaltValue === '' || alt2Value === '') ? true : false;
        console.log('checkis diaabled', isCheckDisabled)
        return(
        <View style={{ flexDirection: 'row' }}>

                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(0) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(0) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%`, backgroundColor: textFieldTabBgColor }} onPress={() => { headerTitleSelectionHandler(0) }} >
                    <TextInput keyboardType='number-pad' onChangeText={onALT1} onBlur={validateALT1} value={alt1Value} style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}></TextInput>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(0) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[3]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: textFieldTabBgColor }} onPress={() => { headerTitleSelectionHandler(1) }}>
                    <TextInput keyboardType='number-pad' onChangeText={onSTBYALT} onBlur={validateSTBYALT} value={stbyaltValue} style={headerClickedIndex == 1 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}></TextInput>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(1) }}>
                    <Text style={headerClickedIndex == 2 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[5]}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: textFieldTabBgColor }} onPress={() => { headerTitleSelectionHandler(1) }}>
                    <TextInput keyboardType='number-pad' onChangeText={onALT2} onBlur={validateALT2} value={alt2Value} style={headerClickedIndex == 3 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}></TextInput>
                </TouchableOpacity>
                <TouchableOpacity disabled={isCheckDisabled} style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { onValidateCheck() }}>
                    <Text style={headerClickedIndex == 4 ? { ...styles[`activeTabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}> {titleData[7]}</Text>
                </TouchableOpacity>
            </View>)
    }

    /**
     * 
     */
    const renderFooterItem = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { footerTitleSelectionHandler(0) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { footerTitleSelectionHandler(1) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { footerTitleSelectionHandler(2) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth * 2}%` }} onPress={() => { footerTitleSelectionHandler(3) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}> EXIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { footerTitleSelectionHandler(4) }}>
                    <Text style={headerClickedIndex == 1 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { footerTitleSelectionHandler(5) }}>
                    <Text style={headerClickedIndex == 2 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}>SUBMIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { footerTitleSelectionHandler(6) }}>
                    <Text style={headerClickedIndex == 4 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
            </View>)
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, flex: 1, width: '100%' }}>

            <View style={{ borderColor: colors.DarkerGrey, borderWidth: 1, width: '100%' }}>
                <Text style={{ paddingVertical: 10, ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>RVSM READING TAKEN AT 12:56 Z (Time of entry)</Text>
            </View>

            {renderHeaderItem()}

            <View style={{ flex: 1, width: '100%' }}>
                <View style={{ flex: 1, marginLeft: '12.5%', width: '75%', marginRight: '12.5%', borderColor: colors.LighterGrey, borderWidth: 0.5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], paddingTop: 15 }}>COMPARISON REPORT - Will be provided</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], paddingTop: 15, textAlign: 'left' }}>{diffCalcMessage}</Text>
                </View>

            </View>
            {/* <SegmentedControlTab
                tabStyle={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderBottomWidth: 1 }}
                activeTabStyle={styles[`activeTabStyle${theme}`]}
                tabTextStyle={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                activeTabTextStyle={{ ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                borderRadius={0}
                values={['', '', '', 'EXIT', '', 'SUBMIT', '', '']}
                selectedIndex={5}
                onTabPress={(index) => {
                    this.props.onClick("SUBHEADER", index);
                    this.setState({ subHeaderClickedIndex: index });
                }}
            /> */}
            {renderFooterItem()}
        </View>
    )
}

const styles = StyleSheet.create({
    tabStyleLight: {
        borderColor: colors.LighterGrey,
        backgroundColor: '#ddd',
        borderWidth: 1,
        borderBottomWidth: 0.5,
        paddingVertical: 5,
        alignItems:'center',
        justifyContent:'center'
    },
    tabStyleDark: {
        borderColor: colors.LighterGrey, //colors.DarkGrey,
        backgroundColor: colors.Black,
        borderWidth: 1,
        borderBottomWidth: 0.5,
        paddingVertical: 5,
        alignItems:'center',
        justifyContent:'center'
    },
    activeTabStyleLight: {
        backgroundColor: colors.DarkModeBtnInActiveBg,
        alignItems:'center',
        justifyContent:'center'
    },
    activeTabStyleDark: {
        backgroundColor: colors.DarkModeBtnInActiveBg,
        alignItems:'center',
        justifyContent:'center'
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
        // fontSize: 16,
        fontSize:(isTablet) ? 16 :6
    },
    textSizeLandscape: {
        // fontSize: 20,
        fontSize:(isTablet) ? 20 : 16
    }
});

export default RVSMComp;
