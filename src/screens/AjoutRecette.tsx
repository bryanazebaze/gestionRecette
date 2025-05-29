import 'react-native-get-random-values';
import React, { useState } from 'react';
import {
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  Image,
} from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import RNFS from 'react-native-fs'; // ✅ Ajouté

type Props = NativeStackScreenProps<RootStackParamList, 'AjoutRecette'>;

export default function AjouterRecette({ navigation }: Props) {
  const [titre, setTitre] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [categorie, setCategorie] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [etapes, setEtapes] = useState('');
  const [tempsCuisson, setTempsCuisson] = useState('');
  const [portion, setPortion] = useState('');

  const choisirImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.5,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('Sélection annulée');
      } else if (response.errorCode) {
        console.error('Erreur image :', response.errorMessage);
        Alert.alert('Erreur', 'Impossible de sélectionner l’image.');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          try {
            const base64Image = await RNFS.readFile(uri, 'base64');
            const imageData = `data:image/jpeg;base64,${base64Image}`;
            setImageUri(imageData);
          } catch (err) {
            console.error('Erreur base64 :', err);
            Alert.alert('Erreur', 'Impossible de lire l’image.');
          }
        }
      }
    });
  };

  const handleAjouter = async () => {
    if (!titre || !imageUri || !categorie || !ingredient || !etapes || !tempsCuisson || !portion) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    try {
      await addDoc(collection(db, 'recettes'), {
        titre,
        image: imageUri, // ✅ Base64 ici
        categorie,
        ingredient: ingredient.split(',').map(i => i.trim()),
        ['etapes de cuisson']: etapes.split(',').map(e => e.trim()),
        ['temps de cuisson']: Number(tempsCuisson),
        portion: Number(portion),
        ['date de creation']: serverTimestamp(),
      });

      Alert.alert('Succès', 'Recette ajoutée avec succès');
      setTitre('');
      setImageUri(null);
      setCategorie('');
      setIngredient('');
      setEtapes('');
      setTempsCuisson('');
      setPortion('');

      navigation.navigate('ListeRecettes');
    } catch (error) {
      console.error('Erreur ajout recette :', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Titre</Text>
      <TextInput style={styles.input} value={titre} onChangeText={setTitre} />

      <Text style={styles.label}>Image</Text>
      <Button title="Choisir une image" onPress={choisirImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Text style={styles.label}>Catégorie</Text>
      <TextInput style={styles.input} value={categorie} onChangeText={setCategorie} />

      <Text style={styles.label}>Ingrédients (séparés par virgule)</Text>
      <TextInput style={styles.input} value={ingredient} onChangeText={setIngredient} />

      <Text style={styles.label}>Étapes de cuisson (séparées par virgule)</Text>
      <TextInput style={styles.input} value={etapes} onChangeText={setEtapes} />

      <Text style={styles.label}>Temps de cuisson (en minutes)</Text>
      <TextInput
        style={styles.input}
        value={tempsCuisson}
        onChangeText={setTempsCuisson}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Portions</Text>
      <TextInput
        style={styles.input}
        value={portion}
        onChangeText={setPortion}
        keyboardType="numeric"
      />

      <Button title="Ajouter la recette" onPress={handleAjouter} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
});
