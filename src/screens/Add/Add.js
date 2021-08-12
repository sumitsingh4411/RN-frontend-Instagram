import React, { useEffect } from 'react'
import { ScrollView, Text } from 'react-native'
import VideoDesign from '../../components/video/VideoDesign'
import axios from 'axios';

function Add() {
    const [design, setdesign] = React.useState([]);
    useEffect(() => {
        axios.get('https://rnbackendinsta.herokuapp.com/upload/gethomepageimage').then(res => {
            const arr = [];
            res.data.map(e => {
                if (e.reels) {
                    arr.push(e);
                }
            });
            setdesign(arr);
        }).catch(err => {
            cosnole.log(err)
        })
    }, [])
    return (
        <ScrollView>
            {
                design && design.map(e => (
                    <VideoDesign data={e} />
                ))
            }

        </ScrollView>
    );
}


export default Add;