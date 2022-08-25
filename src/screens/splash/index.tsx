import {StyleSheet, View, Image, Text} from 'react-native';
import React, {useEffect} from 'react';
import {images} from '../../utils/images';
import {normalize} from '../../utils/dimension';
import CustomButton from '../../component/customButton';
import {useNavigation} from '@react-navigation/native';
import {STRINGS} from '../../utils/strings';
import {useSelector} from 'react-redux';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const NavigateSignIn = () => {
    return navigation.navigate('LogInScreen');
  };
  const {users} = useSelector((store: any) => store.HomeReducer);
  // console.log('home reducer data', users);
  let userId = users?.user?.user?.uid;
  // console.log('userid ', userId);

  useEffect(() => {
    if (userId) {
      navigation.navigate('HomeChatScreen');
    } else {
      navigation.navigate('SignUpScreen');
    }
  });
  return (
    <View style={styles.container}>
      <Image source={images.splash_img} style={styles.splashImgStyle} />
      <Text style={styles.bestTextStyle}>
        {'The best chat app of this century'}
      </Text>
      <View style={styles.customButtonView}>
        <CustomButton label={STRINGS.LABEL.CONTINUE} onPress={NavigateSignIn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashImgStyle: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  customButtonView: {
    top: normalize(700),
  },
  bestTextStyle: {
    fontSize: 22,
    color: 'white',
    top: normalize(580),
    left: normalize(30),
  },
});
