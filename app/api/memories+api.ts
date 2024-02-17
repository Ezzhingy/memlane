import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

interface Memory {
    id?: number;
    created_at: string;
    file_type: 'image' | 'video' | 'text' | 'audio';
    file_url: string;
    coordinates: string;
    user_id: number;
    title: string;
}

function validateMemory(memory: any): memory is Memory {
    const validFileTypes = ['image', 'video', 'text', 'audio'];

    // Check if all required fields are present and have correct types
    if (
        typeof memory.created_at !== 'string' ||
        !validFileTypes.includes(memory.file_type) ||
        typeof memory.file_url !== 'string' ||
        typeof memory.coordinates !== 'string' ||
        typeof memory.user_id !== 'number' ||
        typeof memory.title !== 'string'
    ) {
        return false;
    }

    return true;
}

// TODO update this to get specific memory
export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
    try {
        // Query the "memory" table to get the first row
        const { data, error } = await supabase.from('memory').select('*').limit(1);

        // Check for errors
        if (error) {
            console.error('Error fetching user:', error.message);
            return ExpoResponse.json('Internal Server Error');
        }

        // Check if data is available
        if (!data || data.length === 0) {
            console.error('No user found');
            return ExpoResponse.json('User Table Empty');
        }

        // Return the first row of the user data
        return ExpoResponse.json(data[0]);
    } catch (error) {
        console.error('Error fetching user:', (error as Error).message);
        return ExpoResponse.json('Internal Server Error');
    }
}

/*
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"created_at": "2024-02-17T12:00:00Z", "file_type": "image", "file_url": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png", "coordinates": "POINT(-73.946823 40.807416)", "user_id": 1, "title": "Sunset photo on the highway"}' \
  http://localhost:8081/api/memories
*/

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
    try {
        // Extract the data from the request body
        const newMemory = await request.json();

        // Validate the request body
        if (!validateMemory(newMemory)) {
            console.error('Invalid memory data');
            return ExpoResponse.json({ error: 'Invalid memory data' }, { status: 400 });
        }

        // Insert the new row into the "memory" table
        const { data, error } = await supabase.from('memory').insert(newMemory).select();

        // Check for errors
        if (error) {
            console.error('Error inserting memory:', error.message);
            return ExpoResponse.json({ error: 'Internal Server Error' });
        }

        // Return success response
        return ExpoResponse.json({ message: 'Memory inserted successfully', data });
    } catch (error) {
        console.error('Error inserting memory:', (error as Error).message);
        return ExpoResponse.json({ error: 'Internal Server Error' });
    }
}