# JSONify - JSON解析工具

一个功能强大的JSON解析、格式化和转换工具，支持Unicode转换、历史记录等功能。

## 🚀 功能特性

- ✅ JSON语法验证和错误提示
- ✅ JSON格式化和压缩
- ✅ JSON转义和去转义
- ✅ Unicode与中文互转
- ✅ 历史记录功能（本地存储）
- ✅ 明暗主题切换
- ✅ Monaco编辑器集成
- ✅ 响应式设计

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **UI组件库**: Ant Design 5.x
- **代码编辑器**: Monaco Editor
- **构建工具**: Vite 7.x
- **样式**: CSS3 + Flexbox

## 📦 部署到 GitHub Pages

### 步骤 1: 创建 GitHub 仓库

1. 在 GitHub 上创建一个新的仓库，命名为 `JsonRun`（或您喜欢的名称）
2. 不要初始化 README，保持仓库为空

### 步骤 2: 本地配置

```bash
# 1. 添加远程仓库（替换为您的GitHub用户名）
git remote add origin https://github.com/您的用户名/JsonRun.git

# 2. 推送到main分支
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 步骤 3: 部署

```bash
# 一键部署到 GitHub Pages
npm run deploy
```

### 步骤 4: 启用 GitHub Pages

1. 进入 GitHub 仓库设置页面
2. 找到 "Pages" 选项
3. 在 "Source" 部分选择 "Deploy from a branch"
4. 选择 "gh-pages" 分支和 "/ (root)" 目录
5. 点击保存

### 步骤 5: 访问应用

部署完成后，您的应用将在以下地址访问：
```
https://您的用户名.github.io/JsonRun/
```

## 🔧 开发

### 安装依赖
```bash
npm install
```

### 开发服务器
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📄 许可证

MIT License
