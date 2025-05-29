import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListeRecettes from '../screens/ListeRecettes';
import DetailRecette from '../screens/DetailRecette';
import AjoutRecette from '../screens/AjoutRecette';
import ModifierRecette from '../screens/ModifierRecette';

export type RootStackParamList = {
  ListeRecettes: undefined;
  DetailRecette: { recetteId: string };
  AjoutRecette: undefined;
   ModifierRecette: { recetteId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListeRecettes">
        <Stack.Screen name="ListeRecettes" component={ListeRecettes} />
        <Stack.Screen name="DetailRecette" component={DetailRecette} />
        <Stack.Screen name="AjoutRecette" component={AjoutRecette} options={{ title: 'Ajouter une recette' }} />
        <Stack.Screen name="ModifierRecette" component={ModifierRecette} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
