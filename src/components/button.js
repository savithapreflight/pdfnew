import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import useTheme from '../hooks/useTheme';

const Button = props => {
  const {
    id = 'Button',
    children,
    style,
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
    // flex-----------------------
    flex,
    row,
    center = true,
    alignSelf,
    alignItems,
    justifyContent,
    // ---------------------------
    ...rest
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

  const backgroundColor = color
    ? color
    : colorIndex
    ? colors?.[colorIndex]
    : undefined;

  const styles = StyleSheet.flatten([
    style,
    {
      height: sizes.buttonHeight,
      //   --------------------Block-----------------------------------
      ...(border && {borderWidth: border === true ? 1 : border}),
      ...(borderColor && {borderColor}),
      ...(radius && {
        borderRadius: radius === true ? sizes.buttonRadius : radius,
      }),
      ...(elevation && {elevation: elevation === true ? 2 : elevation}),
      ...(backgroundColor && {backgroundColor: backgroundColor}),
      ...(height && {height: height}),
      ...(width && {width: width}),
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

  return (
    <TouchableOpacity {...blockID} style={styles} {...rest}>
      {children}
    </TouchableOpacity>
  );
};

export default React.memo(Button);

const styles = StyleSheet.create({
  flexs: {},
});
