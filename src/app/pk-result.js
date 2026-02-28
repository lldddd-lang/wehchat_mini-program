
// 检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const isNewSubmit = urlParams.get('new') === '1';
        const isEnded = urlParams.get('ended') === '1';

        // 如果是新提交，显示提交成功提示并添加丝滑动画
        if (isNewSubmit) {
            const submitStatus = document.getElementById('submitStatus');
            submitStatus.style.display = 'block';

            // 3秒后开始淡出动画
            setTimeout(() => {
                submitStatus.classList.add('fade-out');

                // 动画结束后完全隐藏
                setTimeout(() => {
                    submitStatus.style.display = 'none';
                }, 500);
            }, 2500);
        }

        // 如果比赛已结束
        if (isEnded) {
            document.getElementById('pkBadge').textContent = '比赛已结束';
            document.getElementById('pkBadge').classList.add('ended');
            document.getElementById('pkTimer').textContent = '查看最终排名';
            document.getElementById('ongoingTip').style.display = 'none';
            document.getElementById('prizeSection').style.display = 'block';
        }

        // 倒计时功能
        let countdown = 23 * 3600 + 45 * 60 + 12; // 初始倒计时（秒）

        function updateTimer() {
            if (countdown <= 0) {
                location.href = 'pk-result.html?ended=1';
                return;
            }

            const hours = Math.floor(countdown / 3600);
            const minutes = Math.floor((countdown % 3600) / 60);
            const seconds = countdown % 60;

            document.getElementById('pkTimer').textContent =
                `距离比赛结束还有 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            countdown--;
        }

        // 不在结束状态时启动倒计时
        if (!isEnded) {
            setInterval(updateTimer, 1000);
        }

        // 模拟分数变化（演示用）
        function simulateScoreChange() {
            const scores = document.querySelectorAll('.rank-score-value');
            scores.forEach(score => {
                const current = parseFloat(score.textContent);
                const change = (Math.random() - 0.5) * 0.2;
                score.textContent = (current + change).toFixed(1);
            });
        }

        // 每隔几秒模拟分数变化
        if (!isEnded) {
            setInterval(simulateScoreChange, 5000);
        }