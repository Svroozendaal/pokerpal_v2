import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // General
      appName: 'PokerPal',
      tagline: 'Smart Poker Payout Calculator',
      
      // Meta descriptions
      homeMetaDesc: 'Free poker payout calculator for home games and tournaments. Instantly calculate poker winnings, track player stacks, and settle payments easily.',
      historyMetaDesc: 'View and manage your poker game history. Track all your games, results, and payouts in one place.',
      gameMetaDesc: 'Detailed poker game results and payouts. See player stacks, winnings, and settlement details.',
      adminMetaDesc: 'PokerPal admin dashboard. Manage games, users, and application settings.',

      // Navigation
      home: 'Home',
      history: 'History',
      account: 'Account',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',

      // Setup
      setupTitle: 'Game Setup',
      coinValue: 'Coin Value',
      buyInValue: 'Buy-in Value',
      gameTitle: 'Game Title',
      addPlayer: 'Add Player',

      // Results
      results: 'Results',
      totalPot: 'Total Pot',
      startingStack: 'Starting Stack',
      endingStack: 'Ending Stack',
      payouts: 'Payouts',
      
      // Actions
      calculate: 'Calculate',
      save: 'Save',
      share: 'Share',
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Confirm',

      // Messages
      loginRequired: 'Please log in to access this feature',
      saveSuccess: 'Game saved successfully',
      shareSuccess: 'Shared successfully',
      error: 'An error occurred',
    },
  },
  es: {
    translation: {
      // General
      appName: 'PokerPal',
      tagline: 'Calculadora Inteligente de Pagos de Póker',
      
      // Meta descriptions
      homeMetaDesc: 'Calculadora de póker gratuita para juegos en casa y torneos. Calcula ganancias, rastrea fichas y resuelve pagos al instante.',
      historyMetaDesc: 'Ver y gestionar tu historial de juegos de póker. Rastrea todos tus juegos, resultados y pagos en un solo lugar.',
      gameMetaDesc: 'Resultados detallados de juegos de póker y pagos. Ver fichas de jugadores, ganancias y detalles de liquidación.',
      adminMetaDesc: 'Panel de administración de PokerPal. Gestiona juegos, usuarios y configuración de la aplicación.',

      // Navigation
      home: 'Inicio',
      history: 'Historial',
      account: 'Cuenta',
      login: 'Iniciar Sesión',
      signup: 'Registrarse',
      logout: 'Cerrar Sesión',

      // Setup
      setupTitle: 'Configuración del Juego',
      coinValue: 'Valor de la Ficha',
      buyInValue: 'Valor de Entrada',
      gameTitle: 'Título del Juego',
      addPlayer: 'Añadir Jugador',

      // Results
      results: 'Resultados',
      totalPot: 'Bote Total',
      startingStack: 'Fichas Iniciales',
      endingStack: 'Fichas Finales',
      payouts: 'Pagos',
      
      // Actions
      calculate: 'Calcular',
      save: 'Guardar',
      share: 'Compartir',
      delete: 'Eliminar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',

      // Messages
      loginRequired: 'Por favor, inicia sesión para acceder a esta función',
      saveSuccess: 'Juego guardado correctamente',
      shareSuccess: 'Compartido correctamente',
      error: 'Ha ocurrido un error',
    },
  },
  // Add more languages as needed
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n; 