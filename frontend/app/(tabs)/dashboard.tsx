import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, Text, ScrollView } from 'react-native';
import { LevelCard } from '@/components/levelCard';
import { auth, db } from "../../scripts/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Link, useLocalSearchParams } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';

export default function HomeScreen() {
  const [ language, setLanguage ] = useState<{id:string, LanguageId:number, LanguageName:string} | null>(null);
  const [ languages, setLanguages ] = useState<{ id: string, LanguageName: string }[]>([]);
  const [ questions, setQuestions ] = useState<{ id: string, LanguageId: number, QuestionLevel: number }[]>([]);
  const [ languageLevels, setLanguageLevels ] = useState<number[]>([]);
  const [ languageProgress, setLanguageProgress ] = useState<Record<number, number>>({});
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false)
  const { id } = useLocalSearchParams(); 

  function QueryAdmin() {
    const q = query(collection(db, "Admin"), where("UserId", "==", auth.currentUser?.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIsAdmin(snapshot.docs.length > 0);
    });
    return unsubscribe;
  }

  function QueryQuestions() {
    const q = query(collection(db, "LanguageQuestion"), where("LanguageId", "==", language?.LanguageId));
    const _unique = new Set<number>();
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as { id: string, LanguageId: number, QuestionLevel: number }[];

      snapshot.docs.forEach(doc => {
        _unique.add(doc.data().QuestionLevel);
      });
      
      setLanguageLevels(Array.from(_unique));
      setQuestions(list);
    });
    return unsubscribe;
  }

  function QueryQuestionProgress() {
    if (auth.currentUser === null) return;
    const q = query(collection(db, "QuestionAnswers"), where("UserId", "==", auth.currentUser?.uid));
    let _level: {level: number, sum: number, count: number}[] = [];
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach(doc => {
        let _question = questions.find(question => question.id === doc.data().QuestionId);
        if (_question === undefined) return;

        let _temp = _level.find(progress => progress.level === _question.QuestionLevel);
        if (_temp !== undefined) {
          _temp.count++;
          _temp.sum += doc.data().IsCorrect ? 1 : -1;
        } else {
          _level.push({
            count: 1,
            sum: doc.data().IsCorrect ? 1 : 0,
            level: _question.QuestionLevel
          });
        }
      });
      
      let _progressObj: Record<number, number> = {};
      _level.forEach(level => {
        _progressObj[level.level] = 100 - (Math.floor(level.sum / level.count * 100));
      });
      setLanguageProgress(_progressObj);
    });
    return unsubscribe;
  }

  function QueryLanguages(id: number) {
    const q = query(collection(db, "Language"), where("LanguageId", "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as {id:string, LanguageId:number, LanguageName:string}[];
      
      setLanguage(list[0]);
    });
    return unsubscribe;
  }

  useEffect(() => {
    QueryAdmin();
  }, [])

  useEffect (() => {
    return QueryQuestionProgress();
  }, [languageLevels, questions]);

  useEffect (() => {
    if (id === undefined && language !== null) return;
    let _i = id?.toString() || 0;
    return QueryLanguages(Number.parseInt(_i));
  }, [id]);

  useEffect (() => {
    if (language === null) return;
    return QueryQuestions();
  }, [language]);

  return (
    <View style={styles.indexContainer}>
      <View style={styles.topBar}>
        <Link href="/languageModal">
          <Text style={styles.heroTitle}>{language?.LanguageName} ▽</Text>
        </Link>
        {isAdmin?
          <Link href={"/adminCrud"}>
            <Octicons name="gear" size={45} color="black" />
          </Link>
          :
          <></>
        }
      </View>
      <ScrollView style={styles.cardContainer}>
        {languageLevels.map((_val, _i) => (
          <LevelCard key={_i} level={_val} progress={languageProgress[_val] ?? 100}/>
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
      borderRadius: 100,
      borderColor: 'black',
      borderWidth: 8,
    }, 
    cardContainer : {
      flexDirection: 'column' // Removed overflowY
    }
});