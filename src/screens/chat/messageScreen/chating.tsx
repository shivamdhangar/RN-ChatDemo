import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
} from 'react-native';
import React, {useCallback, useEffect, useId, useState} from 'react';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  IMessage,
} from 'react-native-gifted-chat';
import {images} from '../../../utils/images';
import {normalize, vh, vw} from '../../../utils/dimensions';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {COLOR} from '../../../utils/color';
export default function Chating({route}: {route: any}) {
  const navigation = useNavigation<any>();
  const {Name, UID, pic, status} = route.params;
  const [userStatus, setuserStatus] = useState('');
  const [isTyping, setisTyping] = useState<boolean>(false);
  const [getTypingStatus, setgetTypingStatus] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  const {User_Data} = useSelector((store: any) => store.chatReducer);
  let loginname = User_Data?.name;
  let UserId = Auth_Data?.user?.user?.uid;
  const docid = UID > UserId ? UserId + '-' + UID : UID + '-' + UserId;

  const handleLongPress = (context: any, message: any) => {
    let options, cancelButtonIndex;
    if (UserId === message.fromUserID) {
      options = ['Copy', 'Delete for me', 'Delete for everyone', 'cancel'];
      cancelButtonIndex = options.length;
      context.actionSheet().showActionSheetWithOptions(
        {options, cancelButtonIndex},
        //@ts-ignore
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
            case 1:
              deletForMe(message, docid, UserId);
              break;
            case 2:
              deletedForEveryOne(message, docid);
              break;
          }
        },
      );
    } else {
      options = ['Copy', 'Delete for me', 'cancel'];
      cancelButtonIndex = options.length;
      context.actionSheet().showActionSheetWithOptions(
        {options, cancelButtonIndex},
        //@ts-ignore
        buttonIndex => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
            case 1:
              deletForMe(message, docid, UserId);
              break;
          }
        },
      );
    }
  };

  const handleRead = async () => {
    const validate = await firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .get();
    const batch = firestore()?.batch();
    validate.forEach((documentSnapshot: any) => {
      if (documentSnapshot?._data.toUserID === UserId) {
        batch.update(documentSnapshot.ref, {received: true});
      }
    });
    return batch.commit();
  };

  const deletForMe = (message: any, docid: any, UserId: any) => {
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .doc(message?._id)
      .update({...message, deleatedBy: UserId})
      .then(() => {
        if (messages[0]?._id === message?._id) {
        }
      });
  };
  const deletedForEveryOne = (message: any, docid: any) => {
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .doc(message?._id)
      .update({...message, deletedForEveryOne: true})
      .then(() => {
        if (messages[0]?._id === message?._id) {
        }
      });
  };

  useEffect(() => {
    const subscribe = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(documentSnapshot => {
        handleRead();
        const allmsg = documentSnapshot.docs.map(item => {
          return item.data();
        });
        allmsg.sort((a, b) => b.createdAt - a.createdAt);
        let newmessages = allmsg.filter(item => {
          if (item.deletedForEveryOne) return false;
          else if (item.deleatedBy) return item.deleatedBy != UserId;
          else return true;
        });
        setMessages(newmessages);
      });
    return subscribe;
  }, []);

  useEffect(() => {
    const subscribe = firestore()
      .collection('Users')
      .doc(UID)
      .onSnapshot((documentSnapshot: any) => {
        setuserStatus(documentSnapshot.data()?.isActive);
      });
    return subscribe;
  }, []);

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(UserId)
      .collection('inbox')
      .onSnapshot((documentSnapshot: any) => {
        let users = documentSnapshot?._docs?.map((item: any) => {
          return item._data;
        });
        setData(users);
      });
  }, []);

  const onSend = (messagesArray: any) => {
    let msg = messagesArray[0];
    const mymsg = {
      ...msg,
      fromUserID: UserId,
      received: false,
      sent: true,
      toUserID: UID,
      createdAt: new Date()?.getTime(),
    };

    if (messages.length == 0) {
      firestore()
        .collection('Users')
        .doc(UserId)
        .collection('inbox')
        .doc(UID)
        .set({
          name: Name,
          display: pic,
          lastmessgae: mymsg,
          uid: UID,
        });

      firestore()
        .collection('Users')
        .doc(UID)
        .collection('inbox')
        .doc(UserId)
        .set({
          name: loginname,
          lastmessgae: mymsg,
          display: User_Data?.display,
          uid: UserId,
        });
    } else {
      firestore()
        .collection('Users')
        .doc(UserId)
        .collection('inbox')
        .doc(UID)
        .update({lastmessgae: mymsg});
    }
    setMessages((previousMessages: IMessage[] | undefined) =>
      GiftedChat.append(previousMessages, mymsg),
    );

    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .doc(mymsg._id)
      .set(mymsg);
  };
  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={{marginBottom: 5, marginRight: 10}}>
        <View style={styles.viewsendiconimg}>
          <Image source={images.sendImg} style={styles.sendiconimg} />
        </View>
      </Send>
    );
  };

  useEffect(() => {
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('TypingStatus')
      .doc(UserId)
      .set({
        isTyping: isTyping,
      });
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('TypingStatus')
      .doc(UID)
      .onSnapshot(onchange => {
        let typing = onchange.data();
        setgetTypingStatus(typing?.isTyping);
      });
  }, [isTyping]);

  const debounce = useCallback((fun: any, timeout: any) => {
    //@ts-ignore
    let timer;
    return (args: any) => {
      //@ts-ignore
      clearTimeout(timer);
      timer = setTimeout(() => {
        fun(false);
      }, timeout);
      setisTyping(true);
    };
  }, []);

  const startTyping = debounce(() => {
    setisTyping(false);
  }, 2000);

  const findtyping = (text: any) => {
    if (text.length > 0)
      //@ts-ignore
      startTyping();
  };

  return (
    <View style={styles.parent}>
      <View style={styles.innerview}>
        <View style={styles.namearrowview}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image style={styles.backimg} source={images.back} />
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Image style={styles.userbackground} source={images.account} />
            <Image style={styles.profimg} source={{uri: pic}} />
          </View>
          <Text style={styles.mainView}>{Name}</Text>
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
      {userStatus === 'online' ? (
        <Text style={styles.onlinetxt}>{'Online'}</Text>
      ) : (
        <Text style={styles.oflinetxt}>{'Ofline'}</Text>
      )}
      <View style={styles.line}></View>
      <ImageBackground style={styles.girlimg} source={images.bgImg}>
        <GiftedChat
          onLongPress={handleLongPress}
          isTyping={getTypingStatus}
          onInputTextChanged={findtyping}
          messagesContainerStyle={{height: vh(530)}}
          messages={messages}
          onSend={text => onSend(text)}
          showUserAvatar
          user={{
            _id: UserId,
          }}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                tickStyle={{color: COLOR.BLACK}}
                wrapperStyle={{
                  right: {
                    backgroundColor: COLOR.GREEN,
                    left: normalize(40),
                  },
                  left: {
                    right: normalize(35),
                  },
                }}
              />
            );
          }}
          renderInputToolbar={props => (
            <InputToolbar
              {...props}
              containerStyle={styles.containview}
              primaryStyle={{marginBottom: 0, height: 40, width: vw(350)}}
            />
          )}
          renderSend={renderSend}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: 'black',
  },
  innerview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(65),
    alignItems: 'center',
  },
  namearrowview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backimg: {
    height: normalize(25),
    width: normalize(25),
    left: 6,
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
  mainView: {
    color: 'white',
    left: normalize(15),
    fontSize: 20,
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
    marginTop: normalize(10),
  },
  viewsendiconimg: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendiconimg: {
    height: normalize(22),
    width: normalize(25),
    resizeMode: 'contain',
    bottom: normalize(4),
  },
  containview: {
    backgroundColor: 'white',
    marginHorizontal: normalize(15),
    borderRadius: 22,
    justifyContent: 'center',
    shadowColor: '#000',
    marginBottom: 40,
    fontSize: 18,
    paddingTop: 5,
  },
  userbackground: {
    height: normalize(40),
    width: normalize(40),
    left: normalize(10),
    borderRadius: normalize(100),
    resizeMode: 'cover',
  },
  profimg: {
    height: normalize(40),
    width: normalize(40),
    left: normalize(10),
    borderRadius: normalize(100),
    position: 'absolute',
  },
  onlinetxt: {
    color: COLOR.GREEN,
    marginLeft: normalize(85),
    fontSize: 15,
  },
  oflinetxt: {
    color: COLOR.WHITE,
    marginLeft: normalize(85),
    fontSize: 15,
  },
  girlimg: {
    height: '85%',
    width: '100%',
  },
});
