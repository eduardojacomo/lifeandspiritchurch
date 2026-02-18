<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '../stores/languageStore';
import { storeToRefs } from 'pinia';

const uselanguage = useLanguage();
const { currentLocaleKey } = storeToRefs(uselanguage);
const { t, locale } = useI18n();

const serviceTitle = {
  service: {
    en: 'Saturday Celebration',
    pt: 'Celebração de Sábado'
  },
  hour: {
    en: '06:30 PM',
    pt: '18:30'
  },
  day: {
    en: 'Saturday',
    pt: 'Sábado'
  }
}

const butons = {
  inPerson: {
    en: 'IN PERSON',
    pt: 'PRESENCIAL'
  },
  online: {
    en: 'ONLINE',
    pt: 'ONLINE'
  },
  otherTimes: {
    en: 'OTHER TIMES',
    pt: 'DEMAIS HORÁRIOS'
  }
}
</script>

<template>
  <main>
    <section class="schedule-section">
      <!-- Background Text Animation -->
      <div class="scrolling-text-container">
        <div class="scrolling-text">
          <div class="scrolling-text-content">
            <span>CELEBRATIONS · </span>
            <span>CELEBRATIONS · </span>
            <span>CELEBRATIONS · </span>
          </div>
          <div class="scrolling-text-content">
            <span>CELEBRATIONS · </span>
            <span>CELEBRATIONS · </span>
            <span>CELEBRATIONS · </span>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="schedule-card">
          <!-- Left Side - Service Info -->
          <div class="service-info">
            <div class="service-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
              </svg>
              {{ serviceTitle?.service[locale] }}
            </div>

            <h2 class="service-title">
              {{ serviceTitle?.service[locale] }}
            </h2>
            
            <div class="service-details">
              <div class="detail-item">
                <div class="detail-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                    <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </div>
                <span class="detail-text">{{ serviceTitle?.day[locale] }}</span>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                  </svg>
                </div>
                <span class="detail-text">{{ serviceTitle?.hour[locale] }}</span>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="vertical-divider"></div>

          <!-- Right Side - Action Buttons -->
          <div class="service-actions">
            <a 
              href="https://maps.google.com/?q=Life+and+Spirit+Church" 
              target="_blank"
              class="action-link"
            >
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
                </svg>
              </div>
              <span>{{ butons.inPerson[locale] }}</span>
            </a>

            <a 
              href="https://youtube.com/@lifespiritchurch" 
              target="_blank"
              class="action-link"
            >
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
                </svg>
              </div>
              <span>{{ butons.online[locale] }}</span>
            </a>

            <router-link 
              to="/events " 
              class="action-link"
            >
              <div class="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/>
                  <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </div>
              <span>{{ butons.otherTimes[locale] }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  background: var(--color-background);
  position: relative;
  overflow: hidden;
}

/* Schedule Section */
.schedule-section {
  width: 100%;
  padding: 6rem 0;
  position: relative;
  background: linear-gradient(180deg, 
    var(--color-background-mute) 0%, 
    rgb(64, 64, 69) 50%,
    var(--color-background-mute) 100%
  );
}

/* Scrolling Text Background */
.scrolling-text-container {
  width: 100%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.scrolling-text {
  display: flex;
  width: max-content;
  animation: scroll-x 30s linear infinite;
}

.scrolling-text-content {
  display: flex;
  whitespace: nowrap;
}

.scrolling-text span {
  display: inline-block;
  margin-right: 2rem;
  font-size: clamp(5rem, 12vw, 12rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.015);
  letter-spacing: -4px;
  text-transform: uppercase;
}

@keyframes scroll-x {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-33.33%);
  }
}

/* Container */
.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Schedule Card */
.schedule-card {
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 4rem;
  display: flex;
  align-items: center;
  gap: 5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.schedule-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  /* background: linear-gradient(90deg, 
    transparent, 
    rgba(59, 130, 246, 0.4) 30%, 
    rgba(139, 92, 246, 0.4) 70%, 
    transparent
  ); */
}

.schedule-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Service Badge */
.service-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 50px;
  color: rgba(96, 165, 250, 0.9);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
}

.service-badge svg {
  width: 14px;
  height: 14px;
}

/* Left Side - Service Info */
.service-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-title {
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  font-weight: 900;
  letter-spacing: -2px;
  line-height: 1;
  color: #ffffff;
  margin: 0 0 2.5rem 0;
  text-transform: uppercase;
}

.service-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.detail-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.detail-item:hover .detail-icon {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
  color: rgba(96, 165, 250, 0.8);
  transform: scale(1.05);
}

.detail-icon svg {
  width: 18px;
  height: 18px;
}

.detail-text {
  font-size: 1.15rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.3px;
}

/* Vertical Divider */
.vertical-divider {
  width: 1px;
  height: 240px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.06) 20%,
    rgba(255, 255, 255, 0.06) 80%,
    transparent
  );
  flex-shrink: 0;
}

/* Right Side - Action Buttons */
.service-actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.03), 
    transparent
  );
  transition: left 0.6s ease;
}

.action-link:hover::before {
  left: 100%;
}

.action-link:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1);
}

.action-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.action-link:hover .action-icon {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.2);
  color: rgba(96, 165, 250, 0.9);
  transform: scale(1.05) rotate(5deg);
}

.action-icon svg {
  width: 20px;
  height: 20px;
}

.action-link span {
  text-transform: uppercase;
  flex: 1;
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .schedule-card {
    padding: 3rem;
    gap: 3rem;
  }

  .service-title {
    font-size: 2.5rem;
  }

  .vertical-divider {
    height: 200px;
  }
}

@media screen and (max-width: 768px) {
  .schedule-section {
    padding: 4rem 0;
  }

  .container {
    padding: 0 1.5rem;
  }

  .schedule-card {
    flex-direction: column;
    padding: 2.5rem 2rem;
    gap: 3rem;
  }

  .vertical-divider {
    width: 80%;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.06) 20%,
      rgba(255, 255, 255, 0.06) 80%,
      transparent
    );
  }

  .service-info {
    width: 100%;
  }

  .service-title {
    font-size: 2rem;
    text-align: center;
  }

  .service-badge {
    margin: 0 auto 1.5rem;
  }

  .service-details {
    gap: 1.25rem;
  }

  .service-actions {
    width: 100%;
  }

  .action-link {
    justify-content: flex-start;
  }

  .action-link:hover {
    transform: translateY(-4px) translateX(0);
  }

  .scrolling-text span {
    font-size: 6rem;
  }
}

@media screen and (max-width: 480px) {
  .schedule-section {
    padding: 3rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .schedule-card {
    padding: 2rem 1.5rem;
    gap: 2rem;
    border-radius: 20px;
  }

  .service-title {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }

  .service-badge {
    font-size: 0.7rem;
    padding: 0.4rem 0.875rem;
  }

  .detail-item {
    gap: 1rem;
  }

  .detail-icon {
    width: 42px;
    height: 42px;
  }

  .detail-text {
    font-size: 1rem;
  }

  .action-link {
    padding: 1rem 1.25rem;
    font-size: 0.85rem;
  }

  .action-icon {
    width: 40px;
    height: 40px;
  }

  .action-icon svg {
    width: 18px;
    height: 18px;
  }

  .scrolling-text {
    display: none;
  }
}
</style>