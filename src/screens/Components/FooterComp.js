/* eslint-disable */
import React,{useContext,useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConfigData from '../../ConfigData/ConfigJson';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { ThemeContext } from '../../Utilis/ThemeManager';
import { IS_IPAD, IS_TABLET, isTablet } from '../../constants';
import colors from '../../constants/colors';

const FooterComp = ({ onFooterClick }) => {

    const themeContext = useContext(ThemeContext);
    const { theme, Orientation } = themeContext;
    const verticalPaddHeight = Orientation === "Portrait" ? 5 : 10;

    const footerTitles = ConfigData.Titles.FooterTitle;

    const [clickedIndex, setClickedIndex] = useState(0);

    const footerTitleSelectionHandler = () => {
        console.log('clickedIndex===', clickedIndex);
        if (clickedIndex === 0 || clickedIndex === 4 || clickedIndex === 6) {
            onFooterClick(clickedIndex);
        }
    };

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <SegmentedControlTab
                tabStyle={{ ...styles[`tabStyle${theme}`], paddingVertical: verticalPaddHeight }}
                activeTabStyle={styles[`activeTabStyle${theme}`]}
                tabTextStyle={{ ...styles[`tabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                activeTabTextStyle={{ ...styles[`activeTabTextStyle${theme}`], ...styles[`textSize${Orientation}`] }}
                borderRadius={0}
                values={[
                    footerTitles[0].First,
                    footerTitles[0].Second,
                    footerTitles[0].Third,
                    footerTitles[0].Fourth,
                    footerTitles[0].Fifth,
                    footerTitles[0].Sixth,
                    footerTitles[0].Seventh,
                    footerTitles[0].Eighth
                ]}
                selectedIndex={null}
                onTabPress={(index) => {
                    setClickedIndex(index);
                    footerTitleSelectionHandler(index);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tabStyleLight: {
        borderColor: colors.LighterGrey,
        backgroundColor: colors.DarkModeBtnInActiveBg,//'#929292',
        borderWidth: 1,
        shadowColor: colors.Black,
        shadowOffset: {
            width: 0,
            height: -3
        },
        elevation: 3,
        shadowOpacity: 0.3,
    },
    tabStyleDark: {
        borderColor: colors.DarkGrey,
        backgroundColor: colors.DarkModeBtnInActiveBg,
        borderWidth: 1,
        shadowColor: colors.Black,//colors.FluorescentGreen,
        shadowOffset: {
            width: 0,
            height: -3
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
        // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    tabTextStyleDark: {
        color: colors.Black,
        // fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    activeTabTextStyleLight: {
        color: colors.FluorescentGreen,
        //fontSize: (IS_IPAD || IS_TABLET) ? 12 : 8,
        fontWeight: '600'
    },
    activeTabTextStyleDark: {
        color: colors.FluorescentGreen,
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
    }
})

export default FooterComp;