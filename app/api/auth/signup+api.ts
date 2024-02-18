import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

export async function POST(request: ExpoRequest) {
    const { username, password } = await request.json();

    // Insert user into the database
    const { data, error } = await supabase
        .from('user')
        .insert({ username, password })
        .select();

    if (error) {
        return new ExpoResponse("Error creating user", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
    return ExpoResponse.json(data);
}
