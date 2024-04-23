import {StyleSheet, Text, View, Image as NativeImage} from 'react-native';
import React from 'react';
import useTheme from './../hooks/useTheme';

const Image = props => {
  const {
    id = 'Image',
    height = '100%',
    width = '100%',
    style,
    source,
    cover,
    contain,
    stretch,
    repeat,
    center,
    resize,
    scale,
    ...rest
  } = props;

  const {sizes} = useTheme();

  const resizeMode = cover
    ? 'cover'
    : contain
    ? 'contain'
    : stretch
    ? 'stretch'
    : repeat
    ? 'repeat'
    : center
    ? 'center'
    : 'contain';

  const resizeMethod = resize ? 'resize' : scale ? 'scale' : 'auto';

  const styles = StyleSheet.flatten([
    style,
    {
      ...(height && {height}),
      ...(width && {width}),
    },
  ]);

  return (
    <NativeImage
      style={styles}
      resizeMode={'contain'}
      resizeMethod={resizeMethod}
      source={source}
    />
  );
};

export default Image;

const styles = StyleSheet.create({});
