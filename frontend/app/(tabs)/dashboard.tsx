import { CameraView } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View, Text, ScrollView } from 'react-native';
import { LevelCard } from '@/components/levelCard';

export default function HomeScreen() {
  const [ language, setLanguage ] = useState("English");
  const [ languageLevels, setLanguageLevels ] = useState(10);

  return (
    <View style={styles.indexContainer}>
      <View style={styles.topBar}>
        <Pressable>
          <Text style={styles.heroTitle}>{language}</Text>
        </Pressable>
        <View style={styles.accountBubble}>
          <Pressable>

          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.cardContainer}>
        {Array.from({length:languageLevels}, (_ : number,_i : number) => (
          <LevelCard key={_i} level={_i}/>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    indexContainer : {
      flex: 1,
      backgroundColor: '#dee5cf',
    },
    topBar : {
      width: 'auto',
      height: 140,
      backgroundColor: '#a5af8c',
      paddingTop: 42.5,
      paddingLeft: 40,
      borderColor: 'black',
      borderBottomWidth: 9,
      flexDirection: 'row',
      alignItems: 'center',           
      justifyContent: 'space-between',
      paddingHorizontal: 30,
    },
    heroTitle : {
      fontWeight: 'bold',
      fontSize: 30
    },
    accountBubble : {
      width: 55,
      height: 55,
      borderRadius: 100,              // 10px radius makes a perfect circle for 20x20
      borderColor: 'black',
      borderWidth: 8,
    }, 
    cardContainer : {
      flexDirection: 'column',
      overflowY: 'scroll'
    }
});