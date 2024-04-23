import {
  StyleSheet,
  Text,
  View,
  TextInput as NativeTextInput,
} from 'react-native';
import React from 'react';
import {Picker} from '@react-native-picker/picker';
import useDefaultTheme from '../hooks/useDefaultTheme';
import {Icons} from './index';

const Dropdown = props => {
  const {
    id = 'Dropdown',
    h1,
    h2,
    h3,
    h4,
    h5,
    p,
    bold,
    transform,
    textAlign,
    textColor,
    children,
    style,
    width,
    height,
    margin,
    marginBottom,
    marginTop,
    marginHorizontal,
    marginVertical,
    marginRight,
    marginLeft,
    padding,
    paddingBottom,
    paddingTop,
    paddingHorizontal,
    paddingVertical,
    paddingRight,
    paddingLeft,
    elevation,
    borderRadius = 1,
    border,
    primary,
    secondary,
    white,
    black,
    background,
    flex,
    alignItems,
    alignSelf,
    justifyContent,
    center,
    row,
    position,
    right,
    left,
    top,
    bottom,
    end,
    start,
    scroll,
    password,
    secure,
    onIconPress,
    pickerProps,

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

  const backgroundColor = background
    ? background
    : colorIndex
    ? colors?.[colorIndex]
    : undefined;

  const styles = StyleSheet.flatten([
    style,
    {
      //   padding: sizes.base,
      //   borderBottomWidth: 1,
      justifyContent: 'center',
      overflow: 'hidden',

      borderColor: colors.gray,
      ...(height && {height}),
      ...(width && {width}),
      ...(elevation && {elevation}),

      ...(borderRadius && {
        borderRadius: borderRadius !== true ? borderRadius : sizes.radius,
      }),
      ...(row && {flexDirection: 'row'}),
      ...(center && {alignItems: 'center', justifyContent: 'center'}),
      ...(alignItems && {alignItems: alignItems}),
      ...(alignSelf && {alignSelf: alignSelf}),
      ...(justifyContent && {justifyContent: justifyContent}),
      ...(flex && {flex}),
      ...(backgroundColor && {backgroundColor: backgroundColor}),
      ...(border !== undefined && {borderWidth: border === true ? 1 : border}),
      ...(margin !== undefined && {margin}),
      ...(marginBottom && {marginBottom}),
      ...(marginTop && {marginTop}),
      ...(marginHorizontal && {marginHorizontal}),
      ...(marginVertical && {marginVertical}),
      ...(marginRight && {marginRight}),
      ...(marginLeft && {marginLeft}),
      ...(padding !== undefined && {padding}),
      ...(paddingBottom && {paddingBottom}),
      ...(paddingTop && {paddingTop}),
      ...(paddingHorizontal && {paddingHorizontal}),
      ...(paddingVertical && {paddingVertical}),
      ...(paddingRight && {paddingRight}),
      ...(paddingLeft && {paddingLeft}),

      ...(position && {position}),
      ...(right !== undefined && {right}),
      ...(left !== undefined && {left}),
      ...(top !== undefined && {top}),
      ...(bottom !== undefined && {bottom}),
    },
  ]);

  const pickerStyle = StyleSheet.flatten([
    {
      borderWidth: 1,
    },
  ]);

  const blockID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

  return (
    <View {...blockID} style={styles}>
      {children}
    </View>
  );
};

export default React.memo(Dropdown);
