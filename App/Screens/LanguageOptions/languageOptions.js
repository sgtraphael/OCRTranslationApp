import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import languageList from '../../Util/languageList';
import LangItem from '../../components/langItem';

export default function languageOptions() {
  return (
    <View style={styles.container}>
        <FlatList 
            data={Object.keys(languageList)}
            renderItem={(itemData) => {
                const langKeys = itemData.item;
                return <LangItem text={langKeys}/>
        }}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});