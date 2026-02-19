<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Main Footer -->
      <div class="footer-main">
        <div class="footer-grid">
          <!-- Coluna 1: Logo e Descrição -->
          <div class="footer-column brand-column">
            <div class="footer-logo">
              <img src="/src/assets/logo.png" alt="Life & Spirit Church">
            </div>
            <!-- <p class="footer-description">
              {{ t('_footer._description') || 'Uma comunidade de fé, esperança e amor. Transformando vidas através do evangelho de Jesus Cristo.' }}
            </p> -->
            <div class="social-links">
              <a href="https://www.instagram.com/lifeandspiritchurch1" target="_blank" rel="noopener" aria-label="Instagram" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.youtube.com/@lifespiritchurch" target="_blank" rel="noopener" aria-label="YouTube" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="https://www.facebook.com/lifeandspiritchurch1/" target="_blank" rel="noopener" aria-label="Facebook" class="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Coluna 2: Navegação -->
          <div class="footer-column">
            <h3 class="footer-title">{{ t('_footer_navigation') || 'Navegação' }}</h3>
            <nav>
              <ul class="footer-links">
                <li><router-link to="/">{{ t('_nav._home') }}</router-link></li>
                <li><router-link to="/about">{{ t('_nav._about') }}</router-link></li>
                <li><router-link to="/content">{{ t('_nav._content') }}</router-link></li>
                <li><router-link to="/events">{{ t('_nav._events') }}</router-link></li>
                <li><router-link to="/contact">{{ t('_nav._contact') }}</router-link></li>
              </ul>
            </nav>
          </div>

          <!-- Coluna 3: Horários -->
          <div class="footer-column">
            <h3 class="footer-title">{{ t('_footer_schedule') || 'Horários' }}</h3>
            <ul class="footer-info">
              <li>
                <span class="info-label">{{ t('_footer._sceadle1._day') }}</span>
                <span class="info-value">{{ t('_footer._sceadle1._hour') }}</span>
              </li>
              <li>
                <span class="info-label">{{ t('_footer._sceadle2._day') }}</span>
                <span class="info-value">{{ t('_footer._sceadle2._hour') }}</span>
              </li>
              <li>
                <span class="info-label">{{ t('_footer._sceadle3._day') }}</span>
                <span class="info-value">{{ t('_footer._sceadle3._hour') }}</span>
              </li>
            </ul>
          </div>

          <!-- Coluna 4: Contato -->
          <div class="footer-column">
            <h3 class="footer-title">{{ t('_footer_contact') || 'Contato' }}</h3>
            <ul class="footer-info">
              <li class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  <p>Lakeside Retail Park, Unit 13</p>
                  <p>Ballindine Road, Clare</p>
                  <p>Claremorris, Co. Mayo, Ireland</p>
                </div>
              </li>
              <li class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:+353894507333">+353 89 450 7333</a>
              </li>
              <li class="contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href="mailto:info@lifespiritchurch.ie">info@lifespiritchurch.ie</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

     
      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} Life & Spirit Church. All Rights Reserved.
          </p>
          <div class="footer-links-bottom">
            <span class="separator">Created by: </span>
            <a href="">Eduardo Jácomo</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const email = ref('');
const currentYear = computed(() => new Date().getFullYear());

const handleNewsletter = () => {
  // Implementar lógica de inscrição
  console.log('Newsletter signup:', email.value);
  // Aqui você pode fazer a chamada para API, etc.
  email.value = '';
};
</script>

<style scoped>
.footer {
  background: linear-gradient(0deg, #0f0f0f 0%, var(--color-background-soft) 100%);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Main Footer */
.footer-main {
  padding: 40px 40px 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 60px;
}

/* Brand Column */
.brand-column {
  max-width: 400px;
}

.footer-logo {
  width: 140px;
  margin-bottom: 24px;
}

.footer-logo img {
  width: 100%;
  height: auto;
  filter: brightness(0) invert(1);
}

.footer-description {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  transform: translateY(-2px);
}

/* Footer Columns */
.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 24px;
  color: #ffffff;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 15px;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: #ffffff;
  transform: translateX(4px);
}

/* Footer Info */
.footer-info {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-info li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.info-label {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.info-value {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.contact-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
}

.contact-item svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.5);
}

.contact-item a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-item a:hover {
  color: #ffffff;
}

.contact-item div p {
  margin: 0;
  line-height: 1.5;
}

/* Newsletter */
.footer-newsletter {
  padding: 40px 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.newsletter-text h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
}

.newsletter-text p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.newsletter-form input {
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 15px;
  width: 300px;
  transition: all 0.3s ease;
}

.newsletter-form input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.newsletter-form button {
  padding: 14px 32px;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.newsletter-form button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
}

/* Footer Bottom */
.footer-bottom {
  padding: 32px 40px;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.footer-links-bottom {
  display: flex;
  gap: 16px;
  align-items: center;
}

.footer-links-bottom a {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links-bottom a:hover {
  color: #ffffff;
}

.separator {
  color: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr;
  }
  
  .footer-column:last-child {
    grid-column: 1 / -1;
    max-width: 400px;
  }
}

@media (max-width: 968px) {
  .footer-main {
    padding: 60px 32px 40px;
  }
  
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  .brand-column {
    grid-column: 1 / -1;
    max-width: 100%;
  }
  
  .newsletter-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .newsletter-form {
    width: 100%;
  }
  
  .newsletter-form input {
    flex: 1;
    width: auto;
  }
}

@media (max-width: 640px) {
  .footer-main {
    padding: 50px 24px 30px;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-newsletter {
    padding: 32px 24px;
  }
  
  .newsletter-form {
    flex-direction: column;
    width: 100%;
  }
  
  .newsletter-form input,
  .newsletter-form button {
    width: 100%;
  }
  
  .footer-bottom {
    padding: 24px 24px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>