import React, { useEffect, useState, useRef } from 'react'
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, ScrollView, Button, Image, ActivityIndicator, TextInput } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Design from '../../components/card/Card';
import { AntDesign, FontAwesome, Entypo } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GlobalContext } from '../../context/Provider';

import { storage } from '../../firbase/firebase';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: '80%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});
function Home({ show, findvisible }) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [post, setPost] = useState(null);
    const [preogress, setprogress] = useState(0);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [removeall, setremoveall] = useState(false);
    const cameraRef = useRef(null)
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [video, setVideo] = useState(null);
    const [caption, setcaption] = useState('');
    const { authState } = React.useContext(GlobalContext);
    const [design, setdesign] = useState([]);
    const [snap, setsnap] = useState(true);
    const [start, setstart] = useState(false);
    useEffect(() => {
        axios.get('https://rnbackendinsta.herokuapp.com/upload/gethomepageimage').then(res => {
            const arr = [];
            res.data.map(e => {
                if (!e.reels) {
                    arr.push(e);
                }
            });
            setdesign(arr);
        }).catch(err => {
            cosnole.log(err)
        })
    }, [image, video])
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestMicrophonePermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);
    console.log(show)
    useEffect(() => {
        if (show)
            setModalVisible(true);
        else {
            setModalVisible(false);
            setremoveall(false);
            setImage(null);
            setVideo(null);
        }
    }, [show]);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    const choosePhotoFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [16, 9],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };
    const takeVideo = async () => {
        if (cameraRef) {
            const data = await cameraRef.current.recordAsync()
            console.log(data.uri);
            setVideo(data.uri);
            setstart(true);
        }
    }
    const stopVideo = async () => {
        cameraRef.current.stopRecording();
        setremoveall(false);
        setstart(false);
    }
    const _takePhoto = async () => {
        if (cameraRef) {
            const data = await cameraRef.current.takePictureAsync();
            setImage(data.uri);
            setremoveall(false);
        }

    }
    const uploadImage = async () => {
        var metadata = {
            contentType: 'image/jpeg',
        };
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const data = await AsyncStorage.getItem('email');
        //
        let username = data.split('@');

        // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        setUploading(true);
        setTransferred(0);
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", image, true);
            xhr.send(null);
        });

        const storageRef = storage.ref(`photos/${filename}`);
        const task = storageRef.put(blob, metadata);
        // Set transferred state
        task.on('state_changed', (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setTransferred(progress);
        });
        console.log(caption)
        try {
            await task;
            storage.ref("photos").child(filename, metadata).getDownloadURL()
                .then(url => {
                    axios.post('https://rnbackendinsta.herokuapp.com/upload/homepageimage', {
                        email: data,
                        name: username[0],
                        url: url,
                        caption: caption
                    }).then((res) => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                    })
                    setprogress(0);
                    setImage(null);
                }).then(() => {
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

        } catch (e) {
            console.log(e);
        }

    };
    const uploadVideo = async () => {
        var metadata = {
            contentType: 'video/mp4',
        };
        const uploadUri = video;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const data = await AsyncStorage.getItem('email');
        //
        let username = data.split('@');
        // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        setUploading(true);
        setTransferred(0);
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", video, true);
            xhr.send(null);
        });

        const storageRef = storage.ref(`videoes/${filename}`);
        const task = storageRef.put(blob, metadata);
        // Set transferred state
        task.on('state_changed', (snapshot) => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setTransferred(progress);
        });

        try {
            await task;
            storage.ref("videoes").child(filename, metadata).getDownloadURL()
                .then(url => {
                    console.log(url);
                    axios.post('https://rnbackendinsta.herokuapp.com/upload/homepageimage', {
                        email: data,
                        name: username[0],
                        url: url,
                        caption: caption,
                        reels: true,
                    }).then((res) => {
                        console.log(res)
                    }).catch(err => {
                        console.log(err)
                    })
                    setprogress(0);
                    setVideo(null);
                }).then(() => {
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

        } catch (e) {
            console.log(e);
        }

    };
    return (
        <PaperProvider>
            <View>
                <ScrollView>
                    {
                        design && design.map(e => (
                            (e.reels === false) && <Design data={e} />
                        ))
                    }
                </ScrollView>
            </View>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        if (modalVisible)
                            setModalVisible(false);
                        setremoveall(false);
                        setImage(null);
                        setVideo(null);
                    }}>
                    {
                        removeall === true ? (
                            <View style={styles.container}>
                                <Camera
                                    style={styles.camera}
                                    type={type}
                                    ref={cameraRef}
                                    useCamera2Api={true}
                                    ratio={"16:9"}
                                >
                                    <View style={{ position: 'absolute', bottom: 150 }}>
                                        <TouchableHighlight
                                            style={styles.button}
                                            onPress={() => {
                                                setType(
                                                    type === Camera.Constants.Type.back
                                                        ? Camera.Constants.Type.front
                                                        : Camera.Constants.Type.back
                                                );
                                            }}>
                                            <View style={{ borderWidth: 5, borderColor: 'white', borderRadius: 999, padding: 20 }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}> Flip </Text>
                                            </View>
                                        </TouchableHighlight>
                                        {
                                            snap === true ? (
                                                <TouchableHighlight
                                                    onPress={_takePhoto}
                                                >
                                                    <View style={{
                                                        borderWidth: 5, borderColor: 'white', display: 'flex', marginLeft: 140,
                                                        marginTop: 30,
                                                        borderRadius: 999, padding: 20, alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}> Snap </Text>
                                                    </View>
                                                </TouchableHighlight>
                                            ) : (
                                                <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 50 }}>
                                                    <TouchableHighlight
                                                        onPress={takeVideo}
                                                    >
                                                        <View style={{ borderWidth: 5, borderColor: 'white', borderRadius: 999, padding: 20, backgroundColor: start ? 'red' : '' }}>
                                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}> start </Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                    <TouchableHighlight
                                                        onPress={stopVideo}
                                                    >
                                                        <View style={{ borderWidth: 5, borderColor: 'white', borderRadius: 999, padding: 20, marginLeft: 30 }}>
                                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}> stop </Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                </View>
                                            )
                                        }
                                    </View>
                                </Camera>
                            </View>
                        ) : (
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    {
                                        (image || video) ? (
                                            <View style={{ marginBottom: 30 }}>
                                                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, margin: 20 }} />}
                                                {video && <Video source={{ uri: video }} style={{ width: 200, height: 200, margin: 20 }} />}
                                                {uploading ? (
                                                    <View>
                                                        <Text>{transferred} % Completed!</Text>
                                                        <ActivityIndicator size="large" color="#0000ff" />
                                                    </View>
                                                ) : (
                                                    <View style={{ marginTop: 10, padding: 10 }}>
                                                        <TextInput placeholder='Enter your caption' onChangeText={e => setcaption(e)}
                                                            value={caption} style={{ marginBottom: 10, borderWidth: 1, padding: 5, }} multiline
                                                            numberOfLines={4} />
                                                        <Button onPress={image ? uploadImage : uploadVideo} title='post' />
                                                    </View>

                                                )}
                                            </View>

                                        ) : (
                                            <View>
                                                <TouchableHighlight
                                                    onPress={() => {
                                                        setremoveall(!removeall);
                                                        setsnap(false);
                                                        setType(
                                                            type === Camera.Constants.Type.back
                                                                ? Camera.Constants.Type.front
                                                                : Camera.Constants.Type.back
                                                        );
                                                    }}
                                                >
                                                    <View style={{ padding: 20, margin: 20, borderColor: 'black', borderWidth: 4, borderRadius: 999 }}>
                                                        <AntDesign name="videocamera" size={50} color="black" />
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight
                                                    onPress={() => {
                                                        setremoveall(!removeall);
                                                        setsnap(true);
                                                        setType(
                                                            type === Camera.Constants.Type.back
                                                                ? Camera.Constants.Type.front
                                                                : Camera.Constants.Type.back
                                                        );
                                                    }}
                                                >
                                                    <View style={{ padding: 20, margin: 20, borderColor: 'black', borderWidth: 4, borderRadius: 999 }}>
                                                        <AntDesign name="camera" size={50} color="black" />
                                                    </View>
                                                </TouchableHighlight>
                                                <TouchableHighlight
                                                    onPress={choosePhotoFromLibrary}
                                                >
                                                    <View style={{ padding: 20, margin: 20, borderColor: 'black', borderWidth: 4, borderRadius: 999 }}>
                                                        <FontAwesome name="photo" size={50} color="black" />
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        )
                                    }


                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                                        onPress={() => {
                                            if (modalVisible) {
                                                setModalVisible(false);
                                                findvisible(false);
                                            }
                                            setremoveall(false);
                                            setImage(null);
                                            setVideo(null);
                                            setUploading(false)
                                        }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                            <Entypo name="cross" size={30} color="black" />
                                            <Text style={styles.textStyle}>Hide</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        )
                    }
                </Modal>
            </View>
        </PaperProvider >
    );
}


export default Home;