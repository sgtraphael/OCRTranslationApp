import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const TextExtraction = () => {
    const [imageUri, setImageUri] = useState(null);
    const [texts, setTexts] = useState("");

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

    const analyzeImage = async () => {
        try{
            if (!imageUri) {
                alert('Please select an image first');
                return;
            }
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
            setTexts(apiResponse.data.responses[0].textAnnotations[0].description);
            console.log('response: ', apiResponse.data.responses[0]);
            console.log('textAnnotation: ', apiResponse.data.responses[0].textAnnotations);
            console.log('texts', texts);

        } catch(error){
            console.error('Error analyzing image: ', error);
            alert('Error analyzing image. Please try again later');
        }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Google Cloud Vision API Text Detection Demo
      </Text>
      {imageUri && (
        <Image
            source = {{uri: imageUri}}
            style = {{width: 300, height: 300}} 
        />
      )}
      <TouchableOpacity 
        onPress={pickImage}
        style={styles.button}
      >
        <Text style={styles.text}>Choose an image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={analyzeImage}
        style={styles.button}
      >
        <Text style={styles.text}>Analyze image</Text>
      </TouchableOpacity>
      {
        texts.length > 0 && (
            <View>
                <Text style = {styles.label}>
                    Result: {texts}
                </Text>
                {
                    // texts.map((text) => (
                    //     <Text
                    //         key={text.mid}
                    //         style={styles.outputText}
                    //     >
                    //         {text.description}
                    //     </Text> 
                    // ))
                }
            </View>
        )
      }

    </View>
  )
}

export default TextExtraction

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: 100,

    },
    button:{
        backgroundColor: 'DDDDDD',
        padding: 10,
        marginBottom: 10,
        marginTop: 20,

    },
    text:{
        fontSize: 20,
        fontWeight: 'bold',

    },
    label:{
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    outputText: {
        fontSize: 18,
        marginBottom: 10,
    }
  });