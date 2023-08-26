## ZxwyWebSite/Translate-UI
### 简介
+ Zxwy翻译(生草)机的前端UI，使用React框架，MUI界面库

### 使用
0. 设置工作模式(翻译，生草)
1. 输入要翻译的内容
2. 选择源译语言
3. 点击启动即可开始翻译

### 开发
0. 准备node.js、php环境
1. pnpm install 安装依赖
2. 编辑 `src/site.config.js` 修改站点信息
3. pnpm run build 构建静态
4. 打包 `build` 目录
5. 部署到Web服务器即可使用

### 其它
+ 演示站：国际 https://trans.zxwy.tk/, 国内(ipv6) https://trans.zxwy.cf/
+ 注：右击(手机端为长按)生草按钮可设置翻译次数
+ 源译转换：将输出内容转移到输入框，点两次清屏
+ 国内服务器可在 `public/api.php` 中设置代理
+ 参考了谷歌翻译的页面样式

### 更新
#### v1.0.0 2023-08-27
+ 24日立项制作，耗时2天半完成
