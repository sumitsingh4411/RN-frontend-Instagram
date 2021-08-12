import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, AntDesign } from 'react-native-vector-icons';
import { GlobalContext } from '../context/Provider';
import Home from './../screens/Home/Home';
import Search from './../screens/Search/Search';
import Add from './../screens/Add/Add';
import Like from './../screens/Like/Like';
import Profile from './../screens/Profile/Profile';
import { Image, TextInput, TouchableOpacity, View, Platform, Alert, Modal, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { LogBox } from 'react-native';
import { Camera } from 'expo-camera';
LogBox.ignoreLogs(['Setting a timer']);
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const { authDispatch } = React.useContext(GlobalContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [modalVisible, setModalVisible] = useState(false);

  let name = '';
  useEffect(() => {
      const fun = async () => {
          const data = await AsyncStorage.getItem('email');
          //
          let username = data.split('@');
          name = username[0];
      }
      fun();
  }, [])
  console.log(name)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setImage(result.uri);
    console.log(result)
    const uploadUri = result.uri;
    console.log(uploadUri)
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;
    console.log(filename)
    setUploading(true);
    setTransferred(0);
    let storageRef;
    try {
      storageRef = storage().ref(`images/${filename}`);
      console.log(storageRef)
    } catch (err) {
      console.log(err)
    }

    const task = storageRef.putFile(uploadUri);
    console.log(task)
    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
      );
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);
      Alert.alert(
        'Image uploaded!',
        'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      );
      return url;

    } catch (e) {
      console.log(e);
    }


    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);

    firestore()
      .collection('posts')
      .add({
        userId: user.uid,
        post: post,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      })
      .then(() => {
        console.log('Post Added!');
        Alert.alert(
          'Post published!',
          'Your post has been published Successfully!',
        );
        setPost(null);
      })
      .catch((error) => {
        console.log('Something went wrong with added post to firestore.', error);
      });
  };


  return (
    <NativeBaseProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: () => { return null },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
              return <Ionicons name={iconName} size={30} color={color} />;
            } else if (route.name === 'Search') {
              iconName = 'search';
              return <Ionicons name={iconName} size={30} color={color} />;
            }
            else if (route.name === 'Add') {
              iconName = 'ios-add-circle-outline';
              return <Ionicons name={iconName} size={30} color={color} />;
            }
            else if (route.name === 'Like') {
              iconName = 'heart';
              return <Ionicons name={iconName} size={30} color={color} />;
            }
            else if (route.name === 'Profile') {
              iconName = 'face';
              return <MaterialIcons name={iconName} size={30} color={color} />;
            }

          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home"
          children={() => {
            return (
              <Home show={modalVisible} findvisible={setModalVisible}/>
            )
          }}
          options={{
            headerTitle: props =>
              <Image
                source={require('../assets/images/download.png')}
                alt="instagram logo"
                style={{ width: 100, height: 60, resizeMode: 'contain' }}
              />
            ,
            headerRight: () => (
              <TouchableOpacity onPress={() => {
                if (!modalVisible)
                  setModalVisible(true);
                else
                  setModalVisible(false);
              }}>
                <AntDesign name='pluscircle' size={26} color='grey' style={{ padding: 8, marginRight: 10 }} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen name="Search" component={Search}
          options={{
            headerTitle: props =>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Ionicons name='arrow-back' size={30} style={{ marginRight: 20 }} />
                <TextInput
                  placeholder='search'
                  style={{ width: 300, fontSize: 20, fontWeight: 'bold', backgroundColor: '#E8E8E8', height: 40, borderRadius: 10, padding: 3 }}
                />
              </View>
            ,

          }}

        />
        <Tab.Screen name="Add" component={Add} />
        <Tab.Screen name="Like" component={Like} />
        <Tab.Screen name="Profile" component={Profile}
          options={{
            headerTitle: name
          }}
        />
      </Tab.Navigator>
    </NativeBaseProvider>
  );
};

export default TabNavigator;
