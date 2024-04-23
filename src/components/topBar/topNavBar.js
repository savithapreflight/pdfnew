import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {_colors} from '../../css/colors';
import {useDispatch} from 'react-redux';
import {logOutAction} from '../../redux/slices/authSlice';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

console.log(windowWidth, windowHeight);
console.log('windowWidth', 'windowHeight');

const TopNavBar = props => {
  const Dispatch = useDispatch();
  const navigation = useNavigation();
  const [showPopup, setshowPopup] = useState(false);

  const logOutFun = () => {
    Dispatch(logOutAction());
    navigation.navigate('splash');
  };

  const _onPress = ({key, data}) => {
    const fun = {
      logout: () => logOutFun(),
      personal: () => {
        navigation.navigate('personal');
        setshowPopup(!showPopup);
      },
      profession: () => {
        navigation.navigate('profession');
        setshowPopup(!showPopup);
      },
    };
    fun[key](data);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => props.navigation.openDrawer()}>
        <Ionicons name="ios-menu" color={'white'} size={30} />
      </TouchableOpacity>
      <View style={{width: wp('2')}} />
      <View>
        <View style={styles.imageIocn}>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={require('../../assets/images/logo.png')}
          />
        </View>
      </View>
      <Text style={styles.title}> Crew Port</Text>
      <View style={{flex: 1}} />
      <View style={styles.rightBlock}>
        {windowWidth > 700 && (
          <Text style={[styles.label, {fontSize: 15}]}>Name</Text>
        )}
        <TouchableOpacity
          style={[styles.iconBtn, {marginRight: 10}]}
          onPress={() => props.navigation.navigate('notification')}>
          <Ionicons name="notifications" color={'white'} size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setshowPopup(!showPopup)}
          style={[styles.profileIcon]}>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={require('../../assets/images/profile-img.png')}
          />
        </TouchableOpacity>
      </View>
      <Modal visible={showPopup} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={{height: hp('8')}} />
          <View style={styles.optionsBlock}>
            <TouchableOpacity
              style={styles.opt}
              onPress={() => _onPress({key: 'personal'})}>
              <Ionicons name="person-outline" color={'gray'} size={wp('6')} />
              <Text style={styles.label}>Personal details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.opt}
              onPress={() => _onPress({key: 'profession'})}>
              <Ionicons name="person-outline" color={'gray'} size={wp('6')} />
              <Text style={styles.label}>Professional details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.opt}
              onPress={() => _onPress({key: 'logout'})}>
              <Ionicons name="log-out-outline" color={'gray'} size={wp('6')} />
              <Text style={styles.label}>Logout</Text>
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback onPress={() => setshowPopup(!showPopup)}>
            <View style={{flex: 1, borderWidth: 0}}>
              <Text></Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
};

export default TopNavBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: _colors.primary,
    // backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconBtn: {
    borderWidth: 0,
    // width: wp('10'),
    // height: wp('10'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIocn: {
    // borderWidth: 1,
    borderRadius: 5,
    minWidth: wp('20'),
    height: '80%',
    overflow: 'hidden',
    backgroundColor: 'white',
    // marginHorizontal: wp(),
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    // width: wp('9'),
    // height: wp('9'),
    width: 40,
    height: 40,
    overflow: 'hidden',
    borderRadius: 100,
    // marginRight: wp('1'),
    // borderWidth: 0.5,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Ubuntu-Medium',
    color: 'white',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  popup: {
    position: 'absolute',
    top: '90%',
    right: 0,
    width: wp('25'),
    padding: 10,
    backgroundColor: 'gray',
    elevation: 10,
    zIndex: 100,
  },
  modalContainer: {
    backgroundColor: 'rgba(150,150,150,0.4)',
    flex: 1,
  },
  optionsBlock: {
    alignSelf: 'center',
    width: '95%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  opt: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 5,
  },
  label: {fontSize: 16, marginHorizontal: 10},
});
