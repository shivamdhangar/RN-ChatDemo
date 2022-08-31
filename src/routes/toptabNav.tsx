import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();
import MessageScreen from '../screens/chat/messageScreen';
import {COLOR} from '../utils/color';
import StatusScreen from '../screens/chat/statusScreen';
import CallScreen from '../screens/chat/callScreen';
import {normalize} from '../utils/dimensions';

export default function TopTabNav() {
  return (
    <TopTab.Navigator
      sceneContainerStyle={{backgroundColor: 'transparent'}}
      screenOptions={({route}) => ({
        tabBarStyle: {backgroundColor: 'transparent'},
        tabBarLabel: ({focused}) => {
          return (
            <Text
              style={
                focused
                  ? {
                      fontSize: 14,
                      color: COLOR.GREEN,
                      fontWeight: '800',
                      width: normalize(55),
                    }
                  : {
                      fontSize: 14,
                      color: 'white',
                      fontWeight: '800',
                    }
              }>
              {route.name}
            </Text>
          );
        },
        tabBarIndicatorStyle: {backgroundColor: COLOR.GREEN},
        tabBarLabelStyle: {color: '#fff'},
      })}>
      <TopTab.Screen name="CHATS" component={MessageScreen} />
      <TopTab.Screen name="STATUS" component={StatusScreen} />
      <TopTab.Screen name="CALLS" component={CallScreen} />
    </TopTab.Navigator>
  );
}
