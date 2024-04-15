import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import color from "../Util/color";

export default LanguageItem = (props) => {
    // console.log('selected prop:', props.selected);
    // console.log('languageKey: ', props.langKey);

    return <TouchableOpacity 
                style={styles.container}
                onPress={props.onPress}>
        <View style={styles.iconContainer}>
            {
                props.selected &&
                <AntDesign name="check" size={24} color={color.btnTextColor} />
            }
        </View>
        <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        borderBottomColor: color.lightGrey,
        borderBottomWidth: 1,
    },
    iconContainer: {
        paddingRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50
    },
    text: {
        flex: 1,
        fontFamily: 'Medium',
        letterSpacing: 0.2,
    }
})