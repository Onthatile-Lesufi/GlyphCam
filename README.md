# GlyphCam

![Logo](frontend/assets\images\GlyphCam_Logo.png)

## Overview
GlyphCam is an OCR-based language learning app designed to test language skills in real-world environments. Users select a level, photograph text or objects using their device's camera, and receive instant feedback validated through text recognition.

<!-- ### <U>Planning</U> -->


### <U>Tech Stack</U>
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
#### React Native :
Used as the core framework for building native components, responsive layouts, and cross-platform UI views.
#### OCR :
Powered by the [OCR Space API](https://ocr.space/ocrapi) to process images captured by the app and automatically verify detected text against stored answers.
#### Firebase : 
Utilized for backend operations, including Firebase Authentication for user login/signup and Cloud Firestore for storing languages, level questions, user scores, and admin roles in real time.
#### Expo :
Leveraged for native API integrations, using expo-camera for real-time camera controls and expo-router for file-based route navigation.

On top of that Expo was also leveraged for the use of Expo Go as a high efficient development grounds.

## Contributors and Acknowledgements
![StackOverflow](https://img.shields.io/badge/Stack_Overflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
### Contributors
- Tsungai Katsuro - https://github.com/TsungaiKats
### Acknowledgements
- The structure of the app was dictated by my teacher, [Tsungai Katsuro](https://github.com/TsungaiKats) 
- Stack Overflow and Google Gemini were great helps for the debugging process