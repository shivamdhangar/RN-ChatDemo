import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ChatsScreen from '../../screens/homeChat/chats';
import StatusScreen from '../../screens/homeChat/status';
import CallScreen from '../../screens/homeChat/calls';
import {normalize} from '../../utils/dimension';
import COLOR from '../../utils/color';

export default function TopTabNavigation() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      sceneContainerStyle={{backgroundColor: 'black'}}
      screenOptions={{
        tabBarContentContainerStyle: {backgroundColor: 'black'},
        tabBarLabelStyle: {color: COLOR.GREEN, fontSize: 14, fontWeight: '800'},
        tabBarIndicatorStyle: {backgroundColor: COLOR.GREEN},
        tabBarStyle: {height: normalize(47)},
      }}>
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Calls" component={CallScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
