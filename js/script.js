// Navigation Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Update active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.classList.contains('gallery-trigger')) {
            return;
        }

        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.project-card, .skill-category').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Lightbox Gallery
const galleryTriggers = document.querySelectorAll('.gallery-trigger');
const lightboxOverlay = document.querySelector('.lightbox-overlay');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxThumbnails = document.querySelector('.lightbox-thumbnails');
const closeButton = document.querySelector('.lightbox-close');
const prevButton = document.querySelector('.lightbox-prev');
const nextButton = document.querySelector('.lightbox-next');

let activeGallery = null;
let activeIndex = 0;

const placeholderImage = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#111827"/><text x="50%" y="50%" fill="#f8fafc" font-family="Segoe UI, sans-serif" font-size="48" text-anchor="middle" dominant-baseline="middle">Gallery image coming soon</text></svg>'
);
const fallbackImage = `data:image/svg+xml;charset=UTF-8,${placeholderImage}`;

const galleryImages = {
    'gallery-1': [
        'assets/images/Galleries/PCSizzle/PCSizzleReel.webm'
    ],
    'gallery-2': [
        'assets/images/Galleries/FIFA/FIFA-Infographic-Flyer.jpg',
        'assets/images/Galleries/FIFA/FIFA-Infographic-1080x1920.webm'
    ],
    'gallery-3': [
        'assets/images/Galleries/PH360/01-PH-Social-1.jpg',
        'assets/images/Galleries/PH360/02-PH-Social-2.jpg',
        'assets/images/Galleries/PH360/03-PH-Social-3.jpg',
        'assets/images/Galleries/PH360/04-PH-Social-4.jpg',
        'assets/images/Galleries/PH360/05-PH-Social-5.jpg',
        'assets/images/Galleries/PH360/08-TVSlides3.jpg',
        'assets/images/Galleries/PH360/09-TVSlides4.jpg',
        'assets/images/Galleries/PH360/10-TVSlides5.jpg',
        'assets/images/Galleries/PH360/11-TVSlides6.jpg',
        'assets/images/Galleries/PH360/12-TVSlides7.jpg',
        'assets/images/Galleries/PH360/13-TVSlides8.jpg',
        'assets/images/Galleries/PH360/14-Flyer.jpg',
        'assets/images/Galleries/PH360/15-Eblast.jpg'
    ],
    'gallery-4': [
        'assets/images/Galleries/Tufts/01-Collateral-Mockup.jpg',
        'assets/images/Galleries/Tufts/02-PC-Front.jpg',
        'assets/images/Galleries/Tufts/03-PC-Back.jpg',
        'assets/images/Galleries/Tufts/04-Letter-Envelope.jpg',
        'assets/images/Galleries/Tufts/05-Print-Ad.jpg',
        'assets/images/Galleries/Tufts/06-HTML-Email.jpg'
    ],
    'gallery-5': [
        'assets/images/Galleries/WIIF/01-WIIF-Insta3.webm',
        'assets/images/Galleries/WIIF/02-WIIF-Insta4.webm',
        'assets/images/Galleries/WIIF/03-WIIF-Social1.jpg',
        'assets/images/Galleries/WIIF/04-WIIF-Social2.jpg',
        'assets/images/Galleries/WIIF/05-WIIF-Social3.jpg',
        'assets/images/Galleries/WIIF/06-WIIF-PPT.pdf',
    ],
    'gallery-6': [
        'assets/images/Galleries/SBLI/SBLI-Mockup-1.webm',
        'assets/images/Galleries/SBLI/SBLI-Mockup-2.webm'
    ],
    'gallery-7': [
        'assets/images/Galleries/Baystate/Mockup.jpg',
        'assets/images/Galleries/Baystate/Inserts Mockup.jpg',
        'assets/images/Galleries/Baystate/Cover Flat.jpg',
        'assets/images/Galleries/Baystate/Inside Flat.jpg'
    ],
    'gallery-8': [
        'assets/images/Galleries/PCBranded/01-PC-PowerPoint.pdf',
        'assets/images/Galleries/PCBranded/02-PC-Brand-Guidelines-1.jpg',
        'assets/images/Galleries/PCBranded/03-PC-Brand-Guidelines-2.jpg',
        'assets/images/Galleries/PCBranded/04-PC-WordDoc.jpg',
        'assets/images/Galleries/PCBranded/05-PC-Creative-Brief-1.jpg',
        'assets/images/Galleries/PCBranded/06-PC-Creative-Brief-2.jpg',
        'assets/images/Galleries/PCBranded/07-PC-Creative-Brief-3.jpg',
        'assets/images/Galleries/PCBranded/08-PC-FBPage.jpg'
    ],
    'gallery-9': [
        'assets/images/Galleries/Dartmouth/01-CoverMockup.jpg',
        'assets/images/Galleries/Dartmouth/02-CoverMockupFlat.jpg',
        'assets/images/Galleries/Dartmouth/03-Spread-1.jpg',
        'assets/images/Galleries/Dartmouth/04-Spread-2.jpg',
        'assets/images/Galleries/Dartmouth/05-Spread-3.jpg',
        'assets/images/Galleries/Dartmouth/06-Spread-4.jpg',
        'assets/images/Galleries/Dartmouth/07-Spread-5.jpg'
    ]
};

