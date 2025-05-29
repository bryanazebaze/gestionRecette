import React, { useEffect, useState } from 'react';
import { Text, Image, ScrollView, StyleSheet, Alert, Button, View } from 'react-native';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailRecette'>;

interface Recettes {
  titre: string;
  imageUrl: string;
  ingredient: string[];
  etapesDeCuisson: string[];
  tempsCuisson: number;
  portions: number;
  categorie: string;
  dateCreation: any;
}

export default function DetailRecette({ route, navigation }: Props) {
  const { recetteId } = route.params;
  const [recette, setRecette] = useState<Recettes | null>(null);

  useEffect(() => {
    const fetchRecette = async () => {
      const docRef = doc(db, 'recettes', recetteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        const recette: Recettes = {
          titre: data.titre,
          imageUrl: data.image || data['image '],
          ingredient: data.ingredient,
          etapesDeCuisson: data['etapes de cuisson'],
          tempsCuisson: Number(data['temps de cuisson']),
          portions: Number(data.portion),
          categorie: data.categorie,
          dateCreation: data['date de creation'],
        };

        setRecette(recette);
      }
    };
    fetchRecette();
  }, [recetteId]);

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'recettes', recetteId));
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      Alert.alert("Erreur", "La suppression a échoué. Réessaie.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirmation",
      "Es-tu sûr de vouloir supprimer cette recette ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: handleDelete,
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('ModifierRecette', { recetteId }); // ✅ navigation vers l'écran de modification
  };

  if (!recette) {
    return <Text style={styles.loading}>Chargement...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: recette.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{recette.titre}</Text>
      <Text style={styles.label}>Catégorie : {recette.categorie}</Text>
      <Text style={styles.label}>Temps de cuisson : {recette.tempsCuisson} min</Text>
      <Text style={styles.label}>Portions : {recette.portions}</Text>
      <Text style={styles.section}>Ingrédients :</Text>
      {recette.ingredient.map((item, index) => (
        <Text key={index} style={styles.text}>• {item}</Text>
      ))}
      <Text style={styles.section}>Étapes de cuisson :</Text>
      {recette.etapesDeCuisson.map((etape, index) => (
        <Text key={index} style={styles.text}>{index + 1}. {etape}</Text>
      ))}
      <Text style={styles.date}>
        Créée le : {recette.dateCreation?.toDate ? recette.dateCreation.toDate().toLocaleDateString() : new Date(recette.dateCreation).toLocaleDateString()}
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Modifier la recette" onPress={handleEdit} color="#1976D2" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Supprimer cette recette" onPress={confirmDelete} color="#E53935" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loading: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 2,
    color: '#333',
  },
  section: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 3,
  },
  date: {
    marginTop: 15,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
  },
  buttonContainer: {
    marginVertical: 8,
  },
});
