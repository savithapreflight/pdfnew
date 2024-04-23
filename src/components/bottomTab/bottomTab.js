import {
  ScrollView,
  StyleSheet,
  Text as NativeText,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {_colors} from '../../css/colors';
import Text from '../text';
import useDefaultTheme from '../../hooks/useDefaultTheme';
import Button from '../button';
import {Block, Icons} from '..';
import Svg, {Path} from 'react-native-svg';

const BottomNavTab = props => {
  const {notify} = useSelector(_state => _state);
  const {colors, sizes} = useDefaultTheme();
  const {state, descriptors, navigation} = props;
  const [active, setactive] = useState('Home');

  return (
    <View style={[styles.container, {backgroundColor: colors.light}]}>
      <View style={styles.bottomBar}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const isFocused = state.index === index;
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const IconIs = options.tabBarIcon && options.tabBarIcon;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };
          if (label === 'Check In') {
            return (
              <Block key={index} center radius width="20%">
                <Block
                  flex
                  position="absolute"
                  top={-26}
                  padding={0}
                  zIndex={20}
                  center>
                  <Button
                    primary
                    width={65}
                    height={65}
                    radius={200}
                    onPress={onPress}
                    elevation={isFocused ? 10 : 4}>
                    {/* <Icons
                      _Ionicons
                      white
                      label={
                        isFocused ? 'ios-location' : 'ios-location-outline'
                      }
                      size={30}
                    /> */}
                    <Text fontSize={10} textAlign="center" white>
                      CheckIn
                    </Text>
                  </Button>
                  {/* <Text
                    marginTop={4}
                    color={isFocused ? colors.primary : colors.gray}>
                    Check In
                  </Text> */}
                </Block>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={116}
                  height={'100%'}
                  fill="none"
                  {...props}>
                  <Path
                    fill={colors.light}
                    d="M22.678 22.481V0H.178c12.42 0 22.49 10.063 22.5 22.481zm0-22.481h92.797c-12.427 0-22.5 10.074-22.5 22.5V9.87C92.965 29.272 77.232 45 57.826 45 38.414 45 22.678 29.264 22.678 9.852V0z"
                  />
                </Svg>
              </Block>
            );
          }
          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.menuBlock}>
              <View style={[styles.menu]}>
                {label === 'Messages' &&
                  !isFocused &&
                  notify?.viewCount > 0 && (
                    <NativeText style={styles.count}>
                      {notify?.viewCount}
                    </NativeText>
                  )}
                <View style={styles.icon}>
                  {options.tabBarIcon ? (
                    <IconIs
                      color={isFocused ? _colors.primary : 'gray'}
                      focused={isFocused}
                    />
                  ) : (
                    <NativeText></NativeText>
                  )}
                </View>
                <Text color={isFocused ? colors.primary : colors.gray}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavTab;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 75,
    // borderWidth: 1,
    justifyContent: 'flex-end',
  },
  bottomBar: {
    backgroundColor: 'white',
    height: '85%',
    width: '100%',
    borderWidth: 0,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  menuBlock: {
    borderWidth: 0,
    height: '100%',
    // width: '18%',
    flex: 1,
    // paddingHorizontal: wp('2'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderRadius: 8,
    paddingVertical: 4,
    // minWidth: wp('15%'),
    // borderWidth: 1,
  },
  icon: {
    // width: wp('10'),
    // height: wp('10'),
    // marginRight: 5,
  },
  label: {
    // marginHorizontal: 5,

    fontSize: 15,
    fontFamily: 'DMSans-Regular',
  },
  count: {
    position: 'absolute',
    right: 5,
    top: 0,
    backgroundColor: 'red',
    color: 'white',
    minWidth: 18,
    minHeight: 15,
    borderRadius: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    zIndex: 10,
  },
});