const galleryLabels = {
    'gallery-1': 'Pierce-Coté Advertising Sizzle Reel',
    'gallery-2': 'FIFA World Cup 2026 Infographics',
    'gallery-3': 'Power Hour 360 Gym Ad Campaign',
    'gallery-4': 'Tufts Medicine Radiology Recruiting Campaign',
    'gallery-5': 'Town of Sandwich Water Infrastructure Fund Video & Collateral',
    'gallery-6': 'SBLI Boston Subway Triptych Ad',
    'gallery-7': 'Baystate Health Benefits Guide Pocket Folder & Inserts',
    'gallery-8': 'Pierce-Coté Advertising Branded Material',
    'gallery-9': 'Dartmouth-Hitchcock Benefits Guide Brochure'
};

function getThumbnailSrc(src) {
    if (src.includes('youtube.com/embed/')) {
        const videoId = src.split('/embed/')[1].split('?')[0];
        return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }
    if (src.endsWith('.pdf')) {
        return fallbackImage; // Use a placeholder for unspecified PDFs
    }
    return src;
}

function setActiveThumbnails(index) {
    lightboxThumbnails.innerHTML = '';
    galleryImages[activeGallery].forEach((imageSrc, thumbIndex) => {
        const thumbButton = document.createElement('button');
        thumbButton.type = 'button';
        thumbButton.className = 'lightbox-thumb' + (thumbIndex === index ? ' active' : '');
        thumbButton.addEventListener('click', () => {
            activeIndex = thumbIndex;
            updateLightbox();
        });

            const thumbImage = document.createElement('img');
            // Custom thumbnails for specific gallery items
            let thumbSrc;
            if (activeGallery === 'gallery-1' && thumbIndex === 0) {
                thumbSrc = 'assets/images/Galleries/PCSizzle/PCSizzleReel-Thumb.png';
            } else if (activeGallery === 'gallery-2' && imageSrc.includes('FIFA-Infographic-1080x1920.webm')) {
                thumbSrc = 'assets/images/Galleries/FIFA/FIFA-Infographic-1080x1920-Thumb.png';
            } else if (activeGallery === 'gallery-6') {
                if (imageSrc.includes('SBLI-Mockup-1.webm')) {
                    thumbSrc = 'assets/images/Galleries/SBLI/SBLI-Mockup-1-Thumb.png';
                } else if (imageSrc.includes('SBLI-Mockup-2.webm')) {
                    thumbSrc = 'assets/images/Galleries/SBLI/SBLI-Mockup-2-Thumb.png';
                } else {
                    thumbSrc = getThumbnailSrc(imageSrc);
                }
            } else if (activeGallery === 'gallery-5') {
                if (imageSrc.includes('01-WIIF-Insta3.webm')) {
                    thumbSrc = 'assets/images/Galleries/WIIF/01-WIIF-Insta3-Thumb.png';
                } else if (imageSrc.includes('02-WIIF-Insta4.webm')) {
                    thumbSrc = 'assets/images/Galleries/WIIF/02-WIIF-Insta4-Thumb.png';
                } else if (imageSrc.includes('06-WIIF-PPT.pdf')) {
                    thumbSrc = 'assets/images/Galleries/WIIF/06-WIIF-PPT-Thumb.png';
                } else {
                    thumbSrc = getThumbnailSrc(imageSrc);
                }
            } else if (activeGallery === 'gallery-8') {
                if (imageSrc.includes('01-PC-PowerPoint.pdf')) {
                    thumbSrc = 'assets/images/Galleries/PCBranded/01-PC-PowerPoint-Thumb.png';
                } else {
                    thumbSrc = getThumbnailSrc(imageSrc);
                }
            } else {
                thumbSrc = getThumbnailSrc(imageSrc);
            }
            thumbImage.src = thumbSrc;
            thumbImage.alt = `${galleryLabels[activeGallery]} thumbnail ${thumbIndex + 1}`;
        thumbButton.appendChild(thumbImage);
        lightboxThumbnails.appendChild(thumbButton);
    });
}

