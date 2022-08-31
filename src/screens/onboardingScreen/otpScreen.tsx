import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {COLOR} from '../../utils/color';
import {images} from '../../utils/images';
import {normalize} from '../../utils/dimensions';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CustomButton from '../../components/customButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {STRINGS} from '../../utils/strings';
export default function OtpScreen({route}: {route: any}) {
  const navigation = useNavigation<any>();
  const {phoneno, confirm} = route.params;
  const [otp, setOtp] = useState<any>('');
  const otpRef = useRef<any>();
  const dispatch = useDispatch();

  async function confirmCode() {
    try {
      let user = await confirm.confirm(otp);

      dispatch({type: 'signIn', payload: {user}});
      navigation.navigate('ProfileScreen');
      console.log('user', user);
    } catch (error: any) {
      console.log('Invalid code.', error?.message);
    }
  }

  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.headerview}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.arrow} source={images.back} />
        </TouchableOpacity>
        <Text style={styles.otptxt}>{STRINGS.TEXT.ENTER_OTP_CODE}</Text>
      </View>
      <View>
        <View style={styles.phoneno}>
          <Text style={styles.codeSentTextStyle}>
            Code has been sent to {phoneno}
          </Text>
        </View>
        <OTPInputView
          code={otp}
          pinCount={6}
          ref={otpRef}
          autoFocusOnLoad={true}
          style={styles.otpInputContainer}
          onCodeChanged={value => setOtp(value)}
          codeInputFieldStyle={styles.codeInputField}
          onCodeFilled={() => {}}
        />
      </View>
      <CustomButton
        styleview={styles.verfiybutton}
        label={STRINGS.LABEL.VERIFY}
        onPress={confirmCode}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: COLOR.BLACK,
  },
  arrow: {
    height: normalize(25),
    width: normalize(25),
    left: normalize(5),
  },
  otptxt: {
    color: COLOR.WHITE,
    fontSize: 18,
    fontWeight: '500',
    left: normalize(25),
  },
  headerview: {
    flexDirection: 'row',
  },
  otpInputContainer: {
    height: normalize(48),
    borderRadius: normalize(5),
    marginTop: normalize(50),
  },
  codeInputField: {
    height: normalize(48),
    width: normalize(38),
    borderRadius: normalize(10),
    fontSize: normalize(20),
    textAlign: 'center',
    color: COLOR.WHITE,
    fontWeight: '900',
    borderColor: COLOR.GREEN,
  },
  verfiybutton: {
    marginTop: normalize(280),
  },
  phoneno: {
    marginTop: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeSentTextStyle: {
    color: COLOR.WHITE,
    fontSize: 18,
  },
});
