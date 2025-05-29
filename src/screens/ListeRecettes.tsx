import React, { useEffect, useState } from 'react';
import {
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Button,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ListeRecettes'>;

interface Recettes {
  id: string;
  titre: string;
  imageUrl: string;
}

export default function ListeRecettes({ navigation }: Props) {
  const [recettes, setRecettes] = useState<Recettes[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'recettes'), snapshot => {
      const data: Recettes[] = snapshot.docs.map(doc => {
        const d = doc.data();
        console.log('Doc data:', d);
        return {
          id: doc.id,
          titre: d.titre || 'Titre inconnu',
          imageUrl: d.image || d['image '] || '', // image par défaut
        };
      });
      console.log('Liste des recettes:', data);
      setRecettes(data);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }: { item: Recettes }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailRecette', { recetteId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{item.titre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={recettes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Ajouter une recette"
          onPress={() => navigation.navigate('AjoutRecette')}
          color="#4CAF50"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    height: 150,
    width: '100%',
  },
  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
});
