import React from 'react'
import { View, Text, Image, KeyboardAvoidingView, TouchableHighlight, Share, Button, Alert } from 'react-native'
import { Avatar, Input } from 'native-base';
import { Octicons, Feather, Fontisto, Ionicons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Card({ data }) {
    const [like, setlike] = React.useState(false);
    const [message, setmessage] = React.useState('');
    const [showcomment ,setshowcomment]=React.useState(false);
    let name = '';
    React.useEffect(() => {
        const fun = async () => {
            const data = await AsyncStorage.getItem('email');
            //
            let username = data.split('@');
            name = username[0];
        }
        fun();
    }, [])
    console.log(name)
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: data.url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    const commentSend = () => {
        Alert.alert('comment send')
        setmessage('')
    }
    return (
        <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, alignItems: 'center' }}>
                    <View style={{ width: 40, height: 40, margin: 5, borderWidth: 3, borderColor: 'red', borderRadius: 999 }}>
                        <Text
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: 24
                            }}> {data.name[1] + data.name[2]}</Text>
                    </View>
                    <View style={{ marginLeft: 4 }}>
                        <Text>{data.name}</Text>
                    </View>
                </View>
                <View style={{ padding: 10, marginRight: 10 }}>
                    <Octicons name='kebab-vertical' size={24} />
                </View>
            </View>
            <View>
                <Image
                    style={{ width: '100%', height: 350, resizeMode: 'stretch' }}
                    source={{
                        uri: data.url,
                    }}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableHighlight onPress={() => { setlike(!like) }}>
                        {
                            like ? <Ionicons name='heart' size={30} color='red' /> :
                                <Feather name='heart' size={30} />
                        }

                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => setshowcomment(true)}>
                        <Fontisto name='hipchat' size={30} style={{ marginLeft: 15 }} />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={onShare}>
                        <Feather name='send' size={30} style={{ marginLeft: 15 }} />
                    </TouchableHighlight>
                </View>
                <View>
                    <Feather name='bookmark' size={30} style={{ marginRight: 10 }} />
                </View>
            </View>
            <View style={{ padding: 2 }}>
                <Text>{like ? data.likes + 1 : data.likes} likes</Text>
                <Text>{data.caption}</Text>
                <Text>...more</Text>
            </View>
            {
               showcomment===true  && (
                    <KeyboardAvoidingView>
                        <Input
                            onChangeText={e => setmessage(e)}
                            value={message}
                            InputLeftElement={
                                <View style={{ width: 40, height: 40, margin: 5, borderWidth: 3, borderColor: 'red', borderRadius: 999 }}>
                                    <Text
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: 24
                                        }}> {name[1]}</Text>
                                </View>}
                            placeholder='Add a comment'
                            InputRightElement={<Button style={{ marginRight: 10, padding: 10 }} title='send' onPress={commentSend} />}
                        />
                    </KeyboardAvoidingView>
                )
            }

        </View>
    )
}
