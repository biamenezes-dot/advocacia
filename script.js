// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');
    const contactForm = document.getElementById('contactForm');
    const header = document.querySelector('.header');
    
    // Funcionalidade do carrossel
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    window.changeSlide = function(direction) {
        currentSlideIndex += direction;
        
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        }
        
        showSlide(currentSlideIndex);
    }

    window.currentSlide = function(index) {
        currentSlideIndex = index - 1;
        showSlide(currentSlideIndex);
    }

    // Auto-play do carrossel
    function autoPlay() {
        if (slides.length > 0) {
            changeSlide(1);
        }
    }

    // Inicializar o carrossel
    if (slides.length > 0) {
        showSlide(0);
        // Auto-play a cada 5 segundos
        setInterval(autoPlay, 5000);
    }
    
    // Menu hambúrguer responsivo
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        }
    });
    
    // Rolagem suave para seções
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efeito de scroll no header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });
    
    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .team-member, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Validação e envio do formulário de contato
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Elementos do formulário
            const nome = document.getElementById('nome');
            const email = document.getElementById('email');
            const telefone = document.getElementById('telefone');
            const assunto = document.getElementById('assunto');
            const mensagem = document.getElementById('mensagem');
            const submitButton = document.querySelector('.submit-button');
            
            // Limpar mensagens de erro anteriores
            clearErrorMessages();
            
            let isValid = true;
            
            // Validação do nome
            if (!nome.value.trim()) {
                showError(nome, 'Por favor, informe seu nome completo.');
                isValid = false;
            } else if (nome.value.trim().length < 2) {
                showError(nome, 'Nome deve ter pelo menos 2 caracteres.');
                isValid = false;
            }
            
            // Validação do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim()) {
                showError(email, 'Por favor, informe seu e-mail.');
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                showError(email, 'Por favor, informe um e-mail válido.');
                isValid = false;
            }
            
            // Validação do telefone (opcional, mas se preenchido deve ser válido)
            if (telefone.value.trim()) {
                const telefoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
                if (!telefoneRegex.test(telefone.value.trim())) {
                    showError(telefone, 'Por favor, informe um telefone válido.');
                    isValid = false;
                }
            }
            
            // Validação do assunto
            if (!assunto.value) {
                showError(assunto, 'Por favor, selecione um assunto.');
                isValid = false;
            }
            
            // Validação da mensagem
            if (!mensagem.value.trim()) {
                showError(mensagem, 'Por favor, escreva sua mensagem.');
                isValid = false;
            } else if (mensagem.value.trim().length < 10) {
                showError(mensagem, 'Mensagem deve ter pelo menos 10 caracteres.');
                isValid = false;
            }
            
            // Se o formulário é válido, simular envio
            if (isValid) {
                // Desabilitar botão e mostrar loading
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                
                // Construir a mensagem para o WhatsApp
                const phoneNumber = '5582991320458'; // Número do WhatsApp do vendedor
                const message = `*Olá, vim pelo site:*
Nome: ${nome.value.trim()}
E-mail: ${email.value.trim()}
Telefone: ${telefone.value.trim()}
Assunto: ${assunto.value}
Mensagem: ${mensagem.value.trim()}`;
                
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
                
                // Abrir o WhatsApp em uma nova aba
                window.open(whatsappUrl, '_blank');
                
                // Mostrar mensagem de sucesso e limpar formulário após o redirecionamento
                showSuccessMessage();
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensagem';
            }
        });
    }
    
    // Função para mostrar erro
    function showError(element, message) {
        element.style.borderColor = '#e53e3e';
        
        // Remover mensagem de erro existente
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Criar nova mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e53e3e';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        element.parentNode.appendChild(errorDiv);
    }
    
    // Função para limpar mensagens de erro
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#e2e8f0';
        });
    }
    
    // Função para mostrar mensagem de sucesso
    function showSuccessMessage() {
        // Remover mensagem existente
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Criar mensagem de sucesso
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.backgroundColor = '#48bb78';
        successDiv.style.color = 'white';
        successDiv.style.padding = '1rem';
        successDiv.style.borderRadius = '8px';
        successDiv.style.marginBottom = '1rem';
        successDiv.style.textAlign = 'center';
        successDiv.innerHTML = '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.';
        
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        
        // Remover mensagem após 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
        
        // Scroll para o topo do formulário
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Efeito de digitação no título principal
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Iniciar efeito após um pequeno delay
        setTimeout(typeWriter, 1000);
    }
    
    // Contador animado (exemplo para estatísticas futuras)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Scroll to top button (pode ser adicionado no futuro)
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Mostrar/ocultar botão de scroll to top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Funcionalidade do botão scroll to top
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
});

// Função para detectar se o usuário está em dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para otimizar performance em dispositivos móveis
function optimizeForMobile() {
    if (isMobile()) {
        // Reduzir animações em dispositivos móveis para melhor performance
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Executar otimização ao carregar e redimensionar
window.addEventListener('load', optimizeForMobile);
window.addEventListener('resize', optimizeForMobile);

