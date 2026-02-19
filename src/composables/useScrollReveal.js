import { onMounted, onUnmounted } from 'vue';

export function useScrollReveal(options = {}) {
  const {
    threshold = 0.7,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    animationClass = 'in-view' 
  } = options;

  let observer = null;

  const initObserver = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
            
            // Para de observar se triggerOnce for true
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            // Remove a classe quando sair da view
            entry.target.classList.remove(animationClass);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );
  };

  const observe = (selector = '.animate-on-scroll') => {
    if (!observer) {
      initObserver();
    }

    // Aguarda o DOM estar pronto
    setTimeout(() => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        observer.observe(el);
      });
    }, 100);
  };

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    observe();
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    observe,
    cleanup
  };
}