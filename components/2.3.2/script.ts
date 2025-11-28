
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  {
    id: 1,
    speaker: "Rin",
    text: "欢迎来到“风之谷”。在 Android 的世界里，有一种可怕的自然现象叫“配置变更”(Configuration Change)。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛站在峡谷风口，风吹得她的围巾飞舞。背景是荒凉的峡谷。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "当用户旋转屏幕、切换深色模式、或者修改系统语言时，系统会毫不留情地销毁当前的 Activity，然后立刻重建一个新的。这意味着：所有内存里的变量都会被清空。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🌪️ 配置变更流程 (The Wind)

// 1. 用户操作：旋转屏幕 / 切换深色模式
// 2. 系统销毁旧实例
Activity.onDestroy() -> mapOfVariables.clear()

// 3. 系统创建新实例
Activity.onCreate() -> 重新运行所有代码
// 💀 之前 remember 的数据全部丢失！`
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "诶？！那我辛辛苦苦填写的注册表格，如果手滑切了个深色模式，岂不是全没了？这也太惨了吧！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子对着手机惨叫，手机屏幕上显示着空白的表格。"
    }
  },
  {
    id: 4,
    speaker: "Sensei",
    text: "没错。`remember` 的记忆存储在 Slot Table (内存) 中，它依附于 Activity。Activity 死了，它也活不了。来做个小测试，看看你理解了没。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ_SCENARIO' }
    }
  },
  {
    id: 5,
    speaker: "Rin",
    text: "要解决这个问题，我们需要 `rememberSaveable`。它会把数据打包进系统的 Bundle (保险箱) 里。即使 Activity 重建，数据也能从 Bundle 里取出来。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🛡️ rememberSaveable 的原理

// 保存 (onSaveInstanceState):
// Activity 销毁前，自动把数据序列化写入 Bundle
Bundle.put("key", value) 

// 恢复 (onRestoreInstanceState):
// Activity 重建后，自动从 Bundle 读取数据
val value = Bundle.get("key")`
    }
  },
  {
    id: 6,
    speaker: "Sensei",
    text: "但是，保险箱(Bundle)空间有限，不是什么都能塞进去的。它只能存基本类型(Int, String)或实现了 Parcelable 接口的对象。再来考考你。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ_TYPE_SAFETY' }
    }
  },
  {
    id: 7,
    speaker: "Nadeshiko",
    text: "我懂了！网络连接对象(Socket)这种太复杂的东西塞不进 Bundle，所以会报错！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子恍然大悟，手里拿着一个写着 Socket 的巨大插头，试图塞进一个小小的保险箱，但塞不进去。"
    }
  },
  {
    id: 8,
    speaker: "Rin",
    text: "好，最后是实战演练。我们来做两个计数器，一个用 `remember`，一个用 `rememberSaveable`。旋转屏幕，看看谁能活下来。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'COMPARISON_LAB' }
    }
  },
  {
    id: 9,
    speaker: "Rin",
    text: "看到了吗？这就是 `rememberSaveable` 的核心价值。对于任何丢失了会让用户抓狂的数据（输入框、滚动位置），都要用它！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
