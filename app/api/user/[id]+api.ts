import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

export async function GET(request: ExpoRequest) {
    const id = request.expoUrl.searchParams.get('id');

    const { data, error } = await supabase.from('user').select().eq('id', id);

    if (error) {
        return new ExpoResponse("Error getting user", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    return ExpoResponse.json(data);
}
