// Современный JavaScript для сайта РСК Миллениум

// Глобальные переменные
let isScrolling = false;
let animatedElements = [];
let countersAnimated = false;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Основная функция инициализации
function initApp() {
    initSmoothScroll();
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    initCounters();
    initModals();
    initForms();
    initServiceButtons();
    initActiveNavigation();
    
    console.log('РСК Миллениум - сайт загружен');
}

// Плавная прокрутка для якорных ссылок
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            
            if (href === '#') {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрыть мобильное меню если открыто
                closeMobileMenu();
                
                // Обновить активную навигацию
                updateActiveNavigation(href);
            }
        });
    });
}

// Обновление активной навигации
function updateActiveNavigation(activeHref) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

// Обработка скролла для хедера
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                // Добавляем класс при скролле
                if (currentScrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                lastScrollY = currentScrollY;
                isScrolling = false;
            });
        }
        isScrolling = true;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navigation = document.getElementById('navigation');
    
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!navigation.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const navigation = document.getElementById('navigation');
    const menuToggle = document.getElementById('menuToggle');
    
    if (navigation && menuToggle) {
        navigation.classList.toggle('mobile-open');
        menuToggle.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const navigation = document.getElementById('navigation');
    const menuToggle = document.getElementById('menuToggle');
    
    if (navigation && menuToggle) {
        navigation.classList.remove('mobile-open');
        menuToggle.classList.remove('active');
    }
}

// Анимации при прокрутке
function initScrollAnimations() {
    // Создаем observer для отслеживания элементов
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Анимация счетчиков при появлении hero секции
                if (entry.target.id === 'hero' && !countersAnimated) {
                    setTimeout(() => {
                        animateCounters();
                    }, 500);
                    countersAnimated = true;
                }
            }
        });
    }, observerOptions);
    
    // Добавляем элементы для наблюдения
    const elementsToAnimate = [
        '#hero',
        '.about-card',
        '.service-card',
        '.advantage-card',
        '.portfolio-card',
        '.process-step',
        '.review-card',
        '.contact-info',
        '.contact-form'
    ];
    
    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('fade-in');
            // Добавляем задержку для поочередной анимации
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });
}

// Анимированные счетчики в hero секции
function initCounters() {
    const counters = document.querySelectorAll('.hero-stat-number[data-count]');
    animatedElements = Array.from(counters);
}

function animateCounters() {
    animatedElements.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 секунды
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Модальные окна
function initModals() {
    // Кнопка "Заказать звонок"
    const callBtn = document.getElementById('callBtn');
    const callModal = document.getElementById('callModal');
    const closeCallModal = document.getElementById('closeCallModal');
    
    if (callBtn && callModal) {
        callBtn.addEventListener('click', function() {
            openModal(callModal);
        });
    }
    
    if (closeCallModal && callModal) {
        closeCallModal.addEventListener('click', function() {
            closeModal(callModal);
        });
    }
    
    // Кнопка "Получить расчёт стоимости" в hero
    const quoteBtn = document.getElementById('quoteBtn');
    if (quoteBtn) {
        quoteBtn.addEventListener('click', function() {
            scrollToContactForm();
        });
    }
    
    // Закрытие модального окна при клике на overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        }
    });
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function openModal(modal) {
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Фокус на первом поле ввода
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Очистка формы
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            clearFormMessages(form);
        }
    }
}

// Функция прокрутки к форме контактов
function scrollToContactForm() {
    const contactForm = document.getElementById('contacts');
    if (contactForm) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = contactForm.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Подсвечиваем форму
        const contactFormElement = document.querySelector('.contact-form');
        if (contactFormElement) {
            contactFormElement.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                contactFormElement.style.animation = '';
            }, 1000);
        }
    }
}

// Обработка форм
function initForms() {
    // Основная форма контактов
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'contact');
        });
    }
    
    // Форма заказа звонка
    const callForm = document.getElementById('callForm');
    if (callForm) {
        callForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'call');
        });
    }
    
    // Валидация в реальном времени
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function handleFormSubmit(form, type) {
    // Очищаем предыдущие сообщения
    clearFormMessages(form);
    
    // Собираем данные формы
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    // Валидация
    const errors = validateForm(data, type);
    if (errors.length > 0) {
        showFormErrors(form, errors);
        return;
    }
    
    // Отправка формы
    submitForm(form, data, type);
}

