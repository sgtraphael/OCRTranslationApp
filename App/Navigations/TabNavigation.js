import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Screens/HomeScreen/home';
import History from '../Screens/HistoryScreen/history';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';



const Tab = createBottomTabNavigator();


const TabNavigation = (props)=> {
  return (
    <Tab.Navigator screenOptions={{headerShown:false, tabBarActiveTintColor:"purple"}}>
      <Tab.Screen name="Home" component={Home} options={{
        tabBarLabel:({color})=>(
            <Text style={{color:color, fontSize:12, marginTop:-7}}>Home</Text>
        ),
        tabBarIcon: ({color,size})=>(<AntDesign name="home" size={size} color="black"/>)
      }}/>
      <Tab.Screen name="History" component={History} options={{
        tabBarLabel:({color})=>(
            <Text style={{color:color, fontSize:12, marginTop:-7}}>History</Text>
        ),
        tabBarIcon: ({color,size})=>(<FontAwesome5 name="history" size={24} color="black" />)
      }}/>
    </Tab.Navigator>
  )
}

export default TabNavigation;