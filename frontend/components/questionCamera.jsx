import { CameraView, useCameraPermissions, CameraFacing } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View, Text, ScrollView, Button, Image } from 'react-native';
import { LevelCard } from '@/components/levelCard';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';

export default function QuestionCamera({passThrough}) {
    const [ useFlash, setUseFlash ] = useState(false);
    const [ camOrientation, setCamOrientation ] = useState('back');
    const cameraRef = useRef(null);

    const TakePicture = async () => {
      if (cameraRef.current) {
        try {
            // 1. Compress image quality (0.4 keeps file size under the 1 MB limit)
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.4 });
            if (!photo?.uri) return;

            passThrough(photo?.uri);
        } catch (error) {
            console.error('Fetch Error:', error);
        }
      }
    };

    return (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            facing={camOrientation}
            enableTorch={useFlash}
            mode="picture"
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cameraButtonContainer}>
            <Pressable style={styles.cameraFlashButton} onPress={() => setUseFlash(prev => !prev)}>
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
    )
}

const styles = StyleSheet.create({
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
      flex: 1,
      alignItems: 'center',
      padding: 20
    },
    cameraButton : {
      width: 125,
      height: 125,
      borderWidth: 10,
      borderRadius: 150,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      backgroundColor: "#c8d7a2"
    },
    questionText : {
      textAlign: "center",
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 25
    },
    questionImage : {
      width: 300,
      height: 300,
      resizeMode: 'center',
      marginBottom: 35,
      borderRadius: 20,
      borderWidth: 7,
      borderColor: 'black'
    }
});