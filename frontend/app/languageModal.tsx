import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { auth, db, storage } from "../scripts/firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LanguageModal() {
  const [ languages, setLanguages ] = useState<{ id: string, LanguageId:number, LanguageName:string }[]>([]);

  function QueryLanguages() {
    const q = query(collection(db, "Language"), orderBy("LanguageName", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLanguages(list);
    });
    return unsubscribe;
  }

  useEffect(() => {
    QueryLanguages();
  }, []);

  return(
      <View style={styles.container}>
            <ThemedText type="title" style={styles.languageHeading}>Languages:</ThemedText>
            {languages.map((_val, _i) => (
              <Pressable key={_i} onPress={() => router.replace({pathname: "/dashboard", params: { id : _val.id }})} style={styles.languageText}>
                <ThemedText type="title" style={styles.languageText}>{_val.LanguageName}</ThemedText>
              </Pressable>
            ))}
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "#dee5cf",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  languageHeading : {
    color: "black",
    marginBottom: 50,
    fontSize: 50
  },
  languageText : {
    color: "black",
    marginBottom: 30
  }
});
