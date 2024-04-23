import {
  StyleSheet,
  Text,
  View,
  TextInput as NativeTextInput,
} from 'react-native';
import React from 'react';
import useDefaultTheme from '../hooks/useDefaultTheme';
import {Icons} from './index';

const TextInput = props => {
  const {
    id = 'TextInput',
    h1,
    h2,
    h3,
    h4,
    h5,
    p,
    bold,
    textArea,
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
    placeholder,
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
      borderWidth: 1,
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

  const inputStyles = StyleSheet.flatten([
    {
      //   borderWidth: 1,
      //   backgroundColor: colors.primary,
      flex: 1,
      margin: 0,
      paddingVertical: sizes.s - 2,
      fontSize: sizes.text,
      lineHeight: lines.text,
      textTransform: transform,
      ...(textAlign && {textAlign}),
      ...(textColor && {color: textColor}),
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
    },
  ]);

  const blockID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

  if (password) {
    return (
      <View
        {...blockID}
        style={{...styles, flexDirection: 'row', alignItems: 'center'}}>
        <NativeTextInput
          secureTextEntry={secure}
          style={inputStyles}
          placeholder={placeholder || ''}
          {...rest}
        />
        <Icons
          press
          onPress={() => onIconPress()}
          iconName={secure ? 'eye-off' : 'eye'}
          marginHorizontal={sizes.xs}
        />
      </View>
    );
  }
  if (textArea) {
    return (
      <View
        {...blockID}
        style={{...styles, flexDirection: 'row', alignItems: 'center'}}>
        <NativeTextInput
          placeholder={placeholder || ''}
          multiline={true}
          style={{
            ...inputStyles,
            minHeight: sizes.xl,
            textAlignVertical: 'top',
          }}
          {...rest}
        />
      </View>
    );
  }
  return (
    <View {...blockID} style={styles}>
      <NativeTextInput
        style={inputStyles}
        {...rest}
        placeholder={placeholder || ''}
      />
    </View>
  );
};

export default React.memo(TextInput);
