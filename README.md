<div align="center">

<img src="chrome-extension/public/icon-128.png" alt="小狗爱摸鱼" width="128" height="128" />

# 小狗爱摸鱼

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white)

> 用来一键对知乎进行换装，方便摸鱼

</div>

> [!NOTE]
> 基于 [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite) 开发

> [!TIP]
> 插件只在知乎问答详情页显示，点击即可一键修改知乎样式

## 目录

- [功能介绍](#功能介绍)
- [主要特性](#主要特性)
- [安装使用](#安装使用)
- [功能说明](#功能说明)
- [开发说明](#开发说明)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [开发环境](#开发环境)
- [构建部署](#构建部署)

## 功能介绍

"小狗爱摸鱼"是一款专为知乎用户设计的Chrome浏览器扩展插件。它能够一键修改知乎问答页面的样式，让知乎看起来像飞书云文档，方便你在工作时"摸鱼"而不被发现。

## 主要特性

- 🎯 **精准定位**：只在知乎问答详情页显示插件图标
- 🎨 **一键换装**：点击按钮即可将知乎页面伪装成飞书云文档
- 🔄 **智能切换**：支持一键恢复原始样式
- 🚀 **轻量高效**：基于现代Web技术栈，性能优异
- 🛡️ **安全可靠**：最小权限原则，只访问必要的页面

## 安装使用

### 安装步骤

1. 下载并安装Chrome浏览器
2. 下载本项目的 `dist` 文件夹
3. 打开Chrome浏览器，访问 `chrome://extensions/`
4. 开启右上角的"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择下载的 `dist` 文件夹
7. 插件安装完成！

### 使用方法

1. 访问任意知乎问答页面（如：`https://www.zhihu.com/question/390635068`）
2. 点击浏览器工具栏中的插件图标
3. 在弹出的窗口中点击"修改知乎样式"按钮
4. 页面将自动转换为飞书云文档样式
5. 再次点击按钮可恢复原始样式

> [!TIP]
> 插件图标只在知乎问答页面显示，其他页面不会出现

## 功能说明

### 样式修改内容

插件会将知乎页面进行以下修改：

- **Logo替换**：将知乎logo替换为飞书logo
- **标题修改**：将页面标题改为"xxx项目文档"
- **侧边栏清理**：移除右侧推荐内容
- **媒体隐藏**：隐藏回答中的图片和视频
- **样式优化**：调整页面布局，使其更像文档页面

### 权限说明

插件采用最小权限原则：
- 只访问知乎问答页面（`https://www.zhihu.com/question/*`）
- 不收集任何用户数据
- 不访问其他网站

## 技术栈

- [React](https://reactjs.org/) - 用户界面框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript
- [Tailwindcss](https://tailwindcss.com/) - 实用优先的CSS框架
- [Vite](https://vitejs.dev/) - 快速的前端构建工具
- [Chrome Extensions Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) - 最新的扩展API

## 项目结构

```
zhihu-chrome-extension/
├── chrome-extension/          # 扩展核心文件
│   ├── manifest.ts           # 扩展配置文件
│   ├── src/background/       # 后台脚本
│   └── public/               # 静态资源
├── pages/                    # 扩展页面
│   ├── popup/               # 弹窗页面
│   └── content/             # 内容脚本
├── packages/                 # 共享包
│   ├── shared/              # 共享代码
│   ├── storage/             # 存储工具
│   └── ui/                  # UI组件
└── dist/                    # 构建输出目录
```

## 开发说明

### 开发环境

1. 确保Node.js版本 >= 18
2. 安装pnpm：`npm install -g pnpm`
3. 安装依赖：`pnpm install`

### 开发命令

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

### 构建部署

1. 运行 `pnpm build` 构建项目
2. 在Chrome中加载 `dist` 文件夹
3. 测试功能是否正常

## 注意事项

- 插件只在知乎问答页面生效
- 修改样式后刷新页面会恢复原始样式
- 请合理使用，遵守相关法律法规

## 开源协议

本项目基于原 [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite) 开发，遵循相同的开源协议。

---

**免责声明**：本插件仅供学习和娱乐使用，请用户自行承担使用风险。