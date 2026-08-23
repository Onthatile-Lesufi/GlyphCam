import { CameraView, useCameraPermissions, CameraFacing } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View, Text, ScrollView, Button, Image } from 'react-native';
import { LevelCard } from '@/components/levelCard';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';


export default function Question() {
  // 1. Destructure the hook array properly
  const [permission, requestPermission] = useCameraPermissions();
  const [ useFlash, setUseFlash ] = useState(false);
  const [ camOrientation, setCamOrientation ] = useState<CameraFacing>('back');
  const [ cameraFocus, setCameraFocus ] =  useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { languageLevel } = useLocalSearchParams(); 

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
      try {
        // 1. Compress image quality (0.4 keeps file size under the 1 MB limit)
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.4 });
        if (!photo?.uri) return;

        // 2. Package as binary FormData (more reliable than base64 in RN)
        const formData = new FormData();
        formData.append('file', {
          uri: photo.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);

        formData.append('language', 'eng');
        formData.append('scale', 'true'); // Auto-scales for better visibility
        formData.append('OCREngine', '2'); // Engine 2 handles photo/camera text better than Engine 1

        // 3. Make API call
        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: {
            apikey: 'helloworld', // Replace with your key from ocr.space/ocrapi
          },
          body: formData,
        });

        const data = await response.json();

        // Debugging check: Check if API returned an error message
        if (data.IsErroredOnProcessing) {
          console.error('OCR.space Error:', data.ErrorMessage);
          return;
        }

        const text = data?.ParsedResults?.[0]?.ParsedText ?? '';

        if (!text.trim()) {
          console.log('No text detected. Try holding the camera closer or improving lighting.');
        } else {
          console.log('Text Recognised:', text);
        }

        setCameraFocus(false);
      } catch (error) {
        console.error('Fetch Error:', error);
      }
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
              <Pressable onPress={() => router.replace('/(tabs)/dashboard')}>
                  <Text style={styles.heroTitle}>{"<"}  Level {languageLevel}</Text>
              </Pressable>
              <View style={styles.accountBubble}>
                  <Pressable>
                  </Pressable>
              </View>
          </View>
          <View style={styles.questionContainer}>
            <View>
              <Text style={styles.questionText}>What is this item?</Text>
              {/* <Image style={styles.questionImage} source={{uri: 'https://en.wikipedia.org/wiki/File:Image_created_with_a_mobile_phone.png'}}/> */}
              <Image style={styles.questionImage} source={require('../../assets/images/icon.png')}/>
            </View>
            <View>
              <Text style={styles.questionText}>Answer:</Text>
              <Text style={styles.questionText}>Pepe</Text>
            </View>
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
      marginBottom: 35,
      borderRadius: 20,
      borderWidth: 7,
      borderColor: 'black'
    }
});