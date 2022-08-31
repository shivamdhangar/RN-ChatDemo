import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import {images} from '../../../utils/images';
import {normalize} from '../../../utils/dimensions';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {COLOR} from '../../../utils/color';
export default function Chating({route}: {route: any}) {
  const navigation = useNavigation<any>();
  const {Name, UID, status} = route.params;
  const [messages, setMessages] = useState([]);
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  let UserId = Auth_Data?.user?.user?.uid;
  const [isTyping, setisTyping] = useState(false);
  const [timer, setTimer] = useState(100);
  const docid = UID > UserId ? UserId + '-' + UID : UID + '-' + UserId;

  const onTextChange = (text: any) => {
    if (text.length > 0) {
      typingStatus(true);
      clearTimeout(timer);

      const newTimer = setTimeout(() => {
        typingStatus(false);
      }, 1000);
      setTimer(newTimer);
    }
  };
  const typingStatus = (value: boolean) => {
    firestore()
      .collection('userTypingStatus')
      .doc(docid)
      .collection(UserId)
      .doc('currentTypingStatus')
      .set({
        isTyping: value,
      })
      .then(() => {
        console.log('typing status set success');
      })
      .catch(error => {
        console.log('typing status fail', error);
      });
  };
  useEffect(() => {
    firestore()
      .collection('userTypingStatus')
      .doc(docid)
      .collection(UID)
      .doc('currentTypingStatus')
      .onSnapshot(snapshot => {
        setisTyping(snapshot?.data()?.isTyping);
        console.log('------------->', snapshot);
      });
    // return () => typingListner();
  }, []);

  useEffect(() => {
    const docid = UID > UserId ? UserId + '-' + UID : UID + '-' + UserId;
    const subscribe = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(documentSnapshot => {
        const allmsg = documentSnapshot.docs.map(item => {
          return item.data();
        });
        allmsg.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        //@ts-ignore
        setMessages(allmsg);
      });
    return subscribe;
  }, []);

  const getAllmsg = async () => {
    const docid = UID > UserId ? UserId + '-' + UID : UID + '-' + UserId;
    const querySanp = await firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    const allmsg = querySanp.docs.map(docSanp => {
      return docSanp.data();
    });
    //@ts-ignore
    setMessages(allmsg);
  };

  useEffect(() => {
    getAllmsg();
  }, []);

  const onSend = (messagesArray: any) => {
    const msg = messagesArray[0];
    messagesArray[0].createdAt = new Date().getTime();
    const mymsg = {
      ...msg,
      createdAt: new Date().getTime(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    const docid = UID > UserId ? UserId + '-' + UID : UID + '-' + UserId;
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .doc(mymsg._id)
      .set(mymsg);
  };

  // useEffect(() => {
  //   const docid = UID > UserId ? UserId + '-' + UID : UID + '-' + UserId;
  //   firestore()
  //     .collection('chatrooms')
  //     .doc(docid)
  //     .collection('TypingStatus')
  //     .doc(UserId)
  //     .set({
  //       typing: typing,
  //     });
  //   firestore()
  //     .collection('chatrooms')
  //     .doc(docid)
  //     .collection('TypingStatus')
  //     .doc(UID)
  //     .onSnapshot(onchange => {
  //       let typing = onchange.data();
  //       setTypingStatus(typing?.typing);
  //     });
  // }, [typing]);

  // const debounce = useCallback((fun: any, timeout: any) => {
  //   //@ts-ignore
  //   let timer;
  //   return (args: any) => {
  //     //@ts-ignore
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       fun(false);
  //     }, timeout);
  //     setTyping(true);
  //   };
  // }, []);

  // const startTyping = debounce(() => {
  //   setTyping(false);
  // }, 2000);

  // const findtyping = (text: any) => {
  //   if (text.length > 0)
  //     //@ts-ignore
  //     startTyping();
  // };

  // const renderFooter = () => {
  //   console.log('tfyhjbjm', typingStatus);
  //   if (typingStatus) {
  //     return (
  //       <View style={{marginLeft: normalize(23)}}>
  //         {/* <Spinner type={'Bounce'} isVisible={true} size={3} /> */}
  //         {/* <Text style={{color: 'white'}}>{typingStatus}</Text> */}
  //       </View>
  //     );
  //   }
  // };

  return (
    <View style={styles.parent}>
      <View style={styles.body}>
        <View style={styles.innerView}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image style={styles.backimg} source={images.back} />
          </TouchableOpacity>
          <View style={styles.headerComponent}>
            <Text style={styles.nameTextChatting}>{Name}</Text>
            {status ? (
              <Text style={styles.onlineTextStyle}>{'Online'}</Text>
            ) : (
              <Text style={styles.offlineTextStyle}>{'Offline'}</Text>
            )}
          </View>
        </View>

        <View style={styles.leftview}>
          <TouchableOpacity style={styles.searchImgTouchable}>
            <Image source={images.telephone} style={styles.searchImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchImgTouchable}>
            <Image style={styles.searchImg} source={images.video} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuTouchable}>
            <Image style={styles.threeDotImg} source={images.dot} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line}></View>
      <GiftedChat
        isTyping={isTyping}
        messages={messages}
        onInputTextChanged={onTextChange}
        onSend={text => onSend(text)}
        showUserAvatar
        user={{
          _id: UserId,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#5375e0',
                  left: normalize(50),
                },
                left: {
                  right: normalize(50),
                },
              }}
            />
          );
        }}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{backgroundColor: 'black'}}
            renderComposer={props1 => (
              <Composer {...props1} textInputStyle={{color: 'white'}} />
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'black',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 70,
  },
  innerView: {
    flexDirection: 'row',
  },
  backimg: {
    height: normalize(25),
    width: normalize(25),
    left: 6,
  },
  headerComponent: {
    marginLeft: normalize(20),
  },
  searchImg: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
  },
  searchImgTouchable: {
    borderColor: '#2f3d29',
    borderWidth: 1,
    borderRadius: normalize(10),
    backgroundColor: '#2f3d29',
    height: normalize(32),
    width: normalize(34),
    justifyContent: 'center',
    alignItems: 'center',
    margin: normalize(2),
  },
  threeDotImg: {
    height: normalize(25),
    width: normalize(25),
    resizeMode: 'contain',
  },
  offlineTextStyle: {
    color: COLOR.YELLOW,
    fontWeight: '600',
    fontSize: 15,
  },
  onlineTextStyle: {
    color: COLOR.GREEN,
    fontWeight: '600',
    fontSize: 15,
  },
  menuTouchable: {
    borderColor: '#2f3d29',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#2f3d29',
    height: normalize(32),
    width: normalize(34),
    justifyContent: 'center',
    alignItems: 'center',
    margin: normalize(2),
  },
  nameTextChatting: {
    color: 'white',
    // left: normalize(15),
    fontSize: 18,
    fontWeight: '600',
  },
  leftview: {
    flexDirection: 'row',
  },
  line: {
    borderWidth: 0.8,
    borderColor: 'grey',
    width: normalize(370),
    alignSelf: 'center',
    marginTop: normalize(20),
  },
});
