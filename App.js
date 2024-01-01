import { StyleSheet, View } from 'react-native';
import TextExtraction from './src';

export default function App() {
  return (
    <View style={styles.container}>
      <TextExtraction />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
