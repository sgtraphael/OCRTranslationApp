import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, {useEffect} from 'react';
import languageList from '../../Util/languageList';
import LangItem from '../../components/langItem';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';
import color from '../../Util/color';
import { EvilIcons } from '@expo/vector-icons';

const headerBtn = props => {
    return <HeaderButton
        {...props}
        IconComponent={EvilIcons}
        iconSize={24}
        color={props.color}
    />
}

export default function languageOptions(props) {
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: props.route.params.title,
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={headerBtn}>
                    <Item
                        iconName="close"
                        color={color.btnTextColor}
                        onPress={() => props.navigation.goBack()}
                    />
                </HeaderButtons>
            }
        })
    }, [props.navigation]);
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