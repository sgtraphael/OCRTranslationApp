import TranslateText, {TranslateLanguage} from '@react-native-ml-kit/translate-text';
export const mlkitTranslate = async (texts, sourceLanguage, targetLanguage) => {
    const translateResult = await TranslateText.translate({text: texts, sourceLanguage: sourceLanguage, targetLanguage: targetLanguage,downloadModelIfNeeded: true});
    console.log("translated text: ", translateResult);
    return translateResult;
  }