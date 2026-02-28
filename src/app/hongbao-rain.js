
// 红包计数
        let hongbaoCount = 0;
        const rainContainer = document.getElementById('hongbaoRain');

        // 领取红包
        function showReward() {
            // 创建多个庆祝效果
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    createExplosion(
                        window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                        window.innerHeight / 2 + (Math.random() - 0.5) * 200
                    );
                    createGoldCoin(
                        window.innerWidth / 2 + (Math.random() - 0.5) * 300,
                        window.innerHeight / 2
                    );
                }, i * 100);
            }

            setTimeout(() => {
                alert('🧧 恭喜发财！\n\n您获得了 ¥8.88 现金红包！\n\n红包已存入您的账户');
            }, 500);
        }

        // 创建红包SVG
        function createHongbaoSVG() {
            return `
                <svg viewBox="0 0 60 78" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#E74C3C"/>
                            <stop offset="50%" style="stop-color:#C0392B"/>
                            <stop offset="100%" style="stop-color:#E74C3C"/>
                        </linearGradient>
                    </defs>
                    <rect x="5" y="15" width="50" height="58" rx="4" fill="url(#redGradient)"/>
                    <path d="M5 30 L5 18 Q5 15 8 15 L52 15 Q55 15 55 18 L55 30 Q30 45 5 30" fill="#B71C1C"/>
                    <circle cx="30" cy="45" r="15" fill="#F1C40F"/>
                    <circle cx="30" cy="45" r="12" fill="#F39C12"/>
                    <text x="30" y="50" text-anchor="middle" font-size="14" font-weight="bold" fill="#C0392B" font-family="serif">福</text>
                    <rect x="8" y="18" width="44" height="52" rx="2" fill="none" stroke="#F1C40F" stroke-width="1"/>
                    <circle cx="30" cy="20" r="5" fill="#F1C40F"/>
                    <rect x="27" y="10" width="6" height="12" rx="2" fill="#F1C40F"/>
                </svg>
            `;
        }

        // 创建单个红包
        function createHongbao() {
            const hongbao = document.createElement('div');
            hongbao.className = 'hongbao';
            hongbao.innerHTML = createHongbaoSVG();

            const startX = Math.random() * (window.innerWidth - 50);
            const duration = 4 + Math.random() * 4;
            const delay = Math.random() * 2;
            const size = 45 + Math.random() * 25;

            hongbao.style.left = startX + 'px';
            hongbao.style.width = size + 'px';
            hongbao.style.height = (size * 1.3) + 'px';
            hongbao.style.animationDuration = duration + 's';
            hongbao.style.animationDelay = delay + 's';

            hongbao.addEventListener('click', function (e) {
                hongbaoCount++;
                createExplosion(e.clientX, e.clientY);
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => createGoldCoin(e.clientX, e.clientY), i * 80);
                }
                hongbao.remove();
            });

            hongbao.addEventListener('animationend', function () {
                hongbao.remove();
            });

            rainContainer.appendChild(hongbao);
        }

        // 创建爆炸效果
        function createExplosion(x, y) {
            const explosion = document.createElement('div');
            explosion.className = 'explosion';
            explosion.style.left = (x - 25) + 'px';
            explosion.style.top = (y - 25) + 'px';
            document.body.appendChild(explosion);
            setTimeout(() => explosion.remove(), 600);
        }

        // 创建金币效果
        function createGoldCoin(x, y) {
            const coin = document.createElement('div');
            coin.className = 'gold-coin';
            const emojis = ['💰', '🪙', '✨', '💵', '🏆'];
            coin.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            coin.style.left = (x - 14 + (Math.random() - 0.5) * 60) + 'px';
            coin.style.top = (y - 14) + 'px';
            document.body.appendChild(coin);
            setTimeout(() => coin.remove(), 1000);
        }

        // 持续生成红包
        function startRain() {
            for (let i = 0; i < 6; i++) {
                setTimeout(createHongbao, i * 400);
            }
            setInterval(() => {
                if (rainContainer.children.length < 12) {
                    createHongbao();
                }
            }, 600);
        }

        // 启动
        startRain();