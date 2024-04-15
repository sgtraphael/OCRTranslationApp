import axios from 'axios';
import {TRANSLATE_API_KEY} from '@env'

export const googleTranslateApi = async(texts, targetLanguage) => {
    const apiKey = TRANSLATE_API_KEY;
    const apiURL = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const requestData = {
    q: texts,
    target: targetLanguage, // Use the selected target language
    }
    // console.log('pass to translate api:', texts);
    const apiResponse = await axios.post(apiURL, requestData);
    // console.log("translation: ", apiResponse.data.data.translations);
    // console.log("translated text: ", apiResponse.data.data.translations[0].translatedText);
    const translateResult = apiResponse.data.data.translations[0].translatedText;

    if(apiResponse.status !== 200){
        console.log(apiResponse);
        throw new Error('Failed to call Google Translate API. Status: '+ apiResponse.status);
    }
    return translateResult;
    
  }