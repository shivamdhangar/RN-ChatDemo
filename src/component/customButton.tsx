import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { normalize } from '../utils/dimension';

export default function CustomButton(props: any) {
  const {label, onPress, styleCustom} = props;
  return (
    <View>
      <TouchableOpacity activeOpacity={0.6} style={[styles.customButtonTouchable,styleCustom]} onPress={onPress} 
      >
        <Text style={styles.customButtonTextStyle}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  customButtonTextStyle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    color: "white",
    marginBottom: normalize(30),
    top: normalize(15),
    fontStyle: 'italic',
  },
  customButtonTouchable: {
    backgroundColor: '#01F094',
    width: '95%',
    marginLeft: normalize(15),
    borderRadius: 40,
    borderWidth: 1,
    marginBottom: normalize(10)
  },
});
