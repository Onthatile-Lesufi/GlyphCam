import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from 'expo-router';
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
    const [ errorMessage, setErrorMessage ] = useState("");

    async function AuthButtonPressed() {
        setErrorMessage("");

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        try {
            if (loginMode) {
                await signInWithEmailAndPassword(auth, email.trim(), password);
                router.replace("/(tabs)/dashboard");
            } else {
                await createUserWithEmailAndPassword(auth, email.trim(), password);
                router.replace("../onboardingModal");
            }
        } catch (error: any) {
            console.log(error);
            
            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setErrorMessage("Incorrect email or password.");
                    break;
                case 'auth/email-already-in-use':
                    setErrorMessage("An account with this email already exists.");
                    break;
                case 'auth/invalid-email':
                    setErrorMessage("Please enter a valid email address.");
                    break;
                case 'auth/weak-password':
                    setErrorMessage("Password must be at least 6 characters.");
                    break;
                default:
                    setErrorMessage("Authentication failed. Please try again.");
            }
        }
    }

    const toggleAuthMode = () => {
        setErrorMessage("");
        setLoginMode(prev => !prev);
    };

    return (
        <View style={styles.authContainer}>
            <View style={styles.card}>
                <Text style={styles.titleText}>
                    {loginMode ? "Login" : "Sign Up"}
                </Text>

                {errorMessage ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                ) : null}

                <TextInput
                    placeholder="email..."
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={t => setEmail(t)}
                />

                <TextInput
                    placeholder="password..."
                    style={styles.textInput}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={t => setPassword(t)}
                />

                <Pressable 
                    style={({ pressed }) => [
                        styles.authButton, 
                        pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] }
                    ]} 
                    onPress={AuthButtonPressed}
                >
                    <Text style={styles.buttonText}>
                        {loginMode ? "Login" : "Sign Up"}
                    </Text>
                </Pressable>

                <Pressable onPress={toggleAuthMode} style={styles.togglePressable}>
                    <Text style={styles.toggleText}>
                        {loginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    authContainer : {
        flex: 1,
        backgroundColor: '#dee5cf',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25
    },
    card: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    errorBox: {
        width: '100%',
        backgroundColor: '#ffb3b3',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    errorText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
    },
    textInput : {
        width: '100%',
        height: 55,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: 'black',
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        fontSize: 16,
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
        marginTop: 15,
        marginBottom: 20,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    togglePressable: {
        padding: 5,
    },
    toggleText: {
        fontSize: 15,
        fontWeight: '600',
        textDecorationLine: 'underline',
    }
});