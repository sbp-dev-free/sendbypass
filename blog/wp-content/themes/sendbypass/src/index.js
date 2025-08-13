import './style.css';
import './app.scss';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';
document.addEventListener('DOMContentLoaded', function() {
   
    const hamburgerIcon = document.querySelector('.icon-hamburger-menu');
    const closeIcon = document.querySelector('.icon-close-remove');
    const mobileMenu = document.querySelector('.main-navigation');
    
    // Store initial body padding to prevent layout shift
    let scrollPosition = 0;

    function disableScroll() {
        scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
    }

    function enableScroll() {
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('width');
        window.scrollTo(0, scrollPosition);
    }

    hamburgerIcon.addEventListener('click', function() {
        hamburgerIcon.classList.add('!hidden');
        closeIcon.classList.remove('!hidden');
        mobileMenu.classList.remove('closing');
        mobileMenu.classList.add('show');
        disableScroll();
    });
    
    closeIcon.addEventListener('click', function() {
        closeIcon.classList.add('!hidden');
        hamburgerIcon.classList.remove('!hidden');
        mobileMenu.classList.add('closing');
        mobileMenu.classList.remove('show');
        enableScroll();
    });

    
    const scrollUpButton = document.getElementById('scroll-up');


    scrollUpButton.style.opacity = '0';
    scrollUpButton.style.visibility = 'hidden';
    scrollUpButton.style.transition = 'opacity 0.3s, visibility 0.3s';


    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            scrollUpButton.style.opacity = '1';
            scrollUpButton.style.visibility = 'visible';
        } else {
            scrollUpButton.style.opacity = '0';
            scrollUpButton.style.visibility = 'hidden';
        }
    });

    scrollUpButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const tocButton = document.getElementById('tocButton');

    const tocContainer = document.getElementById('tocContainer');
    const closeButton = tocContainer.querySelector('.icon-close-remove');

       
    tocButton.addEventListener('click', function() {
        tocContainer.classList.remove('hidden');
        tocContainer.classList.add('toc-slide-up');
    });
    
       
    closeButton.addEventListener('click', function() {
        tocContainer.classList.add('toc-slide-down');
        setTimeout(() => {
            tocContainer.classList.add('hidden');
            tocContainer.classList.remove('toc-slide-down');
        }, 300);
    });
    
        
    tocContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            tocContainer.classList.add('toc-slide-down');
            setTimeout(() => {
                tocContainer.classList.add('hidden');
                tocContainer.classList.remove('toc-slide-down');
            }, 300);
        });
    });
 
    new Splide('.related-posts-slider', {
        perPage: 1,
        perMove: 1,
        gap: '1rem',
        padding: { right: '20%' }, // This creates the peek effect
        focus: 'left', // Aligns slides to the left
        arrows: false,
        pagination: true,
        breakpoints: {
            640: {
                perPage: 1,
                padding: { right: '15%' },
            }
        }
    }).mount();

   
});