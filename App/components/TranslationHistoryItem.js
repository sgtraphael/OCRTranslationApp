import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import color from "../Util/color";
import {useSelector, useDispatch} from "react-redux";
import { useCallback } from "react";
import { setSaved } from "../store/savedSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default TranslationHistoryItem = props => {
    const dispatch = useDispatch();
    const {itemId} = props;
    const item = useSelector(state => {
        return state.history.items.find(item => item.id === itemId) || 
            state.saved.items.find(item => item.id === itemId)
    });
    const savedItems = useSelector(state => state.saved.items);

    const isSaved = savedItems.some(item => item.id === itemId);
    const star = isSaved ? 'star' : 'star-border';
    const saveItem = useCallback(async () => {
        let newSavedItems;
        if(isSaved) {
            newSavedItems = savedItems.filter(item => item.id !== itemId); //update the saveditems array by removing the saved ite,
        }
        else{
            newSavedItems = savedItems.slice(); //return the copy of the arraay as state item is read-only
            newSavedItems.push(item); //update the saveditems array by adding the saved item.
        }

        await AsyncStorage.setItem('saved', JSON.stringify(newSavedItems)); //save the array to the local storage.
        dispatch(setSaved({items: newSavedItems}));
    },[dispatch, savedItems]);
    // console.log('selected prop:', props.selected);
    // console.log('languageKey: ', props.langKey);
    return <View style={styles.container}
>
        <View style={styles.textContainer}>
            <Text style={styles.label}>{item.sourceText}</Text>
            <Text style={styles.sublabel}>{item.translatedText}</Text>
        </View>

        <TouchableOpacity style={styles.iconContainer} onPress={saveItem}>
            <MaterialIcons name={star} size={24} color={color.smallText} />
        </TouchableOpacity>
    </View>
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 20,
        flexDirection: 'row',
        backgroundColor: color.white,
        borderColor: color.lightGrey,
        borderWidth: 0.5,
        borderTopWidth: 0,
    },
    textContainer: {
        flex: 1,
        marginRight: 9,
    },
    label: {
        fontFamily:'Medium',
        letterSpacing: 0.2,
        color: color.text,
    },
    sublabel:{
        fontFamily:'Regular',
        letterSpacing: 0.2,
        color: color.smallText,
        fontSize: 13,
    },
    iconContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

})