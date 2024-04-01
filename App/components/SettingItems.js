import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import color from '../Util/color'

export default SettingItems = props => {
    return <TouchableOpacity style={styles.container} onPress={props.onPress}>
        <View style={styles.textContainer}>
            <Text
                numberOfLines={1}
                style={styles.label}>
                {props.label}
            </Text>
            <Text
                numberOfLines={1}
                style={styles.sublabel}>
                {props.subLabel}
            </Text>
        </View>
        <View style={styles.iconContainer}>
            <props.iconFamily name={props.icon} size={24} color={color.theme}/>
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: color.white,
        borderColor: color.lightGrey,
        borderWidth: 0.5,
        borderTopWidth: 0,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    textContainer: {
        flex: 1,
        marginRight: 9
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