import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, router } from 'expo-router';
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../scripts/firebase";

export default function UserAuth() {
    const [ loginMode, setLoginMode ] = useState(true);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    async function AuthButtonPressed() {
        try {
            if (loginMode) {
              await signInWithEmailAndPassword(auth, email, password);
            } else {
              await createUserWithEmailAndPassword(auth, email, password);
            }
            router.replace("/(tabs)/dashboard");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.authContainer}>
            <TextInput
                placeholder="email..."
                style={styles.textInput}
                onChangeText={t => setEmail(t)}
            />
            <TextInput
                placeholder="password..."
                style={styles.textInput}
                onChangeText={t => setPassword(t)}
            />
            <Pressable style={styles.authButton} onPress={AuthButtonPressed}>
                <Text style={styles.buttonText}>
                    {loginMode ? "Login" : "Sign Up"}
                </Text>
            </Pressable>

            <Pressable onPress={() => setLoginMode(prev => !prev)}>
                <Text>
                    Don't have an account? Sign Up
                </Text>
            </Pressable>
            
        </View>
    )
}

const styles = StyleSheet.create({
    authContainer : {
        flex: 1,
        backgroundColor: '#dee5cf',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25
    },
    textInput : {
        width: '100%',
        height: 55,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: 'black',
        marginBottom: 15,
        paddingHorizontal: 10
    },
    authButton: {
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
    },
})