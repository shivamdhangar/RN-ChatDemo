import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {COLOR} from '../../utils/color';
import {images} from '../../utils/images';
import {normalize} from '../../utils/dimensions';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import {STRINGS} from '../../utils/strings';
const {width, height} = Dimensions.get('screen');
export default function ProfileScreen() {
  //   const usersCollectionRef = firestore().collection('Users');
  const dispatch = useDispatch();
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  const [name, setName] = useState<any>('');
  const [About, setAbout] = useState<any>('');
  const [Email, setEmail] = useState<any>('');
  const [coverimg, setCoverimg] = useState<any>();
  const navigation = useNavigation<any>();
  const [time, setTime] = useState(new Date().getTime());
  const reference = storage().ref(`img_${time}.jpg`);
  console.log('yiururyurur489', reference);
  let uid = Auth_Data?.user?.user?.uid;

  console.log('Adfcvfds', Auth_Data);
  const imageUploadstore = (imagePath: any) => {
    reference
      .putFile(imagePath)
      .then(response => {
        reference.getDownloadURL().then(res => {
          firestore().collection('Users').doc(uid).update({
            profileImage: res,
          });
        });
      })
      .catch(err => {
        console.log('error upload', err);
      });
  };

  const Logout = () => {
    // firestore().collection('Users').doc(uid).update({
    //   status: firestore.FieldValue.serverTimestamp(),
    // });
    auth()
      .signOut()
      .then((res: any) => {
        console.log('User signed out!', res), navigation.navigate('SignIn');
        dispatch({type: 'signIn', payload: {}});
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        // console.log('Total users: ', querySnapshot.size);
        querySnapshot.forEach(documentSnapshot => {
          const UserName = documentSnapshot.data();
          // console.log('User Name========:=====> ', UserName);
        });
      });
  }, []);

  const UpdateDetails = () => {
    let uid = Auth_Data?.user?.user?.uid;
    firestore()
      .collection('Users')
      .doc(uid)
      .set({
        Name: name,
        Email: Email,
        About: About,
        display: coverimg,
        uid: uid,
        // dp: true,
      })
      .then(res => {
        console.log('Response is', res);
        dispatch({
          type: 'Set_Data',
          payload: {
            Name: name,
            Email: Email,
            About: About,
            display: coverimg,
            uid: uid,
          },
        });
        console.log('!!!!!!!!!!!!!!!', res);

        navigation.navigate('HomeScreen');
      })
      .catch(err => {
        console.log('Error is', err);
      });
  };
  const onChangeName = (text: any) => {
    setName(text);
  };
  const onChangeAbout = (text: any) => {
    setAbout(text);
  };

  const onChangeEmail = (text: any) => {
    setEmail(text);
  };
  const NaviagteGoBack = () => {
    navigation.goBack();
  };
  const imageOpencover = async () => {
    //FUNCTION FOR COVER PICKER
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        height: 150,
        width: 100,
      });
      setCoverimg(image.path);
      imageUploadstore(image.path);
    } catch (err) {
      console.log('ImageErr', err);
    }
  };
  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.headview}>
        <TouchableOpacity onPress={NaviagteGoBack}>
          <Image style={styles.backimg} source={images.back} />
        </TouchableOpacity>
        <Text style={styles.profiletxt}>{STRINGS.LABEL.PROFILE}</Text>
        <TouchableOpacity onPress={Logout}>
          <Image style={styles.logoutimg} source={images.logout} />
        </TouchableOpacity>
      </View>
      <View style={styles.line}></View>

      <TouchableOpacity onPress={imageOpencover} style={styles.imgContainer}>
        <Image style={styles.backgroundimg} source={images.account} />
        <Image style={styles.rectangleimg} source={{uri: coverimg}} />
      </TouchableOpacity>
      <View style={styles.line}></View>
      <View style={styles.textinputview}>
        <TextInput
          placeholder="Name"
          value={name}
          placeholderTextColor="white"
          style={styles.inputinner}
          onChangeText={onChangeName}
        />

        <TextInput
          placeholder="About"
          value={About}
          placeholderTextColor="white"
          onChangeText={onChangeAbout}
          style={styles.inputinner}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="white"
          value={Email}
          onChangeText={onChangeEmail}
          style={styles.inputinner}
        />
      </View>

      <TouchableOpacity onPress={UpdateDetails} style={styles.updateview}>
        <Image style={styles.updateimg} source={images.update} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.chatScreenTextStyle}>
        <Text>{STRINGS.TEXT.CHATS_SCREEN}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  parent: {
    backgroundColor: COLOR.BLACK,
    flex: 1,
  },
  backimg: {
    height: normalize(25),
    width: normalize(30),
    margin: normalize(10),
  },
  headview: {
    flexDirection: 'row',
    marginTop: 60,
  },
  profiletxt: {
    color: COLOR.WHITE,
    fontSize: 20,
    margin: normalize(10),
  },
  logoutimg: {
    height: normalize(40),
    width: normalize(40),
    marginHorizontal: normalize(180),
  },
  line: {
    borderWidth: 0.8,
    borderColor: 'grey',
    width: 370,
    alignSelf: 'center',
    marginTop: normalize(20),
  },
  rectangleimg: {
    height: 120,
    width: 120,
    borderRadius: 100,
    position: 'absolute',
  },
  backgroundimg: {
    height: normalize(90),
    width: normalize(90),
    borderRadius: normalize(100),
    resizeMode: 'contain',
  },
  imgContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  updateimg: {
    height: normalize(80),
    width: normalize(80),
  },
  updateview: {
    alignSelf: 'center',
  },
  textinputview: {
    marginTop: 20,
  },
  inputinner: {
    marginHorizontal: 20,
    padding: 10,
    borderWidth: 1,
    marginVertical: normalize(20),
    color: 'white',
    borderRadius: 20,
    height: normalize(45),
    backgroundColor: '#141414',
  },
  chatScreenTextStyle: {
    width: 50,
    backgroundColor: 'skyblue',
    alignSelf: 'center',
    paddingLeft: 10,
  },
});
