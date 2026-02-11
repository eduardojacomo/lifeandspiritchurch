<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useLanguage } from '../stores/languageStore';

const uselanguage = useLanguage();
const { currentLocaleKey, locale } = storeToRefs(uselanguage);
const { t } = useI18n();

// Form state
const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref(false);

const headerContact = ref({
  title: {
    pt: 'Entre em Contato',
    en: 'Get in Touch'
  },
  subtitle: {
    pt: 'Estamos aqui para você',
    en: 'We are here for you'
  }
});

// Church info
const churchInfo = {
  name: {
    pt: 'Life & Spirit Church - Claremorris',
    en: 'Life & Spirit Church - Claremorris'
  },
  address: {
    pt: 'Lakeside Retail Park, Unit 13 Ballindine Road, Clare, Claremorris, Co. Mayo, Irlanda',
    en: 'Lakeside Retail Park, Unit 13 Ballindine Road, Clare, Claremorris, Co. Mayo, Ireland'
  },
  phone: '+353 89 450 7333',
  email: 'contact@lifeandspiritchurch.com',
  coordinates: {
    lat: 53.7167,
    lng: -8.9833
  }
};

const socialLinks = [
  {
    name: 'Instagram',
    icon: 'fa-brands fa-instagram',
    url: 'https://instagram.com/lifeandspiritchurch',
    color: '#E4405F'
  },
  {
    name: 'Facebook',
    icon: 'fa-brands fa-facebook',
    url: 'https://facebook.com/lifeandspiritchurch',
    color: '#1877F2'
  },
  {
    name: 'YouTube',
    icon: 'fa-brands fa-youtube',
    url: 'https://youtube.com/@lifeandspiritchurch',
    color: '#FF0000'
  },
  {
    name: 'WhatsApp',
    icon: 'fa-brands fa-whatsapp',
    url: 'https://wa.me/353894507333',
    color: '#25D366'
  }
];

// Google Maps URL
const googleMapsUrl = computed(() => {
  const address = encodeURIComponent(churchInfo.address[locale.value]);
  return `https://www.google.com/maps/search/?api=1&query=${address}`;
});

// Form validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const isFormValid = computed(() => {
  return (
    form.value.name.trim() !== '' &&
    form.value.email.trim() !== '' &&
    validateEmail(form.value.email) &&
    form.value.message.trim() !== ''
  );
});

