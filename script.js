// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize login system first
    initLoginSystem();

    // Initialize all functionality
    initNavigation();
    initAPITester();
    initCopyButtons();
    initSmoothScrolling();
    initDateField();
    initAnimations();
    initInteractiveFeatures();
    initInputModeToggle();
    initTechEffects();
    initCounterAnimations();
    initPerformanceBars();
});

// Login System
function initLoginSystem() {
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const loginError = document.getElementById('login-error');
    const mainContent = document.getElementById('main-content');

    // Check if user is already authenticated
    const isAuthenticated = sessionStorage.getItem('user_authenticated');
    const storedUser = sessionStorage.getItem('current_user');

    if (isAuthenticated && storedUser) {
        unlockContent(JSON.parse(storedUser));
        return;
    }

    // Show login modal
    loginModal.style.display = 'flex';

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showLoginError('يرجى إدخال اسم المستخدم وكلمة المرور');
            return;
        }

        try {
            // Users data embedded in JavaScript (to avoid CORS issues)
            const users = [
                {
                    username: "noras",
                    password: "noras1234",
                    role: "administrator",
                    name: "نورس حسون"
                },
                {
                    username: "developer",
                    password: "dev2024",
                    role: "developer",
                    name: "مطور النظام"
                },
                {
                    username: "tester",
                    password: "test123",
                    role: "tester",
                    name: "مختبر النظام"
                },
                {
                    username: "user1",
                    password: "user123",
                    role: "user",
                    name: "مستخدم عادي"
                },
                {
                    username: "api_user",
                    password: "api2024",
                    role: "api_user",
                    name: "مستخدم API"
                }
            ];

            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Store user data and authenticate
                sessionStorage.setItem('current_user', JSON.stringify(user));
                sessionStorage.setItem('user_authenticated', 'true');
                unlockContent(user);
            } else {
                showLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        } catch (error) {
            console.error('Login error:', error);
            showLoginError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        }
    });

    function showLoginError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';

        // Add shake animation
        loginForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);

        setTimeout(() => {
            loginError.textContent = '';
            loginError.style.display = 'none';
        }, 4000);
    }

    function unlockContent(user) {
        // Add fade out animation to login modal
        loginModal.style.animation = 'fadeOut 0.5s ease-out';

        setTimeout(() => {
            loginModal.style.display = 'none';
            mainContent.classList.add('unlocked');

            // Show welcome message
            showWelcomeMessage(user);
        }, 500);

        // Update navigation with user info
        updateUserInterface(user);

        // Generate a mock API token for the user
        const mockApiToken = `apify_api_HwwpgSh4KlU65SrFttAyedaClpuhsI0c9qM3`;

        // Pre-fill the API token in the form
        const apiTokenInput = document.getElementById('api-token');
        if (apiTokenInput) {
            apiTokenInput.value = mockApiToken;
        }
    }

    function showWelcomeMessage(user) {
        // Create welcome notification
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'welcome-notification';
        welcomeDiv.innerHTML = `
            <div class="welcome-content">
                <i class="fas fa-check-circle"></i>
                <span>مرحباً ${user.name}! تم تسجيل الدخول بنجاح</span>
            </div>
        `;

        document.body.appendChild(welcomeDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            welcomeDiv.remove();
        }, 3000);
    }

    function updateUserInterface(user) {
        // Update logout button to show user name
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name} - تسجيل الخروج`;
            logoutBtn.title = `مسجل الدخول كـ ${user.name} (${user.role})`;
        }

        // Add user badge to navigation
        const navBrand = document.querySelector('.nav-brand');
        if (navBrand && !document.querySelector('.user-badge')) {
            const userBadge = document.createElement('div');
            userBadge.className = 'user-badge';
            userBadge.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${user.name}</span>
            `;
            navBrand.appendChild(userBadge);
        }
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// API Tester functionality
function initAPITester() {
    const form = document.getElementById('api-test-form');
    const responseContainer = document.getElementById('response-container');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            await sendAPIRequest();
        });
    }
}

