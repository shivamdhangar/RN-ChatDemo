import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {COLOR} from '../../../utils/color';
import {normalize} from '../../../utils/dimensions';
import {images} from '../../../utils/images';

export default function AllUser() {
  const [Name, setUserName] = useState<any>([]);
  const navigation = useNavigation<any>();
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  let UserId = Auth_Data?.user?.user?.uid;
  useEffect(() => {
    firestore()
      .collection('Users')
      .where('uid', '!=', UserId)
      .get()
      .then(res => {
        //@ts-ignore
        console.log('result', res._docs);
        //@ts-ignore
        let users = res?._docs?.map((item: any) => {
          return item._data;
        });

        console.log('resss', users);
        setUserName(users);
      });
  }, []);

  const _renderItem = ({item}: any) => {
    const NO_DP_IMAGE = require('../../../assets/images/account.png');
    return (
      <TouchableOpacity
        style={styles.flatlistview}
        onPress={() =>
          navigation.navigate('Chating', {
            Name: item?.Name,
            UID: item?.uid,
            status: item?.isActive,
          })
        }>
        <View>
          <Image
            source={item?.display ? {uri: item?.display} : NO_DP_IMAGE}
            // source={{uri: item.display}}
            style={styles.imgStyle}
          />
        </View>
        <Text style={styles.name}>{item?.Name}</Text>
      </TouchableOpacity>
    );
  };

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.3,
          width: '100%',
          backgroundColor: COLOR.WHITE,
        }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View style={{marginTop: normalize(50), flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={images.back} style={styles.backImgStyle} />
        </TouchableOpacity>
        <Text style={styles.select}>{'Select Contacts'}</Text>
        <TouchableOpacity style={styles.searchImgTouchable}>
          <Image source={images.search} style={styles.searchImg} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuTouchable}
          onPress={() => navigation.navigate('ProfileScreen')}>
          <Image style={styles.threeDotImg} source={images.dot} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={Name}
        renderItem={_renderItem}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.BLACK,
  },
  flatlistview: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalize(70),
    color: COLOR.BLACK,
  },
  imgStyle: {
    height: normalize(45),
    width: normalize(45),
    borderRadius: normalize(50),
    resizeMode: 'cover',
  },
  backImgStyle: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
  },
  name: {
    color: 'white',
    margin: normalize(10),
    fontWeight: '500',
    fontSize: 18,
  },
  searchImg: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
  },
  searchImgTouchable: {
    marginLeft: normalize(140),
    borderColor: '#2f3d29',
    borderWidth: 2,
    borderRadius: normalize(10),
    backgroundColor: '#2f3d29',
    padding: normalize(3),
  },
  threeDotImg: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
  },
  menuTouchable: {
    marginLeft: normalize(8),
    borderColor: '#2f3d29',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#2f3d29',
    padding: normalize(2),
  },
  select: {
    color: COLOR.WHITE,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: normalize(20),
  },
});
