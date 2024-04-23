import {StyleSheet, Text as NativeText, View} from 'react-native';
import React, {Children} from 'react';
import useTheme from '../hooks/useTheme';

const Text = props => {
  const {
    id = 'Text',
    children,
    style,
    underline,
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
    // text props----------------
    textAlign,
    uppercase,
    lowercase,
    capitalize,
    h1,
    h2,
    h3,
    h4,
    h5,
    p,
    fontSize,
    bold,
    // block props----------------
    border,
    alignSelf,
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
    radius,
    borderColor,
    height,
    width,
    elevation,
    // ----------------
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

  const textColor = color
    ? color
    : colorIndex
    ? colors?.[colorIndex]
    : undefined;

  const backgroundColor = background ? background : undefined;

  const transform = uppercase
    ? 'uppercase'
    : lowercase
    ? 'lowercase'
    : capitalize
    ? 'capitalize'
    : 'none';

  const styles = StyleSheet.flatten([
    style,
    {
      // fontSize: sizes.text,
      fontFamily: fonts.text,
      ...(textColor && {color: textColor}),
      //   --------------------Block-----------------------------------
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

      // flex style------------------------------------
      ...(alignSelf && {alignSelf}),
      // text style------------------------------------
      ...(fontSize && {fontSize}),
      ...(textAlign && {textAlign}),
      ...(transform && {textTransform: transform}),

      ...(h1 && {
        fontSize: sizes.h1,
        lineHeight: lines.h1,
        fontWeight: weights.h1,
        fontFamily: fonts.h1,
      }),
      ...(h2 && {
        fontSize: sizes.h2,
        lineHeight: lines.h2,
        fontWeight: weights.h2,
        fontFamily: fonts.h2,
      }),
      ...(h3 && {
        fontSize: sizes.h3,
        lineHeight: lines.h3,
        fontWeight: weights.h3,
        fontFamily: fonts.h3,
      }),
      ...(h4 && {
        fontSize: sizes.h4,
        lineHeight: lines.h4,
        fontWeight: weights.h4,
        fontFamily: fonts.h4,
      }),
      ...(h5 && {
        fontSize: sizes.h5,
        lineHeight: lines.h5,
        fontWeight: weights.h5,
        fontFamily: fonts.h5,
      }),
      ...(p && {
        fontSize: sizes.p,
        lineHeight: lines.p,
        fontWeight: weights.p,
        fontFamily: fonts.p,
      }),
      ...(bold && {fontFamily: fonts.bold}),
      ...(underline && {
        textDecorationLine: underline !== true ? underline : 'underline',
        textDecorationColor: textColor,
      }),
    },
  ]);

  const blockID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

  return (
    <NativeText {...blockID} style={styles} {...rest}>
      {children}
    </NativeText>
  );
};

export default React.memo(Text);

const styles = StyleSheet.create({
  text: {},
});
