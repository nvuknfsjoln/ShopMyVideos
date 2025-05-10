// Platzhalter für Werte, die im Code ersetzt werden müssen

module.exports = {
  // Allgemeine Seiteninformationen
  siteTitle: "ShopMyVideos", // Der Name des Shops
  siteDescription: "Der beste Shop für Videos", // Beschreibung der Seite

  // URLs
  logoUrl: "/assets/logo.png", // URL des Logos
  cookiePolicyUrl: "/cookies", // URL für Cookie-Richtlinien
  termsAndConditionsUrl: "/agb", // URL für AGBs
  privacyPolicyUrl: "/datenschutz", // URL für Datenschutzrichtlinien

  // Altersverifikation
  ageVerificationText: "Bist du über 18 Jahre alt?", // Text für Altersverifikation
  ageVerificationAgreeText: "Ja, ich bin über 18 Jahre alt", // Button-Text für Ja
  ageVerificationDisagreeText: "Nein, ich bin unter 18", // Button-Text für Nein

  // Kategorien für Filter
  categories: ["Action", "Drama", "Comedy", "Horror"], // Beispielkategorien für Filter

  // Zahlungs-Optionen
  availablePaymentMethods: ["PayPal", "Stripe"], // Zahlungsoptionen
  paypalAccount: "dein-paypal-konto@example.com", // PayPal Account für Zahlungen

  // Support
  supportEmail: "support@shopmyvideos.com", // E-Mail für Supportanfragen

  // Video-Daten (Beispiel für ein Video)
  video1: {
    title: "Beispielvideo 1", // Titel des Videos
    thumbnailUrl: "/assets/videos/video1_thumbnail.jpg", // Thumbnail-URL des Videos
    videoUrl: "/assets/videos/video1.mp4", // Video-URL
    price: 10.99, // Preis des Videos
    creatorName: "Creator1", // Creator des Videos
    description: "Dies ist das erste Beispielvideo", // Beschreibung des Videos
  },

  // Admin-Panel (nur als Beispiel)
  adminCredentials: {
    adminUsername: "admin", // Admin-Username
    adminPassword: "securepassword", // Admin-Passwort
  },

  // Sprachoptionen
  languages: ["en", "de"], // Verfügbare Sprachen

  // Gutschein-Daten (Platzhalter)
  voucherCode: "EXAMPLECODE123", // Beispiel-Gutschein-Code
  voucherValue: 15, // Gutschein-Wert in Euro
};
