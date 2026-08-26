import { Pressable, StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={styles.indexContainer}>
      <View style={[
        styles.indexBackground, 
        isLandscape && styles.landscapeBackground
      ]}>
        <View style={[
          styles.indexForeground,
          isLandscape && styles.landscapeForeground
        ]}>
          <Text style={[
            styles.heroTitle,
            isLandscape && styles.landscapeTitle
          ]}>
            GlyphCam
          </Text>

          <Pressable 
            style={({ pressed }) => [
              styles.startButton,
              pressed && { transform: [{ scale: 0.94 }], opacity: 0.8 }
            ]} 
            onPress={() => router.replace('/userAuth')}
          >
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
    right: 0,
    height: 550,
    backgroundColor: '#afc18b',
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderLeftWidth: 10,
    borderColor: 'black',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  landscapeBackground: {
    height: '80%',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  indexForeground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 100,
  },
  landscapeForeground: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 40,
  },
  heroTitle: {
    fontWeight: 'bold',
    marginBottom: 30,
    fontSize: 45,
  },
  landscapeTitle: {
    marginBottom: 0,
    fontSize: 38,
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