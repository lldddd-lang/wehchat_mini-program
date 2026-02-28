
let stream = null;
        let facingMode = 'environment';
        let flashEnabled = false;

        // 初始化相机
        async function initCamera() {
            try {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }

                const constraints = {
                    video: {
                        facingMode: facingMode,
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                };

                stream = await navigator.mediaDevices.getUserMedia(constraints);
                const video = document.getElementById('videoElement');
                video.srcObject = stream;
            } catch (error) {
                console.error('相机初始化失败:', error);
                document.getElementById('permissionTip').classList.add('active');
            }
        }

        // 显示选择弹窗
        function showActionSheet() {
            document.getElementById('actionSheet').classList.add('show');
            document.getElementById('actionSheetOverlay').classList.add('show');
        }

        // 隐藏选择弹窗
        function hideActionSheet() {
            document.getElementById('actionSheet').classList.remove('show');
            document.getElementById('actionSheetOverlay').classList.remove('show');
        }

        // 从弹窗拍照
        function takePhotoFromSheet() {
            hideActionSheet();
            takePhoto();
        }

        // 拍照
        function takePhoto() {
            const video = document.getElementById('videoElement');
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            // 转换为图片
            const imageData = canvas.toDataURL('image/jpeg');

            // 将图片数据保存到 sessionStorage
            sessionStorage.setItem('pkPhoto', imageData);

            // 停止相机
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // 跳转到PK结果页
            location.href = 'pk-result.html?new=1';
        }

        // 切换闪光灯
        function toggleFlash() {
            flashEnabled = !flashEnabled;
            const flashBtn = document.getElementById('flashBtn');

            if (stream) {
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack.getCapabilities().torch) {
                    videoTrack.applyConstraints({
                        advanced: [{ torch: flashEnabled }]
                    });
                    flashBtn.classList.toggle('active', flashEnabled);
                } else {
                    alert('当前设备不支持闪光灯');
                }
            }
        }

        // 从相册选择
        function chooseFromGallery() {
            hideActionSheet();
            document.getElementById('fileInput').click();
        }

        // 处理文件选择
        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    // 将图片数据保存到 sessionStorage
                    sessionStorage.setItem('pkPhoto', e.target.result);
                    // 跳转到PK结果页
                    location.href = 'pk-result.html?new=1';
                };
                reader.readAsDataURL(file);
            }
        }

        // 返回 - 回到index.html
        function goBack() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            location.href = 'index.html';
        }

        // 页面加载时初始化相机
        window.addEventListener('load', initCamera);

        // 页面卸载时停止相机
        window.addEventListener('beforeunload', () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        });