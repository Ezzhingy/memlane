import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

export async function GET(request: ExpoRequest) {
    const user_longitude = request.expoUrl.searchParams.get('longitude');
    const user_latitude = request.expoUrl.searchParams.get('latitude');

    // Insert reaction into the database
    const { data, error } = await supabase
        .rpc('find_nearby_points', { user_longitude, user_latitude, search_radius: 1609 });

    if (error) {
        return new ExpoResponse(error.message, {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
    return ExpoResponse.json(data);
}