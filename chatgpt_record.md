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


问题 1：避免接收重复的 AI 消息
要避免在新的浏览器会话中接收到之前所有的 AI 消息，可以通过以下步骤实现：

存储消息的时间戳：在 Kafka 中发布消息时，附加一个时间戳字段。这个时间戳表示消息被发送到 Kafka 的时间。

客户端不需要存储最后一条消息的时间戳，在建立SSE连接后，kafka消费者拉取建立连接后的消息即可。

问题 2：发送消息后未清空 InputBox
在 ChatBox 组件的 handleSendMessage 函数中，消息发送成功后，需要确保调用 setNewMessage('') 来清空输入框。如果这一行代码已经存在但不起作用，可能是由于状态更新异步导致的。可以尝试使用 React 的 useEffect 钩子来监视 newMessage 的变化，并在变化后清空输入框。

问题 3：聊天记录排序
要按时间顺序排列消息，可以在消息对象中包含一个时间戳字段。然后，在渲染 MessageList 组件时，根据这个时间戳对消息数组进行排序。确保在添加新消息到状态时也遵循这个排序规则。

问题 4：AI 消息超出显示区域
为了防止 AI 消息超出并被输入框遮挡，需要调整 MessageList 组件的 CSS 样式。可以通过为消息列表添加一个底部内边距（padding-bottom），这个内边距至少与输入框的高度相同。这样，即使消息列表满了，最后一条消息也不会被输入框遮挡。

根据这些解决方案，如果您同意，我可以进一步提供修改后的代码示例。