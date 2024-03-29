import { StyleSheet, View } from 'react-native';
import Home from './App/Screens/HomeScreen/home';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './App/Navigations/TabNavigation';

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <TabNavigation/>
      </NavigationContainer>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
