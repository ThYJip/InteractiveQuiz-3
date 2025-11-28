
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: POPUPTO (LOGIN TRAP) ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "凛酱！我在露营地大门口（登录页）登记完进来了！但是我发现……如果我回头走（按返回键），我又回到了大门口！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "Nadeshiko 站在营地里，身后是一条通往大门的路。她一转身就又被传送回了大门口，一直在循环。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "你进来后忘了把路封死。登录成功后，应该把‘登录页’从回退栈里清理掉，否则用户会陷入循环。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🧹 清理门户：popUpTo
navController.navigate("home") {
    // 弹出直到 "login" 页面
    popUpTo("login") { 
        inclusive = true // 连 "login" 自己也一起删掉
    }
}
// 结果：栈中只有 [Home]。按返回键 -> 退出 App`
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "原来如此！就像过了桥就把桥拆了（虽然听起来怪怪的）。我要试试这种感觉！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'LOGIN_TRAP' }
    }
  },

  // --- ACT 2: LAUNCH SINGLE TOP (CLONES) ---
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "我在营地里（主页）太兴奋了，一直按导航栏上的‘主页’按钮……结果营地里出现了好多分身！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "Nadeshiko 疯狂点击按钮，每点一次，旁边就多出一个一模一样的 Nadeshiko，很快挤满了屏幕。"
    }
  },
  {
    id: 5,
    speaker: "Sensei",
    text: "如果不加限制，每次导航都会创建一个新实例。你需要 `launchSingleTop = true`，如果你已经在山顶了，就别再造一座山了。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'CLONE_ATTACK' }
    }
  },

  // --- ACT 3: SAVE STATE (AMNESIA) ---
  {
    id: 6,
    speaker: "Nadeshiko",
    text: "还有！我在看食谱列表，好不容易翻到底部。去看了眼设置，回来后……食谱又回到第一页了！我忘了看到哪了！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'AMNESIA_TAB' }
    }
  },
  {
    id: 7,
    speaker: "Rin",
    text: "这叫‘状态失忆’。在切换 Tab 时，你需要保存和恢复状态。`saveState = true` 就像在书里夹个书签。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔖 底部导航的黄金法则
navController.navigate(route) {
    // 1. 避免无限堆叠：弹出到起始页
    popUpTo(graph.findStartDestination().id) {
        saveState = true // 离开时保存状态
    }
    // 2. 避免分身
    launchSingleTop = true
    // 3. 回来时恢复状态
    restoreState = true
}`
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 8,
    speaker: "Sensei",
    text: "考考你。如果我想实现“注销”功能，点击后回到登录页，并且清空所有历史记录，应该怎么写？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: SUMMARY ---
  {
    id: 9,
    speaker: "Rin",
    text: "导航不仅仅是跳转，更是对历史记录（栈）的管理。这三个选项是构建流畅 App 的基石。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI ASSIGNMENT ---
  {
    id: 10,
    speaker: "Rin",
    text: "最后的试炼。写一段底部导航栏的点击逻辑。要求：点击 'Home' 时，清除栈内其他页面，保留 Home 状态，且不重复创建。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `navController.navigate(\"home\")`。配置 NavOptions：1. popUpTo 起始页并 saveState。2. launchSingleTop = true。3. restoreState = true。"
      }
    }
  },

  // --- ACT 7: VICTORY ---
  {
    id: 11,
    speaker: "Nadeshiko",
    text: "太棒了！现在我的应用既不会迷路，也不会失忆，更不会有分身了！这就是完美的导航体验！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