// Submit form
const submitForm = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  submitError.value = false;

  try {
    // Aqui você implementaria o envio real do email
    // Exemplo com uma API:
    /*
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });
    */

    // Simulação de envio (remova isso em produção)
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Form data:', form.value);

    // Sucesso
    submitSuccess.value = true;
    
    // Limpa o formulário
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };

    // Remove mensagem de sucesso após 5 segundos
    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);

  } catch (error) {
    console.error('Error submitting form:', error);
    submitError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

// Copy to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <Transition name="fade-blur" mode="out-in">
          <h1 :key="currentLocaleKey" class="hero-title">
            {{ headerContact.title?.[locale] }}
          </h1>
        </Transition>
        <Transition name="fade-blur" mode="out-in">
          <p :key="currentLocaleKey" class="hero-subtitle">
            {{ headerContact.subtitle?.[locale] }}
          </p>
        </Transition>

      </div>
      <div class="scroll-indicator">
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Info & Social -->
          <div class="contact-info-wrapper">
            <!-- Church Info -->
            <div class="info-card">
              <h2>{{ churchInfo.name[locale] }}</h2>
              
              <div class="info-items">
                <!-- Address -->
                <div class="info-item">
                  <div class="info-icon">
                    <font-awesome-icon icon="fa-solid fa-location-dot" />
                  </div>
                  <div class="info-content">
                    <h3>{{ locale === 'pt' ? 'Endereço' : 'Address' }}</h3>
                    <p>{{ churchInfo.address[locale] }}</p>
                    <a 
                      :href="googleMapsUrl" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="map-link"
                    >
                      <font-awesome-icon icon="fa-solid fa-map-location-dot" />
                      {{ locale === 'pt' ? 'Ver no Mapa' : 'View on Map' }}
                    </a>
                  </div>
                </div>

                <!-- Phone -->
                <div class="info-item">
                  <div class="info-icon">
                    <font-awesome-icon icon="fa-solid fa-phone" />
                  </div>
                  <div class="info-content">
                    <h3>{{ locale === 'pt' ? 'Telefone' : 'Phone' }}</h3>
                    <a :href="`tel:${churchInfo.phone}`" class="contact-link">
                      {{ churchInfo.phone }}
                    </a>
                    <button 
                      @click="copyToClipboard(churchInfo.phone)" 
                      class="copy-btn"
                      :title="locale === 'pt' ? 'Copiar' : 'Copy'"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Email -->
                <div class="info-item">
                  <div class="info-icon">
                    <font-awesome-icon icon="fa-solid fa-envelope" />
                  </div>
                  <div class="info-content">
                    <h3>Email</h3>
                    <a :href="`mailto:${churchInfo.email}`" class="contact-link">
                      {{ churchInfo.email }}
                    </a>
                    <button 
                      @click="copyToClipboard(churchInfo.email)" 
                      class="copy-btn"
                      :title="locale === 'pt' ? 'Copiar' : 'Copy'"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <!-- <div class="social-card">
              <h3>{{ locale === 'pt' ? 'Redes Sociais' : 'Social Media' }}</h3>
              <div class="social-links">
                <a 
                  v-for="social in socialLinks" 
                  :key="social.name"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-link"
                  :style="{ '--hover-color': social.color }"
                  :title="social.name"
                >
                  <font-awesome-icon :icon="social.icon" />
                  <span>{{ social.name }}</span>
                </a>
              </div>
            </div>-->
          </div> 

          <!-- Contact Form -->
          <div class="form-wrapper">
            <div class="form-card">
              <h2>{{ locale === 'pt' ? 'Envie uma Mensagem' : 'Send a Message' }}</h2>
              <p class="form-description">
                {{ locale === 'pt' 
                  ? 'Preencha o formulário abaixo e entraremos em contato em breve.' 
                  : 'Fill out the form below and we will get back to you soon.' 
                }}
              </p>

              <form @submit.prevent="submitForm" class="contact-form">
                <!-- Name -->
                <div class="form-group">
                  <label for="name">
                    {{ locale === 'pt' ? 'Nome Completo' : 'Full Name' }} *
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    v-model="form.name"
                    :placeholder="locale === 'pt' ? 'Seu nome' : 'Your name'"
                    required
                  >
                </div>

                <!-- Email -->
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input 
                    type="email" 
                    id="email"
                    v-model="form.email"
                    :placeholder="locale === 'pt' ? 'seu@email.com' : 'your@email.com'"
                    required
                  >
                </div>

                <!-- Phone -->
                <div class="form-group">
                  <label for="phone">
                    {{ locale === 'pt' ? 'Telefone' : 'Phone' }}
                  </label>
                  <input 
                    type="tel" 
                    id="phone"
                    v-model="form.phone"
                    :placeholder="locale === 'pt' ? '(00) 00000-0000' : '+353 00 000 0000'"
                  >
                </div>

                <!-- Subject -->
                <div class="form-group">
                  <label for="subject">
                    {{ locale === 'pt' ? 'Assunto' : 'Subject' }}
                  </label>
                  <input 
                    type="text" 
                    id="subject"
                    v-model="form.subject"
                    :placeholder="locale === 'pt' ? 'Sobre o que você gostaria de falar?' : 'What would you like to talk about?'"
                  >
                </div>

                <!-- Message -->
                <div class="form-group">
                  <label for="message">
                    {{ locale === 'pt' ? 'Mensagem' : 'Message' }} *
                  </label>
                  <textarea 
                    id="message"
                    v-model="form.message"
                    rows="5"
                    :placeholder="locale === 'pt' ? 'Escreva sua mensagem...' : 'Write your message...'"
                    required
                  ></textarea>
                </div>

                <!-- Success Message -->
                <Transition name="fade">
                  <div v-if="submitSuccess" class="alert alert-success">
                    <font-awesome-icon icon="fa-solid fa-circle-check" />
                    {{ locale === 'pt' 
                      ? 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
                      : 'Message sent successfully! We will contact you soon.' 
                    }}
                  </div>
                </Transition>

                <!-- Error Message -->
                <Transition name="fade">
                  <div v-if="submitError" class="alert alert-error">
                    <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
                    {{ locale === 'pt' 
                      ? 'Erro ao enviar mensagem. Por favor, tente novamente.' 
                      : 'Error sending message. Please try again.' 
                    }}
                  </div>
                </Transition>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="submit-btn"
                  :disabled="!isFormValid || isSubmitting"
                >
                  <span v-if="!isSubmitting">
                    {{ locale === 'pt' ? 'Enviar Mensagem' : 'Send Message' }}
                    <font-awesome-icon icon="fa-solid fa-paper-plane" />
                  </span>
                  <span v-else class="loading">
                    <font-awesome-icon icon="fa-solid fa-spinner" spin />
                    {{ locale === 'pt' ? 'Enviando...' : 'Sending...' }}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>


.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Contact Section */
.contact-section {
  padding: 4rem 0 6rem 0;
  background: var(--color-background);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 4rem;
  align-items: start;
}

/* Contact Info */
.contact-info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 100px;
}

.info-card,
.social-card,
.form-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
}

.info-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 2rem;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-item {
  display: flex;
  gap: 1.25rem;
}

.info-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  font-size: 1.3rem;
}

.info-content h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.info-content p {
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.map-link,
.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #60a5fa;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.map-link:hover,
.contact-link:hover {
  color: #93c5fd;
  transform: translateX(4px);
}

.copy-btn {
  margin-left: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 6px;
  color: #60a5fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: rgba(96, 165, 250, 0.2);
  transform: scale(1.05);
}

/* Social Links */
.social-card h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.social-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--hover-color);
  color: var(--hover-color);
  transform: translateY(-3px);
}

.social-link svg {
  font-size: 1.5rem;
}

/* Form */
.form-card h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.form-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  letter-spacing: 0.3px;
}

.form-group input,
.form-group textarea {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(255, 255, 255, 0.08);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

/* Submit Button */
.submit-btn {
  padding: 1.25rem 2rem;
  background: #60a5fa;
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-btn:hover:not(:disabled) {
  background: #93c5fd;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(96, 165, 250, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Transitions */
.fade-blur-enter-active,
.fade-blur-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-blur-enter-from {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
}

.fade-blur-leave-to {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(-20px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .contact-info-wrapper {
    position: relative;
    top: 0;
  }

  .social-links {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  .hero-section {
    height: 35vh;
    min-height: 300px;
    margin-bottom: 3rem;
  }

  .contact-section {
    padding: 3rem 0 4rem 0;
  }

  .info-card,
  .social-card,
  .form-card {
    padding: 1.5rem;
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-section {
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .contact-section {
    padding: 2rem 0 3rem 0;
  }

  .info-item {
    flex-direction: column;
  }

  .form-card h2 {
    font-size: 1.5rem;
  }
}
</style>