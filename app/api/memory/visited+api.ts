import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

export async function GET(request: ExpoRequest) {
    const memory_id = request.expoUrl.searchParams.get('memory_id');
    const user_id = request.expoUrl.searchParams.get('user_id');

    // Insert reaction into the database
    const { data, error } = await supabase
        .from('user_viewed')
        .select()
        .eq('memory_id', memory_id)
        .eq('user_id', user_id);

    if (error) {
        return new ExpoResponse("Error posting reaction", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
    return ExpoResponse.json(data);
}

export async function POST(request: ExpoRequest) {
    const memory_id = request.expoUrl.searchParams.get('memory_id');
    const user_id = request.expoUrl.searchParams.get('user_id');

    // Insert reaction into the database
    const { data, error } = await supabase
        .from('user_viewed')
        .insert([{ memory_id, user_id }])
        .select();

    if (error) {
        return new ExpoResponse("Error posting reaction", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
    return ExpoResponse.json(data);
}