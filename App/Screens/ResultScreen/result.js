
import { View, Text, StyleSheet } from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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

export default function Result(props) {
    const [translatedText, setTranslatedText] = useState('');
    const [sourceText, setSourceText] = useState('');
    // console.log('result.js->props: ', props);

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

    useEffect(() => {
        setTranslatedText(props.route.params.translatedText);
      }, [props.route.params.translatedText]);
    
      useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
          setTranslatedText(props.route.params.translatedText);
        });
    
        return unsubscribe;
      }, [props.navigation]);
    
    return (
        <View style={styles.container}>
          {props.route.params.isTranslating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={color.theme} />
            </View>
          ) : (
            <>
              <Text style={styles.label}>Translated Text:</Text>
              <Text style={styles.text}>{translatedText}</Text>
              <Text style={styles.label}>Source Text:</Text>
              <Text style={styles.text}>{sourceText}</Text>
            </>
          )}
        </View>
      );
}
const styles = StyleSheet.create({
    resultContainer: {
        borderBottomColor: color.lightGrey,
        borderBottomWidth: 1,
        paddingVertical:10,
      },
      label: {
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Bold',
        marginBottom: 5,
        fontSize: 18,
      },
      text: {
        marginBottom: 10,
        fontSize: 16,
        fontFamily: 'Regular',
        letterSpacing: 0.2,
      },

})

