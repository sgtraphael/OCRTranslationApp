import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import color from '../../Util/color';
import TranslationHistoryItem from '../../components/TranslationHistoryItem';
import { useSelector } from 'react-redux';



export default function Saved() {
  const savedItems = useSelector(state => state.saved.items);
  if(savedItems.length === 0){
    return <View style={styles.noRecordContainer}>
        <Text style={styles.noRecordText}>No Saved Records</Text>
    </View>
  }
  return (
    <View style={styles.container}>
        <FlatList
            data={savedItems.slice().reverse()}
            renderItem={itemData => {
                return <TranslationHistoryItem itemId={itemData.item.id}/>
            }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.greyBg,
        padding: 10,
    },
    noRecordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRecordText: {
        fontFamily: 'Regular',
        letterSpacing: 0.2,
    },
});