import React from 'react'
import { View, FlatList } from 'react-native';
import VideoDesign from '../../components/video/VideoDesign';
import axios from 'axios';
function Search() {
    const [design, setdesign] = React.useState([]);
    React.useEffect(() => {
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
        <View style={{flexDirection:'column'}}>
            {
                design && design.map(e => (
                    <View style={{height:300, width:'50%'}}>
                    <VideoDesign data={e} />
                    </View>
                ))
            }
        </View>
    );
}


export default Search;