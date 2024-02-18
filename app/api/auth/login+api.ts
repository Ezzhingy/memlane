import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

export async function GET(request: ExpoRequest) {
    const username = request.expoUrl.searchParams.get('username');
    const password = request.expoUrl.searchParams.get('password');

    // Insert user into the database
    const { data, error } = await supabase
        .from('user')
        .select()
        .eq('username', username)
        .eq('password', password);

    if (error) {
        return new ExpoResponse("Error logging in", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
    return ExpoResponse.json(data);
}
