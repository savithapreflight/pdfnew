/* eslint-disable */
import React , {useContext,useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ConfigData from '../../ConfigData/ConfigJson';
import { ThemeContext } from '../../Utilis/ThemeManager';
import { IS_IPAD, IS_TABLET, isTablet } from '../../constants/index';

import SegmentedControlTab from "react-native-segmented-control-tab";
 import logo from '../../Assets1/logo.png'
import colors from '../../constants/colors';

function OFPHeaderComp(props) {


    const themeContext = useContext(ThemeContext);
    const { theme, Orientation } = themeContext;

    const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;

        let itemWidth = 100 / 8;

        const themeStyle = theme == "Light" ? styles.tabStyleLight : styles.tabStyleDark;
        const activeThemeBgColor = colors.DarkModeBtnActiveBg;// theme == "Light" ? '#2f4f4f' : '#2f4f4f';
        const inActiveThemeBgColor = colors.DarkModeBtnInActiveBg; //theme == "Light" ? '#929292' : '#929292';
         const logoImg = Image.resolveAssetSource(logo).uri;

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isDisableAltFuelSum, setIsDisableAltFuelSum] = useState(true);
    const [isMainFlightSelected, setIsMainFlightSelected] = useState(true);
    const [headerClickedIndex, setHeaderClickedIndex] = useState(5);
    const [subHeaderClickedIndex, setSubHeaderClickedIndex] = useState(1);
    const titleData = ConfigData.Titles.HeaderTitle;
    const subTitleData = ConfigData.Titles.SubHeaderTitle;

    useEffect(() => {  
        const { data } = props;
        console.log('sub header color change',data.subHeaderClickedIndex)
        setIsDarkTheme(themeContext.theme === 'Dark');
        setHeaderClickedIndex(data.headerClickedIndex);
        setSubHeaderClickedIndex(data.subHeaderClickedIndex);
        setIsDisableAltFuelSum(isDisableAltFuelSum);
    }, [props]);

   

    /**
     * 
     * @param {*} isMainFlight 
     */

    const toggleMainAltFlight = (isMainFlight) => {
        setIsMainFlightSelected(isMainFlight);
        subHeaderTitleSelectionHandler(isMainFlight ? 0 : 1);
    };

    /**
     * 
     */
  

    /**
     * 
     * @param {*} clickedIndex 
     */

    const subHeaderTitleSelectionHandler = (clickedIndex) => {
        console.log('clicked sub header', clickedIndex)
        setSubHeaderClickedIndex(clickedIndex);
        props.onClick("SUBHEADER", clickedIndex, isMainFlightSelected);
    }
    const headerTitleSelectionHandler = (clickedIndex) => {
        console.log('clicked header', clickedIndex)
        setHeaderClickedIndex(clickedIndex);
        props.onClick("HEADER", clickedIndex);
    };
    const renderHeaderItem = () => {
        console.log('LOG LOG LOG',props)
        const { data} = props 
        const { headerClickedIndex } =data
        console.log('ohohohoho', headerClickedIndex )

    const headerIndex = data.headerIndex;
    const themeContext = useContext(ThemeContext); 
    const { theme, Orientation } = themeContext;
    const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;
    const titleData = ConfigData.Titles.HeaderTitle;
    const subTitleData = ConfigData.Titles.SubHeaderTitle;
   

    let itemWidth = 100 / 8;
    const activeThemeBgColor = colors.DarkModeBtnActiveBg;
    const inActiveThemeBgColor = colors.DarkModeBtnInActiveBg;
     const logoImg = Image.resolveAssetSource(logo).uri;
    const style=headerClickedIndex == 0 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
      console.log('style',style)
      const onChangeTheme = () => {
        themeContext.toggleTheme();
        setIsDarkTheme(prevTheme => !prevTheme);
    };
    return (
        
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity disabled={true} style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%`, backgroundColor: (headerClickedIndex == 0) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { headerTitleSelectionHandler(0) }} >
                    <Text style={headerClickedIndex == 0 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[headerIndex].First}</Text>
                    <Image style={styles.tinyLogo} source={{ uri: logoImg }} />
               
                 </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (headerClickedIndex == 1) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { headerTitleSelectionHandler(1) }}>
                    <Text style={headerClickedIndex === 1 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[headerIndex].Second}</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={true} style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth * 3}%`, backgroundColor: (headerClickedIndex == 2) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { headerTitleSelectionHandler(2) }}>
                    <Text style={headerClickedIndex == 2 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {global.selectedFlightName}</Text>
                </TouchableOpacity>
                <TouchableOpacity   disabled={true}style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (headerClickedIndex == 3) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { headerTitleSelectionHandler(3) }}>
                    <Text style={headerClickedIndex == 3 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[headerIndex].Fourth}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (isDarkTheme) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { onChangeTheme() }}>
                    <Text style={isDarkTheme ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[0].Fifth}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (headerClickedIndex == 5) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { headerTitleSelectionHandler(5) }}>
                    <Text style={headerClickedIndex == 5 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {titleData[headerIndex].Sixth}</Text>
                </TouchableOpacity>
            </View>)
    }

    const renderSubHeaderItem = () => {
        console.log('props',props)
         const { data } = props;
    const headerIndex = data.headerIndex;
    const subHeaderIndex = data.subHeaderIndex;
    
    const themeContext = useContext(ThemeContext);
    console.log('hjdbj',themeContext) // Replace YourThemeContext with your actual theme context
    const { theme,Orientation } = themeContext;
    const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;
    const subTitleData = ConfigData.Titles.SubHeaderTitle;
    // const { titleData, subTitleData, headerClickedIndex, subHeaderClickedIndex, isDarkTheme, isMainFlightSelected, isDisableAltFuelSum } = props; // Assuming these props are passed from your component
    let itemWidth = 100 / 8;

    const activeThemeBgColor = colors.DarkModeBtnActiveBg;
    const inActiveThemeBgColor = colors.DarkModeBtnInActiveBg;

    const themeStyle = theme === "Light" ? styles.tabStyleLight : styles.tabStyleDark;

        return (
            <View style={{ flexDirection: 'row' }}>
              
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%`, backgroundColor: (isMainFlightSelected) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { toggleMainAltFlight(true) }} >
                    <Text style={isMainFlightSelected ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {subTitleData[subHeaderIndex].First}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (!isMainFlightSelected) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { toggleMainAltFlight(false) }}>
                    <Text style={!isMainFlightSelected ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {subTitleData[subHeaderIndex].Second}</Text>
                </TouchableOpacity>
                <TouchableOpacity   style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (subHeaderClickedIndex == 2) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { subHeaderTitleSelectionHandler(2) }}>
                    <Text style={subHeaderClickedIndex == 2 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {subTitleData[subHeaderIndex].Third}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (subHeaderClickedIndex == 3) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { subHeaderTitleSelectionHandler(3) }}>
                    <Text style={subHeaderClickedIndex == 3 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {subTitleData[subHeaderIndex].Fourth}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (subHeaderClickedIndex == 4) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { subHeaderTitleSelectionHandler(4) }}>
                    <Text style={subHeaderClickedIndex == 4 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {subTitleData[subHeaderIndex].Fifth}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (subHeaderClickedIndex == 5) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { subHeaderTitleSelectionHandler(5) }}>
                    <Text style={subHeaderClickedIndex == 5 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {subTitleData[subHeaderIndex].Sixth}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (subHeaderClickedIndex == 6) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { subHeaderTitleSelectionHandler(6) }}>
                    <Text style={subHeaderClickedIndex == 6 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {subTitleData[subHeaderIndex].Seventh}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%`, backgroundColor: (subHeaderClickedIndex == 7) ? activeThemeBgColor : inActiveThemeBgColor }} onPress={() => { subHeaderTitleSelectionHandler(7) }}>
                    <Text style={subHeaderClickedIndex == 7 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> {subTitleData[subHeaderIndex].Eighth}</Text>
                </TouchableOpacity>
            </View>)
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            
            { renderHeaderItem() }
            { renderSubHeaderItem() }

            {/* <SegmentedControlTab
                tabStyle={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderBottomWidth: 1 }}
                activeTabStyle={styles[`activeTabStyle${theme}`]}
                tabTextStyle={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                activeTabTextStyle={{ ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                borderRadius={0}
                values={[subTitleData[subHeaderIndex].First, subTitleData[subHeaderIndex].Second, subTitleData[subHeaderIndex].Third, subTitleData[subHeaderIndex].Fourth, subTitleData[subHeaderIndex].Fifth, subTitleData[subHeaderIndex].Sixth, subTitleData[subHeaderIndex].Seventh, subTitleData[subHeaderIndex].Eighth]}
                selectedIndex={subHeaderClickedIndex}
                onTabPress={(index) => {
                    this.props.onClick("SUBHEADER", index);
                    this.setState({ subHeaderClickedIndex: index });
                }} 
            />*/}


        </View>
    )
}

