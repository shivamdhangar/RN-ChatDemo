import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/loginScreen';
import SignUpScreen from '../screens/signUp';
import {STRINGS} from '../utils/strings';
import OtpScreen from '../screens/otpScreen';
import HomeChatScreen from '../screens/homeChat';
import SplashScreen from '../screens/splash';

export default function NavigationScreen() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        // initialRouteName="HomeChatScreen"
      >
        <Stack.Screen
          name={STRINGS.SCREEN.HOMESCREEN}
          component={SplashScreen}
        />
        <Stack.Screen
          name={STRINGS.SCREEN.LOGINSCREEN}
          component={LoginScreen}
        />
        <Stack.Screen
          name={STRINGS.SCREEN.SIGNUPSCREEN}
          component={SignUpScreen}
        />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="HomeChatScreen" component={HomeChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({});
