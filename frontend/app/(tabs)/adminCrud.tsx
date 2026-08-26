import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable, Alert, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { db } from '../../scripts/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

type LanguageItem = {
  id: string;
  LanguageId: number;
  LanguageName: string;
};

type QuestionItem = {
  id: string;
  LanguageId: number;
  QuestionLevel: number;
  QuestionText: string;
  QuestionImage: string;
  QuestionAnswers: string[];
};

export default function AdminCrud() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [activeTab, setActiveTab] = useState<'languages' | 'questions'>('languages');
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [editingLangId, setEditingLangId] = useState<string | null>(null);
  const [langNumId, setLangNumId] = useState('');
  const [langName, setLangName] = useState('');
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [qLangId, setQLangId] = useState('');
  const [qLevel, setQLevel] = useState('');
  const [qText, setQText] = useState('');
  const [qImage, setQImage] = useState('');
  const [qAnswers, setQAnswers] = useState('');

  useEffect(() => {
    const qLang = query(collection(db, "Language"), orderBy("LanguageId", "asc"));
    const unsubLang = onSnapshot(qLang, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as LanguageItem[];
      setLanguages(list);
    });

    const qQuest = query(collection(db, "LanguageQuestion"), orderBy("QuestionLevel", "asc"));
    const unsubQuest = onSnapshot(qQuest, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuestionItem[];
      setQuestions(list);
    });

    return () => {
      unsubLang();
      unsubQuest();
    };
  }, []);

  const handleSaveLanguage = async () => {
    if (!langNumId.trim() || !langName.trim()) {
      Alert.alert("Error", "Please fill in all language fields.");
      return;
    }

    const payload = {
      LanguageId: Number(langNumId),
      LanguageName: langName.trim(),
    };

    try {
      if (editingLangId) {
        await updateDoc(doc(db, "Language", editingLangId), payload);
        setEditingLangId(null);
      } else {
        await addDoc(collection(db, "Language"), payload);
      }
      setLangNumId('');
      setLangName('');
    } catch (err: any) {
      Alert.alert("Save Failed", err.message);
    }
  };

  const handleEditLanguage = (item: LanguageItem) => {
    setEditingLangId(item.id);
    setLangNumId(item.LanguageId.toString());
    setLangName(item.LanguageName);
  };

  const handleDeleteLanguage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Language", id));
    } catch (err: any) {
      Alert.alert("Delete Failed", err.message);
    }
  };

  const handleSaveQuestion = async () => {
    if (!qLangId.trim() || !qLevel.trim() || !qText.trim() || !qAnswers.trim()) {
      Alert.alert("Error", "Please fill in Language ID, Level, Text, and Answers.");
      return;
    }

    const answersArray = qAnswers.split(',').map(ans => ans.trim()).filter(Boolean);

    const payload = {
      LanguageId: Number(qLangId),
      QuestionLevel: Number(qLevel),
      QuestionText: qText.trim(),
      QuestionImage: qImage.trim(),
      QuestionAnswers: answersArray,
    };

    try {
      if (editingQId) {
        await updateDoc(doc(db, "LanguageQuestion", editingQId), payload);
        setEditingQId(null);
      } else {
        await addDoc(collection(db, "LanguageQuestion"), payload);
      }
      setQLangId('');
      setQLevel('');
      setQText('');
      setQImage('');
      setQAnswers('');
    } catch (err: any) {
      Alert.alert("Save Failed", err.message);
    }
  };

  const handleEditQuestion = (item: QuestionItem) => {
    setEditingQId(item.id);
    setQLangId(item.LanguageId.toString());
    setQLevel(item.QuestionLevel.toString());
    setQText(item.QuestionText);
    setQImage(item.QuestionImage || '');
    setQAnswers(item.QuestionAnswers?.join(', ') || '');
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "LanguageQuestion", id));
    } catch (err: any) {
      Alert.alert("Delete Failed", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable 
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          onPress={() => router.replace('/dashboard')}
        >
          <Text style={styles.backButton}>{"<"} Dashboard</Text>
        </Pressable>
        <Text style={styles.title}>Data Admin</Text>
      </View>

      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tabButton, activeTab === 'languages' && styles.activeTab]} 
          onPress={() => setActiveTab('languages')}
        >
          <Text style={styles.tabText}>Languages ({languages.length})</Text>
        </Pressable>
        <Pressable 
          style={[styles.tabButton, activeTab === 'questions' && styles.activeTab]} 
          onPress={() => setActiveTab('questions')}
        >
          <Text style={styles.tabText}>Questions ({questions.length})</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, isLandscape && styles.landscapeContent]}>
        {activeTab === 'languages' ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{editingLangId ? "Edit Language" : "Add New Language"}</Text>
              <TextInput 
                placeholder="Language ID (Number, e.g. 1)" 
                style={styles.input}
                keyboardType="numeric"
                value={langNumId}
                onChangeText={setLangNumId}
              />
              <TextInput 
                placeholder="Language Name (e.g. Spanish)" 
                style={styles.input}
                value={langName}
                onChangeText={setLangName}
              />
              <Pressable 
                style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.8 }]} 
                onPress={handleSaveLanguage}
              >
                <Text style={styles.btnText}>{editingLangId ? "Update Language" : "+ Add Language"}</Text>
              </Pressable>
            </View>

            {languages.map(item => (
              <View key={item.id} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.LanguageName}</Text>
                  <Text style={styles.itemSubtitle}>ID: {item.LanguageId}</Text>
                </View>
                <Pressable style={styles.editBtn} onPress={() => handleEditLanguage(item)}>
                  <Text style={styles.btnTextSm}>Edit</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => handleDeleteLanguage(item.id)}>
                  <Text style={styles.btnTextSm}>Delete</Text>
                </Pressable>
              </View>
            ))}
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{editingQId ? "Edit Question" : "Add New Question"}</Text>
              <TextInput 
                placeholder="Language ID (Number)" 
                style={styles.input}
                keyboardType="numeric"
                value={qLangId}
                onChangeText={setQLangId}
              />
              <TextInput 
                placeholder="Question Level (Number)" 
                style={styles.input}
                keyboardType="numeric"
                value={qLevel}
                onChangeText={setQLevel}
              />
              <TextInput 
                placeholder="Question Prompt / Text" 
                style={styles.input}
                value={qText}
                onChangeText={setQText}
              />
              <TextInput 
                placeholder="Image URL (Optional Direct Link)" 
                style={styles.input}
                value={qImage}
                onChangeText={setQImage}
              />
              <TextInput 
                placeholder="Answers (comma separated: apple, manana)" 
                style={styles.input}
                value={qAnswers}
                onChangeText={setQAnswers}
              />
              <Pressable 
                style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.8 }]} 
                onPress={handleSaveQuestion}
              >
                <Text style={styles.btnText}>{editingQId ? "Update Question" : "+ Add Question"}</Text>
              </Pressable>
            </View>

            {questions.map(item => (
              <View key={item.id} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>Lvl {item.QuestionLevel}: {item.QuestionText}</Text>
                  <Text style={styles.itemSubtitle}>Lang ID: {item.LanguageId} | Answers: {item.QuestionAnswers?.join(', ')}</Text>
                </View>
                <Pressable style={styles.editBtn} onPress={() => handleEditQuestion(item)}>
                  <Text style={styles.btnTextSm}>Edit</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => handleDeleteQuestion(item.id)}>
                  <Text style={styles.btnTextSm}>Delete</Text>
                </Pressable>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dee5cf',
  },
  topBar: {
    height: 90,
    backgroundColor: '#a5af8c',
    paddingTop: 35,
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 4,
    borderColor: 'black',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#c8d7a2',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#dee5cf',
    borderBottomWidth: 4,
    borderBottomColor: '#00ff55',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    padding: 15,
  },
  landscapeContent: {
    paddingHorizontal: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 48,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
    fontSize: 15,
  },
  actionBtn: {
    backgroundColor: '#00ff55',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItem: {
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: '#a5af8c',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  deleteBtn: {
    backgroundColor: '#ff6b6b',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  btnTextSm: {
    fontWeight: 'bold',
    fontSize: 13,
  },
});