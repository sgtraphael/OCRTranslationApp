import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, {useCallback, useEffect} from 'react';
import languageList from '../../Util/languageList';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';
import color from '../../Util/color';
import { EvilIcons } from '@expo/vector-icons';
import LanguageItem from '../../components/LanguageItem';

const headerBtn = props => { 
    return <HeaderButton
        {...props}
        IconComponent={EvilIcons}
        iconSize={24}
        color={props.color}
    />
}

export default function languageOptions({navigation, route}) {
    const params = route.params || {};
    const {title, selected} = params;

    useEffect(() => {
        navigation.setOptions({
            headerTitle: title,
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={headerBtn}>
                    <Item
                        iconName="close"
                        color={color.btnTextColor}
                        onPress={() => navigation.goBack()}
                    />
                </HeaderButtons>
            }
        })
    }, [navigation]);

    // const onSelect = useCallback(itemKey => {
    //     // console.log('direction: ', params.direction);
    //     const dataKey = params.direction === 'target' ? 'targetLanguage': 'sourceLanguage'; //mode: target or source?
    //     // console.log('dataKey: ', dataKey);
    //     navigation.navigate("Home", {[dataKey]: itemKey}); //dataKey: extract the mode: target or source? itemKey: language Item Value, e.g. Chinese
    //     // console.log('itemKey: ', itemKey);
    // }, [params, navigation])

    const onLanguageSelect = useCallback(itemKey => {
        const dataKey = params.direction === 'target' ? 'targetLanguage' : 'sourceLanguage';
        navigation.navigate('Home',{screen: "Home", params:{ [dataKey]: itemKey }}) //  in React Navigation v6 or later, the navigation structure has changed, and  need to specify the screen using the screen property within the params object.
        console.log('dataKey', dataKey);
        console.log('itemKey: ', itemKey);
        console.log('params: ', params);
    }, [params, navigation])
    
    return (
        <View style={styles.container}>
            <FlatList
                data={Object.keys(languageList)}
                renderItem={(itemData) => {
                    const languageKey = itemData.item;
                    const languageString = languageList[languageKey];
                    return <LanguageItem 
                                onPress={() => onLanguageSelect(languageKey)}
                                text={languageString} 
                                selected={languageKey===selected}
                                langKey = {languageKey}
                            />
                }}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});