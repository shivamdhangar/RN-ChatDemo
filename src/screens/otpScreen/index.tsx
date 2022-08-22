import {StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {normalize, vh, vw} from '../../utils/dimension';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import auth from '@react-native-firebase/auth';
import CustomButton from '../../component/customButton';
import CustomBackButton from '../../component/customBackButton';
import NavigationScreen from '../../routes';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

export default function OtpScreen({route}: any) {
  const {phoneNo, confirm} = route.params;
  console.log('params', phoneNo);
  //   const [confirm, setConfirm] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const otpRef = useRef<any>();
  const navigation = useNavigation<any>();
  console.log('otp', otp);
  const dispatch = useDispatch();
  async function confirmCode() {
    try {
      let user = await confirm.confirm(otp);
      dispatch({type: 'SET_USER', payload: {user}});
      console.log('user', user);
      //   navigation.navigate('')
    } catch (error) {
      console.log('Invalid code.', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <CustomBackButton />
        <Text style={styles.enterOtpText}>{'Enter OTP Code'}</Text>
      </View>
      <Text style={styles.codeHasSendText}>
        {'Code has been send to ' + phoneNo}
      </Text>
      <OTPInputView
        pinCount={6}
        ref={otpRef}
        autoFocusOnLoad
        style={styles.otpInputContainer}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={code => {
          setOtp(code);
        }}
      />
      <CustomButton
        onPress={confirmCode}
        label="Verify"
        styleCustom={styles.customButtonStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  body: {
    flexDirection: 'row',
  },
  otpInputContainer: {
    height: vh(48),
    borderRadius: normalize(5),
    marginTop: vh(25),
  },
  codeHasSendText: {
    color: 'white',
    marginTop: normalize(210),
    marginLeft: normalize(15),
    fontSize: 16,
  },
  enterOtpText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginTop: normalize(60),
    marginLeft: normalize(15),
  },
  codeInputField: {
    height: vh(48),
    width: vw(68),
    borderRadius: normalize(5),
    fontSize: vw(20),
    textAlign: 'center',
    color: 'green',
    fontWeight: '900',
    padding: 0,
    borderWidth: 1,
    borderColor: 'green',
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'green',
    margin: normalize(10),
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  customButtonStyle: {
    marginVertical: normalize(340),
  },
});
