import { CameraView, useCameraPermissions, CameraFacing } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View, Text, ScrollView, Button } from 'react-native';
import { LevelCard } from '@/components/levelCard';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { recognizeText } from '@dariyd/react-native-text-recognition';


export default function Question() {
  const [ language, setLanguage ] = useState("English");
  const [ languageLevels, setLanguageLevels ] = useState(10);
  // 1. Destructure the hook array properly
  const [permission, requestPermission] = useCameraPermissions();
  const [ useFlash, setUseFlash ] = useState(false);
  const [ camOrientation, setCamOrientation ] = useState<CameraFacing>('back');
  const [ cameraFocus, setCameraFocus ] =  useState(true);
  const cameraRef = useRef<CameraView>(null);

  // 2. Handle initial loading state
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

  const TakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo taken:', photo?.uri);
      setCameraFocus(false);
    }
  };

  return (
    <View style={styles.indexContainer}>
      {cameraFocus ?
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            facing={camOrientation}
            enableTorch={useFlash}
            mode="picture"
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cameraButtonContainer}>
            <Pressable style={styles.cameraFlashButton} onPress={() => setUseFlash(!useFlash)}>
              {useFlash ?
                <Ionicons name="flash" size={30} color="black" />
              :
                <Ionicons name="flash-outline" size={30} color="black" />
              }
            </Pressable>
            <Pressable style={styles.cameraFlipButton} onPress={() => setCamOrientation(camOrientation === 'back' ? 'front' : 'back')}>
              <Ionicons name="camera-reverse" size={30} color="black" />
            </Pressable>
            <Pressable style={styles.cameraShootButton} onPress={TakePicture}>
              <Entypo name="camera" size={50} color="black" />
            </Pressable>
          </View>
        </View>
      :
        <>
          <View style={styles.topBar}>
              <Pressable>
                  <Text style={styles.heroTitle}>{"<"} {language}</Text>
              </Pressable>
              <View style={styles.accountBubble}>
                  <Pressable>
                  </Pressable>
              </View>
          </View>
          <View style={styles.questionContainer}>
            <View></View>
            <Pressable style={styles.cameraButton} onPress={() => setCameraFocus(true)}>
              <Entypo name="camera" size={50} color="black" />
            </Pressable>
          </View>
        </>
      }
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
    cameraContainer : {
      flex: 1
    },
    cameraFlipButton : {
      width: 75,
      height: 75,
      backgroundColor: "#dee5cf",
      borderRadius: 100,
      borderWidth: 7,
      borderColor: 'Black',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: 65,
      left: 30
    },
    cameraButtonContainer : {
      flex: 1,
      padding: 55,
      paddingLeft: 30,
      position: 'relative',
    },
    cameraShootButton : {
      width: 120,
      height: 120,
      backgroundColor: "#dee5cf",
      borderRadius: 100,
      borderWidth: 7,
      borderColor: 'Black',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: 50,
    },
    cameraFlashButton : {
      width: 75,
      height: 75,
      backgroundColor: "#dee5cf",
      borderRadius: 100,
      borderWidth: 7,
      borderColor: 'Black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionContainer : {
      flex: 1
    },
    cameraButton : {
      width: 125,
      height: 125,
      borderWidth: 10,
      borderRadius: 150,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center'
    }
});