async function sendAPIRequest() {
    const responseContainer = document.getElementById('response-container');
    const submitBtn = document.querySelector('#api-test-form button[type="submit"]');

    // Get form data
    const formData = {
        id: parseInt(document.getElementById('test-id').value),
        amount: document.getElementById('test-amount').value,
        number: document.getElementById('test-number').value,
        code: document.getElementById('test-code').value || "",
        product: parseInt(document.getElementById('test-product').value),
        type: document.getElementById('test-type').value,
        date: document.getElementById('test-date').value + '.000000Z'
    };

    // Get API token from session storage or form
    let apiToken = sessionStorage.getItem('api_token');
    const tokenInput = document.getElementById('api-token');

    if (tokenInput && tokenInput.value.trim()) {
        apiToken = tokenInput.value.trim();
        // Update session storage
        sessionStorage.setItem('api_token', apiToken);
    }

    // Validate API Token
    if (!apiToken || apiToken.trim() === '') {
        responseContainer.innerHTML = `
            <div class="response-error">
                <h4>❌ خطأ في البيانات</h4>
                <div class="response-content">
                    يرجى إدخال API Token صحيح
                </div>
            </div>
        `;
        return;
    }

    // Show loading state
    submitBtn.innerHTML = '<div class="loading"></div> جاري الإرسال...';
    submitBtn.disabled = true;

    // Record start time
    const startTime = Date.now();

    responseContainer.innerHTML = `
        <div class="response-placeholder">
            <div class="loading"></div>
            <p>تم إرسال الطلب، جاري انتظار النتيجة...</p>
        </div>
    `;

    try {
        // Make API call using the new endpoint
        const apiUrl = `https://api.apify.com/v2/acts/knurled_bucket~multi-company-payment-processor-with-sawa/run-sync-get-dataset-items?token=${apiToken}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const responseText = await response.text();

        // Try to parse as JSON for display
        let displayData;
        try {
            if (responseText.trim()) {
                displayData = JSON.parse(responseText);
            } else {
                displayData = responseText;
            }
        } catch (jsonError) {
            displayData = responseText;
        }

        // Calculate total request time
        const endTime = Date.now();
        const totalRequestTime = ((endTime - startTime) / 1000).toFixed(2);

        // Show the results
        let displayContent;
        if (typeof displayData === 'string') {
            displayContent = displayData || '[Empty Response]';
        } else {
            displayContent = JSON.stringify(displayData, null, 2);
        }

        // Extract execution time from response if available
        let executionTimeInfo = `وقت الطلب الكامل: ${totalRequestTime} ثانية`;
        if (typeof displayData === 'object' && displayData !== null) {
            if (displayData.execution_time_seconds) {
                executionTimeInfo = `
                    <div>وقت معالجة الأكتور: ${displayData.execution_time_seconds} ثانية (${displayData.execution_time_ms} مللي ثانية)</div>
                    <div>وقت الطلب الكامل: ${totalRequestTime} ثانية</div>
                `;
            }
        }

        responseContainer.innerHTML = `
            <div class="response-success">
                <h4>✅ تم استلام النتيجة</h4>
                <div class="execution-time">
                    <i class="fas fa-clock"></i>
                    ${executionTimeInfo}
                </div>
                <div class="response-content">
                    <pre>${displayContent}</pre>
                </div>
                <button class="copy-btn" onclick="copyResponse()">
                    <i class="fas fa-copy"></i>
                    نسخ الاستجابة
                </button>
            </div>
        `;

    } catch (error) {
        // Calculate total request time for error case
        const endTime = Date.now();
        const totalRequestTime = ((endTime - startTime) / 1000).toFixed(2);

        // Show network or other errors
        responseContainer.innerHTML = `
            <div class="response-error">
                <h4>❌ خطأ في المعالجة</h4>
                <div class="execution-time">
                    <i class="fas fa-clock"></i>
                    وقت الطلب الكامل: ${totalRequestTime} ثانية
                </div>
                <div class="response-content">
                    <pre>${JSON.stringify({
                        error: error.message,
                        type: 'Processing Error'
                    }, null, 2)}</pre>
                </div>
                <button class="copy-btn" onclick="copyResponse()">
                    <i class="fas fa-copy"></i>
                    نسخ الاستجابة
                </button>
            </div>
        `;
    } finally {
        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب';
        submitBtn.disabled = false;
    }
}

// Remove the simulate function since we're using real API calls now

// Copy functionality
function initCopyButtons() {
    // Add event listeners to existing copy buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
            const button = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
            const targetId = button.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (targetId) {
                copyToClipboard(targetId);
            }
        }
    });
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const text = element.textContent || element.innerText;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess();
            }).catch(() => {
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function copyResponse() {
    const responseContent = document.querySelector('.response-content');
    if (responseContent) {
        const text = responseContent.textContent || responseContent.innerText;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess();
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    }
}

function showCopySuccess(message = '✅ تم نسخ النص بنجاح') {
    // Create and show success message
    const messageEl = document.createElement('div');
    messageEl.innerHTML = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 300);
    }, 2000);
}

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize date field with current date
function initDateField() {
    const dateField = document.getElementById('test-date');
    if (dateField) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        dateField.value = localDateTime;
    }
}

// Initialize animations
function initAnimations() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 1rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);
}

// Utility functions
function formatJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

function validateForm(formData) {
    const required = ['id', 'amount', 'number', 'product', 'type', 'date'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
        throw new Error(`الحقول المطلوبة مفقودة: ${missing.join(', ')}`);
    }

    if (![50, 32, 47, 45, 148, 46, 33].includes(formData.product)) {
        throw new Error(`معرف المنتج غير صحيح: ${formData.product}`);
    }

    return true;
}



// Logout function
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        sessionStorage.removeItem('api_token');
        sessionStorage.removeItem('api_authenticated');
        location.reload();
    }
}

// Logout function
function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        sessionStorage.removeItem('api_token');
        sessionStorage.removeItem('api_authenticated');
        location.reload();
    }
}

// Copy API endpoint function
function copyEndpoint() {
    const endpoint = 'https://api.apify.com/v2/acts/knurled_bucket~multi-company-payment-processor-with-sawa/run-sync-get-dataset-items';

    if (navigator.clipboard) {
        navigator.clipboard.writeText(endpoint).then(() => {
            showCopySuccess('تم نسخ رابط API بنجاح');
        });
    } else {
        fallbackCopyTextToClipboard(endpoint);
    }
}



// Interactive Features
function initInteractiveFeatures() {
    // Add hover effects to improvement cards
    const improvementCards = document.querySelectorAll('.improvement-card');
    improvementCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const animation = this.dataset.animation;
            this.classList.add(`animate-${animation}`);
        });

        card.addEventListener('mouseleave', function() {
            const animation = this.dataset.animation;
            this.classList.remove(`animate-${animation}`);
        });

        card.addEventListener('click', function() {
            triggerCardCelebration(this);
        });
    });

    // Add floating particles
    createFloatingParticles();

    // Add progress indicators
    initProgressIndicators();
}

function triggerCelebration() {
    // Create confetti effect
    createConfetti();

    // Play celebration sound (if available)
    playSound('celebration');

    // Animate all improvement cards
    const cards = document.querySelectorAll('.improvement-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('celebrate');
            setTimeout(() => card.classList.remove('celebrate'), 1000);
        }, index * 200);
    });

    // Show celebration message
    showCelebrationMessage();
}

function triggerCardCelebration(card) {
    card.classList.add('card-pop');
    setTimeout(() => card.classList.remove('card-pop'), 300);

    // Create mini confetti
    createMiniConfetti(card);
}

function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

function createMiniConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#667eea', '#764ba2', '#f093fb'];

    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'mini-confetti';
        confetti.style.left = (rect.left + rect.width / 2) + 'px';
        confetti.style.top = (rect.top + rect.height / 2) + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 1000);
    }
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particleContainer.appendChild(particle);
    }
}

function showCelebrationMessage() {
    const message = document.createElement('div');
    message.className = 'celebration-message';
    message.innerHTML = `
        <div class="celebration-content">
            <i class="fas fa-star"></i>
            <h3>مبروك! 🎉</h3>
            <p>شركة sawa تعمل الآن بشكل مثالي!</p>
        </div>
    `;
    document.body.appendChild(message);

    setTimeout(() => message.classList.add('show'), 100);
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

function playSound(type) {
    // Create audio context for sound effects
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'celebration') {
            // Play a happy tune
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        }

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Fallback for browsers that don't support Web Audio API
        console.log('🎵 Celebration sound!');
    }
}

// Input Mode Toggle Functions
function initInputModeToggle() {
    // Initialize with form mode
    switchInputMode('form');

    // Add event listeners to form fields to auto-update JSON
    const formFields = ['test-id', 'test-amount', 'test-number', 'test-code', 'test-product', 'test-type', 'test-date'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                // Only update JSON if we're in JSON mode
                const jsonContainer = document.getElementById('json-input-container');
                if (jsonContainer && jsonContainer.style.display !== 'none') {
                    updateJSONFromForm();
                }
            });

            field.addEventListener('change', () => {
                // Only update JSON if we're in JSON mode
                const jsonContainer = document.getElementById('json-input-container');
                if (jsonContainer && jsonContainer.style.display !== 'none') {
                    updateJSONFromForm();
                }
            });
        }
    });
}

function switchInputMode(mode) {
    console.log('Switching to mode:', mode);

    const formElement = document.getElementById('api-test-form');
    const jsonContainer = document.getElementById('json-input-container');
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    console.log('Form element:', formElement);
    console.log('JSON container:', jsonContainer);

    // Update toggle buttons
    toggleBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });

    if (mode === 'form') {
        if (formElement) formElement.style.display = 'block';
        if (jsonContainer) jsonContainer.style.display = 'none';
        console.log('Switched to form mode');
    } else if (mode === 'json') {
        if (formElement) formElement.style.display = 'none';
        if (jsonContainer) jsonContainer.style.display = 'block';
        console.log('Switched to JSON mode');

        // Auto-generate JSON from current form data immediately
        updateJSONFromForm();
    }
}

function updateJSONFromForm() {
    console.log('updateJSONFromForm called');

    try {
        // Get current form values
        const idField = document.getElementById('test-id');
        const amountField = document.getElementById('test-amount');
        const numberField = document.getElementById('test-number');
        const codeField = document.getElementById('test-code');
        const productField = document.getElementById('test-product');
        const typeField = document.getElementById('test-type');
        const dateField = document.getElementById('test-date');
        const jsonInput = document.getElementById('json-input');

        console.log('Form fields found:', {
            idField: !!idField,
            amountField: !!amountField,
            numberField: !!numberField,
            codeField: !!codeField,
            productField: !!productField,
            typeField: !!typeField,
            dateField: !!dateField,
            jsonInput: !!jsonInput
        });

        // Check if elements exist
        if (!jsonInput) {
            console.error('JSON input element not found');
            return;
        }

        // Get values with fallbacks
        const idValue = idField ? idField.value : '';
        const amountValue = amountField ? amountField.value : '';
        const numberValue = numberField ? numberField.value : '';
        const codeValue = codeField ? codeField.value : '';
        const productValue = productField ? productField.value : '';
        const typeValue = typeField ? typeField.value : '';
        const dateValue = dateField ? dateField.value : '';

        console.log('Form values:', {
            idValue, amountValue, numberValue, codeValue, productValue, typeValue, dateValue
        });

        // Create form data object
        const formData = {
            id: idValue ? parseInt(idValue) : 587193,
            amount: amountValue || "38000",
            number: numberValue || "6589536",
            code: codeValue || null,
            product: productValue ? parseInt(productValue) : 50,
            type: typeValue || "تغذية رصيد",
            date: dateValue ? dateValue + 'T00:00:00.000000Z' : new Date().toISOString()
        };

        console.log('Generated form data:', formData);

        // Update JSON input
        jsonInput.value = JSON.stringify(formData, null, 2);
        console.log('JSON input updated');

        // Validate the JSON
        validateJSON();

        console.log('JSON updated successfully');

    } catch (error) {
        console.error('Error updating JSON from form:', error);
    }
}

function formatJSON() {
    const textarea = document.getElementById('json-input');
    try {
        const parsed = JSON.parse(textarea.value);
        textarea.value = JSON.stringify(parsed, null, 2);
        validateJSON();
    } catch (e) {
        showJSONError('JSON غير صحيح - لا يمكن التنسيق');
    }
}

function validateJSON() {
    const textarea = document.getElementById('json-input');
    const validation = document.getElementById('json-validation');

    try {
        const parsed = JSON.parse(textarea.value);

        // Check required fields
        const required = ['id', 'amount', 'number', 'product', 'type', 'date'];
        const missing = required.filter(field => !parsed[field]);

        if (missing.length > 0) {
            validation.innerHTML = `<i class="fas fa-exclamation-triangle"></i> حقول مفقودة: ${missing.join(', ')}`;
            validation.className = 'json-validation warning';
        } else {
            validation.innerHTML = '<i class="fas fa-check"></i> JSON صحيح وجاهز للإرسال';
            validation.className = 'json-validation success';
        }
    } catch (e) {
        validation.innerHTML = '<i class="fas fa-times"></i> JSON غير صحيح';
        validation.className = 'json-validation error';
    }
}

function generateSampleJSON() {
    const sampleData = {
        id: 587193,
        amount: "38000",
        number: "6589536",
        code: "",
        product: 50,
        type: "تغذية رصيد",
        date: new Date().toISOString()
    };

    document.getElementById('json-input').value = JSON.stringify(sampleData, null, 2);
    validateJSON();
}

function showJSONError(message) {
    const validation = document.getElementById('json-validation');
    validation.innerHTML = `<i class="fas fa-times"></i> ${message}`;
    validation.className = 'json-validation error';
}

async function sendJSONRequest() {
    const textarea = document.getElementById('json-input');
    const apiToken = document.getElementById('api-token').value;

    if (!apiToken) {
        showJSONError('يرجى إدخال API Token');
        return;
    }

    try {
        const requestData = JSON.parse(textarea.value);

        // Use the existing sendAPIRequest logic but with JSON data
        const responseContainer = document.getElementById('response-container');
        const startTime = Date.now();

        responseContainer.innerHTML = `
            <div class="response-placeholder">
                <div class="loading"></div>
                <p>تم إرسال طلب JSON، جاري انتظار النتيجة...</p>
            </div>
        `;

        const apiUrl = `https://api.apify.com/v2/acts/knurled_bucket~multi-company-payment-processor-with-sawa/run-sync-get-dataset-items?token=${apiToken}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const responseText = await response.text();
        const endTime = Date.now();
        const totalRequestTime = ((endTime - startTime) / 1000).toFixed(2);

        // Display response
        let displayData;
        try {
            displayData = responseText.trim() ? JSON.parse(responseText) : responseText;
        } catch (jsonError) {
            displayData = responseText;
        }

        const displayContent = typeof displayData === 'string' ?
            displayData || '[Empty Response]' :
            JSON.stringify(displayData, null, 2);

        responseContainer.innerHTML = `
            <div class="response-success">
                <h4>✅ تم إرسال الطلب بنجاح</h4>
                <div class="response-meta">
                    <span>وقت الاستجابة: ${totalRequestTime} ثانية</span>
                    <span>حالة HTTP: ${response.status}</span>
                </div>
                <div class="response-content">
                    <pre><code>${displayContent}</code></pre>
                </div>
                <button class="copy-response-btn" onclick="copyResponse()">
                    <i class="fas fa-copy"></i>
                    نسخ الاستجابة
                </button>
            </div>
        `;

    } catch (e) {
        showJSONError('خطأ في إرسال الطلب: ' + e.message);
    }
}

