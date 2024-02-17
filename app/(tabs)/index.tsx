import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
// import db from '@/utils/drizzle';
// import { user } from '@/models/user';

let name: any = 'John Doe';

// let drizzleTest = async () => {
//   await db.insert(user).values({ firstName: 'John', lastName: 'Doe' });
//   let person = await db.select().from(user);
//   name = person[0].firstName + ' ' + person[0].lastName;
// }

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {name}</Text>
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
