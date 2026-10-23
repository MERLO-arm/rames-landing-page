/* ============================================================
   RAMES - Main JavaScript
   Mobile Nav, Modal Lead Capture, Direct WhatsApp Dispatch
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) mobileToggle.textContent = '☰';
      }
    });
  });

  // 2. Modal Lead Capture
  const modal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // 3. Form Submission (Direct WhatsApp Integration)
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const contact = document.getElementById('clientContact').value.trim();
      const module = document.getElementById('clientModule').value;
      const msg = document.getElementById('clientMsg').value.trim();

      const text = `*Demande de Projet - RAMES*%0A%0A*Client / Entreprise:* ${encodeURIComponent(name)}%0A*Contact:* ${encodeURIComponent(contact)}%0A*Module choisi:* ${encodeURIComponent(module)}%0A*Message:* ${encodeURIComponent(msg || 'Je souhaite échanger sur une solution adaptée.')}`;

      // Official RAMES WhatsApp (+237 655 06 81 05)
      const waUrl = `https://wa.me/237655068105?text=${text}`;

      window.open(waUrl, '_blank');

      if (modal) modal.classList.remove('active');
      modalForm.reset();
      alert('Merci ! Vous allez être redirigé vers WhatsApp pour échanger directement avec un expert RAMES.');
    });
  }

  // ============================================================
  // 4. GOOGLE ANTIGRAVITY 3D CUBES & PARTICLE PHYSICS ENGINE
  // ============================================================

  // 3D Rotating Isometric Cube
  class Cube3D {
    constructor(x, y, size, isDark) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.isDark = isDark;

      // Rotation angles
      this.rx = Math.random() * Math.PI * 2;
      this.ry = Math.random() * Math.PI * 2;
      this.rz = Math.random() * Math.PI * 2;

      // Angular velocities
      this.vrx = (Math.random() - 0.5) * 0.02;
      this.vry = (Math.random() - 0.5) * 0.025;
      this.vrz = (Math.random() - 0.5) * 0.015;

      // Upward anti-gravity drift
      this.vy = -(0.35 + Math.random() * 0.75);
      this.sway = Math.random() * 0.6 + 0.2;
      this.phase = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.45 + 0.35;

      // Unit Cube 8 vertices in 3D: [-1, 1]
      this.vertices = [
        [-1, -1, -1], [ 1, -1, -1], [ 1,  1, -1], [-1,  1, -1],
        [-1, -1,  1], [ 1, -1,  1], [ 1,  1,  1], [-1,  1,  1]
      ];

      // 6 Faces
      this.faces = [
        [0, 1, 2, 3], // back
        [4, 5, 6, 7], // front
        [0, 1, 5, 4], // top
        [2, 3, 7, 6], // bottom
        [0, 3, 7, 4], // left
        [1, 2, 6, 5]  // right
      ];
    }

    update(width, height, mouse, time) {
      this.rx += this.vrx;
      this.ry += this.vry;
      this.rz += this.vrz;

      this.y += this.vy;
      this.x += Math.sin(time * 0.001 + this.phase) * this.sway;

      // Mouse repulsion & velocity impulse
      if (mouse && mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 160;
        if (dist < maxDist && dist > 1) {
          const force = (1 - dist / maxDist) * 2.2;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
          this.vrx += 0.003 * force;
          this.vry += 0.004 * force;
        }
      }

      // Loop around screen (Anti-gravity upward cycle)
      if (this.y < -this.size * 2) {
        this.y = height + this.size * 2;
        this.x = Math.random() * width;
      }
      if (this.x < -this.size * 2) this.x = width + this.size;
      if (this.x > width + this.size * 2) this.x = -this.size;
    }

    draw(ctx, isDarkTheme) {
      const s = this.size;
      const cosX = Math.cos(this.rx), sinX = Math.sin(this.rx);
      const cosY = Math.cos(this.ry), sinY = Math.sin(this.ry);
      const cosZ = Math.cos(this.rz), sinZ = Math.sin(this.rz);

      const projected = this.vertices.map(([vx, vy, vz]) => {
        let y1 = vy * cosX - vz * sinX;
        let z1 = vy * sinX + vz * cosX;
        let x2 = vx * cosY + z1 * sinY;
        let z2 = -vx * sinY + z1 * cosY;
        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = x2 * sinZ + y1 * cosZ;

        const fov = 380;
        const p = fov / (fov + z2 * s);
        return [this.x + x3 * s * p, this.y + y3 * s * p, z2];
      });

      // Sort faces by depth
      const sortedFaces = this.faces.map(face => {
        const avgZ = (projected[face[0]][2] + projected[face[1]][2] + projected[face[2]][2] + projected[face[3]][2]) / 4;
        return { face, avgZ };
      }).sort((a, b) => a.avgZ - b.avgZ);

      sortedFaces.forEach(({ face, avgZ }) => {
        ctx.beginPath();
        ctx.moveTo(projected[face[0]][0], projected[face[0]][1]);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(projected[face[i]][0], projected[face[i]][1]);
        }
        ctx.closePath();

        const alpha = Math.min(0.65, Math.max(0.12, (avgZ + 1.5) * 0.28)) * this.opacity;
        if (isDarkTheme) {
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.35})`;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 1.4})`;
          ctx.lineWidth = 1.2;
        } else {
          ctx.fillStyle = `rgba(0, 98, 210, ${alpha * 0.2})`;
          ctx.strokeStyle = `rgba(0, 98, 210, ${alpha * 1.1})`;
          ctx.lineWidth = 1.1;
        }
        ctx.fill();
        ctx.stroke();
      });
    }
  }

  // Antigravity Floating Particles & Shards (Google Antigravity Confetti Style)
  class ParticleShard {
    constructor(width, height) {
      this.reset(width, height, true);
    }

    reset(width, height, initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 15;
      this.w = Math.random() * 8 + 4;
      this.h = Math.random() * 5 + 3;
      this.angle = Math.random() * Math.PI * 2;
      this.vAngle = (Math.random() - 0.5) * 0.035;
      this.vy = -(0.45 + Math.random() * 0.85); // Upward float
      this.sway = Math.random() * 0.7 + 0.3;
      this.phase = Math.random() * Math.PI * 2;
      this.type = Math.random() > 0.35 ? 'rect' : 'circle';

      const colors = [
        'rgba(0, 240, 255, ',   // cyan
        'rgba(0, 98, 210, ',    // RAMES blue
        'rgba(79, 70, 229, ',   // indigo
        'rgba(147, 51, 234, ',  // violet
        'rgba(245, 158, 11, ',  // amber
        'rgba(16, 185, 129, '   // emerald
      ];
      this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.45 + 0.35;
    }

    update(width, height, mouse, time) {
      this.y += this.vy;
      this.angle += this.vAngle;
      this.x += Math.sin(time * 0.001 + this.phase) * this.sway;

      if (mouse && mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 1) {
          const force = (1 - dist / 130) * 2;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }

      if (this.y < -25) {
        this.reset(width, height, false);
      }
    }

    draw(ctx, isDarkTheme) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const a = isDarkTheme ? Math.min(1, this.alpha * 1.3) : this.alpha;
      ctx.fillStyle = this.baseColor + a + ')';

      if (this.type === 'rect') {
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.w / 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Initialize Hero Canvas Engine
  const heroCanvas = document.getElementById('antigravityCanvas');
  const heroSection = document.getElementById('accueil');

  if (heroCanvas && heroSection) {
    const ctx = heroCanvas.getContext('2d');
    let width = 0, height = 0;
    let currentMode = 'particles'; // 'particles', 'cubes', 'dark'
    const mouse = { x: null, y: null };

    let particles = [];
    let cubes = [];

    function resize() {
      const rect = heroSection.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      heroCanvas.width = width * dpr;
      heroCanvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      initElements();
    }

    function initElements() {
      particles = [];
      cubes = [];

      const particleCount = currentMode === 'particles' ? 55 : (currentMode === 'dark' ? 70 : 25);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new ParticleShard(width, height));
      }

      const cubeCount = currentMode === 'cubes' ? 28 : (currentMode === 'dark' ? 22 : 12);
      for (let i = 0; i < cubeCount; i++) {
        const size = Math.random() * 18 + 10;
        cubes.push(new Cube3D(
          Math.random() * width,
          Math.random() * height,
          size,
          currentMode === 'dark'
        ));
      }
    }

    window.addEventListener('resize', resize);
    resize();

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Animation Loop
    function render(time) {
      ctx.clearRect(0, 0, width, height);

      const isDark = currentMode === 'dark';

      // Subtle ambient perspective grid on dark mode
      if (isDark) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 45;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Draw Particles
      particles.forEach(p => {
        p.update(width, height, mouse, time);
        p.draw(ctx, isDark);
      });

      // Draw Cubes
      cubes.forEach(c => {
        c.update(width, height, mouse, time);
        c.draw(ctx, isDark);
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // Proposals Switcher Buttons
    const btnParticles = document.getElementById('btnModeParticles');
    const btnCubes = document.getElementById('btnModeCubes');
    const btnDark = document.getElementById('btnModeDark');
    const allPropBtns = document.querySelectorAll('.prop-btn');

    function setMode(mode) {
      currentMode = mode;
      allPropBtns.forEach(btn => btn.classList.remove('active'));

      if (mode === 'dark') {
        heroSection.classList.add('dark-mode');
        btnDark.classList.add('active');
      } else {
        heroSection.classList.remove('dark-mode');
        if (mode === 'particles') btnParticles.classList.add('active');
        if (mode === 'cubes') btnCubes.classList.add('active');
      }

      initElements();
    }

    if (btnParticles) btnParticles.addEventListener('click', () => setMode('particles'));
    if (btnCubes) btnCubes.addEventListener('click', () => setMode('cubes'));
    if (btnDark) btnDark.addEventListener('click', () => setMode('dark'));
  }

  // ============================================================
  // 5. DEEP SPACE SECTION (Google Antigravity Image 2)
  // ============================================================
  const deepspaceCanvas = document.getElementById('deepspaceCanvas');
  const deepspaceSection = document.getElementById('antigravity-deepspace');

  if (deepspaceCanvas && deepspaceSection) {
    const dctx = deepspaceCanvas.getContext('2d');
    let dWidth = 0, dHeight = 0;
    const dMouse = { x: null, y: null };

    let spaceCubes = [];
    let spaceStars = [];

    function resizeSpace() {
      const rect = deepspaceSection.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dWidth = rect.width;
      dHeight = rect.height;

      deepspaceCanvas.width = dWidth * dpr;
      deepspaceCanvas.height = dHeight * dpr;
      dctx.resetTransform();
      dctx.scale(dpr, dpr);

      spaceCubes = [];
      spaceStars = [];

      // Create glowing 3D perspective cubes
      for (let i = 0; i < 24; i++) {
        const size = Math.random() * 22 + 10;
        spaceCubes.push(new Cube3D(
          Math.random() * dWidth,
          Math.random() * dHeight,
          size,
          true
        ));
      }

      // Cosmic dust particles
      for (let i = 0; i < 80; i++) {
        spaceStars.push(new ParticleShard(dWidth, dHeight));
      }
    }

    window.addEventListener('resize', resizeSpace);
    resizeSpace();

    deepspaceSection.addEventListener('mousemove', (e) => {
      const rect = deepspaceSection.getBoundingClientRect();
      dMouse.x = e.clientX - rect.left;
      dMouse.y = e.clientY - rect.top;
    });

    deepspaceSection.addEventListener('mouseleave', () => {
      dMouse.x = null;
      dMouse.y = null;
    });

    function renderSpace(time) {
      dctx.clearRect(0, 0, dWidth, dHeight);

      spaceStars.forEach(s => {
        s.update(dWidth, dHeight, dMouse, time);
        s.draw(dctx, true);
      });

      spaceCubes.forEach(c => {
        c.update(dWidth, dHeight, dMouse, time);
        c.draw(dctx, true);
      });

      requestAnimationFrame(renderSpace);
    }

    requestAnimationFrame(renderSpace);
  }
});
