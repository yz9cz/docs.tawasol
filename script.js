// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize password protection first
    initPasswordProtection();

    // Initialize all functionality
    initNavigation();
    initAPITester();
    initCopyButtons();
    initSmoothScrolling();
    initDateField();
    initAnimations();
});

// Password Protection
function initPasswordProtection() {
    const passwordModal = document.getElementById('password-modal');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const passwordError = document.getElementById('password-error');
    const mainContent = document.getElementById('main-content');

    // Check if user is already authenticated
    const isAuthenticated = sessionStorage.getItem('api_authenticated');
    const storedToken = sessionStorage.getItem('api_token');

    if (isAuthenticated && storedToken) {
        unlockContent(storedToken);
        return;
    }

    // Show password modal
    passwordModal.style.display = 'flex';

    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = passwordInput.value.trim();

        if (!password) {
            showPasswordError('يرجى إدخال API Token');
            return;
        }

        // Validate password format (should be API token format)
        if (!password.startsWith('apify_api_')) {
            showPasswordError('API Token يجب أن يبدأ بـ apify_api_');
            return;
        }

        // Store token and authenticate
        sessionStorage.setItem('api_token', password);
        sessionStorage.setItem('api_authenticated', 'true');

        unlockContent(password);
    });

    function showPasswordError(message) {
        passwordError.textContent = message;
        passwordInput.style.borderColor = '#dc3545';
        setTimeout(() => {
            passwordError.textContent = '';
            passwordInput.style.borderColor = '';
        }, 3000);
    }

    function unlockContent(token) {
        passwordModal.style.display = 'none';
        mainContent.classList.add('unlocked');

        // Pre-fill the API token in the form
        const apiTokenInput = document.getElementById('api-token');
        if (apiTokenInput) {
            apiTokenInput.value = token;
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
        const apiUrl = `https://api.apify.com/v2/acts/brave_ivy~multi-company-payment-actor/run-sync-get-dataset-items?token=${apiToken}`;

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

        // Calculate execution time
        const endTime = Date.now();
        const executionTime = ((endTime - startTime) / 1000).toFixed(2);

        // Show the results
        let displayContent;
        if (typeof displayData === 'string') {
            displayContent = displayData || '[Empty Response]';
        } else {
            displayContent = JSON.stringify(displayData, null, 2);
        }

        responseContainer.innerHTML = `
            <div class="response-success">
                <h4>✅ تم استلام النتيجة</h4>
                <div class="execution-time">
                    <i class="fas fa-clock"></i>
                    وقت التنفيذ: ${executionTime} ثانية
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
        // Calculate execution time for error case
        const endTime = Date.now();
        const executionTime = ((endTime - startTime) / 1000).toFixed(2);

        // Show network or other errors
        responseContainer.innerHTML = `
            <div class="response-error">
                <h4>❌ خطأ في المعالجة</h4>
                <div class="execution-time">
                    <i class="fas fa-clock"></i>
                    وقت التنفيذ: ${executionTime} ثانية
                </div>
                <div class="response-content">
                    <pre>${JSON.stringify({
                        error: error.message,
                        type: 'Processing Error',
                        timestamp: new Date().toISOString()
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
    
    if (![50, 32, 47, 45, 148, 46, 29].includes(formData.product)) {
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
    const endpoint = 'https://api.apify.com/v2/acts/brave_ivy~multi-company-payment-actor/run-sync-get-dataset-items';

    if (navigator.clipboard) {
        navigator.clipboard.writeText(endpoint).then(() => {
            showCopySuccess('تم نسخ رابط API بنجاح');
        });
    } else {
        fallbackCopyTextToClipboard(endpoint);
    }
}



// Export functions for global access
window.copyToClipboard = copyToClipboard;
window.copyResponse = copyResponse;
window.logout = logout;
window.copyEndpoint = copyEndpoint;
window.logout = logout;