// Tech Effects Initialization
function initTechEffects() {
    createFloatingParticles();
    initMatrixRain();
    initHolographicDisplay();
}

// Create floating particles
function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    if (!particleContainer) return;

    // Create additional particle elements (reduced number)
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'tech-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 2 + 1}px;
            height: ${Math.random() * 2 + 1}px;
            background: ${['#00ffff', '#ff00ff'][Math.floor(Math.random() * 2)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 15 + 20}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
            opacity: ${Math.random() * 0.3 + 0.1};
        `;
        particleContainer.appendChild(particle);
    }
}

// Initialize matrix rain effect (simplified)
function initMatrixRain() {
    const matrixElements = document.querySelectorAll('.matrix-rain');
    matrixElements.forEach(matrix => {
        const chars = '01';
        let matrixText = '';
        for (let i = 0; i < 200; i++) {
            matrixText += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
            if (i % 20 === 0) matrixText += '\n';
        }

        const textElement = document.createElement('div');
        textElement.style.cssText = `
            position: absolute;
            top: -100%;
            left: 0;
            width: 100%;
            height: 200%;
            color: rgba(0, 255, 0, 0.05);
            font-family: 'Courier New', monospace;
            font-size: 10px;
            line-height: 25px;
            animation: matrixFall 25s linear infinite;
            white-space: pre-wrap;
            word-break: break-all;
            animation-delay: ${Math.random() * 10}s;
        `;
        textElement.textContent = matrixText;
        matrix.appendChild(textElement);
    });
}

// Initialize holographic display
function initHolographicDisplay() {
    const holoDisplay = document.querySelector('.holographic-display');
    if (!holoDisplay) return;

    // Add interactive hover effects
    holoDisplay.addEventListener('mouseenter', () => {
        holoDisplay.style.transform = 'translateY(-50%) scale(1.05)';
    });

    holoDisplay.addEventListener('mouseleave', () => {
        holoDisplay.style.transform = 'translateY(-50%) scale(1)';
    });
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            if (target === 99.9) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    };

    // Intersection Observer for triggering animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// Performance bars animation
function initPerformanceBars() {
    const performanceBars = document.querySelectorAll('.performance-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const performance = bar.getAttribute('data-performance');
                setTimeout(() => {
                    bar.style.width = performance + '%';
                }, 500);
                observer.unobserve(bar);
            }
        });
    });

    performanceBars.forEach(bar => observer.observe(bar));
}

// Logout function
function logout() {
    // Show confirmation dialog
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // Clear session data
        sessionStorage.removeItem('user_authenticated');
        sessionStorage.removeItem('current_user');

        // Show logout message
        const logoutDiv = document.createElement('div');
        logoutDiv.className = 'logout-notification';
        logoutDiv.innerHTML = `
            <div class="logout-content">
                <i class="fas fa-sign-out-alt"></i>
                <span>تم تسجيل الخروج بنجاح</span>
            </div>
        `;

        document.body.appendChild(logoutDiv);

        // Reload page after short delay
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

// Export functions for global access
window.copyToClipboard = copyToClipboard;
window.copyResponse = copyResponse;
window.logout = logout;
window.copyEndpoint = copyEndpoint;
window.triggerCelebration = triggerCelebration;
window.switchInputMode = switchInputMode;
window.updateJSONFromForm = updateJSONFromForm;
window.formatJSON = formatJSON;
window.validateJSON = validateJSON;
window.generateSampleJSON = generateSampleJSON;
window.sendJSONRequest = sendJSONRequest;
