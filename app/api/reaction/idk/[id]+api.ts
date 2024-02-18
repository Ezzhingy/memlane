import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import supabase from '@/utils/supabase';

export async function GET(request: ExpoRequest) {
    const memory_id = request.expoUrl.searchParams.get('id');

    // Insert reaction into the database
    const { data, error } = await supabase
        .from('memory')
        .select()
        .eq('id', memory_id);

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