function updateLightbox() {
    const currentImages = galleryImages[activeGallery];
    const currentSrc = currentImages[activeIndex];
    const lightboxContent = document.querySelector('.lightbox-content');
    
    lightboxContent.innerHTML = '';

    // Handle different media types
    
    if (currentSrc.includes('youtube.com/embed/')) {
        const iframe = document.createElement('iframe');
        iframe.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'autoplay=1&mute=1';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        lightboxContent.appendChild(iframe);
    } else if (currentSrc.endsWith('.webm') || currentSrc.endsWith('.mp4') || currentSrc.endsWith('.ogg')) {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        const source = document.createElement('source');
        source.src = currentSrc;
        source.type = currentSrc.endsWith('.webm') ? 'video/webm' : currentSrc.endsWith('.mp4') ? 'video/mp4' : 'video/ogg';
        video.appendChild(source);
        lightboxContent.appendChild(video);
    } else if (currentSrc.endsWith('.pdf')) {
        const iframe = document.createElement('iframe');
        iframe.src = currentSrc;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        lightboxContent.appendChild(iframe);
    } else {
        const img = document.createElement('img');
        img.src = currentSrc;
        img.alt = `${galleryLabels[activeGallery]} - image ${activeIndex + 1}`;
        img.className = 'lightbox-image';

        if (currentSrc.endsWith('15-Eblast.jpg')) {
            img.classList.add('full-width');
            lightboxContent.classList.add('scrollable');
        } else {
            lightboxContent.classList.remove('scrollable');
        }

        lightboxContent.appendChild(img);
    }
    
    lightboxTitle.textContent = galleryLabels[activeGallery];
    lightboxCaption.textContent = `${activeIndex + 1} of ${currentImages.length}`;
    setActiveThumbnails(activeIndex);
}

function openLightbox(galleryId, startIndex = 0) {
    activeGallery = galleryId;
    activeIndex = startIndex;
    updateLightbox();
    lightboxOverlay.classList.remove('hidden');
    lightboxOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
}

function closeLightbox() {
    const lightboxContent = document.querySelector('.lightbox-content');
    lightboxContent.innerHTML = '';
    lightboxContent.classList.remove('scrollable');
    lightboxOverlay.classList.add('hidden');
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
}

galleryTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
        event.preventDefault();
        const galleryId = trigger.dataset.gallery;
        if (!galleryId || !galleryImages[galleryId]) {
            return;
        }
        openLightbox(galleryId);
    });
});

closeButton.addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + galleryImages[activeGallery].length) % galleryImages[activeGallery].length;
    updateLightbox();
});
nextButton.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % galleryImages[activeGallery].length;
    updateLightbox();
});

lightboxOverlay.addEventListener('click', (event) => {
    if (event.target === lightboxOverlay) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (event) => {
    if (lightboxOverlay.classList.contains('hidden')) return;

    if (event.key === 'Escape') {
        closeLightbox();
    }
    if (event.key === 'ArrowLeft') {
        prevButton.click();
    }
    if (event.key === 'ArrowRight') {
        nextButton.click();
    }
});
