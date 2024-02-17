import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import supabase from '@/utils/supabase';

export default function TabOneScreen() {
  const [name, setName] = useState('');

  useEffect(() => {
    const supabaseDBTest = async () => {
      const { data, error } = await supabase.from('user').select();

      if (error) {
        console.error(error);
        return;
      }

      setName(data[0]?.username);
    }

    supabaseDBTest();
  }, []);

  useEffect(() => {
    console.log('name:', name);
  }, [name]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, World</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});