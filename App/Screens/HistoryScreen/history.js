import React from 'react';
import { View, Text } from 'react-native';

const History = ({translationHistory}) => {
  // Implement the logic to display the translation history cards
  const handleCardPress = (saveTranslation) => {
// Implement the logic to handle card press and display the enlarged image
  };
  return (
    <View>
      <Text>Translation History</Text>
      {translationHistory.map((saveTranslation, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(translation)}>
            <View>
                <Text>{translation.translatedText}</Text>
                <Image source={{ uri: saveTranslation.imageUri }} style={{ width: 100, height: 100 }} />
            </View>
            </TouchableOpacity>
      ))}
    </View>
  );
};
    
export default History;