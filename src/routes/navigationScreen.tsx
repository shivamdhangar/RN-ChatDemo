import {AppState} from 'react-native';
import React, {useRef, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/onboardingScreen/splashScreen';
import SignIn from '../screens/onboardingScreen/sign';
import ProfileScreen from '../screens/profileScreen/profile';
import OtpScreen from '../screens/onboardingScreen/otpScreen';
import MessageScreen from '../screens/chat/messageScreen';
import HomeScreen from '../screens/homeScreens';
import Chating from '../screens/chat/messageScreen/chating';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import UserAccountScreen from '../screens/userAccountScreen';
import AllUser from '../screens/chat/messageScreen/allUser';

const RootStack = createNativeStackNavigator();

const NavigationScreen = () => {
  const appState = useRef(AppState.currentState);
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  let UserId = Auth_Data?.user?.user?.uid;
  const [status, setStatus] = React.useState<any>('');

  useEffect(() => {
    firestore().collection('Users').doc(UserId).update({
      isActive: 'online',
    });
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        firestore().collection('Users').doc(UserId).update({
          isActive: 'online',
        });

        // status = true;
      } else {
        firestore().collection('Users').doc(UserId).update({
          isActive: 'offline',
        });
      }
      appState.current = nextAppState;
      setStatus(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="SignIn" component={SignIn} />
        <RootStack.Screen name="OtpScreen" component={OtpScreen} />
        <RootStack.Screen name="ProfileScreen" component={ProfileScreen} />
        <RootStack.Screen name="HomeScreen" component={HomeScreen} />
        <RootStack.Screen name="MessageScreen" component={MessageScreen} />
        <RootStack.Screen name="Chating" component={Chating} />
        <RootStack.Screen name="UserAccount" component={UserAccountScreen} />
        <RootStack.Screen name="AllUser" component={AllUser} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationScreen;
