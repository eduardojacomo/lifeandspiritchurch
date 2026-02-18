<template>
      <div class="schedule-card">
        <!-- Left Side - Service Info -->
        <div class="service-info">
          <h2 class="service-title">
            {{ currentService.title }}
          </h2>
          
          <div class="service-details">
            <div class="detail-item">
              <font-awesome-icon icon="fa-solid fa-calendar" class="detail-icon" />
              <span class="detail-text">{{ currentService.day }}</span>
            </div>
            
            <div class="detail-item">
              <font-awesome-icon icon="fa-solid fa-clock" class="detail-icon" />
              <span class="detail-text">{{ currentService.time }}</span>
            </div>
            
            <div class="detail-item">
              <font-awesome-icon icon="fa-solid fa-location-dot" class="detail-icon" />
              <span class="detail-text">{{ currentService.location }}</span>
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
            <font-awesome-icon icon="fa-solid fa-location-dot" />
            <span>{{ locale === 'pt' ? 'PRESENCIAL' : 'IN PERSON' }}</span>
          </a>

          <a 
            href="https://youtube.com/@lifeandspiritchurch" 
            target="_blank"
            class="action-link"
          >
            <font-awesome-icon icon="fa-brands fa-youtube" />
            <span>{{ locale === 'pt' ? 'ONLINE' : 'ONLINE' }}</span>
          </a>

          <router-link 
            to="/schedule" 
            class="action-link"
          >
            <font-awesome-icon icon="fa-solid fa-calendar-days" />
            <span>{{ locale === 'pt' ? 'DEMAIS HORÁRIOS' : 'OTHER TIMES' }}</span>
          </router-link>
        </div>
      </div>

</template>

<style scoped>
.schedule-card {
  background: #1a1a1a;
  border-radius: 24px;
  padding: 4rem;
  display: flex;
  align-items: center;
  gap: 4rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.schedule-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  /* background: linear-gradient(90deg, var(--color-primary), var(--color-secondary)); */
}

/* Left Side - Service Info */
.service-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.service-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.1;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
}

.service-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-icon {
  font-size: 1.25rem;
  color: var(--color-primary);
  width: 24px;
  text-align: center;
}

.detail-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

/* Vertical Divider */
.vertical-divider {
  width: 2px;
  height: 200px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  flex-shrink: 0;
}

/* Right Side - Action Buttons */
.service-actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 2rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.3s ease;
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
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s ease;
}

.action-link:hover::before {
  left: 100%;
}

.action-link:hover {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.05);
  transform: translateX(8px);
}

.action-link svg {
  font-size: 1.5rem;
  color: var(--color-primary);
  transition: transform 0.3s ease;
}

.action-link:hover svg {
  transform: scale(1.1);
}

.action-link span {
  text-transform: uppercase;
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
    gap: 2.5rem;
  }

  .vertical-divider {
    width: 100%;
    height: 2px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }

  .service-info {
    gap: 1.5rem;
  }

  .service-title {
    font-size: 2rem;
    text-align: center;
  }

  .service-details {
    gap: 1rem;
  }

  .detail-text {
    font-size: 1rem;
  }

  .action-link {
    padding: 1rem 1.5rem;
    justify-content: center;
  }

  .action-link:hover {
    transform: translateX(0) translateY(-4px);
  }
}

@media screen and (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .schedule-card {
    padding: 2rem 1.5rem;
    gap: 2rem;
  }

  .service-title {
    font-size: 1.75rem;
  }

  .detail-item {
    gap: 0.75rem;
  }

  .detail-icon {
    font-size: 1rem;
    width: 20px;
  }

  .detail-text {
    font-size: 0.95rem;
  }

  .action-link {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }

  .action-link svg {
    font-size: 1.25rem;
  }
}

</style>