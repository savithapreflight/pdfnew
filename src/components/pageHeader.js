import {ScrollView, StyleSheet, Text, View, Platform} from 'react-native';
import React from 'react';
import useDefaultTheme from '../hooks/useDefaultTheme';
import Block from './block';

const PageHeader = props => {
  const {children, ...rest} = props;

  return (
    <Block center radius padding white elevation {...rest}>
      {children}
    </Block>
  );
};

export default React.memo(PageHeader);