function validateForm(data, type) {
    const errors = [];
    
    // Проверка имени
    if (!data.name || data.name.length < 2) {
        errors.push({
            field: 'name',
            message: 'Имя должно содержать минимум 2 символа'
        });
    }
    
    // Проверка телефона
    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push({
            field: 'phone',
            message: 'Введите корректный номер телефона'
        });
    }
    
    // Проверка email (если заполнен)
    if (data.email && !isValidEmail(data.email)) {
        errors.push({
            field: 'email',
            message: 'Введите корректный email адрес'
        });
    }
    
    // Проверка услуги для основной формы
    if (type === 'contact' && !data.service) {
        errors.push({
            field: 'service',
            message: 'Выберите интересующую услугу'
        });
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[\+]?[\d]{10,12}$/;
    return phoneRegex.test(cleanPhone);
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    switch (field.type) {
        case 'text':
            if (field.required && value.length < 2) {
                isValid = false;
                message = 'Минимум 2 символа';
            }
            break;
        case 'email':
            if (value && !isValidEmail(value)) {
                isValid = false;
                message = 'Некорректный email';
            }
            break;
        case 'tel':
            if (field.required && !isValidPhone(value)) {
                isValid = false;
                message = 'Некорректный номер телефона';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, message);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFormErrors(form, errors) {
    errors.forEach(error => {
        const field = form.querySelector(`[name="${error.field}"]`);
        if (field) {
            showFieldError(field, error.message);
        }
    });
    
    // Показываем общее сообщение об ошибке
    showFormMessage(form, 'Пожалуйста, исправьте ошибки в форме', 'error');
}

function clearFormMessages(form) {
    // Удаляем сообщения об ошибках полей
    const fieldErrors = form.querySelectorAll('.field-error');
    fieldErrors.forEach(error => error.remove());
    
    // Удаляем общие сообщения
    const messages = form.querySelectorAll('.form-message');
    messages.forEach(message => message.remove());
    
    // Убираем классы ошибок
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

function showFormMessage(form, text, type = 'success') {
    clearFormMessages(form);
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-${type}`;
    messageElement.textContent = text;
    
    form.insertBefore(messageElement, form.firstChild);
    
    // Автоматически убираем сообщение через 5 секунд
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

function submitForm(form, data, type) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Показываем индикатор загрузки
    submitBtn.textContent = 'Отправляется...';
    submitBtn.disabled = true;
    
    // Имитируем отправку на сервер
    setTimeout(() => {
        // Логируем данные (в реальном приложении отправили бы на сервер)
        console.log('Отправка формы:', type, data);
        
        // Показываем успешное сообщение
        let successMessage = '';
        if (type === 'contact') {
            successMessage = 'Спасибо за заявку! Мы рассчитаем стоимость и свяжемся с вами в течение часа.';
        } else if (type === 'call') {
            successMessage = 'Спасибо! Мы перезвоним вам в течение 15 минут.';
        }
        
        showFormMessage(form, successMessage, 'success');
        
        // Сбрасываем форму
        form.reset();
        
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Закрываем модальное окно если это форма в модалке
        const modal = form.closest('.modal');
        if (modal) {
            setTimeout(() => closeModal(modal), 2000);
        }
        
    }, 2000); // 2 секунды задержки для имитации отправки
}

// Кнопки услуг
function initServiceButtons() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const serviceCard = this.closest('.service-card');
            const serviceTitle = serviceCard.querySelector('.service-title').textContent;
            
            // Прокручиваем к форме контактов
            scrollToContactForm();
            
            // Через небольшую задержку предзаполняем услугу в форме
            setTimeout(() => {
                const serviceSelect = document.getElementById('service');
                if (serviceSelect) {
                    // Находим соответствующий option по названию услуги
                    const options = serviceSelect.querySelectorAll('option');
                    let matched = false;
                    
                    options.forEach(option => {
                        if (!matched && option.value) {
                            const optionText = option.textContent.toLowerCase();
                            const serviceText = serviceTitle.toLowerCase();
                            
                            // Проверяем совпадения по ключевым словам
                            if (
                                (serviceText.includes('штукатурные') && option.value === 'plastering') ||
                                (serviceText.includes('малярные') && option.value === 'painting') ||
                                (serviceText.includes('облицовочные') && option.value === 'tiling') ||
                                (serviceText.includes('напольные') && option.value === 'flooring') ||
                                (serviceText.includes('потолочные') && option.value === 'ceiling') ||
                                (serviceText.includes('декоративная') && option.value === 'decorative')
                            ) {
                                serviceSelect.value = option.value;
                                matched = true;
                                
                                // Визуально подсвечиваем выбранную услугу
                                serviceSelect.style.borderColor = 'var(--color-primary)';
                                serviceSelect.style.backgroundColor = 'rgba(var(--color-teal-300-rgb), 0.05)';
                                
                                setTimeout(() => {
                                    serviceSelect.style.borderColor = '';
                                    serviceSelect.style.backgroundColor = '';
                                }, 2000);
                            }
                        }
                    });
                }
            }, 800);
        });
    });
}

// Активная навигация
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const navLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            
            if (entry.isIntersecting) {
                // Убираем active у всех ссылок
                navLinks.forEach(link => link.classList.remove('active'));
                // Добавляем active к текущей
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Дополнительные функции для улучшения UX

// Плавное появление элементов при загрузке страницы
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Обработка ошибок JavaScript
window.addEventListener('error', function(e) {
    console.error('Ошибка JavaScript:', e.error);
});

// Предотвращение отправки формы по Enter (кроме textarea)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
        const form = e.target.closest('form');
        if (form) {
            e.preventDefault();
        }
    }
});

// Улучшение доступности - управление с клавиатуры
document.addEventListener('keydown', function(e) {
    // Закрытие модального окна по Escape
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal) {
            closeModal(openModal);
        }
    }
});

// Оптимизация производительности - debounce для ресайза
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Пересчитываем позиции элементов при изменении размера окна
        console.log('Окно изменило размер');
    }, 250);
});

// Экспорт функций для возможного использования извне
window.RSKMillennium = {
    openModal,
    closeModal,
    showFormMessage,
    validateForm,
    scrollToContactForm
};