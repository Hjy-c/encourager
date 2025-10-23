// 粒子动画效果 - 增强首页科技感
class ParticleAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.isRunning = false;
    }

    init() {
        // 创建canvas元素并添加到页面
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-background';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.isRunning = true;
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5;
            const speedY = (Math.random() - 0.5) * 0.5;
            const color = this.getRandomColor();
            
            this.particles.push({
                x, y, size, speedX, speedY, color
            });
        }
    }

    getRandomColor() {
        // 创建角色主题色的随机变体，保持品牌一致性
        const themes = [
            '#6c5ce7', '#8e44ad', // Cyber侦探主题紫色调
            '#00b894', '#00cec9', // 非遗守护人主题青色调
            '#0984e3', '#6c5ce7', // 星球开拓者主题蓝色调
            '#fdcb6e', '#e17055'  // 数学探索家主题暖色调
        ];
        return themes[Math.floor(Math.random() * themes.length)];
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
        });
    }

    connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 粒子之间的连线效果
                if (distance < 100) {
                    opacityValue = 1 - distance / 100;
                    this.ctx.strokeStyle = `rgba(108, 92, 231, ${opacityValue * 0.3})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            // 更新粒子位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // 边界检查与回弹
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }

            // 鼠标交互 - 粒子排斥效果
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                
                particle.x -= forceDirectionX * force * 3;
                particle.y -= forceDirectionY * force * 3;
            }

            // 绘制粒子
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }

    stop() {
        this.isRunning = false;
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// 创建全局变量供其他文件使用
const particleAnimation = new ParticleAnimation();

// 导出函数供外部调用
function startParticleAnimation() {
    particleAnimation.init();
}

function stopParticleAnimation() {
    particleAnimation.stop();
}