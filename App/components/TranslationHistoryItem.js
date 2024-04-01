import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import { MaterialIcons } from '@expo/vector-icons';
import color from "../Util/color";
import {useSelector} from "react-redux";



export default TranslationHistoryItem = props => {
    const {itemId} = props;
    const item = useSelector(state => state.history.items.find(item => item.id === itemId));
    // console.log('selected prop:', props.selected);
    // console.log('languageKey: ', props.langKey);

    return <View style={styles.container}
>
        <View style={styles.textContainer}>
            <Text style={styles.label}>{item.sourceText}</Text>
            <Text style={styles.sublabel}>{item.translatedText}</Text>
        </View>

        <TouchableOpacity style={styles.iconContainer}>
            <MaterialIcons name="star" size={24} color={color.smallText} />
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
    },
    iconContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

})