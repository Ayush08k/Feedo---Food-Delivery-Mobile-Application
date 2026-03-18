import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@feedo_language';

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja';

export interface LanguageMeta {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
}

export const LANGUAGES: LanguageMeta[] = [
    { code: 'en', name: 'English',  nativeName: 'English',    flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi',    nativeName: 'हिन्दी',      flag: '🇮🇳' },
    { code: 'es', name: 'Spanish',  nativeName: 'Español',    flag: '🇪🇸' },
    { code: 'fr', name: 'French',   nativeName: 'Français',   flag: '🇫🇷' },
    { code: 'de', name: 'German',   nativeName: 'Deutsch',    flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語',       flag: '🇯🇵' },
];

// ─── All Translations ────────────────────────────────────────────────────────
const translations: Record<Language, Record<string, string>> = {
    en: {
        // General
        'app.deliverTo': 'Deliver to',
        'app.currentLocation': 'Current Location 📍',
        'app.searchPlaceholder': 'Search for food or restaurants...',
        'app.recentSearches': 'Recent Searches',
        'app.clearAll': 'Clear All',
        'app.remove': 'Remove',
        'app.order': 'Order',
        'app.back': '←',

        // Home Screen
        'home.offersForYou': 'Offers For You',
        'home.categories': 'Categories',
        'home.showMore': 'Show More',
        'home.topSellers': 'Top Sellers',
        'home.bestOffers': 'Best Offers',
        'home.seeAll': 'See All →',
        'home.popularRestaurants': 'Popular Restaurants',
        'home.browseAll': '🏪 Browse All Restaurants',
        'home.freeDelivery': 'Free Delivery',

        // Cart Screen
        'cart.title': 'Your Cart',
        'cart.empty': 'Your cart is empty',
        'cart.browseRestaurants': 'Browse Restaurants',
        'cart.total': 'Total',
        'cart.proceedToCheckout': 'Proceed to Checkout',
        'cart.remove': 'Remove',

        // Profile Screen
        'profile.account': 'Account',
        'profile.editProfile': 'Edit Profile',
        'profile.manageAddresses': 'Manage Addresses',
        'profile.foodOrders': 'Food Orders',
        'profile.yourOrders': 'Your Orders',
        'profile.favouriteOrders': 'Favorite Orders',
        'profile.payments': 'Payments',
        'profile.paymentMethods': 'Payment Methods',
        'profile.settings': 'Settings',
        'profile.notifications': 'Notifications',
        'profile.language': 'Language',
        'profile.moreInfo': 'More Info',
        'profile.about': 'About',
        'profile.feedback': 'Send Feedback',
        'profile.help': 'Help & Support',
        'profile.terms': 'Terms of Service',
        'profile.privacy': 'Privacy Policy',
        'profile.logout': 'Log Out',
        'profile.orders': 'Orders',
        'profile.rating': 'Rating',

        // Language Screen
        'language.title': 'Language',
        'language.subtitle': 'Select your preferred language',

        // Favourites Screen
        'fav.title': 'Favourite Foods',
        'fav.itemsSaved': 'items saved',
        'fav.itemSaved': 'item saved',
        'fav.empty': 'No Favourites Yet',
        'fav.emptyHint': 'Tap the ❤️ on any food item to save it here for quick ordering later.',
        'fav.exploreFood': '🍔 Explore Food',
        'fav.order': 'Order',
        'fav.remove': 'Remove',

        // Food Details Screen
        'food.chooseSize': 'Choose Size',
        'food.addons': 'Add-ons',
        'food.specialInstructions': 'Special Instructions',
        'food.specialInstructionsPlaceholder': 'E.g., No onions, extra sauce...',
        'food.reviews': 'Reviews & Ratings',
        'food.ratings': 'ratings',
        'food.similarItems': 'Similar Items',
        'food.similarRestaurants': 'Similar Restaurants',
        'food.checkout': 'CHECKOUT',
        'food.addedToCart': '✓ Added to Cart!',
        'food.viewAllReviews': 'View All',
        'food.reviews.suffix': 'Reviews',
    },

    hi: {
        'app.deliverTo': 'डिलीवरी करें',
        'app.currentLocation': 'वर्तमान स्थान 📍',
        'app.searchPlaceholder': 'खाना या रेस्तरां खोजें...',
        'app.recentSearches': 'हाल की खोजें',
        'app.clearAll': 'सब हटाएं',
        'app.remove': 'हटाएं',
        'app.order': 'ऑर्डर करें',
        'app.back': '←',

        'home.offersForYou': 'आपके लिए ऑफर',
        'home.categories': 'श्रेणियाँ',
        'home.showMore': 'और दिखाएं',
        'home.topSellers': 'टॉप सेलर',
        'home.bestOffers': 'बेहतरीन ऑफर',
        'home.seeAll': 'सब देखें →',
        'home.popularRestaurants': 'लोकप्रिय रेस्तरां',
        'home.browseAll': '🏪 सभी रेस्तरां देखें',
        'home.freeDelivery': 'मुफ्त डिलीवरी',

        'cart.title': 'आपकी कार्ट',
        'cart.empty': 'आपकी कार्ट खाली है',
        'cart.browseRestaurants': 'रेस्तरां देखें',
        'cart.total': 'कुल',
        'cart.proceedToCheckout': 'चेकआउट करें',
        'cart.remove': 'हटाएं',

        'profile.account': 'खाता',
        'profile.editProfile': 'प्रोफ़ाइल संपादित करें',
        'profile.manageAddresses': 'पते प्रबंधित करें',
        'profile.foodOrders': 'खाने के ऑर्डर',
        'profile.yourOrders': 'आपके ऑर्डर',
        'profile.favouriteOrders': 'पसंदीदा ऑर्डर',
        'profile.payments': 'भुगतान',
        'profile.paymentMethods': 'भुगतान विधियाँ',
        'profile.settings': 'सेटिंग्स',
        'profile.notifications': 'सूचनाएं',
        'profile.language': 'भाषा',
        'profile.moreInfo': 'अधिक जानकारी',
        'profile.about': 'हमारे बारे में',
        'profile.feedback': 'प्रतिक्रिया भेजें',
        'profile.help': 'सहायता',
        'profile.terms': 'सेवा की शर्तें',
        'profile.privacy': 'गोपनीयता नीति',
        'profile.logout': 'लॉग आउट',
        'profile.orders': 'ऑर्डर',
        'profile.rating': 'रेटिंग',

        'language.title': 'भाषा',
        'language.subtitle': 'अपनी पसंदीदा भाषा चुनें',

        'fav.title': 'पसंदीदा खाना',
        'fav.itemsSaved': 'आइटम सहेजे',
        'fav.itemSaved': 'आइटम सहेजा',
        'fav.empty': 'कोई पसंदीदा नहीं',
        'fav.emptyHint': 'किसी भी खाने पर ❤️ दबाएं और यहाँ सहेजें।',
        'fav.exploreFood': '🍔 खाना एक्सप्लोर करें',
        'fav.order': 'ऑर्डर करें',
        'fav.remove': 'हटाएं',

        'food.chooseSize': 'आकार चुनें',
        'food.addons': 'ऐड-ऑन',
        'food.specialInstructions': 'विशेष निर्देश',
        'food.specialInstructionsPlaceholder': 'जैसे, प्याज नहीं, अतिरिक्त चटनी...',
        'food.reviews': 'समीक्षाएं और रेटिंग',
        'food.ratings': 'रेटिंग',
        'food.similarItems': 'समान आइटम',
        'food.similarRestaurants': 'समान रेस्तरां',
        'food.checkout': 'चेकआउट',
        'food.addedToCart': '✓ कार्ट में जोड़ा!',
        'food.viewAllReviews': 'सभी देखें',
        'food.reviews.suffix': 'समीक्षाएं',
    },

    es: {
        'app.deliverTo': 'Entregar en',
        'app.currentLocation': 'Ubicación actual 📍',
        'app.searchPlaceholder': 'Buscar comida o restaurantes...',
        'app.recentSearches': 'Búsquedas recientes',
        'app.clearAll': 'Borrar todo',
        'app.remove': 'Eliminar',
        'app.order': 'Pedir',
        'app.back': '←',

        'home.offersForYou': 'Ofertas para ti',
        'home.categories': 'Categorías',
        'home.showMore': 'Ver más',
        'home.topSellers': 'Los más vendidos',
        'home.bestOffers': 'Mejores ofertas',
        'home.seeAll': 'Ver todo →',
        'home.popularRestaurants': 'Restaurantes populares',
        'home.browseAll': '🏪 Ver todos los restaurantes',
        'home.freeDelivery': 'Envío gratis',

        'cart.title': 'Tu carrito',
        'cart.empty': 'Tu carrito está vacío',
        'cart.browseRestaurants': 'Ver restaurantes',
        'cart.total': 'Total',
        'cart.proceedToCheckout': 'Proceder al pago',
        'cart.remove': 'Eliminar',

        'profile.account': 'Cuenta',
        'profile.editProfile': 'Editar perfil',
        'profile.manageAddresses': 'Gestionar direcciones',
        'profile.foodOrders': 'Pedidos de comida',
        'profile.yourOrders': 'Tus pedidos',
        'profile.favouriteOrders': 'Pedidos favoritos',
        'profile.payments': 'Pagos',
        'profile.paymentMethods': 'Métodos de pago',
        'profile.settings': 'Configuración',
        'profile.notifications': 'Notificaciones',
        'profile.language': 'Idioma',
        'profile.moreInfo': 'Más información',
        'profile.about': 'Acerca de',
        'profile.feedback': 'Enviar comentarios',
        'profile.help': 'Ayuda y soporte',
        'profile.terms': 'Términos de servicio',
        'profile.privacy': 'Política de privacidad',
        'profile.logout': 'Cerrar sesión',
        'profile.orders': 'Pedidos',
        'profile.rating': 'Valoración',

        'language.title': 'Idioma',
        'language.subtitle': 'Selecciona tu idioma preferido',

        'fav.title': 'Comidas favoritas',
        'fav.itemsSaved': 'elementos guardados',
        'fav.itemSaved': 'elemento guardado',
        'fav.empty': 'Sin favoritos aún',
        'fav.emptyHint': 'Toca ❤️ en cualquier comida para guardarla aquí.',
        'fav.exploreFood': '🍔 Explorar comida',
        'fav.order': 'Pedir',
        'fav.remove': 'Eliminar',

        'food.chooseSize': 'Elige el tamaño',
        'food.addons': 'Complementos',
        'food.specialInstructions': 'Instrucciones especiales',
        'food.specialInstructionsPlaceholder': 'Ej., Sin cebolla, salsa extra...',
        'food.reviews': 'Reseñas y valoraciones',
        'food.ratings': 'valoraciones',
        'food.similarItems': 'Artículos similares',
        'food.similarRestaurants': 'Restaurantes similares',
        'food.checkout': 'PAGAR',
        'food.addedToCart': '✓ ¡Añadido al carrito!',
        'food.viewAllReviews': 'Ver todas',
        'food.reviews.suffix': 'Reseñas',
    },

    fr: {
        'app.deliverTo': 'Livrer à',
        'app.currentLocation': 'Emplacement actuel 📍',
        'app.searchPlaceholder': 'Chercher nourriture ou restaurants...',
        'app.recentSearches': 'Recherches récentes',
        'app.clearAll': 'Tout effacer',
        'app.remove': 'Supprimer',
        'app.order': 'Commander',
        'app.back': '←',

        'home.offersForYou': 'Offres pour vous',
        'home.categories': 'Catégories',
        'home.showMore': 'Voir plus',
        'home.topSellers': 'Meilleures ventes',
        'home.bestOffers': 'Meilleures offres',
        'home.seeAll': 'Voir tout →',
        'home.popularRestaurants': 'Restaurants populaires',
        'home.browseAll': '🏪 Tous les restaurants',
        'home.freeDelivery': 'Livraison gratuite',

        'cart.title': 'Votre panier',
        'cart.empty': 'Votre panier est vide',
        'cart.browseRestaurants': 'Voir les restaurants',
        'cart.total': 'Total',
        'cart.proceedToCheckout': 'Passer à la caisse',
        'cart.remove': 'Supprimer',

        'profile.account': 'Compte',
        'profile.editProfile': 'Modifier le profil',
        'profile.manageAddresses': 'Gérer les adresses',
        'profile.foodOrders': 'Commandes alimentaires',
        'profile.yourOrders': 'Vos commandes',
        'profile.favouriteOrders': 'Commandes favorites',
        'profile.payments': 'Paiements',
        'profile.paymentMethods': 'Modes de paiement',
        'profile.settings': 'Paramètres',
        'profile.notifications': 'Notifications',
        'profile.language': 'Langue',
        'profile.moreInfo': 'Plus d\'infos',
        'profile.about': 'À propos',
        'profile.feedback': 'Envoyer un avis',
        'profile.help': 'Aide et support',
        'profile.terms': 'Conditions d\'utilisation',
        'profile.privacy': 'Politique de confidentialité',
        'profile.logout': 'Se déconnecter',
        'profile.orders': 'Commandes',
        'profile.rating': 'Note',

        'language.title': 'Langue',
        'language.subtitle': 'Sélectionnez votre langue préférée',

        'fav.title': 'Plats favoris',
        'fav.itemsSaved': 'articles sauvegardés',
        'fav.itemSaved': 'article sauvegardé',
        'fav.empty': 'Pas encore de favoris',
        'fav.emptyHint': 'Appuyez sur ❤️ sur un plat pour le sauvegarder ici.',
        'fav.exploreFood': '🍔 Explorer la nourriture',
        'fav.order': 'Commander',
        'fav.remove': 'Supprimer',

        'food.chooseSize': 'Choisir la taille',
        'food.addons': 'Suppléments',
        'food.specialInstructions': 'Instructions spéciales',
        'food.specialInstructionsPlaceholder': 'Ex., Sans oignons, sauce extra...',
        'food.reviews': 'Avis et notes',
        'food.ratings': 'notes',
        'food.similarItems': 'Articles similaires',
        'food.similarRestaurants': 'Restaurants similaires',
        'food.checkout': 'PAYER',
        'food.addedToCart': '✓ Ajouté au panier !',
        'food.viewAllReviews': 'Voir tous',
        'food.reviews.suffix': 'Avis',
    },

    de: {
        'app.deliverTo': 'Liefern an',
        'app.currentLocation': 'Aktueller Standort 📍',
        'app.searchPlaceholder': 'Nach Essen oder Restaurants suchen...',
        'app.recentSearches': 'Letzte Suchen',
        'app.clearAll': 'Alle löschen',
        'app.remove': 'Entfernen',
        'app.order': 'Bestellen',
        'app.back': '←',

        'home.offersForYou': 'Angebote für Sie',
        'home.categories': 'Kategorien',
        'home.showMore': 'Mehr anzeigen',
        'home.topSellers': 'Bestseller',
        'home.bestOffers': 'Beste Angebote',
        'home.seeAll': 'Alle anzeigen →',
        'home.popularRestaurants': 'Beliebte Restaurants',
        'home.browseAll': '🏪 Alle Restaurants',
        'home.freeDelivery': 'Kostenlose Lieferung',

        'cart.title': 'Ihr Warenkorb',
        'cart.empty': 'Ihr Warenkorb ist leer',
        'cart.browseRestaurants': 'Restaurants ansehen',
        'cart.total': 'Gesamt',
        'cart.proceedToCheckout': 'Zur Kasse',
        'cart.remove': 'Entfernen',

        'profile.account': 'Konto',
        'profile.editProfile': 'Profil bearbeiten',
        'profile.manageAddresses': 'Adressen verwalten',
        'profile.foodOrders': 'Essensbestellungen',
        'profile.yourOrders': 'Ihre Bestellungen',
        'profile.favouriteOrders': 'Lieblingsbestellungen',
        'profile.payments': 'Zahlungen',
        'profile.paymentMethods': 'Zahlungsmethoden',
        'profile.settings': 'Einstellungen',
        'profile.notifications': 'Benachrichtigungen',
        'profile.language': 'Sprache',
        'profile.moreInfo': 'Mehr Infos',
        'profile.about': 'Über uns',
        'profile.feedback': 'Feedback senden',
        'profile.help': 'Hilfe & Support',
        'profile.terms': 'Nutzungsbedingungen',
        'profile.privacy': 'Datenschutzrichtlinie',
        'profile.logout': 'Abmelden',
        'profile.orders': 'Bestellungen',
        'profile.rating': 'Bewertung',

        'language.title': 'Sprache',
        'language.subtitle': 'Wählen Sie Ihre bevorzugte Sprache',

        'fav.title': 'Lieblingsgerichte',
        'fav.itemsSaved': 'Artikel gespeichert',
        'fav.itemSaved': 'Artikel gespeichert',
        'fav.empty': 'Noch keine Favoriten',
        'fav.emptyHint': 'Tippen Sie ❤️ auf ein Gericht, um es hier zu speichern.',
        'fav.exploreFood': '🍔 Essen erkunden',
        'fav.order': 'Bestellen',
        'fav.remove': 'Entfernen',

        'food.chooseSize': 'Größe wählen',
        'food.addons': 'Extras',
        'food.specialInstructions': 'Besondere Hinweise',
        'food.specialInstructionsPlaceholder': 'Z.B., Ohne Zwiebeln, extra Soße...',
        'food.reviews': 'Bewertungen',
        'food.ratings': 'Bewertungen',
        'food.similarItems': 'Ähnliche Artikel',
        'food.similarRestaurants': 'Ähnliche Restaurants',
        'food.checkout': 'KASSE',
        'food.addedToCart': '✓ In den Warenkorb!',
        'food.viewAllReviews': 'Alle anzeigen',
        'food.reviews.suffix': 'Bewertungen',
    },

    ja: {
        'app.deliverTo': '配達先',
        'app.currentLocation': '現在地 📍',
        'app.searchPlaceholder': '料理やレストランを検索...',
        'app.recentSearches': '最近の検索',
        'app.clearAll': 'すべてクリア',
        'app.remove': '削除',
        'app.order': '注文する',
        'app.back': '←',

        'home.offersForYou': 'あなたへのオファー',
        'home.categories': 'カテゴリー',
        'home.showMore': 'もっと見る',
        'home.topSellers': '人気商品',
        'home.bestOffers': 'ベストオファー',
        'home.seeAll': 'すべて見る →',
        'home.popularRestaurants': '人気レストラン',
        'home.browseAll': '🏪 全レストランを見る',
        'home.freeDelivery': '送料無料',

        'cart.title': 'カート',
        'cart.empty': 'カートが空です',
        'cart.browseRestaurants': 'レストランを見る',
        'cart.total': '合計',
        'cart.proceedToCheckout': 'チェックアウト',
        'cart.remove': '削除',

        'profile.account': 'アカウント',
        'profile.editProfile': 'プロフィール編集',
        'profile.manageAddresses': '住所管理',
        'profile.foodOrders': '注文履歴',
        'profile.yourOrders': '注文一覧',
        'profile.favouriteOrders': 'お気に入り',
        'profile.payments': '支払い',
        'profile.paymentMethods': '支払い方法',
        'profile.settings': '設定',
        'profile.notifications': '通知',
        'profile.language': '言語',
        'profile.moreInfo': 'その他',
        'profile.about': 'アプリについて',
        'profile.feedback': 'フィードバック',
        'profile.help': 'ヘルプ',
        'profile.terms': '利用規約',
        'profile.privacy': 'プライバシーポリシー',
        'profile.logout': 'ログアウト',
        'profile.orders': '注文',
        'profile.rating': '評価',

        'language.title': '言語',
        'language.subtitle': '言語を選択してください',

        'fav.title': 'お気に入りの料理',
        'fav.itemsSaved': 'アイテム保存済み',
        'fav.itemSaved': 'アイテム保存済み',
        'fav.empty': 'お気に入りなし',
        'fav.emptyHint': '料理の ❤️ をタップして保存しましょう。',
        'fav.exploreFood': '🍔 料理を探す',
        'fav.order': '注文する',
        'fav.remove': '削除',

        'food.chooseSize': 'サイズを選ぶ',
        'food.addons': 'オプション',
        'food.specialInstructions': '特別な指示',
        'food.specialInstructionsPlaceholder': '例：玉ねぎなし、ソース多めなど...',
        'food.reviews': 'レビューと評価',
        'food.ratings': '評価',
        'food.similarItems': '類似商品',
        'food.similarRestaurants': '類似レストラン',
        'food.checkout': '会計',
        'food.addedToCart': '✓ カートに追加！',
        'food.viewAllReviews': 'すべて見る',
        'food.reviews.suffix': 'レビュー',
    },
};

// ─── Context ─────────────────────────────────────────────────────────────────
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string) => string;
    currentLangMeta: LanguageMeta;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
                if (saved) setLanguageState(saved as Language);
            } catch (_) {}
        })();
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, lang);
        } catch (_) {}
    };

    const t = (key: string): string => {
        return translations[language]?.[key] ?? translations['en']?.[key] ?? key;
    };

    const currentLangMeta = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, currentLangMeta }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
};
