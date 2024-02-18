import React, { useEffect, useState } from 'react';
import { Button, Platform, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View } from '@/components/Themed';
import { StatusBar } from 'expo-status-bar';
import { getLocation, getLocationName } from '../functions/location';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';

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

function Page() {

    const styles = StyleSheet.create({
        header: {
            height: 50,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            // Add more styles for your header here
        },
        backButton: {
            position: 'absolute',
            left: 10,
            // Add more styles for your back button here
        },
        memory: {
            // Add more styles for your memory here
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
        <>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Button title="< Back" onPress={() => navigation.goBack()} />
                </TouchableOpacity>
            </View>
            <View style={styles.memory}>
                <Text>{locationName}</Text>
                <Text>{memory.title}</Text>
                <Text>{memory.description || "Hello"}</Text>
                <Text>{memory.created_at}</Text>
                {memory.file_type === 'image' && <Image source={{ uri: memory.file_url }} style={{ width: 200, height: 200 }} />}
            </View>
        </>
    );
}

export default Page;