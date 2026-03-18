import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/cart/CartContext';
import { UserProvider } from './src/utils/UserContext';
import { AlertProvider } from './src/utils/AlertContext';
import { FavouritesProvider } from './src/utils/FavouritesContext';
import { LanguageProvider } from './src/utils/LanguageContext';
import './global.css';

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#333333',
    primary: '#1DB954',
    notification: '#1DB954',
  },
};

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaProvider>
        <LanguageProvider>
          <AlertProvider>
            <UserProvider>
              <CartProvider>
                <FavouritesProvider>
                  <NavigationContainer theme={DarkTheme}>
                    <AppNavigator />
                  </NavigationContainer>
                </FavouritesProvider>
              </CartProvider>
            </UserProvider>
          </AlertProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </View>
  );
}
