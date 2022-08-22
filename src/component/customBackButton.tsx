import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {images} from '../utils/images';
import {useNavigation} from '@react-navigation/native';
import {normalize} from '../utils/dimension';

export default function CustomBackButton() {
  const navigation = useNavigation<any>();
  const goBackScreen = () => navigation.goBack();
  return (
    <View>
      <TouchableOpacity onPress={goBackScreen}>
        <Image style={styles.backArrowStyle} source={images.backarrow} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backArrowStyle: {
    height: normalize(15),
    width: normalize(15),
    marginLeft: normalize(15),
    resizeMode: 'contain',
    marginTop: normalize(60),
  },
});
