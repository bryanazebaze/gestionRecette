import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, ScrollView, StyleSheet, Button, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ModifierRecette'>;

export default function ModifierRecette({ route, navigation }: Props) {
  const { recetteId } = route.params;
  const [titre, setTitre] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categorie, setCategorie] = useState('');
  const [tempsCuisson, setTempsCuisson] = useState('');
  const [portions, setPortions] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [etapes, setEtapes] = useState('');

  useEffect(() => {
    const chargerRecette = async () => {
      const docRef = doc(db, 'recettes', recetteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitre(data.titre);
        setImageUrl(data.image || data['image ']);
        setCategorie(data.categorie);
        setTempsCuisson(String(data['temps de cuisson']));
        setPortions(String(data.portion));
        setIngredient(data.ingredient.join('\n'));
        setEtapes(data['etapes de cuisson'].join('\n'));
      } else {
        Alert.alert('Erreur', 'Recette introuvable.');
        navigation.goBack();
      }
    };

    chargerRecette();
  }, [recetteId, navigation]);

  const handleUpdate = async () => {
    if (!titre || !categorie || !tempsCuisson || !portions) {
      Alert.alert('Erreur', 'Merci de remplir tous les champs obligatoires.');
      return;
    }

    try {
      const docRef = doc(db, 'recettes', recetteId);
      await updateDoc(docRef, {
        titre,
        image: imageUrl,
        categorie,
        'temps de cuisson': Number(tempsCuisson),
        portion: Number(portions),
        ingredient: ingredient.split('\n').map(item => item.trim()).filter(item => item),
        'etapes de cuisson': etapes.split('\n').map(item => item.trim()).filter(item => item),
      });

      Alert.alert('Succès', 'Recette mise à jour avec succès.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Titre *</Text>
      <TextInput style={styles.input} value={titre} onChangeText={setTitre} />

      <Text style={styles.label}>Image (URL)</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />

      <Text style={styles.label}>Catégorie *</Text>
      <TextInput style={styles.input} value={categorie} onChangeText={setCategorie} />

      <Text style={styles.label}>Temps de cuisson (min) *</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={tempsCuisson} onChangeText={setTempsCuisson} />

      <Text style={styles.label}>Portions *</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={portions} onChangeText={setPortions} />

      <Text style={styles.label}>Ingrédients (un par ligne)</Text>
      <TextInput style={styles.inputMultiline} multiline value={ingredient} onChangeText={setIngredient} />

      <Text style={styles.label}>Étapes de cuisson (une par ligne)</Text>
      <TextInput style={styles.inputMultiline} multiline value={etapes} onChangeText={setEtapes} />

      <View style={styles.buttonContainer}>
        <Button title="Enregistrer les modifications" onPress={handleUpdate} color="#1976D2" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    height: 100,
    marginTop: 4,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
