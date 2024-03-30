import React from 'react';
import { View, Text } from 'react-native';
import { useContext } from 'react';
import { TranslationContext } from '../../Context/Context.js';

const History = () => {
    const { translationHistory, removeFromHistory } = useContext(TranslationContext);
    console.log('History.js -> translationHistory:', translationHistory);
  // Implement the logic to display the translation history cards
  const handleCardClick = (index) => {
    // Enlarge the card and show the full-sized image with translated text
  };
  const handleRemoveCard = (index) => {
    removeFromHistory(index);
  };
  return (
    <View>
      <Text>Translation History</Text>
      {translationHistory.map((translation, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardClick(index)}>
            <View>
                <Text>{translation.translatedText}</Text>
                <Image source={{ uri: translation.imageUri }} style={{ width: 100, height: 100 }} />
            </View>
            </TouchableOpacity>
      ))}
    </View>
  );
};
    
export default History;