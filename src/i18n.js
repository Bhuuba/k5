import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "Profile Settings": "Profile Settings",
      "Change Language": "Change Language",
      "Security Settings": "Security Settings",
      "Change Password": "Change Password",
      "Change Email": "Change Email",
      "Link Google Account": "Link Google Account",
      "Current Password": "Current Password",
      "New Password": "New Password",
      "New Email": "New Email",
      "Update Password": "Update Password",
      "Update Email": "Update Email",
      "Sign Out": "Sign Out",
      Subscription: "Subscription",
      Status: "Status",
      "Premium Active": " Premium Active",
      "Valid until": "Valid until",
      "Auto-renewal": "Auto-renewal",
      Enabled: "Enabled",
      Disabled: "Disabled",
      "Cancel Auto-renewal": "Cancel Auto-renewal",
      "Restore Auto-renewal": "Restore Auto-renewal",
      "Subscription auto-renewal has been restored successfully":
        "Subscription auto-renewal has been restored successfully",
      "Error restoring subscription. Please try again.":
        "Error restoring subscription. Please try again.",
      "Subscription can be restored within":
        "Subscription can be restored within",
      days: "days",
      "Free Plan": "Free Plan",
      "Upgrade to Premium": "Upgrade to Premium",
      "Sign in with Google": "Sign in with Google",
      "Add Email and Password": "Add Email and Password",
      // Header translations
      "YTVideo AI": "YTVideo AI",
      "PDF AI": "PDF AI",
      "AI CHATBOTS": "AI CHATBOTS",
      Pricing: "Pricing",
      "Sign Up": "Sign Up",
      "Upload Document": "Upload Document",
      History: "History",
      "No history": "No history",
      Used: "Used",
      Highlights: "Highlights",
      Keywords: "Keywords",
      "No highlights": "No highlights",
      // Pricing page
      "Tariff plans": "Tariff plans",
      Free: "Free",
      Premium: "Premium",
      "Current plan": "Current plan",
      "Free of charge": "Free of charge",
      "Buy now": "Buy now",
      Active: "Active",
      // Features
      "PDF parsings": "PDF parsings",
      "video analysis": "video analysis",
      "Basic support": "Basic support",
      "Priority support": "Priority support",
      "Unlimited PDF parsing": "Unlimited PDF parsing",
      "Unlimited video analysis": "Unlimited video analysis",
      "Access to all functions": "Access to all functions",
      "Features save you time":
        "Our features save you time by turning long content into clear, simple summaries:",
      // AuthPopup translations
      "Для доступу необхідно авторизуватися":
        "Authorization required for access",
      Увійти: "Sign In",
      Зареєструватися: "Register",
      // PaymentSuccess translations
      "Оплата успішна!": "Payment successful!",
      "Дякуємо за покупку. Преміум статус активовано.":
        "Thank you for your purchase. Premium status has been activated.",
      "Ви будете перенаправлені на головну сторінку через кілька секунд...":
        "You will be redirected to the main page in a few seconds...",
      "Помилка активації преміум статусу. Будь ласка, зверніться в підтримку.":
        "Error activating premium status. Please contact support.",
      "Payment initialization failed. Please try again.":
        "Payment initialization failed. Please try again.",
      "Processing...": "Processing...",
      "Return to Home": "Return to Home",
      "Активація преміум статусу...": "Activating premium status...",
      "Payment cancelled": "Payment cancelled",
      "Payment was cancelled. You can try again at any time.":
        "Payment was cancelled. You can try again at any time.",
      "Payment failed": "Payment failed",
      "Payment error": "Payment error",
      "Payment processing": "Payment processing",
      // PDF component additional translations
      Summary: "Summary",
      "Drag & drop file or": "Drag & drop file or",
      "Choose File": "Choose File",
      "Copied!": "Copied!",
      "Uploaded successfully!": "Uploaded successfully!",
      "Error uploading!": "Error uploading!",
      "Generated summary will appear here...":
        "Generated summary will appear here...",
      "Error loading summary.": "Error loading summary.",
      "Error loading highlights.": "Error loading highlights.",
      "Error loading keywords.": "Error loading keywords.",
      // Video component translations
      "Get video summary": "Get video summary",
      "Insert a link to a YouTube video": "Insert a link to a YouTube video",
      "Generating...": "Generating...",
      Generate: "Generate",
      "Summary length": "Summary length",
      "Summary language": "Summary language",
      "We analyze the video...": "We analyze the video...",
      "Video preview": "Video preview",
      "Key steps": "Key steps",
      "Loading summary...": "Loading summary...",
      "No content available.": "No content available.",
      "Error loading content.": "Error loading content.",
      "Video analysis successfully completed!":
        "Video analysis successfully completed!",
      "Video analysis error!": "Video analysis error!",
      "You have reached the limit of free requests. Purchase premium to continue.":
        "You have reached the limit of free requests. Purchase premium to continue.",
      "Please enter the URL of the video!":
        "Please enter the URL of the video!",
      "Invalid YouTube video URL!": "Invalid YouTube video URL!",
      // Subscription messages
      "Are you sure you want to cancel your subscription? All remaining free days will be lost.":
        "Are you sure you want to cancel your subscription? All remaining free days will be lost.",
      "Cancel Subscription": "Cancel Subscription",
      "Yes, Cancel": "Yes, Cancel",
      "No, Keep": "No, Keep",
      "Subscription auto-renewal has been cancelled successfully":
        "Subscription auto-renewal has been cancelled successfully",
      "Error canceling subscription. Please try again.":
        "Error canceling subscription. Please try again.",
      // Form translations
      Пароль: "Password",
      "example@mail.com": "example@mail.com",
      "Невірний формат email": "Invalid email format",
      "Пароль повинен містити мінімум 6 символів":
        "Password must be at least 6 characters long",
      // Footer translations
      "YT Summary AI": "YT Summary AI",
      "Всі права захищені.": "All rights reserved.",
      "Слідкуйте за нами у Twitter": "Follow us on Twitter",
      "Перегляньте наш код на GitHub": "View our code on GitHub",
      // ProfileInfo translations
      "Want anything to be": "Want anything to be",
      "easy with": "easy with",
      "Your Time. Your Information. Your Comfort.":
        "Your Time. Your Information. Your Comfort.",
      "Get started free": "Get started free",
      "Main illustration": "Main illustration",
      "Active Users": "Active Users",
      "Summaries Generated": "Summaries Generated",
      "Integrated Platforms": "Integrated Platforms",
      "Features illustration": "Features illustration",
      "We Provide Many": "We Provide Many",
      "Features You Can Use": "Features You Can Use",
      "Chat Summarization": "Chat Summarization",
      "YouTube Video Summarization": "YouTube Video Summarization",
      "Text Document Summarization": "Text Document Summarization",
      // Chat translations
      "Connect with Our Smart Chat Bots": "Connect with Our Smart Chat Bots",
      "Stay organized with AI-powered message summarization across all your favorite messaging platforms":
        "Stay organized with AI-powered message summarization across all your favorite messaging platforms",
      "Discord Bot": "Discord Bot",
      "Never miss important messages. Get smart summaries of unread conversations in your Discord servers.":
        "Never miss important messages. Get smart summaries of unread conversations in your Discord servers.",
      "Channel summaries": "Channel summaries",
      "Direct message digests": "Direct message digests",
      "Custom summarization rules": "Custom summarization rules",
      "Add to Discord": "Add to Discord",
      "Telegram Bot": "Telegram Bot",
      "Get instant summaries of group chats and channels with our intelligent Telegram bot.":
        "Get instant summaries of group chats and channels with our intelligent Telegram bot.",
      "Group chat summaries": "Group chat summaries",
      "Channel digest": "Channel digest",
      "Scheduled updates": "Scheduled updates",
      "Add to Telegram": "Add to Telegram",
      "Slack Bot": "Slack Bot",
      "Enhance your workspace productivity with our Slack integration.":
        "Enhance your workspace productivity with our Slack integration.",
      "Channel highlights": "Channel highlights",
      "Thread summaries": "Thread summaries",
      "Custom integrations": "Custom integrations",
      "Add to Slack": "Add to Slack",
      "Why Choose Our Bots?": "Why Choose Our Bots?",
      "Fast Processing": "Fast Processing",
      "Get summaries within seconds of requesting them":
        "Get summaries within seconds of requesting them",
      "Smart AI": "Smart AI",
      "Advanced algorithms for accurate summarization":
        "Advanced algorithms for accurate summarization",
      Secure: "Secure",
      "Your data is always encrypted and protected":
        "Your data is always encrypted and protected",
      Customizable: "Customizable",
      "Adjust settings to match your needs":
        "Adjust settings to match your needs",
      "Account Settings": "Account Settings",
      "Email Management": "Email Management",
      "Change Email Address": "Change Email Address",
      "Change Google Account": "Change Google Account",
      "Enter current password": "Enter current password",
      "Enter new email": "Enter new email",
      "Create new password": "Create new password",
      "Profile Avatar": "Profile Avatar",
      Error: "Error",
      "Choose Email Change Method": "Choose Email Change Method",
      "Change to Google Account": "Change to Google Account",
      "Link your email to a different Google account":
        "Link your email to a different Google account",
      "Update your email address manually":
        "Update your email address manually",
      "Email successfully changed to Google account":
        "Email successfully changed to Google account",
      "Error linking Google account. It may already be linked.":
        "Error linking Google account. It may already be linked.",
      "Welcome Back": "Welcome Back",
      "Sign in to your account": "Sign in to your account",
      "Don't have an account?": "Don't have an account?",
      or: "or",
      "Continue with Google": "Continue with Google",
      "Error Google authorization:": "Error Google authorization:",
      "Create an account": "Create an account",
      "Enter your details to register": "Enter your details to register",
      "Already have an account?": "Already have an account?",
      "Sign in": "Sign in",
      Register: "Register",
      // Auth errors
      "User with this email not found": "User with this email not found",
      "Wrong password": "Wrong password",
      "Invalid email format": "Invalid email format",
      "Account is blocked": "Account is blocked",
      "Too many login attempts. Try again later":
        "Too many login attempts. Try again later",
      "Login error. Please try again later":
        "Login error. Please try again later",
      "This email is already registered": "This email is already registered",
      "Email registration is temporarily unavailable":
        "Email registration is temporarily unavailable",
      "Password is too weak": "Password is too weak",
      "Registration error. Please try again later":
        "Registration error. Please try again later",
      "Summary Length": "Summary Length",
      Language: "Language",
      "Length Options": {
        Short: "Short",
        Medium: "Medium",
        Long: "Long",
      },
      English: "English",
      Ukrainian: "Ukrainian",
    },
  },
  uk: {
    translation: {
      "Profile Settings": "Налаштування профілю",
      "Change Language": "Змінити мову",
      "Security Settings": "Налаштування безпеки",
      "Change Password": "Змінити пароль",
      "Change Email": "Змінити email",
      "Link Google Account": "Прив'язати Google акаунт",
      "Current Password": "Поточний пароль",
      "New Password": "Новий пароль",
      "New Email": "Новий email",
      "Update Password": "Оновити пароль",
      "Update Email": "Оновити email",
      "Sign Out": "Вийти",
      Subscription: "Підписка",
      Status: "Статус",
      "Premium Active": " Premium активний",
      "Valid until": "Дійсний до",
      "Auto-renewal": "Автопродовження",
      Enabled: "Увімкнено",
      Disabled: "Вимкнено",
      "Cancel Auto-renewal": "Скасувати автопродовження",
      "Restore Auto-renewal": "Відновити автопродовження",
      "Subscription auto-renewal has been restored successfully":
        "Автопродовження підписки успішно відновлено",
      "Error restoring subscription. Please try again.":
        "Помилка відновлення підписки. Будь ласка, спробуйте ще раз.",
      "Subscription can be restored within":
        "Підписку можна відновити протягом",
      days: "днів",
      "Free Plan": "Безкоштовний план",
      "Upgrade to Premium": "Оновити до Premium",
      "Sign in with Google": "Увійти через Google",
      "Add Email and Password": "Додати Email та пароль",
      // Header translations
      "YTVideo AI": "Відео AI",
      "PDF AI": "PDF AI",
      "AI CHATBOTS": "AI ЧАТБОТИ",
      Pricing: "Тарифи",
      "Sign Up": "Реєстрація",
      "Upload Document": "Завантажити документ",
      History: "Історія",
      "No history": "Історія порожня",
      Used: "Використано",
      Highlights: "Основні моменти",
      Keywords: "Ключові слова",
      "No highlights": "Немає основних моментів",
      // Pricing page
      "Tariff plans": "Тарифні плани",
      Free: "Безкоштовний",
      Premium: "Преміум",
      "Current plan": "Поточний план",
      "Free of charge": "Безкоштовно",
      "Buy now": "Купити зараз",
      Active: "Активний",
      // Features
      "PDF parsings": "PDF аналізів",
      "video analysis": "відео аналізів",
      "Basic support": "Базова підтримка",
      "Priority support": "Пріоритетна підтримка",
      "Unlimited PDF parsing": "Необмежений аналіз PDF",
      "Unlimited video analysis": "Необмежений аналіз відео",
      "Access to all functions": "Доступ до всіх функцій",
      "Our features save you time by turning long content into":
        "Наші функції економлять ваш час, перетворюючи довгий контент на чіткі, прості конспекти:",
      // AuthPopup translations
      "Для доступу необхідно авторизуватися":
        "Для доступу необхідно авторизуватися",
      Увійти: "Увійти",
      Зареєструватися: "Зареєструватися",
      // PaymentSuccess translations
      "Оплата успішна!": "Оплата успішна!",
      "Дякуємо за покупку. Преміум статус активовано.":
        "Дякуємо за покупку. Преміум статус активовано.",
      "Ви будете перенаправлені на головну сторінку через кілька секунд...":
        "Ви будете перенаправлені на головну сторінку через кілька секунд...",
      "Помилка активації преміум статусу. Будь ласка, зверніться в підтримку.":
        "Помилка активації преміум статусу. Будь ласка, зверніться в підтримку.",
      "Payment initialization failed. Please try again.":
        "Помилка ініціалізації платежу. Будь ласка, спробуйте ще раз.",
      "Processing...": "Обробка...",
      "Return to Home": "Повернутися на головну",
      "Активація преміум статусу...": "Активація преміум статусу...",
      "Payment cancelled": "Оплату скасовано",
      "Payment was cancelled. You can try again at any time.":
        "Оплату скасовано. Ви можете спробувати знову в будь-який час.",
      "Payment failed": "Помилка оплати",
      "Payment error": "Помилка платежу",
      "Payment processing": "Обробка платежу",
      // PDF component additional translations
      Summary: "Короткий зміст",
      "Drag & drop file or": "Перетягніть файл або",
      "Choose File": "Виберіть файл",
      "Copied!": "Скопійовано!",
      "Uploaded successfully!": "Успішно завантажено!",
      "Error uploading!": "Помилка завантаження!",
      "Generated summary will appear here...":
        "Згенерований зміст з'явиться тут...",
      "Error loading summary.": "Помилка завантаження змісту.",
      "Error loading highlights.": "Помилка завантаження основних моментів.",
      "Error loading keywords.": "Помилка завантаження ключових слів.",
      // Video component translations
      "Get video summary": "Отримати короткий зміст відео",
      "Insert a link to a YouTube video":
        "Вставте посилання на відео з YouTube",
      "Generating...": "Генерація...",
      Generate: "Згенерувати",
      "Summary length": "Довжина змісту",
      "Summary language": "Мова змісту",
      Short: "Короткий",
      Medium: "Середній",
      Long: "Довгий",
      "We analyze the video...": "Ми аналізуємо відео...",
      "Video preview": "Перегляд відео",
      Summary: "Короткий зміст",
      "Key steps": "Ключові моменти",
      "Loading summary...": "Завантаження змісту...",
      "No content available.": "Контент недоступний.",
      "Error loading content.": "Помилка завантаження контенту.",
      "Video analysis successfully completed!":
        "Аналіз відео успішно завершено!",
      "Video analysis error!": "Помилка аналізу відео!",
      "You have reached the limit of free requests. Purchase premium to continue.":
        "Ви досягли ліміту безкоштовних запитів. Придбайте преміум для продовження.",
      "Please enter the URL of the video!": "Будь ласка, введіть URL відео!",
      "Invalid YouTube video URL!": "Невірний URL відео YouTube!",
      // Subscription messages
      "Are you sure you want to cancel your subscription? All remaining free days will be lost.":
        "Ви впевнені, що хочете скасувати підписку? Всі залишені безкоштовні дні будуть втрачені.",
      "Cancel Subscription": "Скасувати підписку",
      "Yes, Cancel": "Так, скасувати",
      "No, Keep": "Ні, залишити",
      "Subscription auto-renewal has been cancelled successfully":
        "Автопродовження підписки успішно скасовано",
      "Error canceling subscription. Please try again.":
        "Помилка скасування підписки. Будь ласка, спробуйте ще раз.",
      // Form translations
      Пароль: "Пароль",
      "example@mail.com": "приклад@пошта.com",
      "Невірний формат email": "Невірний формат email",
      "Пароль повинен містити мінімум 6 символів":
        "Пароль повинен містити мінімум 6 символів",
      // Footer translations
      "YT Summary AI": "YT Summary AI",
      "Всі права захищені.": "Всі права захищені.",
      "Слідкуйте за нами у Twitter": "Слідкуйте за нами у Twitter",
      "Перегляньте наш код на GitHub": "Перегляньте наш код на GitHub",
      // ProfileInfo translations
      "Want anything to be": "Хочете щоб все було",
      "easy with": "легко з",
      "Your Time. Your Information. Your Comfort.":
        "Ваш час. Ваша інформація. Ваш комфорт.",
      "Get started free": "Почати безкоштовно",
      "Main illustration": "Головна ілюстрація",
      "Active Users": "Активних користувачів",
      "Summaries Generated": "Створено конспектів",
      "Integrated Platforms": "Інтегрованих платформ",
      "Features illustration": "Ілюстрація функцій",
      "We Provide Many": "Ми надаємо багато",
      "Features You Can Use": "функцій, які ви можете використовувати",
      "Chat Summarization": "Конспектування чатів",
      "YouTube Video Summarization": "Конспектування YouTube відео",
      "Text Document Summarization": "Конспектування текстових документів",
      // Chat translations
      "Connect with Our Smart Chat Bots":
        "Підключіться до наших розумних чат-ботів",
      "Stay organized with AI-powered message summarization across all your favorite messaging platforms":
        "Залишайтеся організованими за допомогою AI-конспектування повідомлень у всіх ваших улюблених месенджерах",
      "Discord Bot": "Discord бот",
      "Never miss important messages. Get smart summaries of unread conversations in your Discord servers.":
        "Не пропускайте важливі повідомлення. Отримуйте розумні конспекти непрочитаних розмов на ваших Discord серверах.",
      "Channel summaries": "Конспекти каналів",
      "Direct message digests": "Огляди особистих повідомлень",
      "Custom summarization rules": "Налаштування правил конспектування",
      "Add to Discord": "Додати до Discord",
      "Telegram Bot": "Telegram бот",
      "Get instant summaries of group chats and channels with our intelligent Telegram bot.":
        "Отримуйте миттєві конспекти групових чатів та каналів за допомогою нашого розумного Telegram бота.",
      "Group chat summaries": "Конспекти групових чатів",
      "Channel digest": "Огляд каналу",
      "Scheduled updates": "Заплановані оновлення",
      "Add to Telegram": "Додати до Telegram",
      "Slack Bot": "Slack бот",
      "Enhance your workspace productivity with our Slack integration.":
        "Підвищіть продуктивність вашого робочого простору за допомогою нашої інтеграції зі Slack.",
      "Channel highlights": "Основні моменти каналів",
      "Thread summaries": "Конспекти обговорень",
      "Custom integrations": "Налаштовувані інтеграції",
      "Add to Slack": "Додати до Slack",
      "Why Choose Our Bots?": "Чому варто обрати наших ботів?",
      "Fast Processing": "Швидка обробка",
      "Get summaries within seconds of requesting them":
        "Отримуйте конспекти протягом секунд після запиту",
      "Smart AI": "Розумний ШІ",
      "Advanced algorithms for accurate summarization":
        "Передові алгоритми для точного конспектування",
      Secure: "Безпечно",
      "Your data is always encrypted and protected":
        "Ваші дані завжди зашифровані та захищені",
      Customizable: "Налаштовуваний",
      "Adjust settings to match your needs":
        "Налаштуйте параметри відповідно до ваших потреб",
      "Account Settings": "Налаштування акаунту",
      "Email Management": "Управління поштою",
      "Change Email Address": "Змінити email адресу",
      "Change Google Account": "Змінити Google акаунт",
      "Enter current password": "Введіть поточний пароль",
      "Enter new email": "Введіть новий email",
      "Create new password": "Створіть новий пароль",
      "Profile Avatar": "Фото профілю",
      Error: "Помилка",
      "Choose Email Change Method": "Оберіть спосіб зміни пошти",
      "Change to Google Account": "Змінити на Google акаунт",
      "Link your email to a different Google account":
        "Прив'яжіть пошту до іншого Google акаунту",
      "Update your email address manually": "Оновіть адресу пошти вручну",
      "Email successfully changed to Google account":
        "Пошту успішно змінено на Google акаунт",
      "Error linking Google account. It may already be linked.":
        "Помилка прив'язки Google акаунту. Можливо, він вже прив'язаний.",
      "Welcome Back": "Ласкаво просимо",
      "Sign in to your account": "Увійдіть у свій акаунт",
      "Don't have an account?": "Ще не маєте акаунту?",
      or: "або",
      "Continue with Google": "Продовжити з Google",
      "Error Google authorization:": "Помилка Google авторизації:",
      "Create an account": "Створіть обліковий запис",
      "Enter your details to register": "Введіть свої дані для реєстрації",
      "Already have an account?": "Вже маєте акаунт?",
      "Sign in": "Увійти",
      Register: "Зареєструватися",
      // Auth errors
      "User with this email not found":
        "Користувача з такою поштою не знайдено",
      "Wrong password": "Невірний пароль",
      "Invalid email format": "Невірний формат пошти",
      "Account is blocked": "Акаунт заблоковано",
      "Too many login attempts. Try again later":
        "Забагато спроб входу. Спробуйте пізніше",
      "Login error. Please try again later": "Помилка входу. Спробуйте пізніше",
      "This email is already registered": "Ця пошта вже зареєстрована",
      "Email registration is temporarily unavailable":
        "Реєстрація через пошту тимчасово недоступна",
      "Password is too weak": "Надто слабкий пароль",
      "Registration error. Please try again later":
        "Помилка реєстрації. Спробуйте пізніше",
      "Summary Length": "Довжина резюме",
      Language: "Мова",
      Short: "Коротко",
      Medium: "Середньо",
      Long: "Довго",
      English: "Англійська",
      Ukrainian: "Українська",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
