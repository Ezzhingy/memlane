import React, { useEffect, useState } from 'react';
import { Button, Platform, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View } from '@/components/Themed';
import { StatusBar } from 'expo-status-bar';
import { getLocation, getLocationName } from '../functions/location';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { format } from 'date-fns';

interface Memory {
    id?: number;
    created_at: string;
    file_type: 'image' | 'video' | 'text' | 'audio';
    file_url: string;
    coordinates: string;
    user_id: number;
    title: string;
    description?: string;
}
  
const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy  |  h:mm a');
};

function Page() {

    const styles = StyleSheet.create({
        container: {
            padding: 24,
            flex: 1,
        },
        location: {
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: 8
          },
        header: {
            flexDirection: "row",
            height: 70,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 36,
        },
        title: {
            marginTop: 18,
            fontSize: 21,
            fontWeight: "bold",
        },
        description: {
            marginTop: 12,
            fontSize: 16,
            lineHeight: 21,
        },
        date: {
            marginTop: 4,
            fontSize: 14,
            lineHeight: 21,
            color: "gray",
            fontStyle: "italic",
        },
        emptyView: {
            flexDirection: "row",
            flex: 1,
        },
    });
    const { id } = useLocalSearchParams();
    const [memory, setMemory] = useState<Memory>();
    const [locationName, setLocationName] = useState<string>();

    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/memory/${parseInt((id as string).split(':')[0])}`);
            const data = await response.json();
            setMemory(data[0]);

            // After setting the memory, get the location name
            if (data[0] && data[0].coordinates) {
                const latitude = parseFloat((id as string).split(':')[1]);
                const longitude = parseFloat((id as string).split(':')[2]);
                await getLocationName(setLocationName, latitude, longitude);
            }
        };
        fetchData();
    }, [id]);

    if (!memory) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="location-pin" size={24} color="gray" />
                <Text style={styles.location}>{locationName}</Text>
                <View style={styles.emptyView}></View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="close" size={36} color="black" />
                </TouchableOpacity>

            </View>
            <View>
                {memory.file_type === 'image' && <Image source={{ uri: memory.file_url }} style={{ 
                    width: "100%",
                    height: 200,
                    alignSelf: "center",
                    borderRadius: 10,
                }} />}
                
                <Text style={styles.title}>{memory.title}</Text>
                <Text style={styles.date}>{formatDate(memory.created_at)}</Text>
                <Text style={styles.description}>{memory.description || "Visited a new place today!"}</Text>
                
                
            </View>
        </View>
    );
}

export default Page;
