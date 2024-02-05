/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ConfigData from '../../ConfigData/ConfigJson';
import { ThemeContext } from '../../Utilis/ThemeManager';
import { IS_IPAD, IS_TABLET, isTablet, isAndroid } from '../../constants/index';

import SegmentedControlTab from "react-native-segmented-control-tab";
import { storeData, getData } from '../../Utilis/AsyncStorage';
import logo from '../../Assets1/logo.png'
import colors from '../../constants/colors';

const HeaderComp = (props) => {
    const themeContext = useContext(ThemeContext);
    const { theme, Orientation } = themeContext;
    const { data, navigation } = props;
  
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [headerClickedIndex, setHeaderClickedIndex] = useState(5);
    const [subHeaderClickedIndex, setSubHeaderClickedIndex] = useState(1);
    const [titleData, setTitleData] = useState(ConfigData.Titles.HeaderTitle);
    const [subTitleData, setSubTitleData] = useState(ConfigData.Titles.SubHeaderTitle);
  
    useEffect(() => {
      console.log('logging logging logging')
      setIsDarkTheme(themeContext.theme === 'Dark');
      setHeaderClickedIndex(data.headerClickedIndex);
      setSubHeaderClickedIndex(data.subHeaderClickedIndex);
  
      const focusListener = navigation.addListener('focus', () => {
        if (global.screenHeadder ===
           'techlog') {
          global.screenHeadder = '';
          setSubHeaderClickedIndex(4);
        } else if (global.screenHeadder === 'voy') {
          global.screenHeadder = '';
          setSubHeaderClickedIndex(3);
        }
      });
  
      return () => {
        // focusListener.remove();
      };
    }, [data.headerClickedIndex, data.subHeaderClickedIndex, navigation, themeContext.theme]);

    const onChangeTheme = () => {
      themeContext.toggleTheme();
      setIsDarkTheme((prevTheme) => !prevTheme);
    };
  
    const headerTitleSelectionHandler = (clickedIndex) => {
      setHeaderClickedIndex(clickedIndex);
      props.onClick('HEADER', clickedIndex);6
    };
  
    const renderHeaderItem = () => {
      const { headerIndex } = data;
      const verticalPaddHeight = Orientation === 'Portrait' ? 5 : 10;
  
      let itemWidth = 100 / 8;
      const activeThemeBgColor = colors.DarkModeBtnActiveBg;
      const inActiveThemeBgColor = colors.DarkModeBtnInActiveBg;
      // const userID = global.userID._W;
      const userID = global.userID
      const logoImg = Image.resolveAssetSource(logo).uri;
  
      return (
       
        <View style={{ flexDirection: 'row' }}>
           <TouchableOpacity
          disabled={true}
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: 0,
            width: `${itemWidth}%`,
            backgroundColor: headerClickedIndex === 0 ? activeThemeBgColor : inActiveThemeBgColor,
          }}
          onPress={() => headerTitleSelectionHandler(0)}
        >
          {/* <Image style={styles.tinyLogo} source={{ uri: logoImg }} /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
            backgroundColor: headerClickedIndex === 1 ? activeThemeBgColor : inActiveThemeBgColor,
          }}
          onPress={() => headerTitleSelectionHandler(1)}
        >
            <Text
            style={
              headerClickedIndex === 1
                ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
                : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
            }
          >
            {userID}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={true}
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth * 3}%`,
            backgroundColor: headerClickedIndex === 2 ? activeThemeBgColor : inActiveThemeBgColor,
          }}
          onPress={() => headerTitleSelectionHandler(2)}
        >
          <Text
            style={
              headerClickedIndex === 2
                ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
                : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
            }
            >
            {titleData[headerIndex].Third}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
            backgroundColor: headerClickedIndex === 3 ? activeThemeBgColor : inActiveThemeBgColor,
          }}
          onPress={() => headerTitleSelectionHandler(3)}
        >
          <Text
            style={
              headerClickedIndex === 3
                ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
                : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
            }
          >
            {titleData[headerIndex].Fourth}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
            backgroundColor: isDarkTheme ? activeThemeBgColor : inActiveThemeBgColor,
          }}
          onPress={() => onChangeTheme()}
        >
          <Text
            style={
              isDarkTheme
                ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
                : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
            }
          >
            {titleData[0].Fifth}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
            backgroundColor: headerClickedIndex === 5 ? activeThemeBgColor : inActiveThemeBgColor,
          }}
          onPress={() => headerTitleSelectionHandler(5)}
        >
          <Text
            style={
              headerClickedIndex === 5
                ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
                : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }
            }
          >
            {titleData[headerIndex].Sixth}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => {
    // const { theme, Orientation } = themeContext;

    const verticalPaddHeight = Orientation === 'Portrait' ? (isTablet ? 5 : isAndroid ? 5 : 2.5) : 10;
    const { subHeaderIndex } = data;
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {renderHeaderItem()}
          <SegmentedControlTab
            tabStyle={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderBottomWidth: 1 }}
            activeTabStyle={styles[`activeTabStyle${theme}`]}
            tabTextStyle={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
            activeTabTextStyle={{ ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
            borderRadius={0}
            values={[subTitleData[subHeaderIndex].First, subTitleData[subHeaderIndex].Second, subTitleData[subHeaderIndex].Third, subTitleData[subHeaderIndex].Fourth, subTitleData[subHeaderIndex].Fifth, subTitleData[subHeaderIndex].Sixth, subTitleData[subHeaderIndex].Seventh, subTitleData[subHeaderIndex].Eighth]}
            selectedIndex={subHeaderClickedIndex}
            onTabPress={(index) => {
              props.onClick('SUBHEADER', index);
              setSubHeaderClickedIndex(index);
            }}
          />
        </View>
      );
    };
  
    return renderHeader();
  };

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
        borderColor: colors.DarkGrey,
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
        fontSize:(isTablet) ? 16 : 6
    },
    textSizeLandscape: {
        // fontSize: 20,
        fontSize:(isTablet) ? 20 : 16
    },
    tinyLogo: {
        // width: 27,
        // height: 10,
        // alignContent:'center',
        // justifyContent:'center',
        // alignSelf:'center'
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    }
})
  
  export default HeaderComp;