import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Switch, Settings, ActivityIndicator, Button} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import TranslateText, {TranslateLanguage} from '@react-native-ml-kit/translate-text';
import { TranslationContext } from '../../Context/Context.js';
import { useContext } from 'react';

import History from '../HistoryScreen/history';
import TabNavigation from '../../Navigations/TabNavigation';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import color from '../../Util/color.js';

const Home = (props) => {
    const [imageUri, setImageUri] = useState(null);
    const [texts, setTexts] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [shouldTranslate, setShouldTranslate] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const [shouldUseTesseract, setShouldUseTesseract] = useState(false);
    const [sourceLanguage, setSourceLanguage] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);
    // const { addToHistory } = useContext(TranslationContext);

    const toggleOCR = () => {
      setShouldUseTesseract(!shouldUseTesseract);
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if(!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
        console.log(result);
        }catch (error){
            console.error('Error Picking Image: ', error);
        }
    };

    const takePhoto = async () => {
      try {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (permission.granted === false) {
            alert("You've refused to allow this app to access your photos!");
          } else {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
      
            if (!result.cancelled) {
              setImageUri(result.uri);
            }
            console.log(result);
          }
      } catch (error) {
        console.error('Error Taking Photo: ', error);
      }
    };
    
    useEffect(() => {
        const translateText = async () => {
          try {
                const GoogleCloudTranslate = async() => {
                  const apiKey = "AIzaSyA60a6EUSAHZFh5GPwpb_KQ_ifUO5bBwtM";
                  const apiURL = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
              
                  const requestData = {
                  q: texts,
                  target: targetLanguage, // Use the selected target language
                  }
                  console.log('pass to translate api:', texts);
                  const apiResponse = await axios.post(apiURL, requestData);
                  console.log("translation: ", apiResponse.data.data.translations);
                  console.log("translated text: ", apiResponse.data.data.translations[0].translatedText);
                  // setTexts(apiResponse.data.data.translations[0].translatedText)
                  const translateResult = apiResponse.data.data.translations[0].translatedText;
                  return translateResult;
                  // setTranslatedText(apiResponse.data.data.translations[0].translatedText);
                  
                }
                const mlTranslate = async () => {
                  const translateResult = await TranslateText.translate({text: texts, sourceLanguage: sourceLanguage, targetLanguage: targetLanguage,downloadModelIfNeeded: true});
                  console.log("translated text: ", translateResult);
                  return translateResult
                }

                setIsTranslating(true);
                let translateResult = '';
                if(shouldUseTesseract){
                  translateResult = await mlTranslate(sourceLanguage);
                  setTranslatedText(translateResult);
                  console.log('tesseract');
                }else {
                  translateResult = await GoogleCloudTranslate();
                  setTranslatedText(translateResult);
                  console.log('google OCR');
                }
                //Save the translation in the history
                const translationData = {
                    translatedText: translateResult,
                    imageUri: imageUri,
                };
                // addToHistory(translationData);
                // console.log('translation history: ', translationHistory);
                console.log('image uri: ', imageUri);
                console.log('translated result: ', translateResult);
                setIsTranslating(false);
          } catch (error) {
            setIsTranslating(false);
            console.error('Error translating text: ', error);
            alert('Error translating text. Please try again later');
          }
        };

        if (shouldTranslate && targetLanguage && texts && sourceLanguage) {
          console.log('selected language', targetLanguage);
          console.log('text in useEffect IF: ', texts);
          translateText();
          setShouldTranslate(false);
        }
      }, [shouldTranslate, texts, targetLanguage, sourceLanguage]);

    const analyzeImage = async () => {
        try{
            if (!imageUri) {
                alert('Please select an image first');
                return;
            }
            
            const GoogleCloudVisionApiAnalyze = async() => {
              // Google Cloud Vision API Key
              const apiKey = "AIzaSyA60a6EUSAHZFh5GPwpb_KQ_ifUO5bBwtM";
              const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

              //read image from local URI and convert to base64
              const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
                  encoding: FileSystem.EncodingType.Base64,
              });

              const requestData = {
                  requests: [
                      {
                          image: {
                              content: base64ImageData,
                          },
                          features:{type: 'TEXT_DETECTION'},
                      },
                  ],
              };
              const apiResponse = await axios.post(apiURL, requestData);
              const extractedText = apiResponse.data.responses[0].textAnnotations[0].description;
              return extractedText;
            };
            // Google Cloud Vision API Key
            // const apiKey = "AIzaSyA60a6EUSAHZFh5GPwpb_KQ_ifUO5bBwtM";
            // const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

            // //read image from local URI and convert to base64
            // const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
            //     encoding: FileSystem.EncodingType.Base64,
            // });

            // const requestData = {
            //     requests: [
            //         {
            //             image: {
            //                 content: base64ImageData,
            //             },
            //             features:{type: 'TEXT_DETECTION'},
            //         },
            //     ],
            // };
            // const apiResponse = await axios.post(apiURL, requestData);
            // setTexts(apiResponse.data.responses[0].textAnnotations[0].description);
            // if(targetLanguage) {
            //     console.log('selected language',  targetLanguage);
            //     translateText();
            // }
            // console.log('response: ', apiResponse.data.responses[0]);

            //OCR using tesseract
            const mlAnalyze = async () => {
              const recognizedText = await TextRecognition.recognize(
                imageUri
              );
              return recognizedText;
            };

            let extractedTextFromGoogle = '';
            let extractedTextFromMl = [];

            // Choose the OCR engine based on a condition
            if (shouldUseTesseract) {
              extractedTextFromMl = await mlAnalyze();
              const fullText = extractedTextFromMl.text;
              console.log('full text',fullText);
              setTexts(fullText);
            } else {
              extractedTextFromGoogle = await GoogleCloudVisionApiAnalyze();
              setTexts(extractedTextFromGoogle);
            }
        
            // setTexts(extractedText);
            // console.log('textAnnotation: ', extractedText);
            // console.log("text extracted: ", texts);
            setShouldTranslate(true);
            console.log('texts', texts);
            console.log('translated Text', translatedText);

        } catch(error){
            console.error('Error analyzing image: ', error);
            alert('Error analyzing image. Please try again later');
        }
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.languageContainer}>
                <TouchableOpacity 
                style={styles.languageOptions}
                onPress={() => props.navigation.navigate('LanguageOptions')}>
                    <Text style={styles.languageOptionsContent}>English</Text>
                </TouchableOpacity>

                <View style={styles.arrowContainer}>
                    <AntDesign name="arrowright" size={24} color={color.lightGrey} />
                </View>

                <TouchableOpacity 
                style={styles.languageOptions}
                onPress={() => props.navigation.navigate('LanguageOptions')}>
                    <Text style={styles.languageOptionsContent}>French</Text>
                </TouchableOpacity>
            </View> 

          {/* <TabNavigation translationHistory={translationHistory} /> */}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={takePhoto} style={styles.button}>
                <AntDesign name="camera" size={24} color={color.theme} />
                <Text style={styles.buttonText}>Photo</Text>   
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Ionicons name="albums-sharp" size={24} color={color.theme} />
                <Text style={styles.buttonText}>Album</Text>
            </TouchableOpacity>
        
            <TouchableOpacity onPress={analyzeImage} style={styles.button}>
                <Ionicons name="arrow-forward-circle-sharp" size={24} color={color.theme} />
                <Text style={styles.buttonText}>Translate</Text>
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity onPress={}>Save Results</TouchableOpacity> */}
          <View>
            <Text>Offline Mode: {shouldUseTesseract ? 'On' : 'Off'}</Text>
            <Switch
              value={shouldUseTesseract}
              onValueChange={toggleOCR}
            />
          </View>
          {texts.length > 0 && (
            <View style={styles.resultContainer}>
              <Text style={styles.label}>Source Text:</Text>
              <Text style={styles.text}>{texts}</Text>
    
              {isTranslating ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {translatedText && (
                  <>
                    <Text style={styles.label}>Translated Text:</Text>
                    <Text Text style={styles.text}>{translatedText}</Text>
                  </>
                )}
              </>
            )}
            </View>
          )}
          <View style={styles.historyContainer}>

          </View>
          {shouldUseTesseract && (
            <Picker
              selectedValue={sourceLanguage}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSourceLanguage(itemValue)}
            >
              <Picker.Item label="Select source language" value="" />
              <Picker.Item label="English" value="en" />
              {/* Add more languages as needed */}
            </Picker>
          )}
          <Picker
            selectedValue={targetLanguage}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setTargetLanguage(itemValue)}
          >
            <Picker.Item label="Select target language" value="" />
            <Picker.Item label="Spanish" value="es" />
            <Picker.Item label="French" value="fr" />
            <Picker.Item label="German" value="de" />
            <Picker.Item label="Chinese" value="zh" />
            {/* Add more languages as needed */}
          </Picker>
    
          {/* {texts.length > 0 && (
            <View style={styles.resultContainer}>
              <Text style={styles.label}>Extracted Text:</Text>
              <Text style={styles.text}>{texts}</Text>
    
              {isTranslating ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {translatedText && (
                  <>
                    <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Translated Text:</Text>
                    <Text>{translatedText}</Text>
                  </>
                )}
              </>
            )}
            </View>
          )} */}
        </ScrollView>
        
      );

}

