import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, {useCallback, useEffect} from 'react';
import languageList from '../../Util/languageList';
import languageListOffline from '../../Util/languageListOffline';
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
    const mode = props.route.params.appMode;
    console.log('mode',mode);
    const getAppMode = useCallback(() => {
        if (mode == false) {
            return Object.keys(languageList);
        } else {
            return Object.keys(languageListOffline);
        }
    },[mode])


    const onLanguageSelect = useCallback(itemKey => {
        const dataKey = props.route.params.direction === 'target' ? 'targetLanguage' : 'sourceLanguage';
        props.navigation.navigate('Home',{screen: "Home", params:{ [dataKey]: itemKey }}) //  in React Navigation v6 or later, the navigation structure has changed, and  need to specify the screen using the screen property within the params object.
        // console.log('dataKey', dataKey);
        // console.log('itemKey: ', itemKey);
        // console.log('params: ', props.route.params);
    }, [props.route.params, props.navigation])
    
    return (
        <View style={styles.container}>
            <FlatList
                data={getAppMode()}
                renderItem={(itemData) => {
                    const languageKey = itemData.item;
                    //if mode===true use languageListOffline, else use languageLists
                    const languageString = mode === false ? languageList[languageKey] : languageListOffline[languageKey];
                    return <LanguageItem 
                                onPress={() => onLanguageSelect(languageKey)}
                                text={languageString} 
                                selected={languageKey===props.route.params.selected}
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