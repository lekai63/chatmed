我们将根据以下步骤，逐步构建一个chatmed项目，该项目通过网页端提供一个类似chatGPT的聊天界面，后端通过访问openai的Assistant API 来为用户(user)提供建议。
## Part 0: Project Step
### 1.初始化项目:
使用npx create-next-app@latest chatmed命令创建一个新的Next.js项目。
### 2.安装依赖:
安装如下依赖：axios用于API请求，socket.io-client用于WebSocket通信，以及tailwindcss（如果你打算使用）来快速开发UI。
### 3.设置背景:
在public/images目录下放入background.jpg。
在Background.tsx组件中，你可以使用<div>标签并设置style属性，将背景图片作为CSS背景。
### 4.聊天界面:
ChatBox.tsx将作为包含消息列表、输入框和发送按钮的容器。
Message.tsx将根据是用户消息还是AI消息来显示不同样式。
MessageList.tsx将负责渲染所有消息，并处理滚动和布局。
InputBox.tsx是用户输入和发送消息的组件。
### 5.全局状态管理:
使用ChatContext.tsx来跨组件共享聊天状态。
### 6.实时通信:
socket.ts用于管理WebSocket连接和实时通信。
### 7.API调用:
chatService.ts服务层将处理与聊天后端的交互。
### 8.风格和布局:
在globals.css中定义全局样式。
使用Tailwind CSS（如果选择使用）可以快速构建UI。
### 9.类型定义:
在types/index.ts中定义应用程序中使用的所有TypeScript类型。
### 10.路由和页面:
index.tsx作为聊天应用的入口点。
_app.tsx和_document.tsx用于自定义应用的布局和设置。