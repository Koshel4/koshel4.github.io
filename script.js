class TypeWriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    start(delay = 500) {
        setTimeout(() => this.type(), delay);
    }
}

class MilkyWayGalaxy {
    constructor() {
        this.container = document.getElementById('galaxy-container');
        this.bgCanvas = document.getElementById('galaxyBgCanvas');
        this.mainCanvas = document.getElementById('galaxyMainCanvas');

        if (!this.bgCanvas || !this.mainCanvas) return;

        this.bgCtx = this.bgCanvas.getContext('2d', { alpha: false });
        this.ctx = this.mainCanvas.getContext('2d', { alpha: true });

        this.CONFIG = {
            charSize: 10,
            font: '10px "JetBrains Mono", monospace',
            starCount: 6000,
            dustCount: 1500,
            nebulaCount: 100,
            armCount: 4,
            maxRadius: 600,
            rotationSpeed: 0.00025,
            tilt: -0.6,

            coreColors: ['#fff8e7', '#ffe4b5', '#ffd699', '#ffcc80'],
            armColors: [
                '#7dd3fc', '#38bdf8', '#0ea5e9',
                '#c084fc', '#a855f7', '#9333ea',
                '#f472b6', '#ec4899', '#db2777',
                '#34d399', '#10b981', '#059669',
            ],
            brightColors: ['#ffffff', '#f0f9ff', '#fef3c7'],
            dustColors: ['#1a1a2e', '#16213e', '#0f0f23'],
            nebulaColors: [
                'rgba(147, 51, 234, 0.15)',
                'rgba(59, 130, 246, 0.12)',
                'rgba(236, 72, 153, 0.1)',
                'rgba(16, 185, 129, 0.08)',
            ],
            chars: [' ', '·', '∙', '•', '°', '*', '✦', '✧', '★', '◆', '◈', '❋', '✹', '※', '❂', '@'],
            dustChars: ['░', '▒', '▓', '█', '▄', '▀'],
        };

        this.width = 0;
        this.height = 0;
        this.cols = 0;
        this.rows = 0;
        this.stars = [];
        this.dustClouds = [];
        this.nebulae = [];
        this.grid = [];
        this.bgStars = [];
        this.time = 0;
        this.animationId = null;
    }

    init() {
        if (!this.bgCanvas || !this.mainCanvas) return;

        this.resize();
        this.createBackgroundStars();
        this.renderBackground();

        for (let i = 0; i < this.CONFIG.starCount; i++) {
            this.stars.push(this.createStar());
        }

        for (let i = 0; i < this.CONFIG.dustCount; i++) {
            this.dustClouds.push(this.createDust());
        }

        for (let i = 0; i < this.CONFIG.nebulaCount; i++) {
            this.nebulae.push(this.createNebula());
        }

        window.addEventListener('resize', () => this.handleResize());

        this.loop();
    }

    handleResize() {
        this.resize();
        this.createBackgroundStars();
    }

    resize() {
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;

        this.width = Math.max(containerWidth, 800);
        this.height = Math.max(containerHeight, 600);

        this.bgCanvas.width = this.mainCanvas.width = this.width;
        this.bgCanvas.height = this.mainCanvas.height = this.height;

        if (this.width > containerWidth) {
            const offsetX = (this.width - containerWidth) / 2;
            this.bgCanvas.style.left = `-${offsetX}px`;
            this.mainCanvas.style.left = `-${offsetX}px`;
        } else {
            this.bgCanvas.style.left = '0';
            this.mainCanvas.style.left = '0';
        }

        this.cols = Math.ceil(this.width / this.CONFIG.charSize);
        this.rows = Math.ceil(this.height / this.CONFIG.charSize);
        this.grid = new Array(this.cols * this.rows);
    }

