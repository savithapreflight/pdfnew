import {Dimensions, Platform} from 'react-native';

const {width, height} = Dimensions.get('window');

// Naming source: https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
export const WEIGHTS = {
  text: 'normal',
  h1: Platform.OS === 'ios' ? '700' : 'normal',
  h2: Platform.OS === 'ios' ? '700' : 'normal',
  h3: Platform.OS === 'ios' ? '700' : 'normal',
  h4: Platform.OS === 'ios' ? '700' : 'normal',
  h5: Platform.OS === 'ios' ? '600' : 'normal',
  p: 'normal',

  thin: Platform.OS === 'ios' ? '100' : 'normal',
  extralight: Platform.OS === 'ios' ? '200' : 'normal',
  light: Platform.OS === 'ios' ? '300' : 'normal',
  normal: Platform.OS === 'ios' ? '400' : 'normal',
  medium: Platform.OS === 'ios' ? '500' : 'normal',
  semibold: Platform.OS === 'ios' ? '600' : 'normal',
  bold: Platform.OS === 'ios' ? '700' : 'normal',
  extrabold: Platform.OS === 'ios' ? '800' : 'normal',
  black: Platform.OS === 'ios' ? '900' : 'normal',
};

export const ICONS = {
  // apple: require('../assets/icons/apple.png'),
  // google: require('../assets/icons/google.png'),
  // facebook: require('../assets/icons/facebook.png'),
};

export const ASSETS = {
  // fonts
  // DmSansRegular: require('../../../../assets/fonts/DMSans-Regular.ttf'),
  DmSansRegular: require('../../../../assets/fonts/Ubuntu-Regular.ttf'),
  // OpenSansLight: require('../../../../assets/fonts/OpenSans-Light.ttf'),
  // OpenSansLight: require('../../../../assets/fonts/OpenSans-Light.ttf'),
  // OpenSansRegular: require('../assets/fonts/OpenSans-Regular.ttf'),
  // OpenSansSemiBold: require('../assets/fonts/OpenSans-SemiBold.ttf'),
  // OpenSansExtraBold: require('../assets/fonts/OpenSans-ExtraBold.ttf'),
  // OpenSansBold: require('../assets/fonts/OpenSans-Bold.ttf'),

  // backgrounds/logo
  logo: require('../../../Assets1/logo.png'),
  background: require('../../../Assets1/flightimage.png'),
};

export const FONTS = {
  // based on font size
  text: 'DMSans-Regular',
  h1: 'DMSans-Regular',
  h2: 'DMSans-Regular',
  h3: 'DMSans-Regular',
  h4: 'DMSans-Regular',
  h5: 'DMSans-Regular',
  p: 'DMSans-Regular',

  // based on fontWeight
  thin: 'OpenSans-Light',
  extralight: 'OpenSans-Light',
  light: 'OpenSans-Light',
  normal: 'OpenSans-Regular',
  medium: 'DMSans-Medium',
  semibold: 'OpenSans-SemiBold',
  bold: 'DMSans-Bold',
  extrabold: 'OpenSans-ExtraBold',
  black: 'OpenSans-ExtraBold',
};

export const LINE_HEIGHTS = {
  // font lineHeight
  text: 22,
  h1: 60,
  h2: 55,
  h3: 43,
  h4: 33,
  h5: 24,
  p: 22,
};

export const THEME = {
  icons: ICONS,
  assets: {...ICONS, ...ASSETS},
  fonts: FONTS,
  weights: WEIGHTS,
  lines: LINE_HEIGHTS,
  sizes: {width, height},
};
