我们将根据以下步骤，逐步构建一个chatmed项目，该项目通过网页端提供一个类似chatGPT的聊天界面，后端通过访问openai的Assistant API 来为用户(user)提供建议。
## Part 0: Project Step
### 1.初始化项目:
使用npx create-next-app@latest chatmed命令创建一个新的Next.js项目。
使用tailwindcss作为UI框架:
在public/images目录下放入background.jpg。
### 2.聊天界面:
ChatBox.tsx将作为包含消息列表、输入框和发送按钮的容器。
Message.tsx将根据是用户消息还是AI消息来显示不同样式。
MessageList.tsx将负责渲染所有消息，并处理滚动和布局。
InputBox.tsx是用户输入和发送消息的组件。
### 3.全局状态管理:
使用ChatContext.tsx来跨组件共享聊天状态。
### 4.通信:
前后端通过SSE进行通信，后端逻辑在 pages/api下处理
### 5.风格和布局:
在globals.css中定义全局样式。
使用Tailwind CSS（如果选择使用）可以快速构建UI。
### 6.类型定义:
在types/index.ts中定义应用程序中使用的所有TypeScript类型。
### 7.路由和页面:
index.tsx作为聊天应用的入口点。
_app.tsx和_document.tsx用于自定义应用的布局和设置。