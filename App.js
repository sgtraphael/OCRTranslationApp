import 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';
import Home from './App/Screens/HomeScreen/home';
import Setting  from './App/Screens/SettingScreen/setting';
import Saved  from './App/Screens/SavedScreen/saved';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Entypo } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import color from './App/Util/color';
import languageOptions from './App/Screens/LanguageOptions/languageOptions';
import Result from './App/Screens/ResultScreen/result';

import {Provider} from 'react-redux';
import store from './App/store/store';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown:false, tabBarActiveTintColor:'#964EC2'}}>
      <Tab.Screen name="Home" component={Home} options={{
        tabBarLabel:({color})=>(
            <Text style={{color:color, fontSize:12, marginTop:-7}}>Home</Text>
        ),
        tabBarIcon:(props)=> <Entypo name="home" size={props.size} color={props.color} />
      }}/>
      <Tab.Screen name="Saved" component={Saved} options={{
        tabBarLabel:({color})=>(
            <Text style={{color:color, fontSize:12, marginTop:-7}}>Saved</Text>
        ),
        tabBarIcon:(props)=><FontAwesome name="star" size={props.size} color={props.color} />
      }}/>
      <Tab.Screen name="Setting" component={Setting} options={{
        tabBarLabel:({color})=>(
            <Text style={{color:color, fontSize:12, marginTop:-7}}>Settings</Text>
        ),
        tabBarIcon:(props)=><Ionicons name="settings" size={props.size} color={props.color} />
      }}/>
    </Tab.Navigator>
  )
}

const Stack = createNativeStackNavigator();
export default function App() {

  const [appIsLoaded, setAppIsLoaded] = useState(false);
  useEffect(() => {
    const prepare = async() => {
      try {
        await Font.loadAsync({
          Black: require('./assets/fonts/Roboto-Black.ttf'),
          BlackItalic: require('./assets/fonts/Roboto-BlackItalic.ttf'),
          Bold: require('./assets/fonts/Roboto-Bold.ttf'),
          BoldItalic: require('./assets/fonts/Roboto-BoldItalic.ttf'),
          Italic: require('./assets/fonts/Roboto-Italic.ttf'),
          Light: require('./assets/fonts/Roboto-Light.ttf'),
          LightItalic: require('./assets/fonts/Roboto-LightItalic.ttf'),
          Medium: require('./assets/fonts/Roboto-Medium.ttf'),
          MediumItalic: require('./assets/fonts/Roboto-MediumItalic.ttf'),
          Regular: require('./assets/fonts/Roboto-Regular.ttf'),
          Thin: require('./assets/fonts/Roboto-Thin.ttf'),
          ThinItalic: require('./assets/fonts/Roboto-ThinItalic.ttf'),
        });
      }
      catch(e){
        console.log(e);
      }
      finally {
        setAppIsLoaded(true);
      }
    };
    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      await SplashScreen.hideAsync();
    }

  }, [appIsLoaded]);

  if (!appIsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <View onLayout={onLayout} style={{flex:1}}>
          <Stack.Navigator
            screenOptions={{
              headerTitleStyle: {
                fontFamily: 'Medium',
                color: 'white',
              },
              headerStyle: {
                backgroundColor: color.theme,
              }
            }}
          >
            <Stack.Group>
              <Stack.Screen name="Home" component={TabNavigator} options={{headerTitle:"Translate"}} />
            </Stack.Group>
            <Stack.Group screenOptions={{
              presentation: 'containedModal',
              headerStyle: {
                backgroundColor: 'white'
              },
              headerTitleStyle: {
                fontFamily: 'Medium',
                color: color.text,
              }
            }}>
              <Stack.Screen name="LanguageOptions" component={languageOptions}/>
              <Stack.Screen name="Result" component={Result}/>
            </Stack.Group>
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
