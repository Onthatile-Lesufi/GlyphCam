import { useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Button, Image } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { auth, db, storage } from "../../scripts/firebase";
import { collection, addDoc, updateDoc, doc, getDocs, onSnapshot, query, orderBy, where } from "firebase/firestore";
import QuestionCamera from "../../components/questionCamera";
import QuestionView from "../../components/questionView";

export default function Question() {
  const [ permission, requestPermission ] = useCameraPermissions();
  const [ cameraFocus, setCameraFocus ] = useState(false);
  const [ answerCorrect, setAnswerCorrect ] = useState(false);
  const [ questions, setQuestions ] = useState<{ id: string, QuestionAnswers: string[] }[]>([]);
  const [ question, setQuestion ] = useState<{ id: string, QuestionAnswers: string[] } | null>(null);
  const { languageLevel } = useLocalSearchParams(); 
  const [ result, setResult ] = useState<string | null>(null);

  const NewQuestion = () => {
    setResult(null);
    setCameraFocus(false);
    if (questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setQuestion(questions[randomIndex]);
    }
  };

  const LoadQuestions = () => {
    const _level = Number.parseInt(Array.isArray(languageLevel) ? languageLevel[0] : languageLevel);
    const q = query(collection(db, "LanguageQuestion"), where("QuestionLevel", "==", _level), orderBy("QuestionLevel", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as { id: string, QuestionAnswers: string[] }[];
      setQuestions(list);
    });
    return unsubscribe;
  }

  useEffect(() => {
    return LoadQuestions();
  }, [languageLevel]);

  useFocusEffect(
    useCallback(() => {
      NewQuestion(); 
    }, [questions])
  );

  if (!permission) {
    return <View style={styles.indexContainer} />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  async function OnPictureCapture (image: string) {
    setCameraFocus(false);

    const formData = new FormData();
    formData.append('file', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    formData.append('language', 'eng');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: { apikey: 'helloworld' },
      body: formData,
    });

    const data = await response.json();

    if (data.IsErroredOnProcessing) {
      console.error('OCR.space Error:', data.ErrorMessage);
      return;
    }
    
    const text = data?.ParsedResults?.[0]?.ParsedText ?? '';

    let _correct = false;
    question?.QuestionAnswers?.forEach(answer => {
      if (!_correct) _correct = text.toLowerCase().includes(answer.toLowerCase());
    });

    setResult(text.trim() ? text : 'No text detected');
    setAnswerCorrect(_correct);

    if (text.trim() && auth.currentUser?.uid && question?.id) {
      const qAnswers = query(
        collection(db, "QuestionAnswers"),
        where("UserId", "==", auth.currentUser.uid),
        where("QuestionId", "==", question.id)
      );
      
      const snapshot = await getDocs(qAnswers);

      if (!snapshot.empty) {
        const _existingDocId = snapshot.docs[0].id;
        await updateDoc(doc(db, "QuestionAnswers", _existingDocId), {
          IsCorrect: _correct
        });
      } else {
        await addDoc(collection(db, "QuestionAnswers"), {
          UserId: auth.currentUser.uid,
          QuestionId: question.id,
          IsCorrect: _correct
        });
      }
    }
  }

  return (
    <View style={styles.indexContainer}>
      {cameraFocus ?
        <QuestionCamera passThrough={OnPictureCapture}/>
      :
        <QuestionView 
          languageLevel={languageLevel} 
          cameraPassThrough={(k:boolean) => setCameraFocus(k)} 
          question={question} 
          result={result}
          onNext={NewQuestion}
          answerCorrect={answerCorrect}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
    indexContainer : {
      flex: 1,
      backgroundColor: '#dee5cf',
    }
});