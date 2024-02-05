/* eslint-disable */
import React, {useState,useContext,useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import ConfigData from '../../ConfigData/ConfigJson'
import {ThemeContext} from '../../Utilis/ThemeManager'
import {IS_IPAD, IS_TABLET, isTablet} from '../../constants'

import SegmentedControlTab from 'react-native-segmented-control-tab'
import colors from '../../constants/colors'

const VoyageRepComp = props => {
  console.log("props 4",props)
  const themeContext = useContext(ThemeContext)

  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [headerClickedIndex, setHeaderClickedIndex] = useState(5)
  const [subHeaderClickedIndex, setSubHeaderClickedIndex] = useState(1)
  const [titleData, setTitleData] = useState([
    'FLTNO',
    'FROM',
    'TO',
    'OUT',
    'OFF',
    'ON',
    'IN',
    'BLK',
    'NIGHT',
    'DELAY',
    'REASON',
  ])
  const [subTitleData, setSubTitleData] = useState([])
 const { theme, Orientation } = themeContext;
 const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;
  useEffect(() => {
    setIsDarkTheme(themeContext.theme === 'Dark')
    setHeaderClickedIndex(props.data.headerClickedIndex)
    setSubHeaderClickedIndex(props.data.subHeaderClickedIndex)
    setSubTitleData(props.data.subTitleData)
  }, [themeContext, props.data])

  const onChangeTheme = () => {
    themeContext.toggleTheme()
    setIsDarkTheme(prevTheme => !prevTheme)
  }

  const headerTitleSelectionHandler = clickedIndex => {
    setHeaderClickedIndex(clickedIndex)
    // this.props.onClick("HEADER", clickedIndex);
  }
  const renderHeaderItem = () => {
    const headerIndex = props.data.headerIndex
    const {theme, Orientation} = themeContext
    const verticalPaddHeight = Orientation === 'Portrait' ? 5 : 10

    let itemWidth = 100 / 11
    const activeThemeBgColor = isDarkTheme ? '#000' : '#ccc'
    const inActiveThemeBgColor = isDarkTheme ? '#000' : '#ccc'

    return (
      <View style={{flexDirection: 'row'}}>
        {titleData.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={{
              paddingVertical: verticalPaddHeight,
              width: `${itemWidth}%`,
              backgroundColor:
                headerClickedIndex === index
                  ? activeThemeBgColor
                  : inActiveThemeBgColor,
              ...styles[`tabStyle${theme}`],
            }}
            onPress={() => headerTitleSelectionHandler(index)}>
            <Text
              style={{
                ...styles[`tabTextStyle${theme}`],
                ...styles[`textSize${Orientation}`],
              }}>
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  const renderSubmitClearListItem = () => {
    const headerIndex = props.data.headerIndex
    const {theme, Orientation} = themeContext
    const verticalPaddHeight = Orientation === 'Portrait' ? 5 : 10

    let itemWidth = 100 / 8
    
    return (
        <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(0) }} >
            <Text style={{ ...styles[`tabTextStyle${theme}`], fontSize: 16, ...styles[`textSize${Orientation}`] }}> { }</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(1) }} >
            <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, width: `${itemWidth * 2}%` }} onPress={() => { headerTitleSelectionHandler(3) }} >
            <Text style={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> SUBMIT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles[`activeTabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth * 2}%` }} onPress={() => { headerTitleSelectionHandler(5) }}>
            <Text style={headerClickedIndex == 2 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}>CLEAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(4) }}>
            <Text style={headerClickedIndex == 1 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderLeftWidth: 0, width: `${itemWidth}%` }} onPress={() => { headerTitleSelectionHandler(6) }}>
            <Text style={headerClickedIndex == 4 ? { ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] } : { ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}> { }</Text>
        </TouchableOpacity>
    </View>
    )
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        flex: 1,
      }}>
          
      {renderHeaderItem()}
      <SegmentedControlTab
        tabStyle={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderBottomWidth: 1 }}
        activeTabStyle={styles[`activeTabStyle${theme}`]}
        tabTextStyle={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
        activeTabTextStyle={{ ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
        borderRadius={0}
        // values={[subTitleData[0], subTitleData[1], subTitleData[2], subTitleData[3], subTitleData[4], subTitleData[5], subTitleData[6], subTitleData[7], subTitleData[8], subTitleData[9], subTitleData[10]]}
        selectedIndex={subHeaderClickedIndex}
        onTabPress={(index) => {
            setSubHeaderClickedIndex({ subHeaderClickedIndex: index })
          // onClick("SUBHEADER", index);
          // Assuming onClick is a prop function passed from the parent component
          // If not, you can define a local function here and use it to set the state.
          // Example: const handleTabPress = (index) => { ... }
          // Then, use `handleTabPress` instead of `onClick` in the `onTabPress` attribute.
        }}
      />
      <View
        style={{borderColor: colors.DarkerGrey, borderWidth: 1, width: '100%'}}>
        <Text
          style={{
            paddingVertical: 10,
            ...styles[`activeTabTextStyle${theme}`],
            ...styles[`textSize${Orientation}`],
          }}>
          SPECIAL REPORT
        </Text>
      </View>
      <View style={{flex: 1}}></View>
      <Text
        style={{
          paddingVertical: 10,
          ...styles[`activeTabTextStyle${theme}`],
          ...styles[`textSize${Orientation}`],
        }}>
        I CAN WRITE
      </Text>
      {renderSubmitClearListItem()}
      <SegmentedControlTab
                    tabStyle={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight, borderBottomWidth: 1 }}
                    activeTabStyle={styles[`activeTabStyle${theme}`]}
                    tabTextStyle={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                    activeTabTextStyle={{ ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                    borderRadius={0}
                    values={['', '', '', '', '', '', '', '']}
                    selectedIndex={subHeaderClickedIndex}
                    onTabPress={(index) => {
                        // this.props.onClick("SUBHEADER", index);
                        setSubHeaderClickedIndex({ subHeaderClickedIndex: index });
                    }}
                />
    </View>
  )
}

const styles = StyleSheet.create({

    tabStyleLight: {
        borderColor: colors.LighterGrey,
        backgroundColor: colors.White,//'#929292',
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingVertical: 5,
    },
    tabStyleDark: {
        borderColor: colors.LighterGrey, //colors.DarkGrey,
        backgroundColor: colors.Black,
        borderWidth: 1,
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
    textSizePortrait: {
        // fontSize: 14,
        fontSize:(isTablet) ? 14 : 10
    },
    textSizeLandscape: {
        //  fontSize: 18,
        fontSize:(isTablet) ? 18 : 14
    }
})

export default VoyageRepComp
