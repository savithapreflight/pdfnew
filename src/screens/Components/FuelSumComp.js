/* eslint-disable */
import React,{useContext,useState,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ConfigData from '../../ConfigData/ConfigJson';
import { ThemeContext } from '../../Utilis/ThemeManager';
import { IS_IPAD, IS_TABLET, isTablet } from '../../constants/index';
import { API } from '../../constants';
import api from '../../API-Axios/axios';
import Details  from '../Latest'
import SegmentedControlTab from "react-native-segmented-control-tab";
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import colors from '../../constants/colors';

const FuelSumComp = (props) => {
   
    const themeContext = useContext(ThemeContext);
    const { theme, Orientation } = themeContext;

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [fuelData, setFuelData] = useState('');
    const [weightData, setWeightData] = useState('');
    const [altFlightLevelData, setAltFlightLevelData] = useState('');
    const [headerClickedIndex, setHeaderClickedIndex] = useState(5);
    const [subHeaderClickedIndex, setSubHeaderClickedIndex] = useState(1);

    const titleData = ['', 'ALT1', '', 'STBYALT', '', 'ALT2', '', 'CHECK'];
    const subTitleData = ['ABC1234', 'CCU', 'BLR', '0:00', '0:00', '0:00', '0:00', '', '', '', ''];

    const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;
    let itemWidth = 100 / 8;

    const themeStyle = theme == "Light" ? styles.tabStyleLight : styles.tabStyleDark;
        const textFieldTabBgColor = theme == "Light" ? '#fff' : '#000';
        const checkFontColor = theme == "Light" ? '#fff' : colors.FluorescentGreen;

    useEffect(() => {
        const { data } = props;

        loadInitialData();

        setIsDarkTheme(themeContext.theme === 'Dark');
        setHeaderClickedIndex(headerClickedIndex);
        setSubHeaderClickedIndex(subHeaderClickedIndex);
    }, []);

    const loadInitialData = async () => {
    
        try {
            // const { data, status, statusText } = await api.get(API + '/Latest_CFP.json', '');
            const data=[Details]
            console.log('neeeded data data data',data[0].OPR_ID.FUEL)
// console.log('detailss',arrDetails)
            // console.log('data===', data.FLIGHTFOLDER.OPR_ID[0]);

            setFuelData(data[0].OPR_ID.FUEL);
            setWeightData(data[0].OPR_ID.FLTDET);
            setAltFlightLevelData(data[0].OPR_ID.ALTFL);

        } catch (err) {
            console.log('loadInitialData err', err);
        }
    };

    /**
     * 
     */
    const renderFuelSummary = () => {
        console.log('fuelData ==', fuelData);
        console.log('fuelData trip=', fuelData.TRIP);

        if (fuelData === undefined || fuelData === '') {
            return <View>
                <Text>No Records!!!</Text>
                </View>;
        }

        let itemWidth = `${100 / 6}%`;
        let twoItemWidth = `${100 / 6 * 2}%`;

        return (
            <View style={{ width: '50%' }}>

                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10 }}>FUEL SUMMARY</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>  Fuel Bias: 0</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', width: itemWidth }}>ARPT</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', width: itemWidth }}>FUEL</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', width: itemWidth }}>TIME</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', width: itemWidth }}>DIST</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>TRIP</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}>{fuelData.TRIP.ARPT}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.TRIP.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.TRIP.TIME}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.TRIP.DIST}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>CONT (5% TRIP)</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.CONT.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.CONT.TIME}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>INST APPR</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.INSTARPT.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.INSTARPT.TIME}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>ALTN</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}>{fuelData.ALT.ARPT}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.ALT.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.ALT.TIME}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.ALT.DIST}</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>HOLD</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.HOLD.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.HOLD.TIME}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>MSF</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.MSF.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>TAXI</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.TAXI.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>SURPLUS</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.SURPLUS.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.SURPLUS.TIME}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>TANK FUEL</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.TANKFUEL.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingLeft: 10, width: twoItemWidth }}>MBF</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '500', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}>{fuelData.MBF.FUEL}</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: '300', width: itemWidth }}></Text>
                </View>
            </View>
        )
    }

    /**
     * 
     */
    const renderWeightAltFlightLevels = () => {
        console.log('weightData ==', weightData);
        console.log('altFlightLevelData ==', altFlightLevelData);

        if (weightData === undefined || weightData === '' || altFlightLevelData === undefined || altFlightLevelData === '') {
            return;
        }

        let itemWidth = `${100 / 6}%`;
        let altFlightItemWidth = `${100 / 3}%`;

        return (
            <View style={{ marginLeft: '5%', width: '45%' }}>
                <Text style={{ fontWeight: 'bold', paddingVertical: 15, textAlign: 'center' }}>WEIGHTS (Kg)</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', width: itemWidth }}>MZFW</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth }}>{weightData.MZFW}</Text>

                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', width: itemWidth }}>MLW</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth }}>{weightData.MLW}</Text>

                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', width: itemWidth }}>MTOW</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth }} >{weightData.MTOW}</Text>
                </View>

                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth, fontWeight: 'bold' }}>EZFW</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth }}>{weightData.EZFW}</Text>

                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth, fontWeight: 'bold' }}>ELW</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth }}>{weightData.ELW}</Text>

                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth, fontWeight: 'bold' }}>ETOW</Text>
                    <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], width: itemWidth }} >{weightData.ETOW}</Text>
                </View>



                <Text style={{ fontWeight: 'bold', paddingTop: 50, paddingBottom: 10, textAlign: 'center' }}>ALTERNATIVE FLIGHT LEVELS</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                    <View style={{ width: altFlightItemWidth }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingVertical: 5 }}>FL</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], }}>{altFlightLevelData.ROW[0].FL}</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], paddingVertical: 5 }}>{altFlightLevelData.ROW[1].FL}</Text>
                    </View>

                    <View style={{ width: altFlightItemWidth }} >
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingVertical: 5 }}>TRIP FUEL</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], }}>{altFlightLevelData.ROW[0].TRIPFUEL}</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], paddingVertical: 5 }}>{altFlightLevelData.ROW[1].TRIPFUEL}</Text>
                    </View>

                    <View style={{ width: altFlightItemWidth }}>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], fontWeight: 'bold', paddingVertical: 5 }}>TRIP TIME</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], }}>{altFlightLevelData.ROW[0].TRIPTIME}</Text>
                        <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], paddingVertical: 5 }}>{altFlightLevelData.ROW[1].TRIPTIME}</Text>
                    </View>

                </View>

            </View>
        )

    }

     /**
     * 
     */
     const headerTitleSelectionHandler = () => {

        setHeaderClickedIndex(clickedIndex);
        // this.props.onClick("HEADER", clickedIndex);
    }

     /**
     * 
     */
    const renderFooterItem = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(0) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(0) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(0) }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth * 2}%` }} onPress={() => { props.onClick() }} >
                    <Text style={{ ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}> EXIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(1) }}>
                    <Text style={headerClickedIndex == 1 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(1) }}>
                    <Text style={headerClickedIndex == 2 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}></Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(2) }}>
                    <Text style={headerClickedIndex == 4 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], color: checkFontColor, ...styles[`textSize${Orientation}`] }}> { }</Text>
                </TouchableOpacity>
            </View>)
    }

    return (
        <View style={{ marginTop: 10, flex: 1, }}>

            <Text style={{ padding: 10, alignSelf: 'flex-start', ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}>GROUND DISTANCE 164 N.M.        ISA DEV 16</Text>

            <View style={{ height: '100%' }}>
                <View style={{ flexDirection: 'row', }}>
                    {renderFuelSummary()}
                    {renderWeightAltFlightLevels()}
                </View>
                <View style={{ backgroundColor: 'gray', height: 1, width: '100%', marginVertical: 15 }}></View>

                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`], paddingVertical: 10 }}> -  - ADDITIONAL FUEL BURN PER 500 KGS INCREASE IN TOW -  - 4KG</Text>
                <Text style={{ ...styles[`textStyle${theme}`], ...styles[`textSize${Orientation}`] }}> -  - ADDITIONAL FUEL BURN PER 1000 KGS INCREASE IN TOW -  - 8KG</Text>

            </View>


            {renderFooterItem()}
        </View>
    )
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
    activeTabStyleLight: {
        backgroundColor: colors.DarkModeBtnInActiveBg
    },
    activeTabStyleDark: {
        backgroundColor: colors.DarkModeBtnInActiveBg
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
        textAlign: 'left',
    },
    textStyleDark: {
        color: colors.FluorescentGreen,
        textAlign: 'left',
    },
    textSizePortrait: {
        // fontSize: 16,
        fontSize:(isTablet) ? 16 : 8
    },
    textSizeLandscape: {
        // fontSize: 20,
        fontSize:(isTablet) ? 20 : 16
    }
});

export default FuelSumComp;