import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

export async function GET(request: ExpoRequest) {
    const user_longitude = request.expoUrl.searchParams.get('longitude');
    const user_latitude = request.expoUrl.searchParams.get('latitude');
    const search_radius = Math.ceil(parseInt(request.expoUrl.searchParams.get('radius') || '0'));

    // Insert reaction into the database
    const { data, error } = await supabase
        .rpc('find_nearby_points', { user_longitude, user_latitude, search_radius });

    if (error) {
        console.error('Error getting nearby memories:', error);
        return new ExpoResponse(error.message, {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
    return ExpoResponse.json(data);
}