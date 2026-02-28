// rules modal
        function openRulesModal() {
            document.getElementById('rulesModal').classList.add('show');
        }
        function closeRulesModal() {
            document.getElementById('rulesModal').classList.remove('show');
        }

        // 配置
        const prizes = [
            { id: 0, name: '0.01元', amount: 0.01, weight: 35, image: 'images/hongbao.png' },
            { id: 1, name: '0.2元', amount: 0.2, weight: 25, image: 'images/hongbao.png' },
            { id: 2, name: '0.5元', amount: 0.5, weight: 15, image: 'images/hongbao.png' },
            { id: 3, name: '下次努力', amount: 0, weight: 15, image: 'images/try_again.png' },
            { id: 4, name: '1元红包', amount: 1, weight: 8, image: 'images/hongbao.png' },
            { id: 5, name: '5元红包', amount: 5, weight: 2, image: 'images/yuanbao.png' }
        ];

        // 分享链接
        const shareLink = 'https://chihuiben.app/invite?code=ABC123';
        const teamLink = 'https://chihuiben.app/team?id=TEAM456';

        // 状态 - 从 localStorage 加载
        let drawsRemaining = parseInt(localStorage.getItem('chihuiben_drawsRemaining') || '3');
        let totalAmount = parseFloat(localStorage.getItem('chihuiben_totalAmount') || '2.41');
        let isSpinning = false;
        let teamMemberCount = parseInt(localStorage.getItem('chihuiben_teamCount') || '1');
        const teamNames = ['我', '小明', '阿华', '小红', '大壮', '小李', '阿强', '小美', '老王', '小张'];

        // 签到状态 - 从 localStorage 加载
        const todayStr = new Date().toLocaleDateString('zh-CN');
        const savedCheckin = JSON.parse(localStorage.getItem('chihuiben_checkin') || '{}');
        let checkinDone = savedCheckin.lastDate === todayStr;
        let currentCheckinDay = parseInt(savedCheckin.day || '4');
        const checkinRewards = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1.0];

        // 保存状态到 localStorage
        function saveState() {
            localStorage.setItem('chihuiben_drawsRemaining', drawsRemaining.toString());
            localStorage.setItem('chihuiben_totalAmount', totalAmount.toString());
            localStorage.setItem('chihuiben_teamCount', teamMemberCount.toString());
        }

        function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

        function updateDisplays() {
            document.getElementById('drawsCount').textContent = drawsRemaining;
            document.getElementById('totalAmount').innerHTML = '<span>¥</span>' + totalAmount.toFixed(2);
            document.getElementById('withdrawAmount').textContent = totalAmount.toFixed(2);
            document.getElementById('continueBtn').style.display = drawsRemaining > 0 ? 'block' : 'none';
        }

        function getWeightedRandom() {
            const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
            let random = Math.random() * totalWeight;
            for (let i = 0; i < prizes.length; i++) {
                random -= prizes[i].weight;
                if (random <= 0) return i;
            }
            return 0;
        }

        async function runLotteryAnimation(winnerIndex) {
            const items = document.querySelectorAll('.lottery-item');
            const sequence = [0, 1, 2, 5, 4, 3];
            let currentPos = 0;
            const totalSteps = 18 + Math.floor(Math.random() * 6);

            for (let step = 0; step < totalSteps; step++) {
                items.forEach(el => el.classList.remove('highlight', 'winner'));
                const gridIndex = sequence[currentPos % 6];
                items[gridIndex].classList.add('highlight');
                const progress = step / totalSteps;
                const delay = 60 + progress * 180;
                await sleep(delay);
                currentPos++;
            }

            const winnerGridPos = sequence.indexOf(winnerIndex);
            let stepsToWinner = (winnerGridPos - (currentPos % 6) + 6) % 6;
            if (stepsToWinner === 0) stepsToWinner = 6;

            for (let i = 0; i < stepsToWinner; i++) {
                items.forEach(el => el.classList.remove('highlight', 'winner'));
                const gridIndex = sequence[currentPos % 6];
                items[gridIndex].classList.add('highlight');
                await sleep(200 + i * 50);
                currentPos++;
            }

            items.forEach(el => el.classList.remove('highlight'));
            items[winnerIndex].classList.add('highlight', 'winner');
            await sleep(500);
        }

        async function startLottery() {
            if (isSpinning) return;
            if (drawsRemaining <= 0) {
                document.getElementById('noDrawsModal').classList.add('show');
                return;
            }

            isSpinning = true;
            const btn = document.getElementById('lotteryBtn');
            btn.disabled = true;
            btn.textContent = '抽奖中...';

            const winnerIndex = getWeightedRandom();
            await runLotteryAnimation(winnerIndex);

            const prize = prizes[winnerIndex];
            if (prize.amount > 0) totalAmount += prize.amount;
            drawsRemaining--;
            saveState(); // 保存状态
            updateDisplays();

            showResultModal(winnerIndex);

            document.querySelectorAll('.lottery-item').forEach(el => {
                el.classList.remove('highlight', 'winner');
            });

            btn.disabled = false;
            btn.textContent = '立即抽奖';
            isSpinning = false;
        }

        function showResultModal(prizeIndex) {
            const prize = prizes[prizeIndex];
            const modal = document.getElementById('resultModal');
            const iconEl = document.getElementById('resultIcon');

            iconEl.innerHTML = '<img src="' + prize.image + '" alt="' + prize.name + '">';
            if (prize.amount > 0) {
                document.getElementById('resultTitle').textContent = '恭喜获得';
                document.getElementById('resultTitle').style.color = '#E53935';
                document.getElementById('resultAmount').textContent = '¥' + prize.amount.toFixed(2);
                document.getElementById('resultAmount').style.display = 'block';
                document.getElementById('resultText').textContent = '红包已存入您的账户';
            } else {
                document.getElementById('resultTitle').textContent = '差一点点';
                document.getElementById('resultTitle').style.color = '#666';
                document.getElementById('resultAmount').style.display = 'none';
                document.getElementById('resultText').textContent = '再接再厉，好运即将到来!';
            }

            modal.classList.add('show');
        }

        function closeResultModal() {
            document.getElementById('resultModal').classList.remove('show');
        }

        function closeNoDrawsModal() {
            document.getElementById('noDrawsModal').classList.remove('show');
        }

        function scrollToCheckin() {
            const checkinSection = document.getElementById('checkinBtn');
            if (checkinSection) {
                checkinSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // 高亮提示
                checkinSection.style.animation = 'none';
                setTimeout(() => {
                    checkinSection.style.animation = 'todayPulse 0.5s ease 3';
                }, 100);
            }
        }

        function continueLottery() {
            closeResultModal();
            if (drawsRemaining > 0) {
                setTimeout(() => startLottery(), 300);
            } else {
                document.getElementById('noDrawsModal').classList.add('show');
            }
        }

        // ======== 签到功能 ========
        function doCheckin() {
            if (checkinDone) {
                alert('今日已签到!');
                return;
            }

            const btn = document.getElementById('checkinBtn');
            const todayItem = document.getElementById('todayItem');
            const reward = checkinRewards[currentCheckinDay - 1];

            // 禁用按钮
            btn.classList.add('checking');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 签到中...';

            // 播放签到动画
            todayItem.classList.add('checking');

            // 模拟网络延迟
            setTimeout(() => {
                // 更新今日为已签到
                todayItem.classList.remove('today', 'checking');
                todayItem.classList.add('checked');

                // 更新签到天数
                const checkinDaysSpan = document.querySelector('.section-subtitle span');
                if (checkinDaysSpan) {
                    checkinDaysSpan.textContent = currentCheckinDay;
                }

                // 更新总金额
                totalAmount += reward;
                saveState(); // 保存金额状态
                updateDisplays();

                // 保存签到状态到 localStorage
                localStorage.setItem('chihuiben_checkin', JSON.stringify({
                    day: currentCheckinDay,
                    lastDate: new Date().toLocaleDateString('zh-CN')
                }));

                // 隐藏按钮，显示签到成功徽标
                btn.style.display = 'none';
                const badge = document.getElementById('checkinSuccessBadge');
                document.getElementById('badgeAmount').textContent = '+¥' + reward.toFixed(2);
                badge.classList.add('show');

                // 显示签到成功弹窗
                document.getElementById('checkinReward').textContent = '+¥' + reward.toFixed(2);
                document.getElementById('checkinModal').classList.add('show');

                // 释放撒花效果
                createConfetti();

                checkinDone = true;
            }, 800);
        }

        // 创建撒花效果
        function createConfetti() {
            const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
            const container = document.body;

            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.top = '-20px';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                    confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
                    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
                    container.appendChild(confetti);

                    // 动画结束后移除
                    setTimeout(() => {
                        confetti.remove();
                    }, 4000);
                }, i * 30);
            }
        }

        function closeCheckinModal() {
            document.getElementById('checkinModal').classList.remove('show');
        }

        function goWithdraw() {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
            // 保存当前金额并跳转到提现页面
            saveState();
            window.location.href = 'withdraw.html';
        }

        // 邀请弹窗
        function showInviteModal() {
            document.getElementById('inviteModal').classList.add('show');
        }

        function closeInviteModal() {
            document.getElementById('inviteModal').classList.remove('show');
        }

        function copyShareLink() {
            navigator.clipboard.writeText(shareLink).then(() => {
                showToast('邀请链接已复制');
            }).catch(() => {
                // 降级方案
                const textarea = document.createElement('textarea');
                textarea.value = shareLink;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('邀请链接已复制');
            });
        }

        // 拼团弹窗
        function showTeamModal() {
            document.getElementById('teamModal').classList.add('show');
        }

        function closeTeamModal() {
            document.getElementById('teamModal').classList.remove('show');
        }

        function copyTeamLink() {
            navigator.clipboard.writeText(teamLink).then(() => {
                showToast('拼团链接已复制');
            }).catch(() => {
                const textarea = document.createElement('textarea');
                textarea.value = teamLink;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('拼团链接已复制');
            });
        }

        function showToast(message) {
            const toast = document.getElementById('copyToast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }

        // 提现相关函数
        function openWithdrawModal() {
            document.getElementById('withdrawModalAmount').innerText = totalAmount.toFixed(2);
            document.getElementById('withdrawModal').classList.add('show');
        }

        function closeWithdrawModal() {
            document.getElementById('withdrawModal').classList.remove('show');
        }

        function confirmWithdraw() {
            if (totalAmount < 0.01) {
                alert('无可提现金额');
                return;
            }

            // 新用户检查
            const now = Date.now();
            const daysSinceReg = (now - registerTime) / (1000 * 60 * 60 * 24);
            if (daysSinceReg < 3) {
                // 简单提示，或者用更好看的toast
                alert('新用户注册3天后可提现\n(注册时间: ' + new Date(registerTime).toLocaleDateString() + ')');
                return;
            }

            // 检查提现日期
            const today = new Date();
            const month = today.getMonth() + 1;
            const date = today.getDate();
            // 允许提现日期：2月12日, 2月13日, 2月17日
            const allowedDates = [12, 13, 17];
            if (month !== 2 || !allowedDates.includes(date)) {
                alert('当前不在提现开放时间内\n仅 2月12日、13日、17日 可申请提现');
                return;
            }

            // 模拟提现
            const amount = totalAmount;

            // 记录历史 (Simulate)
            const history = JSON.parse(localStorage.getItem('chihuiben_withdrawHistory') || '[]');
            history.unshift({
                id: Date.now(),
                type: 'wechat',
                account: '微信钱包',
                name: '我',
                amount: amount,
                status: 'pending-audit', // Audit pending
                date: new Date().toLocaleDateString('zh-CN')
            });
            localStorage.setItem('chihuiben_withdrawHistory', JSON.stringify(history));

            // 清零
            totalAmount = 0;
            saveState();
            updateDisplays();

            closeWithdrawModal();

            // 显示成功弹窗
            setTimeout(() => {
                const modal = document.getElementById('withdrawSuccessModal');
                if (modal) modal.classList.add('show');
                createConfetti(); // 再次撒花
            }, 300);
        }

        function closeWithdrawSuccessModal() {
            document.getElementById('withdrawSuccessModal').classList.remove('show');
        }

        // 拼团PK相关函数
        function updateTeamDisplay() {
            // 更新团员数显示
            document.getElementById('teamCount').textContent = teamMemberCount;
            document.getElementById('modalTeamCount').textContent = teamMemberCount + '/10';

            // 更新团员头像显示
            const grid = document.getElementById('teamGrid');
            const members = grid.querySelectorAll('.team-member');

            members.forEach((member, index) => {
                if (index < teamMemberCount) {
                    if (index === 0) {
                        member.className = 'team-member me';
                        member.textContent = '我';
                    } else {
                        member.className = 'team-member joined';
                        member.textContent = teamNames[index].charAt(0);
                    }
                    member.onclick = null;
                } else {
                    member.className = 'team-member';
                    member.textContent = '?';
                    member.onclick = showTeamModal;
                }
            });

            // 更新开始比赛按钮状态
            const startBtn = document.getElementById('startPkBtn');
            const statusEl = document.getElementById('teamStatus');

            if (teamMemberCount >= 10) {
                startBtn.disabled = false;
                statusEl.className = 'team-status ready';
                showToast('队伍已满员！可以开始比赛了');
            } else {
                startBtn.disabled = true;
                statusEl.className = 'team-status';
            }
        }

        function simulateJoin() {
            if (teamMemberCount >= 10) {
                showToast('队伍已满员');
                return;
            }
            teamMemberCount++;
            updateTeamDisplay();

            if (teamMemberCount >= 10) {
                closeTeamModal();
            }
        }

        function startTeamPK() {
            if (teamMemberCount < 10) {
                showToast('需要10人才能开始比赛');
                showTeamModal();
                return;
            }
            // 显示开始比赛弹窗
            document.getElementById('pkStartModal').classList.add('show');
        }

        function closePkStartModal() {
            document.getElementById('pkStartModal').classList.remove('show');
        }

        function goToCamera() {
            closePkStartModal();
            // 跳转到PK专属拍照页面
            window.location.href = 'scan-process-pk.html';
        }

        // 初始化页面状态
        function initPage() {
            // 更新显示
            updateDisplays();
            updateTeamDisplay();

            // 恢复签到状态
            if (checkinDone) {
                const btn = document.getElementById('checkinBtn');
                const todayItem = document.getElementById('todayItem');
                if (btn) {
                    btn.classList.add('checked');
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> 今日已签到';
                }
                if (todayItem) {
                    todayItem.classList.remove('today');
                    todayItem.classList.add('checked');
                }
                // 更新签到天数显示
                const checkinDaysSpan = document.querySelector('.section-subtitle span');
                if (checkinDaysSpan) {
                    checkinDaysSpan.textContent = currentCheckinDay;
                }
            }

            // 恢复团队成员显示
            const savedTeamCount = parseInt(localStorage.getItem('chihuiben_teamCount') || '1');
            if (savedTeamCount > 1) {
                for (let i = 1; i < savedTeamCount && i < 10; i++) {
                    addTeamMemberDisplay();
                }
            }
        }

        // 添加团队成员显示（不做动画）
        function addTeamMemberDisplay() {
            const slots = document.querySelectorAll('.team-slot');
            const slot = slots[teamMemberCount - 1];
            if (slot && teamMemberCount < 10) {
                slot.classList.add('filled');
                const avatar = slot.querySelector('.team-avatar');
                const name = slot.querySelector('.team-name');
                if (avatar) avatar.textContent = teamNames[teamMemberCount].charAt(0);
                if (name) name.textContent = teamNames[teamMemberCount];
            }
        }

        // 页面加载
        initPage();
/* Dev Panel Functions */
window.toggleDevPanel = toggleDevPanel;
window.setDraws = setDraws;
window.devShowPrize = devShowPrize;
window.devResetCheckin = devResetCheckin;
window.devResetAll = devResetAll;

        function toggleDevPanel() {
            const body = document.getElementById('devPanelBody');
            const arrow = document.getElementById('devPanelArrow');
            const isOpen = body.style.display !== 'none';
            body.style.display = isOpen ? 'none' : 'block';
            arrow.textContent = isOpen ? '▼' : '▲';
        }

        function setDraws(n) {
            drawsRemaining = n;
            saveState();
            updateDisplays();
        }

        function devShowPrize(index) {
            // close any open modal first
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
            showResultModal(index);
        }

        function devResetCheckin() {
            localStorage.removeItem('chihuiben_checkin');
            location.reload();
        }

        function devResetAll() {
            localStorage.removeItem('chihuiben_checkin');
            localStorage.removeItem('chihuiben_drawsRemaining');
            localStorage.removeItem('chihuiben_totalAmount');
            localStorage.removeItem('chihuiben_teamCount');
            location.reload();
        }
    