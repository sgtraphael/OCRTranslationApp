import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Switch, Settings, ActivityIndicator, Button, Modal, FlatList} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import TranslateText, {TranslateLanguage} from '@react-native-ml-kit/translate-text';
import { TranslationContext } from '../../Context/Context.js';
import { useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';


import History from '../HistoryScreen/history';
import TabNavigation from '../../Navigations/TabNavigation';
import { mlTranslate, mlkitTranslate } from '../../Util/mlKitTranslate.js';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';

import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import color from '../../Util/color.js';
import languageList from '../../Util/languageList.js';
import { googleTranslateApi } from '../../Util/googleTranslateApi.js';
import Result from '../ResultScreen/result.js';
import { addHistoryItem, setHistoryItems } from '../../store/historySlice.js';
import TranslationHistoryItem from '../../components/TranslationHistoryItem.js';
import { setSaved } from '../../store/savedSlice.js';
import {LinearGradient} from 'expo-linear-gradient';
import languageListOffline from '../../Util/languageListOffline.js';
import calcCER from 'character-error-rate';


const retrieveData = () => {
    return async dispatch => {
        try {
            const historyStr = await AsyncStorage.getItem('history');
            if(historyStr !== null) {
                const history = JSON.parse(historyStr);
                dispatch(setHistoryItems({items: history}));
            }
            const saveStr = await AsyncStorage.getItem('saved');
            if(saveStr !== null) {
                const saved = JSON.parse(historyStr);
                dispatch(setSaved({items: saved}));
            }
        } catch (error) {
            console.log(error);
        }
    }
}
export default function Home(props) {
    console.disableYellowBox = true;// temporarilty disable warning msgs

    const dispatch = useDispatch();
    const history = useSelector(state => state.history.items);
    console.log('history:', history);
    
    // console.log('Home component params:', props.route.params);
    // console.log('Home component props:', props);
    
    const route = useRoute();
    // console.log('route:', route.params);
    const params = props.route.params || {};
    const [imageUri, setImageUri] = useState(null);
    const [texts, setTexts] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("fr");
    const [shouldTranslate, setShouldTranslate] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const [shouldUseTesseract, setShouldUseTesseract] = useState(false);
    const [sourceLanguage, setSourceLanguage] = useState("en");
    const [isTranslating, setIsTranslating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    // const { addToHistory } = useContext(TranslationContext);
    useEffect(() => {
        if (params.targetLanguage) {
            setTargetLanguage(params.targetLanguage);
        }
        if (params.sourceLanguage) {
            setSourceLanguage(params.sourceLanguage);
        }
        // console.log('in HomeScreen, props.targetLanguage: ', params.targetLanguage);
        // console.log('in HomeScreen, props.sourceLanguage: ', params.sourceLanguage);
    }, [params.targetLanguage, params.sourceLanguage])

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
        // console.log(result);
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
            // console.log(result);
          }
      } catch (error) {
        console.error('Error Taking Photo: ', error);
      }
    };
    
    useEffect(() => {
        const translateText = async () => {
        //   try {
        //         const GoogleCloudTranslate = async() => {
        //           const apiKey = "AIzaSyA60a6EUSAHZFh5GPwpb_KQ_ifUO5bBwtM";
        //           const apiURL = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
              
        //           const requestData = {
        //           q: texts,
        //           target: targetLanguage, // Use the selected target language
        //           }
        //           console.log('pass to translate api:', texts);
        //           const apiResponse = await axios.post(apiURL, requestData);
        //           console.log("translation: ", apiResponse.data.data.translations);
        //           console.log("translated text: ", apiResponse.data.data.translations[0].translatedText);
        //           // setTexts(apiResponse.data.data.translations[0].translatedText)
        //           const translateResult = apiResponse.data.data.translations[0].translatedText;
        //           return translateResult;
        //           // setTranslatedText(apiResponse.data.data.translations[0].translatedText);
                  
        //         }
        //         const mlTranslate = async () => {
        //           const translateResult = await TranslateText.translate({text: texts, sourceLanguage: sourceLanguage, targetLanguage: targetLanguage,downloadModelIfNeeded: true});
        //         //   console.log("translated text: ", translateResult);
        //           return translateResult
        //         }

                try{
                    setIsTranslating(true);
                    setShowModal(true);
                    let translateResult = '';
                    // props.navigation.navigate('Result', {
                    //     screen: 'Result',
                    //     params:{
                    //         translatedText: translatedText,
                    //         sourceText: texts,
                    //         isTranslating: isTranslating
                    //     },
                    //   });
                    if(shouldUseTesseract){
                      translateResult = await mlkitTranslate(texts, sourceLanguage, targetLanguage);
                      setTranslatedText(translateResult);
                    //   console.log('tesseract');
                    }else {
                        translateResult = await googleTranslateApi(texts, targetLanguage);
                        setTranslatedText(translateResult);
                        // console.log('google OCR');
                    }
                    //dispatch action
                    const id = uuid.v4(); //id for translateResult Objects
                    translateResult.id = id;
                    const translateResultObj ={
                        id: id,
                        translatedText: translateResult,
                        sourceText: texts,
                        imageUri: imageUri,
                    };
                    dispatch(addHistoryItem({item: translateResultObj}));
                } catch (error) {
                    console.error('Error translating text: ', error);
                    alert('Error translating text. Please try again later');
                  }finally{
                    setIsTranslating(false);
                  }
                
                //Save the translation in the history
                const translationData = {
                    translatedText: translateResult,
                    imageUri: imageUri,
                };
                // addToHistory(translationData);
                // console.log('translation history: ', translationHistory);
                // console.log('image uri: ', imageUri);
                // console.log('translated result: ', translateText);
                setIsTranslating(false);
        //   } catch (error) {
        //     setIsTranslating(false);
        //     console.error('Error translating text: ', error);
        //     alert('Error translating text. Please try again later');
        //   }
        };

        if (shouldTranslate && targetLanguage && texts && sourceLanguage) {
        //   console.log('selected language', targetLanguage);
        //   console.log('text in useEffect IF: ', texts);
          translateText();
          setShouldTranslate(false);
        }
      }, [shouldTranslate, texts, targetLanguage, sourceLanguage, dispatch]);
      const closeModal = () => {
        setShowModal(false);
    };
    const handleSubmit = async() => {
        ()=> isTranslating? undefined : analyzeImage
    }
    const copyToClipboard = useCallback(async () => {
        await Clipboard.setStringAsync(translatedText);
        alert('Text copied to clipboard');
    }, [translatedText]);

    useEffect(() => {
        dispatch(retrieveData());
    }, [dispatch])
    // save history to long-term storage
    useEffect(() => {
        const saveHistory = async() => {
            try {
                await AsyncStorage.setItem('history', JSON.stringify(history));
            } catch (error) {
                console.log(error);
            }
        }
        saveHistory();
    }, [history]);
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
            let script;
              if (sourceLanguage === 'zh') {
                script = TextRecognitionScript.CHINESE;
              } else if (sourceLanguage === 'en') {
                script = TextRecognitionScript.LATIN;
              } else if (sourceLanguage === 'hi') {
                script = TextRecognitionScript.DEVANAGARI;
              }
              script = script || TextRecognitionScript.LATIN
              const recognizedText = await TextRecognition.recognize(
                imageUri, script
              );
              return recognizedText;
            };

            let extractedTextFromGoogle = '';
            let extractedTextFromMl = [];

            // Choose the OCR engine based on a condition
            if (shouldUseTesseract) {
              extractedTextFromMl = await mlAnalyze();
              const fullText = extractedTextFromMl.text;
            //   console.log('text extracted: ',fullText);
              setTexts(fullText);
            //   console.log('Mode: used RNML');
            } else {
              extractedTextFromGoogle = await GoogleCloudVisionApiAnalyze();
              setTexts(extractedTextFromGoogle);
            //   console.log('Mode: used GCV');
            }
            
        
            // setTexts(extractedText);
            // console.log('textAnnotation: ', extractedText);
            // console.log('texts: ', texts);
            setShouldTranslate(true);
            // console.log('texts', texts);
            // console.log('translated Text', translatedText);

        } catch(error){
            console.error('Error analyzing image: ', error);
            alert('Error analyzing image. Please try again later');
        }
    };
    console.log('text extracted: ', texts);
    console.log('text translated', translatedText);
    // console.log('CER: ', calcCER("A man who went missing in Sham Shui Po has been located. Yip Hing-shing, aged 48, went missing after he was last seen on Ki Lung Street on March 30 afternoon. His family made a report to Police on the same day. The man was located on Lai Chi Kok Road last night (April 2). He sustained no injuries and no suspicious circumstances were detected. Ends/Wednesday, April 3, 2024 Issued at HKT 12:10", "A man who was missing in deep water ingredients was put on. Forty-€ 1 year old man Qingzheng in the afternoon of March 30 afternoon in the corpus of the Christung Street after the closed, the family to the vowillaration. The man was founded last night (April 2) Went Like Treadya. He did not injury, the case has suspicious. Ends / Wednesday, April 3, 2012 (Hong Kong) Hong Kong time 12:10", false, false));

    return (
       // <LinearGradient style={styles.container} start={{x:0.5, y:0}} end={{x:0.5, y:1}} locations={[0,0.5,1]} colors={['#764BA2', '#667EEA']}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.languageContainer}>
                    <TouchableOpacity 
                    style={styles.languageOptions}
                    onPress={() => props.navigation.navigate('LanguageOptions', {title: "Source Language Select", selected: sourceLanguage, direction: 'source', appMode: shouldUseTesseract})}>
                        <Text style={styles.languageOptionsContent}>{languageList[sourceLanguage]}</Text>
                    </TouchableOpacity>

                    <View style={styles.arrowContainer}>
                        <AntDesign name="arrowright" size={24} color={color.lightGrey} />
                    </View>

                    <TouchableOpacity 
                    style={styles.languageOptions}
                    onPress={() => props.navigation.navigate('LanguageOptions', {title: "Target Language Select", selected: targetLanguage, direction: 'target', appMode: shouldUseTesseract})}>
                        <Text style={styles.languageOptionsContent}>{languageList[targetLanguage]}</Text>
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
            
                <TouchableOpacity onPress={isTranslating? undefined : analyzeImage} style={styles.button}>
                    <Ionicons name="arrow-forward-circle-sharp" size={24} color={color.theme} />
                    <Text style={styles.buttonText}>Translate</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={()=> {handleSubmit(); 
                    props.navigation.navigate('Result', 
                    {title:'Result', sourceText:texts, translatedText:translatedText, isTranslating:isTranslating}
                    )}} style={styles.button}>
                    <Ionicons name="arrow-forward-circle-sharp" size={24} color={color.theme} />
                    <Text style={styles.buttonText}>Translate</Text>
                </TouchableOpacity> */}
            </View>

            {/* <TouchableOpacity onPress={}>Save Results</TouchableOpacity> */}
            <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Offline Mode: {shouldUseTesseract ? 'On ' : 'Off '}</Text>
                <Switch
                value={shouldUseTesseract}
                onValueChange={toggleOCR}
                />
            </View>
            {/* {texts.length > 0 && (
                <View style={styles.resultContainer}>
                <Text style={styles.label}>Source Text:</Text>
                <Text style={styles.text}>{texts}</Text>
        
                {isTranslating ? (
                <ActivityIndicator size="small" color={color.theme} />
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
            )} */}
                <Modal visible={showModal} animationType='slide'>
                    <ScrollView style={styles.modalContainer}>
                    {isTranslating ? (
                            <ActivityIndicator size="small" color={color.theme} />
                        ) : (
                            <>
                                
                                <Text style={styles.modalText}>Original: {texts}</Text>
                                <View style={styles.resultContainer}>
                                <Text style={styles.modalText}>Translation: {translatedText}</Text>
                                    <TouchableOpacity onPress={copyToClipboard} style={styles.iconContainer}>
                                        <MaterialIcons name="content-copy" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <Button color={color.theme} title="Close" onPress={closeModal} />
                            </>
                        )}
                    </ScrollView> 
                </Modal>

                {/* {translatedText.length > 0 && (
                    <Result translatedText={translatedText} sourceText={texts} />
                )} */}

            <View style={styles.historyContainer}>
                <FlatList
                    data={history.slice().reverse()}//create copy and render in reverse order
                    renderItem={itemData => {
                        return <TranslationHistoryItem itemId={itemData.item.id}/>
                    }}
                />
            </View>
            {/* {shouldUseTesseract && (
                <Picker
                selectedValue={sourceLanguage}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setSourceLanguage(itemValue)}
                >
                <Picker.Item label="Select source language" value="" />
                <Picker.Item label="English" value="en" />
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
            </Picker> */}
        
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
        //</LinearGradient>
        
      );

}

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
      marginHorizontal:2,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height:120,
      width:120
    },
    buttonText: {
      fontSize: 13,
      fontFamily: 'Bold',
      letterSpacing: 0.2,
      color: color.btnTextColor,
    },
    picker: {
      width: '100%',
      marginBottom: 20,
    },
    resultContainer: {
        borderBottomColor: color.lightGrey,
        borderBottomWidth: 1,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalLabel:{
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
    modalContainer: {
        borderBottomColor: color.lightGrey,
        borderBottomWidth: 1,
        paddingVertical:10,
        paddingHorizontal:15,
        marginTop: 10,

    },
    modalText: {
        fontSize: 16,
        fontFamily: 'regular',
        letterSpacing: 0.2,
        marginBottom: 20,
        marginHorizontal: 10,
        textAlign: 'left',
        flex:1,
    },
    iconContainer:{
        paddingHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    historyContainer:{
        padding: 10,
        marginTop: 10,
        marginHorizontal: 10,
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