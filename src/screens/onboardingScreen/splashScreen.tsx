import {
  View,
  AppState,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLOR} from '../../utils/color';
import {images} from '../../utils/images';
import {normalize, vh, vw} from '../../utils/dimensions';
import CustomButton from '../../components/customButton';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import {useSelector} from 'react-redux';
import {STRINGS} from '../../utils/strings';
interface USERDEFINED {
  navigation?: any;
}
export default function SplashScreen(props: USERDEFINED) {
  const navigation = useNavigation<any>();
  const [isLoading, setisLoading] = useState(false);
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  let uid = Auth_Data?.user?.user?.uid;
  console.log('authhhhhhhh', Auth_Data);

  useEffect(() => {
    setTimeout(() => {
      if (uid) {
        setisLoading(true);
        navigation.navigate('HomeScreen');
      } else {
        navigation.replace('SignIn');
      }
    }, 3000);
  }, []);

  return (
    <View style={styles.parent}>
      <StatusBar barStyle={'light-content'} translucent={true} />
      <View style={styles.logoview}>
        <Image style={styles.logo} source={images.logo} />
      </View>
      <Text style={styles.headtxt}>{'The best Chat app of this Century'}</Text>
      <CustomButton
        NavigatePress={() => props.navigation.navigate('SignIn')}
        label={STRINGS.LABEL.CONTINUE}
        styleview={styles.continue}
      />
      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={COLOR.GREEN}
          style={styles.indicator}
        />
      ) : null}
    </View>
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
    position: 'absolute',
    bottom: normalize(200),
    left: normalize(60),
    fontWeight: '500',
  },
  logoview: {
    marginTop: 150,
  },

  logo: {
    height: vh(400),
    width: vw(375),
    opacity: 1.5,
  },
  continue: {
    marginTop: 180,
    color: COLOR.GREEN,
  },
  indicator: {
    position: 'absolute',
    right: normalize(180),
    top: normalize(620),
  },
});
