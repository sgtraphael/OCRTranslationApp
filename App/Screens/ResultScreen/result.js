import React from 'react';
import { View, Text } from 'react-native';

const Result = ({ translatedText, sourceText }) => {
  return (
    <View style={styles.resultContainer}>
      <Text style={styles.label}>Translated Text:</Text>
      <Text style={styles.text}>{translatedText}</Text>
      <Text style={styles.label}>Source Text:</Text>
      <Text style={styles.text}>{sourceText}</Text>
    </View>
  );
};

const styles = {
  resultContainer: {
    margin: 20,
  },
  label: {
    fontWeight: 'Bold',
    marginBottom: 5,
  },
  text: {
    marginBottom: 10,
  },
};

export default Result;