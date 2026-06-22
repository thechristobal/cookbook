import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, BarlowCondensed_400Regular, BarlowCondensed_600SemiBold, BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { RecipeProvider } from './src/contexts/RecipeContext';
import AppNavigator from './src/navigation';

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cb-shimmer {
      0%   { background-position: 250% center; }
      100% { background-position: -250% center; }
    }
    @keyframes cb-pulse {
      0%, 100% { opacity: 0.7; }
      50%       { opacity: 1; }
    }
    * { -webkit-tap-highlight-color: transparent; }
    input, textarea { outline: none; }
    input:focus, textarea:focus {
      box-shadow: 0 0 0 3px rgba(212,98,42,0.22);
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  const [fontsLoaded] = useFonts({
    BarlowCondensed_400Regular,
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <RecipeProvider>
              <AppNavigator />
            </RecipeProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
