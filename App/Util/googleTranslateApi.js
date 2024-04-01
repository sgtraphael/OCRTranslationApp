import axios from 'axios';
export const googleTranslateApi = async(texts, targetLanguage) => {
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

    if(apiResponse.status !== 200){
        console.log(apiResponse);
        throw new Error('Failed to call Google Translate API. Status: '+ apiResponse.status);
    }
    return translateResult;
    // setTranslatedText(apiResponse.data.data.translations[0].translatedText);
    
  }