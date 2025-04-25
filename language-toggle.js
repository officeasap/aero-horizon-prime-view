// Translation function
function translatePage(language) {
    const translations = {
        en: {
            "home.title": "Welcome to Our Site",
            "contact.title": "Contact Us",
            // Add more translations for English...
        },
        zh: {
            "home.title": "欢迎来到我们的网站",
            "contact.title": "联系我们",
            // Add more translations for Chinese...
        },
        th: {
            "home.title": "ยินดีต้อนรับสู่เว็บไซต์ของเรา",
            "contact.title": "ติดต่อเรา",
            // Add more translations for Thai...
        },
        hi: {
            "home.title": "हमारी साइट पर आपका स्वागत है",
            "contact.title": "संपर्क करें",
            // Add more translations for Hindi...
        },
        id: {
            "home.title": "Selamat datang di situs kami",
            "contact.title": "Hubungi Kami",
            // Add more translations for Indonesian...
        },
        fr: {
            "home.title": "Bienvenue sur notre site",
            "contact.title": "Contactez-nous",
            // Add more translations for French...
        },
        es: {
            "home.title": "Bienvenido a nuestro sitio",
            "contact.title": "Contáctenos",
            // Add more translations for Spanish...
        },
        ru: {
            "home.title": "Добро пожаловать на наш сайт",
            "contact.title": "Свяжитесь с нами",
            // Add more translations for Russian...
        },
        vi: {
            "home.title": "Chào mừng đến với trang web của chúng tôi",
            "contact.title": "Liên hệ với chúng tôi",
            // Add more translations for Vietnamese...
        },
        km: {
            "home.title": "សូមស្វាគមន៍មកកាន់គេហទំព័ររបស់យើង",
            "contact.title": "ទំនាក់ទំនងមកយើង",
            // Add more translations for Khmer...
        },
        ms: {
            "home.title": "Selamat datang ke laman web kami",
            "contact.title": "Hubungi Kami",
            // Add more translations for Malay...
        },
        ko: {
            "home.title": "우리 사이트에 오신 것을 환영합니다",
            "contact.title": "문의하기",
            // Add more translations for Korean...
        },
        ja: {
            "home.title": "私たちのサイトへようこそ",
            "contact.title": "お問い合わせ",
            // Add more translations for Japanese...
        },
        pt: {
            "home.title": "Bem-vindo ao nosso site",
            "contact.title": "Contate-nos",
            // Add more translations for Portuguese...
        },
        ar: {
            "home.title": "مرحبًا بكم في موقعنا",
            "contact.title": "اتصل بنا",
            // Add more translations for Arabic...
        },
        sw: {
            "home.title": "Karibu kwenye tovuti yetu",
            "contact.title": "Wasiliana Nasi",
            // Add more translations for Swahili...
        },
        am: {
            "home.title": "እንኳን ወደ ስምንት ገጽታችን እንግዲኛ",
            "contact.title": "እኛን እንዴት እቀርባለን",
            // Add more translations for Amharic...
        }
    };

    // Fetching the elements with translation keys
    document.querySelectorAll('[data-translate]').forEach(function(element) {
        const translationKey = element.getAttribute('data-translate');
        if (translations[language] && translations[language][translationKey]) {
            element.innerText = translations[language][translationKey];
        }
    });
}

// Detect user language based on IP (or use localStorage if language is set)
function detectLanguage() {
    // Example geo-location API usage for detecting the user's location (adjust for free API like ipinfo.io)
    fetch('https://ipinfo.io?token=your_token')  // Use your API token
        .then(response => response.json())
        .then(data => {
            const country = data.country;  // Example country code
            let language = "en";  // Default to English
            // Map specific countries to their languages
            switch (country) {
                case "CN":
                    language = "zh"; // Chinese for China
                    break;
                case "TH":
                    language = "th"; // Thai for Thailand
                    break;
                case "IN":
                    language = "hi"; // Hindi for India
                    break;
                case "ID":
                    language = "id"; // Indonesian for Indonesia
                    break;
                case "FR":
                    language = "fr"; // French for France
                    break;
                case "ES":
                    language = "es"; // Spanish for Spain
                    break;
                case "RU":
                    language = "ru"; // Russian for Russia
                    break;
                case "VN":
                    language = "vi"; // Vietnamese for Vietnam
                    break;
                case "KH":
                    language = "km"; // Khmer for Cambodia
                    break;
                case "MY":
                    language = "ms"; // Malay for Malaysia
                    break;
                case "KR":
                    language = "ko"; // Korean for South Korea
                    break;
                case "JP":
                    language = "ja"; // Japanese for Japan
                    break;
                case "PT":
                    language = "pt"; // Portuguese for Portugal/Brazil
                    break;
                case "SA":
                    language = "ar"; // Arabic for Saudi Arabia
                    break;
                case "KE":
                    language = "sw"; // Swahili for Kenya/Tanzania
                    break;
                case "ET":
                    language = "am"; // Amharic for Ethiopia
                    break;
                default:
                    language = "en"; // Default to English for other countries
            }
            localStorage.setItem("language", language);
            translatePage(language);
        })
        .catch(() => {
            // If failed to detect, fallback to English
            let language = localStorage.getItem("language") || "en";
            translatePage(language);
        });
}

// Toggle between English and detected language
function toggleLanguage() {
    let currentLanguage = localStorage.getItem("language") || "en";
    let newLanguage = currentLanguage === "en" ? localStorage.getItem("language") : "en"; // Toggle between English and the detected language
    localStorage.setItem("language", newLanguage);
    translatePage(newLanguage);
}

// Initialize the language detection
document.addEventListener("DOMContentLoaded", function() {
    detectLanguage();

    // Add event listener to your language toggle button
    const languageToggleButton = document.querySelector("#language-toggle");
    if (languageToggleButton) {
        languageToggleButton.addEventListener("click", toggleLanguage);
    }
});
