# 图片字幕生成器

这是一个简单易用的网页工具，可以为图片添加多行字幕，每行字幕之间有分割线，并且每行字幕背景都使用相同的图片切片。

## 功能特点

- 上传任意图片作为背景
- 添加多行文字作为字幕
- 自定义字幕高度、字体大小
- 自定义字体颜色和轮廓颜色
- 每行字幕之间自动添加分割线
- 每行字幕背景使用相同的图片切片
- 一键保存生成的图片

## 使用方法

1. **选择图片**：点击"选择文件"按钮上传一张图片
2. **设置参数**：
   - 字幕高度(px)：调整每行字幕的高度
   - 字体大小(px)：调整字幕文字的大小
   - 字体颜色：选择字幕文字的颜色
   - 轮廓颜色：选择字幕文字轮廓的颜色
3. **输入字幕**：在文本框中输入字幕内容，每行将作为一个独立的字幕
4. **生成预览**：点击"生成字幕图片"按钮查看效果
5. **保存图片**：点击"保存图片"按钮下载生成的图片

## 技术实现

- 使用HTML5的Canvas API处理图像和文字
- 纯前端实现，无需服务器支持
- 响应式设计，适配不同屏幕尺寸

## 浏览器兼容性

支持所有现代浏览器，包括：
- Chrome
- Firefox
- Safari
- Edge

## 本地运行

直接在浏览器中打开index.html文件即可使用。

## 注意事项

- 上传的图片仅在本地处理，不会上传到任何服务器
- 图片过大可能会影响性能
- 字幕文字过长可能会被截断