const styles = StyleSheet.create({

    tabStyleLight: {
        borderColor: colors.LighterGrey,
        backgroundColor: colors.DarkModeBtnInActiveBg,//'#929292',
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingVertical: 5,
        shadowColor: colors.Black,
        shadowOffset: {
            width: 0,
            height: 3
        },
        elevation: 3,
        shadowOpacity: 0.3,
    },
    tabStyleDark: {
        borderColor: colors.DarkerGrey,
        backgroundColor: colors.DarkModeBtnInActiveBg,
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingVertical: 5,
        shadowColor: colors.Black,//colors.FluorescentGreen,
        shadowOffset: {
            width: 0,
            height: 3
        },
        elevation: 3,
        shadowOpacity: 0.3,
    },
    activeTabStyleLight: {
        backgroundColor: colors.LightModeBtnActiveBg
    },
    activeTabStyleDark: {
        backgroundColor: colors.DarkModeBtnActiveBg
    },
    tabTextStyleLight: {
        color: colors.Black,
        textAlign: 'center',
        // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    tabTextStyleDark: {
        color: colors.Black,
        textAlign: 'center',
        // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    activeTabTextStyleLight: {
        color: colors.FluorescentGreen,
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
    textSizePortrait: {
        // fontSize: 16,
        fontSize: (isTablet) ? 16 : 6
    },
    textSizeLandscape: {
        // fontSize: 20,
        fontSize: (isTablet) ? 20 : 16
    },
    tinyLogo: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    }
})

export default OFPHeaderComp;