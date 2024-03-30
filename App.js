import 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import Home from './App/Screens/HomeScreen/home';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './App/Navigations/TabNavigation';
import { TranslationProvider } from './App/Context/Context';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator;

export default function App() {
  return (
    <View style={styles.container}>
      <TranslationProvider>
        <NavigationContainer>
          <TabNavigation/>
        </NavigationContainer>
      </TranslationProvider>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
