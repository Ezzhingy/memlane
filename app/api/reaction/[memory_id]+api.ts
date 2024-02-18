import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

export async function POST(request: ExpoRequest) {
    const memory_id = request.expoUrl.searchParams.get('memory_id');
    const { user_id, reaction } = await request.json();

    // Insert reaction into the database
    const { data, error } = await supabase
        .from('reaction')
        .insert([{ user_id, memory_id, reaction }])
        .select();

    if (error) {
        console.log("ERROR",error);
        return new ExpoResponse("Error posting reaction", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
    return ExpoResponse.json(data);
}

export async function GET(request: ExpoRequest) {
    const memory_id = request.expoUrl.searchParams.get('memory_id');

    const { data, error } = await supabase.from('reaction').select().eq('memory_id', memory_id);

    if (error) {
        return new ExpoResponse("Error getting reaction", {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    return ExpoResponse.json(data);
}
