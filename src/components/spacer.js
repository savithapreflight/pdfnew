import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import useTheme from '../hooks/useTheme';

const Spacer = props => {
  const {
    id = 'Spacer',
    style,
    vertical,
    horizontal,
    // colors-------
    color,
    primary,
    secondary,
    tertiary,
    black,
    white,
    dark,
    light,
    gray,
    warning,
    success,
    danger,
    info,
    // block props----------------
    border,
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
    background,
    status,
    radius,
    borderColor,
    height,
    width,
    elevation,
    overflow,
    // flex-----------------------
    flex,
    row,
    center,
    alignSelf,
    alignItems,
    justifyContent,
    // ---------------------------
  } = props;
  const {colors, sizes, lines, weights, fonts} = useTheme();

  const colorIndex = primary
    ? 'primary'
    : secondary
    ? 'secondary'
    : tertiary
    ? 'tertiary'
    : white
    ? 'white'
    : black
    ? 'black'
    : light
    ? 'light'
    : dark
    ? 'dark'
    : gray
    ? 'gray'
    : success
    ? 'success'
    : warning
    ? 'warning'
    : info
    ? 'info'
    : danger
    ? 'danger'
    : null;

  const backgroundColor = background
    ? background
    : colorIndex
    ? colors?.[colorIndex]
    : undefined;

  const styles = StyleSheet.flatten([
    style,
    {
      ...(vertical && {
        width: width || '90%',
        height: height || sizes.m,
        alignSelf: 'center',
      }),
      ...(horizontal && {
        width: width || sizes.m,
        height: height || '90%',
        alignSelf: 'center',
      }),
      //   --------------------Block-----------------------------------

      ...(overflow && {overflow}),
      ...(border && {borderWidth: border === true ? 1 : border}),
      ...(borderColor && {borderColor}),
      ...(radius && {borderRadius: radius === true ? sizes.radius : radius}),
      ...(elevation && {elevation: elevation === true ? 2 : elevation}),
      ...(backgroundColor && {backgroundColor: backgroundColor}),
      ...(height && {height}),
      ...(width && {width}),
      ...(margin && {margin: margin === true ? sizes.xs : margin}),
      ...(marginBottom && {
        marginBottom: marginBottom === true ? sizes.xs : marginBottom,
      }),
      ...(marginTop && {marginTop: marginTop === true ? sizes.xs : marginTop}),
      ...(marginHorizontal && {
        marginHorizontal:
          marginHorizontal === true ? sizes.xs : marginHorizontal,
      }),
      ...(marginVertical && {
        marginVertical: marginVertical === true ? sizes.xs : marginVertical,
      }),
      ...(marginRight && {
        marginRight: marginRight === true ? sizes.xs : marginRight,
      }),
      ...(marginLeft && {
        marginLeft: marginLeft === true ? sizes.xs : marginLeft,
      }),
      ...(padding && {padding: padding === true ? sizes.base : padding}),
      ...(paddingBottom && {
        paddingBottom: paddingBottom === true ? sizes.base : paddingBottom,
      }),
      ...(paddingTop && {
        paddingTop: paddingTop === true ? sizes.base : paddingTop,
      }),
      ...(paddingHorizontal && {
        paddingHorizontal:
          paddingHorizontal === true ? sizes.base : paddingHorizontal,
      }),
      ...(paddingVertical && {
        paddingVertical:
          paddingVertical === true ? sizes.base : paddingVertical,
      }),
      ...(paddingRight && {
        paddingRight: paddingRight === true ? sizes.base : paddingRight,
      }),
      ...(paddingLeft && {
        paddingLeft: paddingLeft === true ? sizes.base : paddingLeft,
      }),

      //   --------------------flex------------------------------------
      ...(flex !== undefined && {flex: flex === true ? 1 : flex}),
      ...(row && {flexDirection: 'row'}),
      ...(center && {alignItems: 'center', justifyContent: 'center'}),
      ...(alignSelf && {alignSelf: alignSelf}),
      ...(alignItems && {alignItems: alignItems}),
      ...(justifyContent && {justifyContent: justifyContent}),
    },
  ]);

  const blockID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};
  //   render------------------------------------------------

  if (vertical) {
    return <View {...blockID} style={styles} />;
  }
  if (horizontal) {
    return <View {...blockID} style={styles} />;
  }
  return <View {...blockID} style={styles} />;
};

export default React.memo(Spacer);

const styles = StyleSheet.create({
  flexs: {},
});
