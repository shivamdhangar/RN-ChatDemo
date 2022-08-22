import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {images} from '../../utils/images';
import auth from '@react-native-firebase/auth';
import {normalize, screenHeight, vw} from '../../utils/dimension';
import CustomButton from '../../component/customButton';
import {useNavigation} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import {STRINGS} from '../../utils/strings';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const [phoneNo, setPhoneNo] = useState('');
  const [confirm, setConfirm] = useState();

  const onSignUpPress = async () => {
    console.log('inside onPress');
    try {
      const confirmation = await auth().signInWithPhoneNumber('+91' + phoneNo);
      console.log('confirmation', confirmation);
      // setConfirm(confirmation);
      navigation.navigate('OtpScreen', {
        phoneNo: phoneNo,
        confirm: confirmation,
      });
    } catch (err) {
      console.log('error', err);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={images.splash_img} style={styles.splashImgStyle} />
      <KeyboardAwareScrollView>
        <View style={styles.body}>
          <Text style={styles.signInTextStyle}>{'Sign up for free'}</Text>
          <Text style={styles.phoneNoTextStyle}> {'Phone Number*'} </Text>

          <View style={styles.inputView}>
            <Image source={images.telephone} style={styles.telephoneImg} />
            <TextInput
              style={styles.input}
              onChangeText={text => {
                setPhoneNo(text);
              }}
              placeholder="Phone Number"
              placeholderTextColor={'white'}
              maxLength={10}
              keyboardType={'number-pad'}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <CheckBox
              style={styles.checkbox}
              boxType="circle"
              onFillColor="green"
              onCheckColor="white"
              onTintColor="green"
            />
            <Text style={styles.label}>{'Remember Me?'}</Text>
          </View>
          <CustomButton
            label="Sign Up"
            onPress={onSignUpPress}
            styleCustom={styles.customButtonStyle}
          />
          <View style={styles.lastView}>
            <Text style={styles.dontHaveTextstyle}>
              {"Don't Have an account?"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LogInScreen', {phoneNo: phoneNo})
              }>
              <Text style={styles.signUpText}>{STRINGS.LABEL.SIGNIN}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  body: {
    height: screenHeight,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  splashImgStyle: {
    height: '60%',
    width: '100%',
    position: 'absolute',
  },
  signInTextStyle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  phoneNoTextStyle: {
    color: 'white',
    marginLeft: normalize(25),
    fontSize: 15,
    top: normalize(20),
  },
  input: {
    marginLeft: normalize(20),
    color: 'white',
  },
  inputView: {
    borderWidth: 1,
    width: normalize(345),
    marginLeft: normalize(15),
    borderRadius: normalize(20),
    marginTop: normalize(40),
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: normalize(45),
    paddingRight: normalize(20),
    marginHorizontal: 30,
    backgroundColor: 'grey',
  },
  customButtonStyle: {
    top: normalize(10),
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: normalize(10),
  },
  checkbox: {
    width: normalize(50),
    marginLeft: normalize(20),
  },
  label: {
    margin: normalize(4),
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  telephoneImg: {
    height: normalize(20),
    width: normalize(20),
    marginLeft: normalize(20),
    resizeMode: 'contain',
  },
  signUpText: {
    color: 'green',
    paddingHorizontal: normalize(8),
    fontWeight: '700',
  },
  lastView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: normalize(20),
  },
  dontHaveTextstyle: {
    color: 'grey',
  },
});
