import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator, useWindowDimensions, Pressable } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';

export default function QuestionView ({ languageLevel, cameraPassThrough, question, result, onNext, answerCorrect }) {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    return (
        <View style={styles.indexContainer}>
            {question ? 
                <>
                  <View style={styles.topBar}> 
                      <Pressable 
                          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
                          onPress={() => router.replace('/dashboard')}
                      > 
                          <Text style={styles.heroTitle}>{"<"}  Level {languageLevel}</Text> 
                      </Pressable>
                  </View>

                  <ScrollView contentContainerStyle={[
                      styles.questionContainer, 
                      isLandscape && styles.landscapeContainer
                  ]}> 
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.questionText}>{question.QuestionText}</Text> 
                      <Image 
                        style={[styles.questionImage, isLandscape && styles.landscapeImage]} 
                        source={{ uri: question.QuestionImage }}
                      /> 
                    </View>
                    
                    {result === null || result === "No text detected" ? ( 
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            {result === "No text detected" &&
                                <Text style={styles.questionText}>No text was detected. Try Again</Text>
                            }
                            <Pressable 
                                style={({ pressed }) => [
                                    styles.cameraButton,
                                    pressed && { transform: [{ scale: 0.92 }], opacity: 0.8 }
                                ]} 
                                onPress={() => cameraPassThrough(true)}
                            > 
                              <Entypo name="camera" size={50} color="black" /> 
                            </Pressable>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.questionText}>{answerCorrect ? "Correct ✔️" : "Incorrect ❌"}</Text>
                            <Text style={styles.questionText}>Possible Answer(s):</Text> 
                            {question.QuestionAnswers?.map((answer, index) => ( 
                                <Text key={index} style={styles.questionText}>{answer}</Text>
                            ))}

                            <Pressable 
                                style={({ pressed }) => [
                                    styles.nextButton,
                                    pressed && { transform: [{ scale: 0.95 }], opacity: 0.8 }
                                ]} 
                                onPress={onNext}
                            >
                                <Text style={styles.nextButtonText}>Next Question</Text>
                            </Pressable>
                        </View>
                    )}
                  </ScrollView>
                </>
                :
                <View style={styles.loadingContainer}> 
                    <ActivityIndicator style={{marginBottom: 50}} size={200} color="black" /> 
                    <Text style={{fontWeight:'700', fontSize: 30}}>Getting Question</Text> 
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    indexContainer : {
      flex: 1,
    },
    topBar : {
      width: '100%',
      height: 90,
      backgroundColor: '#a5af8c',
      paddingTop: 20,
      paddingLeft: 30,
      borderColor: 'black',
      borderBottomWidth: 7,
      flexDirection: 'row',
      alignItems: 'center',
    },
    heroTitle : {
      fontWeight: 'bold',
      fontSize: 26
    },
    questionContainer : {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        flexDirection: 'column',
    },
    landscapeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    cameraButton : {
        width: 110,
        height: 110,
        borderWidth: 8,
        borderRadius: 150,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#c8d7a2"
    },
    questionText : {
        textAlign: "center",
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15
    },
    questionImage : {
        width: 250,
        height: 250,
        marginBottom: 20,
        borderRadius: 20,
        borderWidth: 6,
        borderColor: 'black'
    },
    landscapeImage: {
        width: 180,
        height: 180,
        marginBottom: 0,
    },
    loadingContainer : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    nextButton: {
      backgroundColor: '#a5af8c',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: 'black',
      marginTop: 10,
    },
    nextButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
    }
});