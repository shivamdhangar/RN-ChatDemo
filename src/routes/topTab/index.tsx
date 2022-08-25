// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import StatusScreen from '../../screens/homeChat/status';
// import CallScreen from '../../screens/homeChat/calls';
// import {normalize} from '../../utils/dimension';
// import COLOR from '../../utils/color';
// import ChatsScreen from '../../screens/homeChat/chats';

// export default function TopTabNavigation() {
//   const Tab = createMaterialTopTabNavigator();
//   return (
//     <Tab.Navigator
//       sceneContainerStyle={{backgroundColor: 'black'}}
//       screenOptions={{
//         tabBarContentContainerStyle: {backgroundColor: 'black'},
//         tabBarLabelStyle: {color: COLOR.GREEN, fontSize: 14, fontWeight: '800'},
//         tabBarIndicatorStyle: {backgroundColor: COLOR.GREEN},
//         tabBarStyle: {height: normalize(47)},
//       }}>
//       <Tab.Screen name="Chats" component={ChatsScreen} />
//       <Tab.Screen name="Status" component={StatusScreen} />
//       <Tab.Screen name="Calls" component={CallScreen} />
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({});

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {normalize} from '../../utils/dimension';
import COLOR from '../../utils/color';
import ChatsScreen from '../../screens/homeChat/chats';
import StatusScreen from '../../screens/homeChat/status';
import CallScreen from '../../screens/homeChat/calls';

export default function TopTabNavigation() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      sceneContainerStyle={styles.sceneContainer}
      screenOptions={({route}) => ({
        tabBarContentContainerStyle: {backgroundColor: 'black'},
        tabBarLabelStyle: {color: COLOR.WHITE, fontSize: 14, fontWeight: '800'},
        tabBarLabel: ({focused}) => {
          return (
            <Text
              style={
                focused
                  ? {
                      fontSize: 16,
                      color: COLOR.GREEN,
                      fontWeight: '800',
                      width: normalize(60),
                    }
                  : {fontSize: 16, color: COLOR.WHITE, fontWeight: '800'}
              }>
              {route.name}
            </Text>
          );
        },
        tabBarIndicatorStyle: {backgroundColor: COLOR.GREEN},
        tabBarStyle: {height: normalize(48)},
      })}>
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Calls" component={CallScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  sceneContainer: {
    backgroundColor: 'black',
  },
});
