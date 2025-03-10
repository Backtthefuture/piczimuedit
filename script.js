// 获取DOM元素
const imageUpload = document.getElementById('imageUpload');
const captionHeight = document.getElementById('captionHeight');
const fontSize = document.getElementById('fontSize');
const fontColor = document.getElementById('fontColor');
const outlineColor = document.getElementById('outlineColor');
const fontFamily = document.getElementById('fontFamily');
const fontWeight = document.getElementById('fontWeight');
const captionText = document.getElementById('captionText');
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const previewCanvas = document.getElementById('previewCanvas');
const previewContainer = document.getElementById('previewContainer');
const noPreview = document.querySelector('.no-preview');
const fileNameDisplay = document.querySelector('.file-name');
const fontColorValue = document.querySelector('.color-picker .color-value:first-of-type');
const outlineColorValue = document.querySelector('.color-picker .color-value:last-of-type');

// 全局变量
let originalImage = null;
let ctx = previewCanvas.getContext('2d');

// 初始化颜色显示
fontColorValue.textContent = fontColor.value.toUpperCase();
outlineColorValue.textContent = outlineColor.value.toUpperCase();

// 监听颜色变化
fontColor.addEventListener('input', function() {
    fontColorValue.textContent = this.value.toUpperCase();
});

outlineColor.addEventListener('input', function() {
    outlineColorValue.textContent = this.value.toUpperCase();
});

// 监听图片上传
imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 显示文件名
    fileNameDisplay.textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            // 显示上传成功提示
            showToast('图片上传成功！');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// 生成字幕图片
generateBtn.addEventListener('click', function() {
    if (!originalImage) {
        showToast('请先上传图片', 'error');
        return;
    }
    
    const lines = captionText.value.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        showToast('请输入字幕内容', 'error');
        return;
    }
    
    // 获取设置值
    const height = parseInt(captionHeight.value);
    const fSize = parseInt(fontSize.value);
    const fColor = fontColor.value;
    const oColor = outlineColor.value;
    
    // 计算字幕区域总高度（每行高度 * 行数）
    const totalCaptionHeight = height * lines.length;
    
    // 设置画布尺寸
    previewCanvas.width = originalImage.width;
    previewCanvas.height = originalImage.height;
    
    // 设置画布尺寸
    previewCanvas.width = originalImage.width;
    previewCanvas.height = originalImage.height;
    
    // 绘制原始图片
    ctx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height);
    
    // 计算字幕区域的起始位置
    const captionStartY = originalImage.height - totalCaptionHeight;
    
    // 先保存原始图片的副本，用于获取干净的背景图像
    const originalImageCopy = ctx.getImageData(0, 0, originalImage.width, originalImage.height);
    
    // 为每行字幕绘制背景和文字
    for (let i = 0; i < lines.length; i++) {
        // 计算当前字幕行的位置
        const y = captionStartY + (i * height);
        
        // 如果是多行字幕，对第2行及以后的行进行特殊处理
        if (i > 0) {
            // 从原始图片副本中获取干净的背景图像（不包含字幕文字）
            const firstLineY = captionStartY;
            const cleanBackgroundData = originalImageCopy.data.slice(0);
            const cleanBackground = new ImageData(
                cleanBackgroundData,
                originalImage.width,
                originalImage.height
            );
            
            // 将干净的背景图像的相应区域绘制到当前行
            // 注意：我们需要先将完整的背景图像绘制到一个临时画布，然后取出我们需要的部分
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = originalImage.width;
            tempCanvas.height = originalImage.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            // 将原始图片绘制到临时画布
            tempCtx.putImageData(originalImageCopy, 0, 0);
            
            // 从临时画布中获取第一行字幕位置的图像数据
            const firstLineImageData = tempCtx.getImageData(0, firstLineY, originalImage.width, height);
            
            // 将干净的背景图像绘制到当前行
            ctx.putImageData(firstLineImageData, 0, y);
            
            // 添加分割线
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(originalImage.width, y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // 添加半透明黑色背景，提高文字可读性
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, y, originalImage.width, height);
        
        // 设置文字样式
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 获取字体样式和粗细
        let selectedFont = fontFamily.value;
        let selectedWeight = fontWeight.value;
        
        // 处理系统默认字体
        if (selectedFont === 'system') {
            selectedFont = '-apple-system, BlinkMacSystemFont, "SF Pro Text", Arial';
        }
        
        // 设置字体
        ctx.font = `${selectedWeight} ${fSize}px ${selectedFont}`;
        
        // 绘制文字轮廓
        ctx.strokeStyle = oColor;
        ctx.lineWidth = 3;
        ctx.strokeText(lines[i], originalImage.width / 2, y + height / 2);
        
        // 绘制文字
        ctx.fillStyle = fColor;
        ctx.fillText(lines[i], originalImage.width / 2, y + height / 2);
    }
    
    // 显示预览
    noPreview.style.display = 'none';
    previewCanvas.style.display = 'block';
    
    // 启用保存按钮
    saveBtn.disabled = false;
    
    // 显示成功消息
    showToast('字幕图片生成成功！');
    
    // 调整预览大小
    adjustCanvasSize();
});

// 保存图片
saveBtn.addEventListener('click', function() {
    if (!previewCanvas.toDataURL) {
        showToast('您的浏览器不支持此功能', 'error');
        return;
    }
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = '字幕图片_' + new Date().getTime() + '.png';
    link.href = previewCanvas.toDataURL('image/png');
    link.click();
    
    // 显示成功消息
    showToast('图片已保存！');
});

// 添加响应式调整
window.addEventListener('resize', adjustCanvasSize);

// 调整预览画布大小
function adjustCanvasSize() {
    if (previewCanvas.style.display === 'block') {
        // 获取预览容器的尺寸
        const containerWidth = previewContainer.clientWidth;
        const containerHeight = previewContainer.clientHeight;
        
        // 计算缩放比例，保持图片比例
        const widthScale = containerWidth / previewCanvas.width;
        const heightScale = containerHeight / previewCanvas.height;
        
        // 选择较小的缩放比例，确保图片完全显示在容器内
        const scale = Math.min(widthScale, heightScale, 1);
        
        // 应用缩放
        previewCanvas.style.width = (previewCanvas.width * scale) + 'px';
        previewCanvas.style.height = (previewCanvas.height * scale) + 'px';
    }
}

// 显示提示消息
function showToast(message, type = 'success') {
    // 移除现有的提示
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新提示
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示提示
    setTimeout(() => toast.classList.add('show'), 10);
    
    // 自动关闭
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 添加提示样式
const style = document.createElement('style');
style.textContent = `
.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

.toast.success {
    background-color: #34c759;
}

.toast.error {
    background-color: #ff3b30;
}
`;
document.head.appendChild(style);
