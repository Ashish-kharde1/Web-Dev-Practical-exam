document.addEventListener('DOMContentLoaded', function() {
    // Get all service items
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceDetails = document.querySelectorAll('.service-detail-content');
    const defaultMessage = document.querySelector('.default-message');

    // Add click event listener to each service item
    if (serviceItems.length > 0) {
        serviceItems.forEach(item => {
            item.addEventListener('click', function() {
                // Get the service type from data attribute
                const serviceType = this.getAttribute('data-service');

                // Remove active class from all items
                serviceItems.forEach(i => i.classList.remove('active'));

                // Add active class to clicked item
                this.classList.add('active');

                // Hide all service details
                serviceDetails.forEach(detail => {
                    detail.style.display = 'none';
                });

                // Hide default message
                if (defaultMessage) {
                    defaultMessage.style.display = 'none';
                }

                // Show the selected service details
                const selectedDetail = document.getElementById(`${serviceType}-details`);
                if (selectedDetail) {
                    selectedDetail.style.display = 'block';
                }
            });
        });
    }

    // Carousel auto-play with pause on hover
    const carousel = document.getElementById('carouselExampleCaptions');
    if (carousel) {
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000,
            pause: 'hover'
        });

        // Add animation to carousel captions
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        carouselItems.forEach(item => {
            const caption = item.querySelector('.carousel-caption');
            if (caption) {
                caption.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }

    // Add animation to cards on scroll
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        const animateCards = () => {
            cards.forEach(card => {
                const cardPosition = card.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;

                if (cardPosition < screenPosition) {
                    card.classList.add('card-visible');
                }
            });
        };

        // Initial check
        animateCards();

        // Check on scroll
        window.addEventListener('scroll', animateCards);
    }

    // Form validation for login and register forms
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const requiredFields = loginForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }

                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value.trim())) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    }
                }

                // Password validation for register form
                if (field.id === 'floatingPassword' && field.value.trim()) {
                    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
                    if (!passwordRegex.test(field.value.trim())) {
                        field.classList.add('is-invalid');
                        isValid = false;

                        // Add password requirements message
                        let feedbackElement = field.nextElementSibling.nextElementSibling;
                        if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
                            feedbackElement = document.createElement('div');
                            feedbackElement.className = 'invalid-feedback';
                            field.parentNode.appendChild(feedbackElement);
                        }
                        feedbackElement.textContent = 'Password must be at least 8 characters with letters and numbers';
                    }
                }

                // Confirm password validation
                if (field.id === 'floatingConfirmPassword' && field.value.trim()) {
                    const password = document.getElementById('floatingPassword');
                    if (password && field.value !== password.value) {
                        field.classList.add('is-invalid');
                        isValid = false;

                        // Add password match message
                        let feedbackElement = field.nextElementSibling.nextElementSibling;
                        if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
                            feedbackElement = document.createElement('div');
                            feedbackElement.className = 'invalid-feedback';
                            field.parentNode.appendChild(feedbackElement);
                        }
                        feedbackElement.textContent = 'Passwords do not match';
                    }
                }
            });

            if (isValid) {
                // Simulate successful login/register
                const formType = loginForm.closest('.auth-section').querySelector('h2').textContent;

                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success mt-3';
                successMessage.textContent = formType.includes('Login') ?
                    'Login successful! Redirecting to your account...' :
                    'Registration successful! Please check your email to verify your account.';

                loginForm.appendChild(successMessage);

                // Reset form
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
});
