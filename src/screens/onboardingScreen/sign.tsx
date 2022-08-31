import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {images} from '../../utils/images';
import {normalize, vh, vw} from '../../utils/dimensions';
import CustomButton from '../../components/customButton';
import {COLOR} from '../../utils/color';
import CustomTextinput from '../../components/customTextinput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {STRINGS} from '../../utils/strings';

export default function SignIn() {
  const navigation = useNavigation<any>();
  const [checked, setChecked] = useState<boolean>(false);
  const [phoneno, setPhoneno] = useState<any>('');
  const [isLoading, setisLoading] = useState(false);
  const onPressCheck = () => {
    setChecked(!checked);
  };

  const signInWithMobileNumber = async () => {
    try {
      setisLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(phoneno);
      navigation.navigate('OtpScreen', {phoneno, confirm: confirmation});
    } catch (err) {
      console.log('err', err);
    }
  };

  const navigateSignin = () => {
    navigation.navigate('SignIn');
  };
  return (
    <KeyboardAwareScrollView style={styles.parent}>
      <StatusBar barStyle={'light-content'} translucent={true} />
      <View style={styles.logoview}>
        <Image style={styles.logo} source={images.logo} />
      </View>
      <View style={styles.signtxt}>
        <Text style={styles.headtxt}>{STRINGS.TEXT.SIGN_YOUR_ACCOUNT}</Text>
      </View>
      <View style={styles.phonenoview}>
        <Text style={styles.phonetxt}>{STRINGS.TEXT.PHONE_NUMBER}</Text>
      </View>

      <CustomTextinput onChangeText={(text: any) => setPhoneno(text)} />
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={onPressCheck}>
          {checked ? (
            <Image style={styles.uncheckview} source={images.uncheck} />
          ) : (
            <Image style={styles.checkimg} source={images.check} />
          )}
        </TouchableOpacity>
        <Text style={styles.remembertxt}>{STRINGS.TEXT.REMEMBER_ME}</Text>
      </View>
      <CustomButton
        styleview={
          !checked
            ? styles.customButtonStyle
            : [styles.customButtonStyle, {backgroundColor: COLOR.GREY}]
        }
        label={STRINGS.LABEL.SIGNIN}
        onPress={signInWithMobileNumber}
      />
      <View style={styles.dontview}>
        <Text style={styles.donttxt}>{STRINGS.TEXT.ALREADY_HAD_ACCOUNT}</Text>
        <TouchableOpacity onPress={navigateSignin}>
          <Text style={styles.signuptxt}>{STRINGS.LABEL.SIGNUP}</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={COLOR.GREEN}
          style={styles.indicator}
        />
      ) : null}
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  headtxt: {
    color: COLOR.WHITE,
    fontSize: 18,
    fontWeight: '500',
  },
  signtxt: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonStyle: {
    backgroundColor: COLOR.GREEN,
    marginTop: 25,
  },
  phonenoview: {
    marginTop: 20,
  },
  phonetxt: {
    color: 'white',
    left: 20,
  },
  uncheckview: {
    height: 30,
    width: 30,
    borderRadius: 5,
    marginTop: 15,
    marginLeft: 15,
    tintColor: COLOR.GREEN,
    resizeMode: 'contain',
  },
  checkimg: {
    height: 30,
    width: 30,
    tintColor: COLOR.GREEN,
    marginTop: 15,
    marginLeft: 15,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  remembertxt: {
    color: COLOR.WHITE,
    marginTop: 20,
    marginLeft: 15,
  },
  dontview: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  donttxt: {
    color: 'grey',
    fontSize: 16,
  },
  signuptxt: {
    color: COLOR.GREEN,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    right: normalize(180),
    top: normalize(380),
  },
  logoview: {
    marginTop: 120,
  },
  logo: {
    height: vh(400),
    width: vw(375),
    opacity: 1.5,
  },
});
