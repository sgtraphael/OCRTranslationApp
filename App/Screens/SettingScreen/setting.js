import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useCallback } from 'react'
import color from '../../Util/color';
import SettingItems from '../../components/SettingItems';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { clearHistoryItems } from '../../store/historySlice';
import { setSaved } from '../../store/savedSlice';

export default function Setting() {
  const dispatch = useDispatch();
  const clearHistory = useCallback(async () => {
    try {
        await AsyncStorage.setItem('history', JSON.stringify([]));
        dispatch(clearHistoryItems());
        Alert.alert('History Cleared');
    } catch (error) {
        console.log(error);
    }
  }, [dispatch])

  const clearSaved = useCallback(async () => {
    try {
        await AsyncStorage.setItem('saved', JSON.stringify([]));
        dispatch(setSaved({items:[]}));
        Alert.alert('Saved Record Cleared');
    } catch (error) {
        console.log(error);
    }
  }, [dispatch])
  return (
    <View>
        <SettingItems
            label="Clear History"
            subLabel="Clear all records from history"
            iconFamily={AntDesign}
            icon="delete"
            onPress={clearHistory}
        />
        <SettingItems
            label="Clear Saved Items"
            subLabel="Clear all saved items"
            iconFamily={AntDesign}
            icon="delete"
            onPress={clearSaved}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.greyBg,
        padding: 10
    },
});