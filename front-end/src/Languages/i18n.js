// i18n.js
import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            Home: 'Home',
            Sport: 'Sport',
            Education: 'Education',
            Politics: 'Politics',

            // NewsSection:
            recentlyPublished: '🆕 Recently Published',
            loading: 'Loading...',
            noNews: 'No news available.',
            showMore: 'Show More',
            hide: 'Hide',

            politicsSection: '🏛️ Politics',
            educationSection: '📚 Education',
            sportsSection: '🏅 Sports',

            // Login & Signin
            loginTitle: 'Login',
            usernamePlaceholder: 'Username',
            passwordPlaceholder: 'Password',
            loginButton: 'Login',
            backButton: 'Back',
            noAccount: 'Do not have an Account?',
            clickMe: 'Click Me.!',

            createEditorAccount: 'Create New Editor Account',
            submitButton: 'Submit',
            haveAccount: 'If you have an Account?',
            userAddedSuccess: 'User added successfully!',
            userAlreadyRegistered: 'User already registered!',
            userAddFail: 'Failed to add User.',

            // Dash boards
            superAdminDashboard: "Super Admin Dashboard",
            userManagement: "User Management",
            pendingNews: "Pending News",
            acceptedNews: "Accepted News",
            rejectedNews: "Rejected News",
            createArticle: "Create Article",
            historyOfArticles: "History Of Articles",
            createUser: "Create User",
            authorDashboard: "Author Dashboard",
            adminDashboard: "Admin Dashboard",

            // news edit section
            editNewsArticle: "Edit News Article",
            selectCategory: "Select Category",
            education: "Education",
            politics: "Politics",
            sports: "Sports",
            title: "Title",
            mediaUrl: "Media URL (optional)",
            content: "Content",
            updateArticle: "Update Article",
            updating: "Updating...",
            cancel: "Cancel",
            backToModeration: "Back to Moderation",
            noArticleId: "No article ID found. Please select an article to edit.",
            loadingArticle: "Loading article data...",
            fetchArticleError: "Failed to load article data. Please try again.",
            updateSuccess: "News article updated successfully!",
            updateError: "Something went wrong during update.",

            // Create News
            breakingNews: "Breaking News",
            createNewsArticle: "Create News Article",
            submit: "Submit",
            submitting: "Submitting...",

            // Unauthorized
            accessDenied: "Access Denied",
            noPermission: "You do not have permission to access this page.",
            goHome: "Go to Home-page",

            // Accepted News Section
            acceptedModerationTitle: 'Accepted News Moderation',
            notificationTitle: 'Notification',
            fetchAcceptedFail: 'Failed to load accepted news articles',
            noAcceptedArticles: 'No accepted articles to review.',
            imagePreview: 'Image Preview',
            loading: 'Loading...',
            by: 'By:',
            editContent: 'Edit Content',
            stopShowing: 'Stop Showing',
            processing: 'Processing...',
            articleRemoved: 'Article is no longer displayed on the site',
            updateStatusFail: 'Failed to update article status',
        }
    },
    si: {
        translation: {
            Home: 'මුල් පිටුව',
            Sport: 'ක්‍රීඩා',
            Education: 'අධ්‍යාපන',
            Politics: 'දේශපාලන',

            // NewsSection:
            recentlyPublished: '🆕 නවතම ප්‍රකාශිත',
            loading: 'පූරණය වෙමින්...',
            noNews: 'පුවත් නොමැත.',
            showMore: 'තව දර්ශනය කරන්න',
            hide: 'සඟවන්න',

            politicsSection: '🏛️ දේශපාලන',
            educationSection: '📚 අධ්‍යාපන',
            sportsSection: '🏅 ක්‍රීඩා',

            // Login & signin
            loginTitle: 'පිවිසෙන්න',
            usernamePlaceholder: 'පරිශීලක නාමය',
            passwordPlaceholder: 'මුරපදය',
            loginButton: 'ඇතුල් වන්න',
            backButton: 'ආපසු',
            noAccount: 'ගිණුමක් නැද්ද?',
            clickMe: 'මෙතන ක්ලික් කරන්න.!',

            createEditorAccount: 'නව සංස්කාරක ගිණුමක් සාදන්න',
            submitButton: 'ඉදිරිපත් කරන්න',
            haveAccount: 'ඔබට ගිණුමක් තිබේද?',
            clickMe: 'මෙතන ක්ලික් කරන්න.!',
            userAddedSuccess: 'පරිශීලකයා සාර්ථකව එකතු කරන ලදී!',
            userAlreadyRegistered: 'පරිශීලකයා දැනටමත් ලියාපදිංචි වී ඇත!',
            userAddFail: 'පරිශීලකයා එක් කිරීමට අසමත් විය.',

            // Dash boards
            superAdminDashboard: "සුපිරි පරිපාලක ඩෑෂ්බෝර්ඩය",
            userManagement: "පරිශීලක කළමනාකරණය",
            pendingNews: "බලාපොරොත්තු වන පුවත්",
            acceptedNews: "පිළිගත් පුවත්",
            rejectedNews: "ප්‍රතික්ෂේප කළ පුවත්",
            createArticle: "ලිපියක් සාදන්න",
            historyOfArticles: "ලිපි ඉතිහාසය",
            createUser: "පරිශීලකයෙකු සාදන්න",
            authorDashboard: "කතෘ ඩෑෂ්බෝර්ඩය",
            adminDashboard: "පරිපාලක ඩෑෂ්බෝර්ඩය",

            // news edit section
            editNewsArticle: "පුවත් ලිපිය සංස්කරණය කරන්න",
            selectCategory: "ප්‍රවර්ගය තෝරන්න",
            education: "අධ්‍යාපන",
            politics: "දේශපාලන",
            sports: "ක්‍රීඩා",
            title: "මාතෘකාව",
            mediaUrl: "මාධ්‍ය URL (විකල්පය)",
            content: "අන්තර්ගතය",
            updateArticle: "ලිපිය යාවත්කාලීන කරන්න",
            updating: "යාවත්කාලීන වෙමින්...",
            cancel: "අවලංගු කරන්න",
            backToModeration: "මධ්‍යස්ථානයට ආපසු යන්න",
            noArticleId: "ලිපි ID එකක් සොයාගත නොහැක. කරුණාකර ලිපියක් තෝරන්න.",
            loadingArticle: "ලිපි දත්ත පූරණය වෙමින්...",
            fetchArticleError: "ලිපි දත්ත ලබා ගැනීම අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.",
            updateSuccess: "පුවත් ලිපිය සාර්ථකව යාවත්කාලීන කරන ලදී!",
            updateError: "යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",

            // Create News
            breakingNews: "උණුසුම් පුවත්",
            createNewsArticle: "පුවත් ලිපියක් සාදන්න",
            submit: "ඉදිරිපත් කරන්න",
            submitting: "ඉදිරිපත් වෙමින්...",

            // Unauthorized
            accessDenied: "ප්‍රවේශය වළක්වා ඇත",
            noPermission: "ඔබට මෙම පිටුව වෙත ප්‍රවේශ වීමට අවසර නැත.",
            goHome: "මුල් පිටුවට යන්න",

            // Accepted News Section
            acceptedModerationTitle: 'පිළිගත් පුවත් මධ්‍යස්ථකරණය',
            notificationTitle: 'නිවේදනය',
            fetchAcceptedFail: 'පිළිගත් පුවත් ආයාත කිරීමට අපොහොසත් විය',
            noAcceptedArticles: 'සමාලෝචනය කිරීමට පිළිගත් ලිපි නොමැත.',
            imagePreview: 'පින්තූර පෙරදසුන',
            loading: 'පූරණය වෙමින්...',
            by: 'ලියා ඇති අය:',
            editContent: 'අන්තර්ගතය සංස්කරණය කරන්න',
            stopShowing: 'ප්‍රදර්ශනය නවතා දමන්න',
            processing: 'සම්පූර්ණ වෙමින්...',
            articleRemoved: 'ලිපිය දැක්වීම තිබෙන තැනින් ඉවත් කර ඇත',
            updateStatusFail: 'ලිපි තත්වය යාවත්කාලීන කිරීමට අසමත් විය',
        }
    },
    ta: {
        translation: {
            Home: 'முகப்பு',
            Sport: 'விளையாட்டு',
            Education: 'கல்வி',
            Politics: 'அரசியல்',

            // NewsSection:
            recentlyPublished: '🆕 சமீபத்தில் வெளியிடப்பட்டது',
            loading: 'பொறுத்தப்பட்டுள்ளது...',
            noNews: 'செய்திகள் இல்லை.',
            showMore: 'மேலும் காண்பி',
            hide: 'மறை',

            politicsSection: '🏛️ அரசியல்',
            educationSection: '📚 கல்வி',
            sportsSection: '🏅 விளையாட்டு',

            // Login & Signin
            loginTitle: 'உள்நுழை',
            usernamePlaceholder: 'பயனர் பெயர்',
            passwordPlaceholder: 'கடவுச்சொல்',
            loginButton: 'உள்நுழையவும்',
            backButton: 'பின்னேறு',
            noAccount: 'கணக்கு இல்லையா?',
            clickMe: 'இங்கே கிளிக் செய்யவும்.!',

            createEditorAccount: 'புதிய ஆசிரியர் கணக்கை உருவாக்கவும்',
            submitButton: 'சமர்ப்பிக்கவும்',
            haveAccount: 'உங்களிடம் கணக்கு உள்ளதா?',
            userAddedSuccess: 'பயனர் வெற்றிகரமாக சேர்க்கப்பட்டார்!',
            userAlreadyRegistered: 'பயனர் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளார்!',
            userAddFail: 'பயனரை சேர்க்க முடியவில்லை.',

            // Dash boards
            superAdminDashboard: "சூப்பர் நிர்வாகி டாஷ்போர்டு",
            userManagement: "பயனர் மேலாண்மை",
            pendingNews: "நிலுவையிலுள்ள செய்தி",
            acceptedNews: "ஏற்கப்பட்ட செய்தி",
            rejectedNews: "நிராகரிக்கப்பட்ட செய்தி",
            createArticle: "கட்டுரை உருவாக்கு",
            historyOfArticles: "கட்டுரைகளின் வரலாறு",
            createUser: "புதிய பயனர் உருவாக்கு",
            authorDashboard: "ஆசிரியர் டாஷ்போர்டு",
            adminDashboard: "நிர்வாகி டாஷ்போர்டு",


            // news edit section
            editNewsArticle: "செய்தி கட்டுரையை திருத்தவும்",
            selectCategory: "வகையை தேர்ந்தெடுக்கவும்",
            education: "கல்வி",
            politics: "அரசியல்",
            sports: "விளையாட்டு",
            title: "தலைப்பு",
            mediaUrl: "ஊடக URL (விருப்பமானது)",
            content: "உள்ளடக்கம்",
            updateArticle: "கட்டுரையை புதுப்பிக்கவும்",
            updating: "புதுப்பிக்கிறது...",
            cancel: "ரத்து செய்யவும்",
            backToModeration: "மோடரேஷனுக்கு திரும்புக",
            noArticleId: "கட்டுரை ஐடி காணப்படவில்லை. தயவுசெய்து கட்டுரையைத் தேர்ந்தெடுக்கவும்.",
            loadingArticle: "கட்டுரை தரவை ஏற்றுகிறது...",
            fetchArticleError: "கட்டுரை தரவுகளை ஏற்றுவதில் தோல்வி. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
            updateSuccess: "செய்தி கட்டுரை வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
            updateError: "புதுப்பிக்கும் போது ஏதோ தவறு ஏற்பட்டது.",

            // Create News
            breakingNews: "உடனடி செய்தி",
            createNewsArticle: "செய்தி கட்டுரை உருவாக்குக",
            submit: "சமர்ப்பிக்கவும்",
            submitting: "சமர்ப்பிக்கப்படுகிறது...",


            // Unauthorized
            accessDenied: "அணுகல் மறுக்கப்பட்டது",
            noPermission: "இந்தப் பக்கத்தை அணுக உங்களுக்கு அனுமதி இல்லை.",
            goHome: "முகப்பு பக்கத்திற்கு செல்லவும்",

            // Accepted News Section
            acceptedModerationTitle: 'உடன்படுதல் செய்தி மதிப்பாய்வு',
            notificationTitle: 'அறிவிப்பு',
            fetchAcceptedFail: 'ஏற்கப்பட்ட செய்திகள் ஏற்றுவதில் தோல்வி',
            noAcceptedArticles: 'மதிப்பாய்வு செய்ய ஏற்கப்பட்ட கட்டுரைகள் இல்லை.',
            imagePreview: 'பட முன்னோட்டு',
            loading: 'பொறுத்தப்படுகிறது...',
            by: 'ஆல்:',
            editContent: 'உள்ளடக்கம் தொகுக்கவும்',
            stopShowing: 'காட்சி நிறுத்தவும்',
            processing: 'செயலாக்கம்...',
            articleRemoved: 'கட்டுரைத் தளம் மீது காட்டப்படவில்லை',
            updateStatusFail: 'கட்டுரையின் நிலையைப் புதுப்பிக்க முடியவில்லை',
        }
    }
};

i18n

    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        resources,
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: { escapeValue: false }
    });

export default i18n;
