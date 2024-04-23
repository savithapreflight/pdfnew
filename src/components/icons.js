import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useDefaultTheme from '../hooks/useDefaultTheme';

const Icons = props => {
  const {
    id = 'Icons',
    iconName,
    label,
    smallIcon,
    mediumIcon,
    largeIcon,
    xlargeIcon,
    size,
    _Ionicons,
    press,
    style,
    width,
    height,
    padding,
    paddingHorizontal,
    paddingVertical,
    margin,
    marginHorizontal,
    marginVertical,
    borderRadius,
    elevation,
    border,
    backgroundColor,
    primary,
    secondary,
    white,
    black,
    color,
    flex,
    alignItems,
    alignSelf,
    justifyContent,
    center,
    row,
    ...rest
  } = props;
  const {sizes, colors, fonts, lines, weights, gradients} = useDefaultTheme();

  const colorIndex = primary
    ? 'primary'
    : secondary
    ? 'secondary'
    : white
    ? 'white'
    : null;

  const iconColor = color ? color : colorIndex ? colors?.[colorIndex] : 'gray';

  const iconSizeIndex = size
    ? size
    : smallIcon
    ? 'smallIcon'
    : largeIcon
    ? 'largeIcon'
    : mediumIcon
    ? 'mediumIcon'
    : null;

  const iconSize = size
    ? size
    : iconSizeIndex
    ? sizes?.[iconSizeIndex]
    : sizes.mediumIcon;

  const styles = StyleSheet.flatten([
    style,
    {
      ...(row && {flexDirection: 'row'}),
      ...(elevation && {elevation}),

      ...(alignItems && {alignItems: alignItems}),
      ...(alignSelf && {alignSelf: alignSelf}),
      ...(justifyContent && {justifyContent: justifyContent}),
      ...(flex && {flex: 1}),
      ...(backgroundColor && {backgroundColor: backgroundColor}),
      ...(padding && {padding}),
      ...(paddingVertical && {paddingVertical}),
      ...(paddingHorizontal && {paddingHorizontal}),
      ...(border !== undefined && {borderWidth: border === true ? 1 : border}),
      ...(margin && {margin: margin}),
      ...(marginHorizontal && {marginHorizontal}),
      ...(marginVertical && {marginVertical}),
    },
  ]);

  const blockID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

  const IconIs = () => {
    if (_Ionicons) {
      return (
        <Ionicons name={iconName || 'help'} color={iconColor} size={iconSize} />
      );
    }
    return (
      <Ionicons name={iconName || 'help'} color={iconColor} size={iconSize} />
    );
  };

  // -----------------------------------------------------------------------------------------

  if (press) {
    return (
      <TouchableOpacity {...blockID} {...rest} style={styles}>
        <IconIs />
      </TouchableOpacity>
    );
  }

  return (
    <View {...blockID} {...rest} style={styles}>
      <IconIs />
    </View>
  );
};

export default React.memo(Icons);
