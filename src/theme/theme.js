import {Dimensions, Platform} from 'react-native';

const {width, height} = Dimensions.get('window');

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
  normal: 'DMSans-Regular',
  medium: 'DMSans-Medium',
  bold: 'DMSans-Bold',
  // thin: 'OpenSans-Light',
  // extralight: 'OpenSans-Light',
  // light: 'OpenSans-Light',
  // semibold: 'OpenSans-SemiBold',
  // extrabold: 'OpenSans-ExtraBold',
  // black: 'OpenSans-ExtraBold',
};
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
  bold: Platform.OS === 'ios' ? '700' : 'bold',
  extrabold: Platform.OS === 'ios' ? '800' : 'normal',
  black: Platform.OS === 'ios' ? '900' : 'normal',
};

export const LINE_HEIGHTS = {
  // font lineHeight
  text: 20,
  h1: 50,
  h2: 42,
  h3: 34,
  h4: 28,
  h5: 24,
  p: 22,
  // text: 15,
  // h1: 45,
  // h2: 41,
  // h3: 33,
  // h4: 25,
  // h5: 19,
  // p: 17,
};

export const SIZES = {
  // global sizes
  base: 10,
  text: 14,
  radius: 10,

  // padding sizes
  padding: 10,
  paddingHorizontal: 10,
  paddingVertical: 10,

  // font sizes
  h1: 44,
  h2: 36,
  h3: 28,
  h4: 22,
  h5: 18,
  p: 16,

  // button sizes
  buttonBorder: 1,
  buttonHeight: 46,
  buttonRadius: 6,
  socialSize: 64,
  socialRadius: 16,
  socialIconSize: 26,

  // button shadow
  shadowOffsetWidth: 0,
  shadowOffsetHeight: 7,
  shadowOpacity: 0.07,
  shadowRadius: 4,
  elevation: 2,

  // input sizes
  inputHeight: 46,
  inputBorder: 1,
  inputRadius: 6,
  inputPadding: 12,

  // card sizes
  cardRadius: 16,
  cardPadding: 10,

  // block sizes
  blockRadius: 6,
  blockPadding: 10,

  // image sizes
  imageRadius: 14,
  avatarSize: 32,
  avatarRadius: 8,

  //Icon sizes
  smallIcon: 16,
  mediumIcon: 22,
  largeIcon: 30,
  xlargeIcon: 40,
  iconPadding: 2,
  iconMargin: 2,

  // switch sizes
  switchWidth: 50,
  switchHeight: 24,
  switchThumb: 20,

  // checkbox sizes
  checkboxWidth: 18,
  checkboxHeight: 18,
  checkboxRadius: 5,
  checkboxIconWidth: 10,
  checkboxIconHeight: 8,

  // product link size
  linkSize: 12,

  /** font size multiplier: for maxFontSizeMultiplier prop */
  multiplier: 2,
  windowHeight: height,
  windowWidth: width,
};

export const SPACING = {
  /** xs: 4px */
  xs: SIZES.base * 0.5,
  /** s: 8px */
  s: SIZES.base * 1,
  /** sm: 16px */
  sm: SIZES.base * 2,
  /** m: 24px */
  m: SIZES.base * 3,
  /** md: 32px */
  md: SIZES.base * 4,
  /** l: 40px */
  l: SIZES.base * 5,
  /** xl: 48px */
  xl: SIZES.base * 6,
  /** xxl: 56px */
  xxl: SIZES.base * 7,
};

export const IMAGES = {
  image: '',
  facebook: '',
  google: '',
};
export const ICONS = {
  back: 'arrow-back',
  home: 'ios-home',
  homeOutline: 'ios-home-outline',
  close: 'close',
  closeOutline: 'close-outline',
  heart: 'heart',
  heartOutline: 'heart-outline',
  share: Platform.OS === 'android' ? 'share-social' : 'ios-share',
  shareOutline:
    Platform.OS === 'android' ? 'share-social-outline' : 'ios-share-outline',
  right: 'ios-arrow-forward',
};

export const Theme = {
  sizes: {width, height, ...SPACING, ...SIZES},
  fonts: FONTS,
  weights: WEIGHTS,
  lines: LINE_HEIGHTS,
  icons: ICONS,
  images: IMAGES,
};
