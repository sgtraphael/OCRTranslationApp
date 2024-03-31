import { TouchableOpacity, View, StyleSheet, Text } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import color from "../Util/color";

export default langItem = props => {
    return <TouchableOpacity style={styles.container}>
        <View style={styles.iconContainer}>
            {
                props.selected &&
                <AntDesign name="check" size={24} color="black" />
            }
        </View>
        <Text style={styles.itemText}>{props.text}</Text>
    </TouchableOpacity>
}

const styles=  StyleSheet.create({
    container:{
        borderBottomColor: color.lightGrey,
        borderBottomWidth: 2,
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
    },
    iconContainer: {
        paddingRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
    },
    itemText: {
        fontFamily: 'Medium',
        letterSpacing: 0.2,
        flex: 1,
        fontSize: 16,
    },
})