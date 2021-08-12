import React from 'react'
import { Video } from 'expo-av';
import { TouchableOpacity } from 'react-native';

export default function VideoDesign({ data }) {
    const video = React.useRef(true);
    const [status, setStatus] = React.useState({});
    return (
        <TouchableOpacity
            onPress={() =>
                status.isPlaying
                    ? video.current.pauseAsync()
                    : video.current.playAsync()
            }>
            <Video
                ref={video}
                style={{ width: '100%', height: '95%' }}
                source={{
                    uri: data.url,
                }}
                resizeMode="stretch"
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
        </TouchableOpacity>
    )
}
