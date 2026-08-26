import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { auth, db, storage } from "../scripts/firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

import { ThemedText } from '@/components/themed-text';

export default function OnboardingModal() {
  return(
      <View style={styles.container}>
            <ThemedText type="title" style={styles.languageHeading}>Welcome to Glyph</ThemedText>
            <Text style={styles.buttonText}>
                1. Choose a language{`\n`}{`\n`}
                2. Choose a level{`\n`}{`\n`}
                3. Learn start learning our suite of languages
            </Text>
            <Pressable style={styles.button} onPress={() => router.replace('/languageModal')}>
                <Text style={styles.buttonText}>
                    Start
                </Text>
            </Pressable>
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
        fontSize: 35
    },
    languageText : {
        color: "black",
        marginBottom: 30
    },
    button: {
        height: 60,
        width: 220,
        backgroundColor: '#00ff55',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderRadius: 10,
        borderColor: 'black',
        marginTop: 35,
        marginBottom: 15,
        textAlign: 'center'
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 22,
        textAlign: 'center'
    },
});
