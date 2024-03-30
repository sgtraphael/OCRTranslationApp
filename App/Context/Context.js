import { createContext } from "react";
import { useState } from "react";

const TranslationContext = createContext(null);

const TranslationProvider = ({children}) => {
    const [translationHistory, setTranslationHistory] = useState([]);
    const addToHistory = (translationData) => {
        setTranslationHistory((prevHistory) => [...prevHistory, translationData]);
      };
      const removeFromHistory = (index) => {
        setTranslationHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
          updatedHistory.splice(index, 1);
          return updatedHistory;
        });
      };    
    return (
        <TranslationContext.Provider value={{translationHistory,addToHistory,removeFromHistory,}}>
            {children}
        </TranslationContext.Provider>
    ) 
}

export {TranslationContext, TranslationProvider};