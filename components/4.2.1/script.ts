
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: THE GOAL ---
  {
    id: 1,
    speaker: "Chi",
    text: "欢迎来到代码喵的协程驾驶舱！我是舰长小奇。今天我们有个小目标：按下按钮，弹出一个酷炫的提示框 (Snackbar)！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "一只戴着机械单片眼镜的猫（小奇）坐在充满科技感的驾驶舱里，手持游戏手柄，面前是全息屏幕。"
    }
  },
  {
    id: 2,
    speaker: "Chi",
    text: "这很简单，对吧？直接在 `onClick` 里调用 `showSnackbar` 就行了……哎？报警灯亮了！编译错误！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'DIMENSION_ERROR' }
    }
  },
  
  // --- ACT 2: THE PROBLEM ---
  {
    id: 3,
    speaker: "Rin",
    text: "因为维度不同。`onClick` 是普通回调世界，而 `showSnackbar` 位于挂起函数 (Suspend) 的特殊时空。普通人无法直接进入挂起时空。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `Button(onClick = {
    // ❌ 编译错误！
    // Suspend function 'showSnackbar' should be called 
    // only from a coroutine or another suspend function
    snackbarHostState.showSnackbar("喵~") 
}) { Text("点我") }`
    }
  },

  // --- ACT 3: GLOBAL SCOPE DANGER ---
  {
    id: 4,
    speaker: "Chi",
    text: "那我用 `GlobalScope`？它好像能强行启动任务。只要发射出去就不管了！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'GLOBAL_LEAK_LAB' }
    }
  },
  {
    id: 5,
    speaker: "Rin",
    text: "绝对不行！`GlobalScope` 就像失控的无人机。即使你离开了页面（销毁 Activity），它还在后台乱飞（内存泄漏），甚至会导致坠机（Crash）。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "小奇看着一群失控的无人机在冒烟的服务器机房里乱撞，背景有红色的 WARNING 警报。"
    }
  },

  // --- ACT 4: THE SOLUTION ---
  {
    id: 6,
    speaker: "Chi",
    text: "那怎么办？我需要一个能听指挥的遥控器！",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 正确工具：rememberCoroutineScope
@Composable
fun MyScreen() {
    // 1. 获取遥控器 (绑定当前生命周期)
    val scope = rememberCoroutineScope() 

    Button(onClick = {
        // 2. 手动按下发射键
        scope.launch {
            snackbarHostState.showSnackbar("发射成功！")
        }
    }) { ... }
}`
    }
  },

  // --- ACT 5: SCOPED LAB ---
  {
    id: 7,
    speaker: "Chi",
    text: "这个 `scope` 就像我的专属无人机控制器。当我离开驾驶舱时，它会自动销毁所有无人机。我们来测试一下！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SCOPED_LAUNCH_LAB' }
    }
  },

  // --- ACT 6: QUIZ ---
  {
    id: 8,
    speaker: "Sensei",
    text: "现在你有了两种启动方式：`LaunchedEffect` (自动挡) 和 `rememberCoroutineScope` (手动挡)。什么时候用哪个？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 7: TYPING ---
  {
    id: 9,
    speaker: "Chi",
    text: "口诀记住了：自动跑用 LaunchedEffect，手动点用 rememberCoroutineScope。把获取控制器的代码刻在芯片上！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "val scope = rememberCoroutineScope()"
      }
    }
  },

  // --- ACT 8: SUMMARY ---
  {
    id: 10,
    speaker: "Rin",
    text: "这就是手动挡的艺术。不仅是 Snackbar，任何需要在点击事件中发起的异步任务（如网络请求、动画）都需要它。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 9: AI ASSIGNMENT ---
  {
    id: 11,
    speaker: "Rin",
    text: "实战考核。写一个“点赞”功能。点击按钮后，调用一个挂起函数 `api.like()`。记得处理 Scope。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：在 Button 的 onClick 中调用挂起函数 `api.like()`。你需要先使用 `rememberCoroutineScope` 获取 scope，然后用 `scope.launch` 启动协程。"
      }
    }
  },

  // --- ACT 10: FINAL PROJECT ---
  {
    id: 12,
    speaker: "Sensei",
    text: "终极试炼：编码实战！模拟一个“点击加载”场景。点击按钮 -> 禁用按钮 -> 模拟耗时 -> 弹出提示。逻辑要严密。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: {
          mode: 'FINAL_PROJECT'
      }
    }
  },

  // --- ACT 11: VICTORY ---
  {
    id: 13,
    speaker: "Chi",
    text: "任务完成！你已经解锁了“手动协程大师”成就！所有的异步能量都在你的掌控之中！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