export default Home
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#fff',
    //   alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    languageContainer: {
        flexDirection: 'row',
        borderBottomColor: color.lightGrey,
        borderBottomWidth: 1,
    },
    languageOptions: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
    },
    arrowContainer: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    languageOptionsContent: {
        color: color.theme,
        fontFamily: 'Light',
        letterSpacing: 0.2
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
    image: {
      width: 300,
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      marginTop: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 10,
        paddingHorizontal:20,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
      backgroundColor: color.lightGrey,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      height:120,
      width:120
    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'Bold',
      letterSpacing: 0.2,
      color: color.btnTextColor,
    },
    picker: {
      width: '100%',
      marginBottom: 20,
    },
    resultContainer: {
      marginTop: 20,
      alignItems: 'center',
      borderBottomColor: color.lightGrey,
      borderBottomWidth: 1,
      flexDirection: 'row',
      height: 90,
      paddingVertical:10,
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
      fontFamily: 'regular',
      letterSpacing: 0.2,
      flex:1,
      marginBottom: 20,
      textAlign: 'center',
    },
    historyContainer:{
        backgroundColor: '#F2F2F7',
        flex: 1,
        padding: 10,
    },
  });
  

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#fff',
//       //alignItems: 'center',
//       justifyContent: 'center',
//     },
//     title: {
//         fontSize: 30,
//         fontWeight: 'bold',
//         marginBottom: 50,
//         marginTop: 100,

//     },
//     button:{
//         backgroundColor: 'DDDDDD',
//         padding: 10,
//         marginBottom: 10,
//         marginTop: 20,

//     },
//     text:{
//         fontSize: 20,
//         fontWeight: 'bold',

//     },
//     label:{
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginTop: 20,
//     },
//     outputText: {
//         fontSize: 18,
//         marginBottom: 10,
//     }
//   });