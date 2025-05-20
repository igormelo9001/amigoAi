import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Assistant from './src/components/Assistant';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Assistant />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
