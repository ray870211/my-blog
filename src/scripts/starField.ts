import { gsap } from 'gsap';

const MOBILE_BREAKPOINT = 768;
const STAR_COUNT = 1000;
const STAR_TYPES = [
  { color: '#ffffff' },
  { color: '#ffe4b5' },
  { color: '#ffccaa' },
  { color: '#e6f3ff' },
] as const;

interface Star {
  element: HTMLDivElement;
  originalX: number;
  originalY: number;
  size: number;
  baseOpacity: number;
  depth: number;
  twinkleSpeed: number;
}

function isMobileViewport(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function canvasSize(mobile: boolean): number {
  return mobile ? 200 : 150;
}

function createStarElement(canvasPercent: number): {
  element: HTMLDivElement;
  meta: Omit<Star, 'element'>;
} {
  const element = document.createElement('div');
  element.className = 'absolute rounded-full';

  const baseSize = Math.random() * 3 + 0.5;
  const x = Math.random() * canvasPercent;
  const y = Math.random() * canvasPercent;
  const depth = Math.random();
  const opacity = 0.3 + depth * 0.7;
  const size = baseSize * (0.5 + depth * 0.5);
  const starType = STAR_TYPES[Math.floor(Math.random() * STAR_TYPES.length)];

  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.left = `${x}%`;
  element.style.top = `${y}%`;
  element.style.opacity = opacity.toString();
  element.style.backgroundColor = starType.color;
  element.style.boxShadow = `0 0 ${size * 4}px ${starType.color}80`;
  element.style.willChange = 'transform, opacity';
  element.style.transform = 'translateZ(0)';

  return {
    element,
    meta: {
      originalX: x,
      originalY: y,
      size,
      baseOpacity: opacity,
      depth,
      twinkleSpeed: Math.random() * 4 + 2,
    },
  };
}

function renderStars(container: HTMLElement, mobile: boolean): Star[] {
  const stars: Star[] = [];
  const percent = canvasSize(mobile);

  for (let i = 0; i < STAR_COUNT; i++) {
    const { element, meta } = createStarElement(percent);
    container.appendChild(element);
    stars.push({ element, ...meta });
  }

  return stars;
}

function startAnimations(
  stars: Star[],
  milkyWay: HTMLElement | null,
  starsContainer: HTMLElement | null,
  mobile: boolean,
): void {
  if (mobile) {
    if (milkyWay) {
      gsap.to(milkyWay, {
        rotation: 360,
        duration: 480,
        repeat: -1,
        ease: 'none',
      });
    }
    return;
  }

  const timeline = gsap.timeline({ repeat: -1 });

  stars.forEach(star => {
    timeline.to(
      star.element,
      {
        opacity: star.baseOpacity * 0.3,
        duration: star.twinkleSpeed,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      Math.random() * 3,
    );

    if (Math.random() < 0.15) {
      timeline.to(
        star.element,
        {
          scale: 1.4,
          duration: star.twinkleSpeed * 1.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1,
        },
        Math.random() * 5,
      );
    }
  });

  if (milkyWay) {
    gsap.to(milkyWay, {
      rotation: 360,
      duration: 360,
      repeat: -1,
      ease: 'none',
    });
  }

  if (starsContainer) {
    gsap.to(starsContainer, {
      rotation: 360,
      duration: 360,
      repeat: -1,
      ease: 'none',
      transformOrigin: 'center center',
    });
  }
}

function attachMouseParallax(
  stars: Star[],
  nightSky: HTMLElement | null,
  milkyWay: HTMLElement | null,
): void {
  let mouseX = 0;
  let mouseY = 0;
  let mouseTimeout: ReturnType<typeof setTimeout> | undefined;

  const apply = () => {
    const parallaxX = (mouseX - 50) * 0.02;
    const parallaxY = (mouseY - 50) * 0.02;

    if (nightSky) {
      gsap.to(nightSky, {
        x: parallaxX * 10,
        y: parallaxY * 10,
        duration: 2,
        ease: 'power2.out',
      });
    }

    stars.forEach(star => {
      gsap.to(star.element, {
        x: parallaxX * star.depth * 20,
        y: parallaxY * star.depth * 20,
        duration: 1.5,
        ease: 'power2.out',
      });
    });

    if (milkyWay) {
      gsap.to(milkyWay, {
        x: parallaxX * 15,
        y: parallaxY * 15,
        duration: 2.5,
        ease: 'power2.out',
      });
    }
  };

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth) * 150;
    mouseY = (e.clientY / window.innerHeight) * 150;

    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(apply, 50);
  });
}

function attachResize(stars: Star[], initialMobile: boolean): void {
  let mobile = initialMobile;
  let resizeTimeout: ReturnType<typeof setTimeout> | undefined;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const nextMobile = isMobileViewport();
      if (mobile === nextMobile) return;

      mobile = nextMobile;
      const percent = canvasSize(mobile);

      stars.forEach(star => {
        const x = Math.random() * percent;
        const y = Math.random() * percent;
        star.originalX = x;
        star.originalY = y;
        star.element.style.left = `${x}%`;
        star.element.style.top = `${y}%`;
      });
    }, 300);
  });
}

export function initStarField(): void {
  const backgroundElement = document.getElementById('animated-background');
  const starsContainer = document.getElementById('stars-container');
  const nightSky = document.getElementById('night-sky');
  const milkyWay = document.getElementById('milky-way');

  if (!backgroundElement || !starsContainer) return;

  const globalKey = '__starFieldInitialized' as const;
  const w = window as unknown as Record<string, boolean>;

  if (starsContainer.children.length > 0) {
    w[globalKey] = true;
    return;
  }

  if (w[globalKey]) return;

  const mobile = isMobileViewport();
  const stars = renderStars(starsContainer, mobile);

  startAnimations(stars, milkyWay, starsContainer, mobile);

  if (!mobile) {
    attachMouseParallax(stars, nightSky, milkyWay);
  }

  attachResize(stars, mobile);

  w[globalKey] = true;
}
