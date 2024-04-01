import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import color from '../../Util/color';
import TranslationHistoryItem from '../../components/TranslationHistoryItem';
import { useSelector } from 'react-redux';



export default function Saved() {
  const savedItems = useSelector(state => state.saved.items);
  return (
    <View style={styles.container}>
        <FlatList
            data={savedItems}
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
});