import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import backgroundImage from './assets/background.png';

SplashScreen.preventAutoHideAsync(); // Previne que a tela de splash desapareça automaticamente

export default function App() {
  const [profileImage, setProfileImage] = useState(null);

  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para usar a câmera.');
      }
    })();
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage !== null) {
        setProfileImage(storedImage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    // Solicita a permissão para usar a câmera, caso ainda não tenha sido concedida
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para usar a câmera.');
      return;
    }

    // Lança a câmera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // Verifica se a seleção foi cancelada ou se há um URI válido
    if (!result.canceled && result.uri) {
      const selectedImage = result.uri;
      setProfileImage(selectedImage);

      // Só tenta salvar no AsyncStorage se o URI for válido
      await AsyncStorage.setItem('profileImage', selectedImage);
    } else {
      console.log("Nenhuma imagem foi selecionada ou URI inválido.");
    }
  };

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync(); // Oculta a tela de splash após carregar as fontes
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Perfil</Text>
      </View>
      <View style={styles.belowHeaderContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color="white" />
          )}
        </TouchableOpacity>
        <View style={styles.ativoContainer}>
          <Ionicons name="ellipse" size={16} color="green" style={styles.ativoIcon} />
          <Text style={styles.ativo}>Ativo</Text>
        </View>
      </View>

      {/* Container dos Títulos e Subtítulos */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBlock}>
          <Text style={styles.title}>Nome:</Text>
          <Text style={styles.subtitle}>Juliana</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.title}>Email:</Text>
          <Text style={styles.subtitle}>Julianafeliz@gmail.com</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.title}>Telefone:</Text>
          <Text style={styles.subtitle}>+55 (11) 99999-9999</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.title}>Nome da criança:</Text>
          <Text style={styles.subtitle}>Samuel</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.titleSair}>Sair</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  header: {
    width: '100%',
    height: 90,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 35,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.3,
    elevation: 5,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: {
    position: 'absolute',
    left: 30,
    top: 42,
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    width: '100%',
    bottom: 5,
  },
  belowHeaderContainer: {
    backgroundColor: '#FFD942',
    height: 240,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    bottom: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ativoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
  },
  ativo: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  ativoIcon: {
    marginRight: 8,
  },
  profileImageContainer: {
    marginTop: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginLeft: 20,
  },
  infoBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#555',
    marginTop: 5,
  },
  titleSair: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#FF0000',
  },
});
