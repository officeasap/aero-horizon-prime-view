
// Translation function
function translatePage(language) {
    const translations = {
        en: { "home.title": "Welcome to Our Site", "contact.title": "Contact Us" },
        zh: { "home.title": "欢迎来到我们的网站", "contact.title": "联系我们" },
        th: { "home.title": "ยินดีต้อนรับสู่เว็บไซต์ของเรา", "contact.title": "ติดต่อเรา" },
        hi: { "home.title": "हमारी साइट पर आपका स्वागत है", "contact.title": "संपर्क करें" },
        id: { "home.title": "Selamat datang di situs kami", "contact.title": "Hubungi Kami" },
        fr: { "home.title": "Bienvenue sur notre site", "contact.title": "Contactez-nous" },
        es: { "home.title": "Bienvenido a nuestro sitio", "contact.title": "Contáctenos" },
        ru: { "home.title": "Добро пожаловать на наш сайт", "contact.title": "Свяжитесь с нами" },
        vi: { "home.title": "Chào mừng đến với trang web của chúng tôi", "contact.title": "Liên hệ với chúng tôi" },
        km: { "home.title": "សូមស្វាគមន៍មកកាន់គេហទំព័ររបស់យើង", "contact.title": "ទំនាក់ទំនងមកយើង" },
        ms: { "home.title": "Selamat datang ke laman web kami", "contact.title": "Hubungi Kami" },
        ko: { "home.title": "우리 사이트에 오신 것을 환영합니다", "contact.title": "문의하기" },
        ja: { "home.title": "私たちのサイトへようこそ", "contact.title": "お問い合わせ" },
        pt: { "home.title": "Bem-vindo ao nosso site", "contact.title": "Contate-nos" },
        ar: { "home.title": "مرحبًا بكم في موقعنا", "contact.title": "اتصل بنا" },
        sw: { "home.title": "Karibu kwenye tovuti yetu", "contact.title": "Wasiliana Nasi" },
        am: { "home.title": "እንኳን ወደ ጣቢያችን በደህና መጡ", "contact.title": "አግኙን" }
    };

    document.querySelectorAll('[data-translate]').forEach(function (element) {
        const translationKey = element.getAttribute('data-translate');
        if (translations[language] && translations[language][translationKey]) {
            element.innerText = translations[language][translationKey];
        }
    });
}

// Detect user language based on IP or fallback
function detectLanguage() {
    const savedLanguage = localStorage.getItem("preferredLanguage");

    if (savedLanguage) {
        translatePage(savedLanguage);
        return;
    }

    const ipInfoToken = import.meta.env.VITE_IPINFO_TOKEN; // Make sure this is in your .env file
    const ipInfoUrl = `https://ipinfo.io?token=${ipInfoToken}`;

    fetch(ipInfoUrl)
        .then(response => response.json())
        .then(data => {
            const country = data.country || "";
            let language = "en"; // Default to English

            const countryToLanguage = {
                "CN": "zh", "TH": "th", "IN": "hi", "ID": "id", "FR": "fr",
                "ES": "es", "RU": "ru", "VN": "vi", "KH": "km", "MY": "ms",
                "KR": "ko", "JP": "ja", "PT": "pt", "SA": "ar", "KE": "sw", "ET": "am"
            };

            if (countryToLanguage[country]) {
                language = countryToLanguage[country];
            }

            localStorage.setItem("preferredLanguage", language);
            localStorage.setItem("detectedLanguage", language); // Store detected language too for toggling
            translatePage(language);
        })
        .catch(() => {
            // Fallback if API fails
            translatePage("en");
        });
}

// Toggle between English and detected language
function toggleLanguage() {
    const currentLanguage = localStorage.getItem("preferredLanguage") || "en";
    const toggledLanguage = currentLanguage === "en" ? (localStorage.getItem("detectedLanguage") || "en") : "en";

    localStorage.setItem("preferredLanguage", toggledLanguage);
    translatePage(toggledLanguage);

    // Toggle button text (or any UI change) to indicate active language
    const languageButton = document.querySelector("#language-toggle span");
    if (languageButton) {
        languageButton.innerText = toggledLanguage.toUpperCase(); // Updates the text next to the button
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    detectLanguage();

    const toggleButton = document.querySelector("#language-toggle");
    if (toggleButton) {
        toggleButton.addEventListener("click", toggleLanguage);
    }
});

