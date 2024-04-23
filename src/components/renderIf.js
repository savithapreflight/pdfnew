import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';

const RenderIf = ({children, isTrue}) => {
  return <>{isTrue ? children : null}</>;
};

export default memo(RenderIf);

const styles = StyleSheet.create({});
