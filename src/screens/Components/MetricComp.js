/* eslint-disable */
import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ConfigData from '../../ConfigData/ConfigJson';
import {ThemeContext} from '../../Utilis/ThemeManager';
import {IS_IPAD, IS_TABLET, isTablet} from '../../constants/index';

import SegmentedControlTab from 'react-native-segmented-control-tab';
import COLORS from '../../constants/colors';
import {ScrollView, TextInput} from 'react-native-gesture-handler';

const MetricComp = props => {
  const themeContext = useContext(ThemeContext);
  const {theme, Orientation} = themeContext;

  const {alt1Value, onALT1, validateALT1, validateSTBYALT, onSTBYALT} = props;

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  // const [alt1Value, setAlt1Value] = useState('');
  const [stbyaltValue, setStbyaltValue] = useState('');
  const [alt2Value, setAlt2Value] = useState('');
  const [headerClickedIndex, setHeaderClickedIndex] = useState(5);
  const [subHeaderClickedIndex, setSubHeaderClickedIndex] = useState(1);

  const titleData = ['', 'ALT1', '', 'STBYALT', '', 'ALT2', '', 'CHECK'];
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
  ];
  const verticalPaddHeight = Orientation === 'Portrait' ? 5 : 10;

  let itemWidth = 100 / 8;

  // const themeStyle = theme == "Light" ? styles.tabStyleLight : styles.tabStyleDark;
  const textFieldTabBgColor = theme == 'Light' ? '#fff' : '#333';
  const checkFontColor = theme == 'Light' ? '#fff' : COLORS.FluorescentGreen;

  /**
   *
   */
  useEffect(() => {
    setIsDarkTheme(theme === 'Dark');
    setHeaderClickedIndex(headerClickedIndex);
    setSubHeaderClickedIndex(subHeaderClickedIndex);
  }, []);

  /**
   *
   */
  const onChangeTheme = () => {
    themeContext.toggleTheme();
  };

  const headerTitleSelectionHandler = (headerClickedIndex) => {
    setHeaderClickedIndex(headerClickedIndex);
  };

  const renderHeaderItem = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(0);
          }}>
          <Text
            style={{
              ...styles[`tabTextStyle${theme}`],
              ...styles[`textSize${Orientation}`],
            }}>
            {' '}
            {titleData[0]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(0);
          }}>
          <Text
            style={{
              ...styles[`tabTextStyle${theme}`],
              ...styles[`textSize${Orientation}`],
            }}>
            {' '}
            {titleData[1]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            width: `${itemWidth}%`,
            backgroundColor: textFieldTabBgColor,
          }}
          onPress={() => {
            headerTitleSelectionHandler(0);
          }}>
          <TextInput
            keyboardType="numeric"
            onChangeText={onALT1}
            onBlur={validateALT1}
            value={alt1Value}
            style={{
              ...styles[`tabTextStyle${theme}`],
              ...styles[`textSize${Orientation}`],
            }}></TextInput>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(0);
          }}>
          <Text
            style={{
              ...styles[`tabTextStyle${theme}`],
              ...styles[`textSize${Orientation}`],
            }}>
            {' '}
            {titleData[3]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
            backgroundColor: textFieldTabBgColor,
          }}
          onPress={() => {
            headerTitleSelectionHandler(1);
          }}>
          <TextInput
            keyboardType="numeric"
            onChangeText={onSTBYALT}
            onBlur={validateSTBYALT}
            value={stbyaltValue}
            style={
              headerClickedIndex == 1
                ? {
                    ...styles[`activeTabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
                : {
                    ...styles[`tabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
            }></TextInput>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(1);
          }}>
          <Text
            style={
              headerClickedIndex == 2
                ? {
                    ...styles[`activeTabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
                : {
                    ...styles[`tabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
            }>
            {' '}
            {titleData[5]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
            backgroundColor: textFieldTabBgColor,
          }}
          onPress={() => {
            headerTitleSelectionHandler(1);
          }}>
          <TextInput
            keyboardType="numeric"
            value={alt2Value}
            style={
              headerClickedIndex == 3
                ? {
                    ...styles[`activeTabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
                : {
                    ...styles[`tabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
            }></TextInput>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`activeTabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            onValidateCheck();
          }}>
          <Text
            style={
              headerClickedIndex == 4
                ? {
                    ...styles[`activeTabTextStyle${theme}`],
                    color: checkFontColor,
                    ...styles[`textSize${Orientation}`],
                  }
                : {
                    ...styles[`tabTextStyle${theme}`],
                    color: checkFontColor,
                    ...styles[`textSize${Orientation}`],
                  }
            }>
            {' '}
            {titleData[7]}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooterItem = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(0);
          }}>
          <Text
            style={{
              ...styles[`tabTextStyle${theme}`],
              ...styles[`textSize${Orientation}`],
            }}>
            {' '}
            {}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(0);
          }}>
          <Text
            style={{
              ...styles[`tabTextStyle${theme}`],
              ...styles[`textSize${Orientation}`],
            }}>
            {' '}
            {}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(0);
          }}>
          <Text
            style={{
              ...styles[`tabTextStyle${theme}`],
              ...styles[`textSize${Orientation}`],
            }}>
            {' '}
            {}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`activeTabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            width: `${itemWidth * 2}%`,
          }}
          onPress={() => {
            props.onClick();
          }}>
          <Text
            style={{
              ...styles[`tabTextStyle${theme}`],
              color: checkFontColor,
              ...styles[`textSize${Orientation}`],
            }}>
            {' '}
            EXIT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(1);
          }}>
          <Text
            style={
              headerClickedIndex == 1
                ? {
                    ...styles[`activeTabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
                : {
                    ...styles[`tabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
            }>
            {' '}
            {}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(1);
          }}>
          <Text
            style={
              headerClickedIndex == 2
                ? {
                    ...styles[`activeTabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
                : {
                    ...styles[`tabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
            }></Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles[`tabStyle${theme}`],
            paddingVertical: verticalPaddHeight,
            borderLeftWidth: 0,
            width: `${itemWidth}%`,
          }}
          onPress={() => {
            headerTitleSelectionHandler(2);
          }}>
          <Text
            style={
              headerClickedIndex == 4
                ? {
                    ...styles[`activeTabTextStyle${theme}`],
                    ...styles[`textSize${Orientation}`],
                  }
                : {
                    ...styles[`tabTextStyle${theme}`],
                    color: checkFontColor,
                    ...styles[`textSize${Orientation}`],
                  }
            }>
            {' '}
            {}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        flex: 1,
        width: '100%',
      }}>
      <View
        style={{borderColor: COLORS.DarkerGrey, borderWidth: 1, width: '100%'}}>
        <Text
          style={{
            paddingVertical: 10,
            ...styles[`textStyle${theme}`],
            ...styles[`textSize${Orientation}`],
          }}>
          RVSM READING TAKEN AT 12:56 Z (Time of entry)
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('../../../src/assets/metricValue.jpeg')}
        />
      </View>

      {renderFooterItem()}
    </View>
  );
};
const styles = StyleSheet.create({
  tabStyleLight: {
    borderColor: COLORS.LighterGrey,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
  },
  tabStyleDark: {
    borderColor: COLORS.LighterGrey, //COLORS.DarkGrey,
    backgroundColor: COLORS.Black,
    borderWidth: 1,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
  },
  activeTabStyleLight: {
    backgroundColor: COLORS.DarkModeBtnInActiveBg,
  },
  activeTabStyleDark: {
    backgroundColor: COLORS.DarkModeBtnInActiveBg,
  },
  tabTextStyleLight: {
    color: COLORS.Black,
    textAlign: 'center',
    // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
    fontWeight: '600',
  },
  tabTextStyleDark: {
    color: COLORS.FluorescentGreen,
    textAlign: 'center',
    // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
    fontWeight: '600',
  },
  activeTabTextStyleLight: {
    color: COLORS.Black,
    textAlign: 'center',
    // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
    fontWeight: '600',
  },
  activeTabTextStyleDark: {
    color: COLORS.FluorescentGreen,
    textAlign: 'center',
    // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
    fontWeight: '600',
  },
  textStyleLight: {
    color: COLORS.Black,
    textAlign: 'center',
  },
  textStyleDark: {
    color: COLORS.FluorescentGreen,
    textAlign: 'center',
  },
  textSizePortrait: {
    // fontSize: 16,
    fontSize: isTablet ? 16 : 12,
  },
  textSizeLandscape: {
    // fontSize: 20,
    fontSize: isTablet ? 20 : 16,
  },
});
export default MetricComp;
