import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons'; // for icons
import { Link } from 'expo-router';

const CustomMarker = (props: any) => {
    const { id, file_type, file_url, coordinate, title, description, visited, user_id, markerInRange } = props;

    // Render different content based on the type of memory
    const renderContent = (visited: boolean) => {
        if (visited || user_id === 1) {
            switch (file_type) {
                case 'image':
                    return (
                        <View style={styles.imageContainer}>
                            <Image source={{
                                uri: file_url,
                            }} style={styles.image} />
                        </View>
                    )
                case 'video':
                    return (
                        <View style={styles.videoContainer}>
                            <Image source={file_url} style={styles.image} />
                            <MaterialIcons name="play-circle-outline" size={24} color="white" />
                        </View>
                    );
                case 'audio':
                    return <MaterialIcons name="music-note" size={24} color="white" />;
                default:
                    // Your default marker content
                    return (
                        <View>
                            <Text style={styles.text}>{title}</Text>
                            <Text style={styles.text}>{description}</Text>
                        </View>
                    );
            }

        } else if (markerInRange) {
            return (
                <View style={styles.default}>
                    <Image source={require('../assets/images/Google_Maps_pin_red.png')} style={styles.markerImage} />
                </View>
            );
        } else {
            return (
                <View style={styles.default}>
                    <Image source={require('../assets/images/Google_Maps_pin_grey.png')} style={styles.markerImage} />
                </View>
            );
        }
    };

    // Style changes if visited or not
    const markerStyle = user_id === 1
        ? styles.markerOwned
        : visited ? styles.markerVisited : styles.markerNotVisited;

    return (
        markerInRange || visited ? (
            <Link href={`/memory/${String(id)}:${String(coordinate.latitude)}:${String(coordinate.longitude)}`} asChild>
                <Marker coordinate={coordinate}>
                    <View style={markerStyle}>
                        {renderContent(visited)}
                    </View>
                </Marker>
            </Link>
        ) : (
            <Marker coordinate={coordinate}>
                <View style={markerStyle}>
                    {renderContent(visited)}
                </View>
            </Marker>
        )
    );
};

// You can define your styles here
const styles = StyleSheet.create({
    default: {
        // Your default marker style
    },
    markerOwned: {
        backgroundColor: '#FF4646',
        padding: 3,
        borderRadius: 5,
    },
    markerVisited: {
        backgroundColor: 'grey', // example color for visited
        padding: 3,
        borderRadius: 5,
        // Other styling properties
    },
    markerNotVisited: {
        // backgroundColor: 'gray', // example color for not visited
        // padding: 5,
        // // Other styling properties
    },
    bubble: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'red',
        transform: [{ translateY: -10 }],
    },
    image: {
        width: 53, // Set the image size
        height: 38, // Set the image size
        resizeMode: 'cover',
        borderRadius: 2
    },
    markerImage: {
        width: 20,
        height: 34,
        resizeMode: 'contain',
    },
    imageContainer: {
        // Style for the image container
    },
    videoContainer: {
        // Style for the video container
    },
    video: {
        width: 53, // Set the image size
        height: 38, // Set the image size
        resizeMode: 'cover',
        borderRadius: 2
    },
    text: {
        // Style for the text
    },
    // ...other styles
});

export default CustomMarker;
