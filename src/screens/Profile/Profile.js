import React, { useContext, useEffect } from 'react'
import { View, Text, Image, Button } from 'react-native'
import Logout from './../Logout/index';
import logoutUser from '../../context/actions/auth/logoutUser';
import { GlobalContext } from '../../context/Provider';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Profile() {
    const { authDispatch } = useContext(GlobalContext);
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
    return (
        <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        alt="instagram logo"
                        style={{ width: 100, height: 100, resizeMode: 'contain', borderRadius: 999 }}
                    />
                    <Text style={{ marginTop: 20 }}>{name}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text>0</Text>
                    <Text>Posts</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text>7</Text>
                    <Text>Followers</Text>
                </View>
                <View style={{ alignItems: 'center', marginRight: 20 }}>
                    <Text>14</Text>
                    <Text>Following</Text>
                </View>
            </View>
            <View style={{ marginTop: 30, padding: 20 }}>
                <View style={{ marginBottom: 30 }} >
                    <Button title='Edit Profile' />
                </View>
                <Button title='logout' onPress={() => { logoutUser()(authDispatch); }} />
            </View>
        </View>
    );
}


export default Profile;