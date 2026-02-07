<template>
     <section class="hero" id="inicio">
        <div class="decorative-element element-1"></div>
        <div class="decorative-element element-2"></div>
        <div class="decorative-element element-3"></div>
        
        <div class="hero-content">
            <p class="hero-subtitle">Psicologia Clínica</p>
            <h1 class="hero-title">Cuidando da sua <strong>saúde mental</strong> com acolhimento e profissionalismo</h1>
            <p class="hero-description">Atendimento psicológico presencial em Volta Redonda e online para todo o Brasil, com abordagens humanizadas e baseadas em evidências científicas.</p>
            <div class="cta-buttons">
                <a href="#contato" class="btn btn-primary">Agendar Consulta</a>
                <a href="#sobre" class="btn btn-secondary">Conheça Meu Trabalho</a>
            </div>
        </div>
        
        <div class="hero-image">
            <div class="hero-image-container">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1000&fit=crop" alt="Renata Machado - Psicóloga">
            </div>
        </div>
    </section>
</template>

<script setup>
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 90;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
      
        // Scroll animations with Intersection Observer
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
    
</script>

<style scoped>

 :root {
            --navy: #071422;
            --navy-light: #0A1F35;
            --navy-lighter: #162D44;
            --beige-primary: #EFE8DB;
            --beige-light: #F8F3E8;
            --cream: #FFFBF5;
            --text-dark: #071422;
            --text-medium: #4A5568;
            --shadow-soft: rgba(7, 20, 34, 0.08);
            --shadow-medium: rgba(7, 20, 34, 0.15);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Crimson Pro', serif;
            background-color: var(--cream);
            color: var(--text-dark);
            line-height: 1.7;
            overflow-x: hidden;
        }

        /* Animações */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-60px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(60px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(5deg); }
        }

        /* Header */
        header {
            background: rgba(255, 251, 245, 0.95);
            padding: 1.5rem 2rem;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(7, 20, 34, 0.1);
            animation: fadeIn 0.6s ease-out;
            transition: all 0.3s ease;
        }

        header.scrolled {
            box-shadow: 0 4px 20px var(--shadow-soft);
            padding: 1rem 2rem;
        }

        nav {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            font-weight: 600;
            color: var(--navy);
            letter-spacing: 1px;
            transition: transform 0.3s ease;
        }

        .logo:hover {
            transform: scale(1.05);
        }

        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-medium);
            font-weight: 400;
            font-size: 1.05rem;
            position: relative;
            transition: color 0.3s ease;
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--navy);
            transition: width 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .nav-links a:hover {
            color: var(--navy);
        }

        .nav-links a:hover::after {
            width: 100%;
        }

        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.8rem;
            color: var(--navy);
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .mobile-menu-btn:hover {
            transform: rotate(90deg);
        }

        /* Hero Section */
        .hero {
            margin-top: 90px;
            min-height: 95vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            gap: 5rem;
            padding: 5rem 2rem;
            max-width: 1400px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            background: var(--cream);
        }

        .hero-content {
            animation: slideInLeft 1s ease-out;
            position: relative;
            z-index: 1;
        }

        .hero-subtitle {
            font-size: 0.95rem;
            color: var(--navy);
            font-weight: 600;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.3s forwards;
        }

        .hero-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 4.2rem;
            font-weight: 300;
            line-height: 1.2;
            margin-bottom: 2rem;
            color: var(--text-dark);
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.5s forwards;
        }

        .hero-title strong {
            font-weight: 700;
            color: var(--navy);
            position: relative;
            display: inline-block;
        }

        .hero-title strong::after {
            content: '';
            position: absolute;
            bottom: 5px;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--navy);
            opacity: 0.2;
        }

        .hero-description {
            font-size: 1.25rem;
            color: var(--text-medium);
            margin-bottom: 3rem;
            line-height: 1.9;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.7s forwards;
        }

        .cta-buttons {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.9s forwards;
        }

        .btn {
            padding: 1rem 2.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            display: inline-block;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .btn:hover::before {
            width: 300px;
            height: 300px;
        }

        .btn-primary {
            background-color: var(--navy);
            color: white;
            box-shadow: 0 10px 30px rgba(7, 20, 34, 0.2);
        }

        .btn-primary:hover {
            background-color: var(--navy-lighter);
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(7, 20, 34, 0.3);
        }

        .btn-secondary {
            background-color: transparent;
            color: var(--navy);
            border: 2px solid var(--navy);
        }

        .btn-secondary:hover {
            background-color: var(--navy);
            color: white;
            transform: translateY(-3px);
        }

        .hero-image {
            position: relative;
            animation: slideInRight 1s ease-out;
        }

        /* Decoração delicada ao redor da foto */
        .hero-image::before {
            content: '';
            position: absolute;
            top: -30px;
            left: -30px;
            right: 30px;
            bottom: 30px;
            border: 2px solid var(--navy);
            border-radius: 30px;
            opacity: 0.15;
            z-index: -1;
        }

        .hero-image::after {
            content: '';
            position: absolute;
            top: 30px;
            left: 30px;
            right: -30px;
            bottom: -30px;
            background: linear-gradient(135deg, var(--beige-light), var(--beige-primary));
            border-radius: 30px;
            opacity: 0.4;
            z-index: -1;
        }

        .hero-image-container {
            position: relative;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 30px 80px var(--shadow-medium);
            border: 3px solid white;
        }

        .hero-image-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(7, 20, 34, 0.05) 0%, transparent 50%);
            z-index: 1;
            pointer-events: none;
        }

        .hero-image img {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.4s ease;
        }

        .hero-image-container:hover img {
            transform: scale(1.02);
        }

        .decorative-element {
            position: absolute;
            z-index: 0;
            opacity: 0.06;
        }

        .element-1 {
            width: 200px;
            height: 200px;
            top: 10%;
            right: 5%;
            border: 2px solid var(--navy);
            border-radius: 50%;
            animation: float 12s ease-in-out infinite;
        }

        .element-2 {
            width: 150px;
            height: 150px;
            bottom: 15%;
            left: 8%;
            border: 2px solid var(--navy);
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            animation: float 10s ease-in-out infinite 2s;
        }

        .element-3 {
            width: 100px;
            height: 100px;
            top: 60%;
            right: 15%;
            border: 1px solid var(--navy);
            border-radius: 50%;
            animation: float 8s ease-in-out infinite 4s;
        }

        /* Section Transitions */
        .section {
            position: relative;
            overflow: hidden;
        }

        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(to bottom, var(--cream), transparent);
            z-index: 1;
            pointer-events: none;
        }

        .section:first-of-type::before {
            display: none;
        }

        /* Sobre Section */
        .sobre {
            padding: 8rem 2rem;
            background: var(--cream);
            position: relative;
        }

        .section-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .section-header {
            text-align: center;
            margin-bottom: 5rem;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }

        .section-header.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .section-label {
            font-size: 0.9rem;
            color: var(--navy);
            font-weight: 600;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 1rem;
        }

        .section-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 3.5rem;
            font-weight: 300;
            color: var(--text-dark);
            position: relative;
            display: inline-block;
        }

        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 2px;
            background: var(--navy);
        }

        .sobre-content {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 5rem;
            align-items: center;
        }

        .sobre-text {
            font-size: 1.15rem;
            line-height: 2;
            color: var(--text-medium);
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.8s ease;
        }

        .sobre-text.visible {
            opacity: 1;
            transform: translateX(0);
        }

        .sobre-text p {
            margin-bottom: 1.5rem;
        }

        .credenciais {
            background-color: white;
            padding: 3rem;
            border-radius: 25px;
            box-shadow: 0 15px 50px var(--shadow-soft);
            border: 1px solid rgba(7, 20, 34, 0.05);
            opacity: 0;
            transform: translateX(30px);
            transition: all 0.8s ease 0.2s;
        }

        .credenciais.visible {
            opacity: 1;
            transform: translateX(0);
        }

        .credencial-item {
            display: flex;
            align-items: start;
            gap: 1.5rem;
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid rgba(7, 20, 34, 0.08);
            transition: all 0.3s ease;
        }

        .credencial-item:hover {
            transform: translateX(10px);
        }

        .credencial-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .credencial-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            border: 2px solid var(--navy);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }

        .credencial-item:hover .credencial-icon {
            background-color: var(--navy);
            transform: rotate(5deg);
        }

        .credencial-icon svg {
            width: 24px;
            height: 24px;
            stroke: var(--navy);
            transition: stroke 0.3s ease;
        }

        .credencial-item:hover .credencial-icon svg {
            stroke: white;
        }

        .credencial-text h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .credencial-text p {
            font-size: 1rem;
            color: var(--text-medium);
            line-height: 1.6;
        }

        /* Serviços Section */
        .servicos {
            padding: 8rem 2rem;
            background: linear-gradient(180deg, var(--cream) 0%, var(--beige-light) 100%);
            position: relative;
        }

        .servicos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 2.5rem;
            margin-top: 4rem;
        }

        .servico-card {
            background: white;
            padding: 3rem 2.5rem;
            border-radius: 25px;
            box-shadow: 0 10px 40px var(--shadow-soft);
            border: 1px solid rgba(7, 20, 34, 0.05);
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateY(30px);
        }

        .servico-card.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .servico-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 0;
            background: linear-gradient(135deg, var(--navy) 0%, var(--navy-lighter) 100%);
            transition: height 0.5s ease;
            z-index: 0;
        }

        .servico-card:hover::before {
            height: 100%;
        }

        .servico-card:hover {
            transform: translateY(-15px);
            box-shadow: 0 25px 70px var(--shadow-medium);
        }

        .servico-card > * {
            position: relative;
            z-index: 1;
            transition: color 0.3s ease 0.2s;
        }

        .servico-card:hover h3,
        .servico-card:hover p {
            color: white;
        }

        .servico-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 2rem;
            border: 2px solid var(--navy);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease 0.2s;
        }

        .servico-card:hover .servico-icon {
            border-color: white;
            transform: rotate(10deg) scale(1.1);
        }

        .servico-icon svg {
            width: 30px;
            height: 30px;
            stroke: var(--navy);
            transition: stroke 0.3s ease 0.2s;
        }

        .servico-card:hover .servico-icon svg {
            stroke: white;
        }

        .servico-card h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .servico-card p {
            color: var(--text-medium);
            font-size: 1.05rem;
            line-height: 1.8;
        }

        /* Abordagens Section */
        .abordagens {
            padding: 8rem 2rem;
            background: var(--beige-primary);
            position: relative;
        }

        .abordagens-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2.5rem;
            margin-top: 4rem;
        }

        .abordagem-item {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px var(--shadow-soft);
            border: 1px solid rgba(7, 20, 34, 0.05);
            text-align: center;
            transition: all 0.4s ease;
            opacity: 0;
            transform: scale(0.95);
        }

        .abordagem-item.visible {
            opacity: 1;
            transform: scale(1);
        }

        .abordagem-item:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 60px var(--shadow-medium);
        }

        .abordagem-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 3px;
            background: var(--navy);
            border-radius: 0 0 10px 10px;
        }

        .abordagem-item h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.6rem;
            font-weight: 600;
            color: var(--navy);
            margin-bottom: 1rem;
        }

        .abordagem-item p {
            color: var(--text-medium);
            font-size: 1.05rem;
            line-height: 1.8;
        }

        /* Contato Section */
        .contato {
            padding: 8rem 2rem;
            background: linear-gradient(180deg, var(--beige-primary) 0%, var(--cream) 100%);
        }

        .contato-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            max-width: 1200px;
            margin: 4rem auto 0;
        }

        .contato-info {
            background: white;
            padding: 3.5rem;
            border-radius: 25px;
            box-shadow: 0 15px 50px var(--shadow-soft);
            border: 1px solid rgba(7, 20, 34, 0.05);
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.8s ease;
        }

        .contato-info.visible {
            opacity: 1;
            transform: translateX(0);
        }

        .contato-info h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.2rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 2.5rem;
        }

        .info-item {
            display: flex;
            align-items: start;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
            transition: all 0.3s ease;
        }

        .info-item:hover {
            transform: translateX(10px);
        }

        .info-icon {
            width: 50px;
            height: 50px;
            border: 2px solid var(--navy);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }

        .info-item:hover .info-icon {
            background-color: var(--navy);
            transform: rotate(5deg);
        }

        .info-icon svg {
            width: 24px;
            height: 24px;
            stroke: var(--navy);
            transition: stroke 0.3s ease;
        }

        .info-item:hover .info-icon svg {
            stroke: white;
        }

        .info-text h4 {
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }

        .info-text p {
            color: var(--text-medium);
            font-size: 1rem;
            line-height: 1.7;
        }

        .info-text a {
            color: var(--navy);
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
        }

        .info-text a::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background-color: var(--navy);
            transition: width 0.3s ease;
        }

        .info-text a:hover::after {
            width: 100%;
        }

        .social-links {
            display: flex;
            gap: 1rem;
            margin-top: 3rem;
        }

        .social-link {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            border: 2px solid var(--navy);
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .social-link svg {
            width: 22px;
            height: 22px;
            stroke: var(--navy);
            transition: stroke 0.3s ease;
        }

        .social-link:hover {
            background-color: var(--navy);
            transform: translateY(-5px) rotate(5deg);
        }

        .social-link:hover svg {
            stroke: white;
        }

        .contact-form {
            background: white;
            padding: 3.5rem;
            border-radius: 25px;
            box-shadow: 0 15px 50px var(--shadow-soft);
            border: 1px solid rgba(7, 20, 34, 0.05);
            opacity: 0;
            transform: translateX(30px);
            transition: all 0.8s ease 0.2s;
        }

        .contact-form.visible {
            opacity: 1;
            transform: translateX(0);
        }

        .contact-form h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.2rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 2.5rem;
        }

        .form-group {
            margin-bottom: 1.8rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.7rem;
            color: var(--text-dark);
            font-weight: 600;
            font-size: 1rem;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 1.1rem 1.3rem;
            border: 2px solid rgba(7, 20, 34, 0.1);
            border-radius: 12px;
            font-family: 'Crimson Pro', serif;
            font-size: 1rem;
            color: var(--text-dark);
            transition: all 0.3s ease;
            background-color: white;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--navy);
            box-shadow: 0 0 0 3px rgba(7, 20, 34, 0.05);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 130px;
        }

        .submit-btn {
            width: 100%;
            padding: 1.3rem;
            background-color: var(--navy);
            color: white;
            border: none;
            border-radius: 50px;
            font-family: 'Crimson Pro', serif;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 10px 30px rgba(7, 20, 34, 0.2);
            position: relative;
            overflow: hidden;
        }

        .submit-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .submit-btn:hover::before {
            width: 400px;
            height: 400px;
        }

        .submit-btn:hover {
            background-color: var(--navy-lighter);
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(7, 20, 34, 0.3);
        }

        /* Footer */
        footer {
            background: var(--navy);
            color: var(--beige-light);
            padding: 3.5rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--beige-primary), transparent);
            animation: slideLight 3s ease-in-out infinite;
        }

        @keyframes slideLight {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-text {
            font-size: 0.95rem;
            opacity: 0.9;
        }

        /* Scroll Animations */
        .fade-in-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .fade-in-section.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
            .nav-links {
                position: fixed;
                top: 80px;
                left: -100%;
                width: 100%;
                height: calc(100vh - 80px);
                background: var(--cream);
                flex-direction: column;
                align-items: center;
                justify-content: start;
                padding-top: 3rem;
                gap: 2rem;
                transition: left 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                box-shadow: 10px 0 30px var(--shadow-medium);
                border-right: 1px solid rgba(7, 20, 34, 0.1);
            }

            .nav-links.active {
                left: 0;
            }

            .mobile-menu-btn {
                display: block;
            }

            .hero {
                grid-template-columns: 1fr;
                padding: 3rem 1.5rem;
                gap: 3rem;
                margin-top: 80px;
            }

            .hero-title {
                font-size: 2.8rem;
            }

            .hero-description {
                font-size: 1.1rem;
            }

            .cta-buttons {
                flex-direction: column;
            }

            .btn {
                width: 100%;
                text-align: center;
            }

            .sobre-content {
                grid-template-columns: 1fr;
                gap: 3rem;
            }

            .servicos-grid {
                grid-template-columns: 1fr;
            }

            .contato-content {
                grid-template-columns: 1fr;
                gap: 3rem;
            }

            .section-title {
                font-size: 2.5rem;
            }

            .element-1, .element-2 {
                display: none;
            }
        }

        @media (max-width: 480px) {
            .logo {
                font-size: 1.4rem;
            }

            .hero-title {
                font-size: 2.2rem;
            }

            .section-title {
                font-size: 2rem;
            }

            .servico-card,
            .abordagem-item,
            .contato-info,
            .contact-form {
                padding: 2rem 1.5rem;
            }
        }
</style>