    createBackgroundStars() {
        this.bgStars = [];
        const count = Math.floor((this.width * this.height) / 2000);
        for (let i = 0; i < count; i++) {
            this.bgStars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                brightness: Math.random(),
                size: Math.random() * 1 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    renderBackground() {
        const gradient = this.bgCtx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.7
        );
        gradient.addColorStop(0, '#0d0d1a');
        gradient.addColorStop(0.3, '#080812');
        gradient.addColorStop(0.6, '#040408');
        gradient.addColorStop(1, '#000000');

        this.bgCtx.fillStyle = gradient;
        this.bgCtx.fillRect(0, 0, this.width, this.height);
    }

    createStar() {
        const isBulge = Math.random() < 0.18;
        const isBar = Math.random() < 0.1;
        const star = { isBulge: false, isBright: false };

        if (isBulge) {
            const r = Math.pow(Math.random(), 0.7) * 40;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            star.x = r * Math.sin(phi) * Math.cos(theta);
            star.y = r * Math.sin(phi) * Math.sin(theta) * 0.5;
            star.z = r * Math.cos(phi);
            star.r = r;
            star.baseColor = this.CONFIG.coreColors[Math.floor(Math.random() * this.CONFIG.coreColors.length)];
            star.isBulge = true;
        } else if (isBar) {
            const barLength = 60;
            star.x = (Math.random() - 0.5) * barLength * 2;
            star.y = (Math.random() - 0.5) * 8;
            star.z = (Math.random() - 0.5) * 20;
            star.r = Math.sqrt(star.x * star.x + star.z * star.z);
            star.baseColor = this.CONFIG.coreColors[Math.floor(Math.random() * this.CONFIG.coreColors.length)];
            star.isBulge = true;
        } else {
            const armIndex = Math.floor(Math.random() * this.CONFIG.armCount);
            const rNorm = Math.pow(Math.random(), 1.2);
            star.r = 30 + (rNorm * (this.CONFIG.maxRadius - 30));

            const armOffset = (Math.PI * 2 * armIndex) / this.CONFIG.armCount;
            const spiralTwist = Math.log(star.r / 30 + 1) * 2.8;
            const scatterAmplitude = 0.08 + (star.r / this.CONFIG.maxRadius) * 0.35;
            const angleFuzz = (Math.random() - 0.5) * scatterAmplitude;

            star.theta = armOffset + spiralTwist + angleFuzz;
            star.x = Math.cos(star.theta) * star.r;
            star.z = Math.sin(star.theta) * star.r;

            const thickness = 5 + (star.r * 0.01);
            star.y = (Math.random() - 0.5) * thickness * (Math.random() < 0.8 ? 0.3 : 1);

            const colorSet = this.CONFIG.armColors;
            const colorIndex = (armIndex * 3 + Math.floor(Math.random() * 3)) % colorSet.length;
            star.baseColor = colorSet[colorIndex];

            if (Math.random() < 0.08) {
                star.baseColor = this.CONFIG.brightColors[Math.floor(Math.random() * this.CONFIG.brightColors.length)];
                star.isBright = true;
            }
        }

        star.blinkSpeed = 0.015 + Math.random() * 0.04;
        star.blinkOffset = Math.random() * Math.PI * 2;
        star.blinkAmplitude = 0.3 + Math.random() * 0.4;

        return star;
    }

    createDust() {
        const armIndex = Math.floor(Math.random() * this.CONFIG.armCount);
        const rNorm = Math.pow(Math.random(), 1.5);
        const r = 40 + (rNorm * (this.CONFIG.maxRadius - 40));

        const armOffset = (Math.PI * 2 * armIndex) / this.CONFIG.armCount;
        const spiralTwist = Math.log(r / 30 + 1) * 2.8;
        const dustOffset = 0.15;
        const theta = armOffset + spiralTwist + dustOffset + (Math.random() - 0.5) * 0.1;

        return {
            x: Math.cos(theta) * r,
            z: Math.sin(theta) * r,
            y: (Math.random() - 0.5) * 3,
            r: r,
            baseColor: this.CONFIG.dustColors[Math.floor(Math.random() * this.CONFIG.dustColors.length)],
            char: this.CONFIG.dustChars[Math.floor(Math.random() * this.CONFIG.dustChars.length)],
            opacity: 0.3 + Math.random() * 0.4
        };
    }

    createNebula() {
        const armIndex = Math.floor(Math.random() * this.CONFIG.armCount);
        const r = 60 + Math.random() * 200;
        const armOffset = (Math.PI * 2 * armIndex) / this.CONFIG.armCount;
        const spiralTwist = Math.log(r / 30 + 1) * 2.8;
        const theta = armOffset + spiralTwist + (Math.random() - 0.5) * 0.3;

        return {
            x: Math.cos(theta) * r,
            z: Math.sin(theta) * r,
            y: (Math.random() - 0.5) * 10,
            r: r,
            size: 15 + Math.random() * 40,
            color: this.CONFIG.nebulaColors[Math.floor(Math.random() * this.CONFIG.nebulaColors.length)],
            pulseSpeed: 0.005 + Math.random() * 0.01,
            pulseOffset: Math.random() * Math.PI * 2
        };
    }

    updateObject(obj) {
        const rotSpeed = this.CONFIG.rotationSpeed * (1 + 120 / (obj.r + 40));
        const cosRot = Math.cos(rotSpeed);
        const sinRot = Math.sin(rotSpeed);

        const nx = obj.x * cosRot - obj.z * sinRot;
        const nz = obj.z * cosRot + obj.x * sinRot;

        obj.x = nx;
        obj.z = nz;
    }

    projectObject(obj, zOffsetAdd = 0) {
        const cosTilt = Math.cos(this.CONFIG.tilt);
        const sinTilt = Math.sin(this.CONFIG.tilt);

        const y2 = obj.y * cosTilt - obj.z * sinTilt;
        const z2 = obj.z * cosTilt + obj.y * sinTilt;

        const fov = 400;
        const zOffset = 500;
        const depth = z2 + zOffset + zOffsetAdd;

        if (depth < 30) return null;

        const scale = fov / depth;
        const screenX = (obj.x * scale) + (this.width / 2);
        const screenY = (y2 * scale) + (this.height / 2);

        return {
            c: Math.floor(screenX / this.CONFIG.charSize),
            r: Math.floor(screenY / this.CONFIG.charSize),
            depth: depth,
            scale: scale,
            screenX: screenX,
            screenY: screenY
        };
    }

    loop() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.renderBackground();
        for (let star of this.bgStars) {
            const twinkle = 0.3 + 0.7 * (Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5);
            const alpha = star.brightness * twinkle;
            this.bgCtx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.6})`;
            this.bgCtx.beginPath();
            this.bgCtx.arc(star.x, star.y, star.size * twinkle, 0, Math.PI * 2);
            this.bgCtx.fill();
        }

        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = null;
        }

        this.time += 1;

        for (let nebula of this.nebulae) {
            this.updateObject(nebula);
            const proj = this.projectObject(nebula);
            if (!proj || proj.scale < 0.1) continue;

            const pulse = 0.7 + 0.3 * Math.sin(this.time * nebula.pulseSpeed + nebula.pulseOffset);
            const size = nebula.size * proj.scale * pulse;
            const gradient = this.ctx.createRadialGradient(proj.screenX, proj.screenY, 0, proj.screenX, proj.screenY, size);
            gradient.addColorStop(0, nebula.color);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(proj.screenX, proj.screenY, size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        for (let dust of this.dustClouds) {
            this.updateObject(dust);
            const proj = this.projectObject(dust, 20);
            if (!proj || proj.c < 0 || proj.c >= this.cols || proj.r < 0 || proj.r >= this.rows) continue;

            const index = proj.r * this.cols + proj.c;
            const existing = this.grid[index];

            if (!existing || proj.depth < existing.depth) {
                this.grid[index] = {
                    char: dust.char,
                    color: dust.baseColor,
                    depth: proj.depth,
                    opacity: dust.opacity * (proj.scale * 1.5),
                    glow: false
                };
            }
        }

        for (let star of this.stars) {
            this.updateObject(star);
            const proj = this.projectObject(star);
            if (!proj || proj.c < 0 || proj.c >= this.cols || proj.r < 0 || proj.r >= this.rows) continue;

            const index = proj.r * this.cols + proj.c;
            const existing = this.grid[index];

            if (!existing || proj.depth < existing.depth) {
                let brightness = proj.scale * 8;
                if (star.isBulge) brightness *= 1.3;

                const twinkle = Math.sin(this.time * star.blinkSpeed + star.blinkOffset);
                brightness += twinkle * star.blinkAmplitude * 2;

                let charIndex = Math.floor(brightness);
                charIndex = Math.max(1, Math.min(this.CONFIG.chars.length - 1, charIndex));

                this.grid[index] = {
                    char: this.CONFIG.chars[charIndex],
                    color: star.baseColor,
                    depth: proj.depth,
                    opacity: 1,
                    glow: star.isBright || star.isBulge || charIndex > 8,
                    glowSize: charIndex > 10 ? 6 : 3
                };
            }
        }

        this.ctx.font = this.CONFIG.font;
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'left';

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.grid[r * this.cols + c];
                if (cell && cell.glow) {
                    this.ctx.shadowBlur = cell.glowSize || 4;
                    this.ctx.shadowColor = cell.color;
                    this.ctx.fillStyle = cell.color;
                    this.ctx.globalAlpha = cell.opacity;
                    this.ctx.fillText(cell.char, c * this.CONFIG.charSize, r * this.CONFIG.charSize);
                }
            }
        }

        this.ctx.shadowBlur = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = this.grid[r * this.cols + c];
                if (cell) {
                    this.ctx.fillStyle = cell.color;
                    this.ctx.globalAlpha = cell.opacity;
                    this.ctx.fillText(cell.char, c * this.CONFIG.charSize, r * this.CONFIG.charSize);
                }
            }
        }

        this.ctx.globalAlpha = 1;

        this.animationId = requestAnimationFrame(() => this.loop());
    }
}

class ScrollAnimator {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.observer = null;
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.elements.forEach(el => this.observer.observe(el));
    }
}

class SkillBars {
    constructor() {
        this.bars = document.querySelectorAll('.kernel-bar');
        this.animated = false;
    }

    init() {
        const skillsSection = document.querySelector('#skills');
        if (!skillsSection) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated) {
                        this.animateBars();
                        this.animated = true;
                    }
                });
            },
            { threshold: 0.3 }
        );

        observer.observe(skillsSection);
    }

    animateBars() {
        this.bars.forEach((bar, index) => {
            const level = bar.dataset.level || 50;
            setTimeout(() => {
                bar.style.width = `${level}%`;
            }, index * 150);
        });
    }
}

class Navigation {
    constructor() {
        this.sections = document.querySelectorAll('.section, .hero');
        this.navLinks = document.querySelectorAll('.nav-link');
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}


class AsciiMouseTrail {
    constructor() {
        if ('ontouchstart' in window) return;

        this.particles = [];
        this.chars = ['·', '∙', '•', '°', '*', '✦', '✧', '░', '▒', '█', '/', '\\', '|', '-', '+'];
        this.colors = ['#00ff9f', '#00d4ff', '#bd93f9', '#ff79c6', '#ffb86c'];
        this.maxParticles = 50;
        this.spawnRate = 3;
        this.frameCount = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMoving = false;
        this.moveTimeout = null;
    }

    init() {
        if ('ontouchstart' in window) return;

        this.heroSection = document.getElementById('hero');

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            const isOverHero = this.heroSection && this.heroSection.contains(e.target);
            this.isMoving = isOverHero;

            clearTimeout(this.moveTimeout);
            this.moveTimeout = setTimeout(() => {
                this.isMoving = false;
            }, 50);
        });

        this.animate();
    }

    createParticle() {
        const particle = document.createElement('span');
        particle.className = 'ascii-particle';
        particle.textContent = this.chars[Math.floor(Math.random() * this.chars.length)];
        particle.style.left = this.mouseX + (Math.random() - 0.5) * 20 + 'px';
        particle.style.top = this.mouseY + 'px';
        particle.style.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        particle.style.fontSize = (8 + Math.random() * 8) + 'px';

        document.body.appendChild(particle);

        return {
            element: particle,
            x: this.mouseX + (Math.random() - 0.5) * 20,
            y: this.mouseY,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
            life: 1,
            decay: 0.02 + Math.random() * 0.02
        };
    }

    animate() {
        this.frameCount++;
        if (this.isMoving && this.frameCount % this.spawnRate === 0 && this.particles.length < this.maxParticles) {
            this.particles.push(this.createParticle());
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life -= p.decay;

            p.element.style.left = p.x + 'px';
            p.element.style.top = p.y + 'px';
            p.element.style.opacity = p.life;

            if (p.life <= 0) {
                p.element.remove();
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}


class GravityEasterEgg {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.inputSequence = [];
        this.activated = false;
        this.engine = null;
        this.bodies = [];
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleKeyDown(e) {
        if (this.activated) return;

        this.inputSequence.push(e.code);
        if (this.inputSequence.length > this.konamiCode.length) {
            this.inputSequence.shift();
        }

        if (this.inputSequence.join(',') === this.konamiCode.join(',')) {
            this.activate();
        }
    }

    activate() {
        this.activated = true;

        document.querySelector('.scanlines')?.remove();

        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const Runner = Matter.Runner;
        const Bodies = Matter.Bodies;
        const Composite = Matter.Composite;
        const Mouse = Matter.Mouse;
        const MouseConstraint = Matter.MouseConstraint;

        this.engine = Engine.create();
        this.engine.world.gravity.y = 1;

        const runner = Runner.create();
        Runner.run(runner, this.engine);

        const docHeight = Math.max(document.body.scrollHeight, window.innerHeight);
        const docWidth = Math.max(document.body.scrollWidth, window.innerWidth);

        const floor = Bodies.rectangle(docWidth / 2, docHeight + 30, docWidth * 2, 60, { isStatic: true });
        const leftWall = Bodies.rectangle(-30, docHeight / 2, 60, docHeight * 2, { isStatic: true });
        const rightWall = Bodies.rectangle(docWidth + 30, docHeight / 2, 60, docHeight * 2, { isStatic: true });
        Composite.add(this.engine.world, [floor, leftWall, rightWall]);

        const selectors = [
            '.project-card',
            '.terminal-window',
            '.system-monitor',
            '.timeline-item',
            '.bonus-item',
            '.nav',
            '.footer'
        ];

        const elements = document.querySelectorAll(selectors.join(','));

        elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            const x = rect.left + scrollX + rect.width / 2;
            const y = rect.top + scrollY + rect.height / 2;

            const body = Bodies.rectangle(x, y, rect.width, rect.height, {
                restitution: 0.3,
                friction: 0.5,
                frictionAir: 0.01
            });

            el.style.position = 'absolute';
            el.style.left = rect.left + scrollX + 'px';
            el.style.top = rect.top + scrollY + 'px';
            el.style.width = rect.width + 'px';
            el.style.height = rect.height + 'px';
            el.style.margin = '0';
            el.style.zIndex = '10000';
            el.style.transition = 'none';

            document.body.appendChild(el);

            this.bodies.push({ el, body });
            Composite.add(this.engine.world, body);
        });

        const mouse = Mouse.create(document.body);
        mouse.pixelRatio = window.devicePixelRatio || 1;

        const mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(this.engine.world, mouseConstraint);

        const updateLoop = () => {
            for (const { el, body } of this.bodies) {
                el.style.left = (body.position.x - el.offsetWidth / 2) + 'px';
                el.style.top = (body.position.y - el.offsetHeight / 2) + 'px';
                el.style.transform = `rotate(${body.angle}rad)`;
            }
            requestAnimationFrame(updateLoop);
        };
        updateLoop();
    }
}


function showConsoleEasterEgg() {
    console.log('%c╔═══════════════════════════════════════════════════╗', 'color: #00ff9f');
    console.log('%c║                                                   ║', 'color: #00ff9f');
    console.log('%c║   👁️  Привет, любопытный разработчик!             ║', 'color: #00ff9f');
    console.log('%c║                                                   ║', 'color: #00ff9f');
    console.log('%c║   Если ты читаешь это — значит мы на одной волне  ║', 'color: #00ff9f');
    console.log('%c║   Пиши в Telegram: @Koshel4                       ║', 'color: #00d4ff');
    console.log('%c║                                                   ║', 'color: #00ff9f');
    console.log('%c╚═══════════════════════════════════════════════════╝', 'color: #00ff9f');
}

document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.getElementById('typing-name');
    if (typingElement) {
        const typeWriter = new TypeWriter(typingElement, 'Кошель Влад', 80);
        typeWriter.start(1000);
    }

    const galaxy = new MilkyWayGalaxy();
    galaxy.init();

    const scrollAnimator = new ScrollAnimator();
    scrollAnimator.init();

    const skillBars = new SkillBars();
    skillBars.init();

    const navigation = new Navigation();
    navigation.init();

    const mouseTrail = new AsciiMouseTrail();
    mouseTrail.init();

    const gravityEgg = new GravityEasterEgg();
    gravityEgg.init();

    showConsoleEasterEgg();
});

document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
