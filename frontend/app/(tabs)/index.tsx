import { Platform, Pressable, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.indexContainer}>
      <View style={styles.indexBackground}>
        <View style={styles.indexForeground}>
          <Text style={styles.heroTitle}>GlyphCam</Text>
          <Pressable style={styles.startButton} onPress={() => router.replace('/userAuth')}>
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indexContainer: {
    flex: 1,
    backgroundColor: '#dee5cf',
  },
  indexBackground: {
    top: 0,
    left: 0,
    right: 0, // Spans full width when absolutely positioned
    height: 550,
    backgroundColor: '#afc18b',
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderLeftWidth: 10,
    borderColor: 'black',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100
  },
  indexForeground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 100,
  },
  heroTitle: {
    fontWeight: 'bold',
    marginBottom: 30,
    fontSize: 45,
  },
  startButton: {
    height: 60,
    width: 140,
    backgroundColor: '#00ff55',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderRadius: 10,
    borderColor: 'black',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
});