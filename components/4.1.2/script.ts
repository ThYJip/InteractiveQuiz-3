import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  {
    id: 1,
    speaker: "Rin",
    text: "太阳快下山了，事情还多着呢……搭帐篷、烧水、劈柴……感觉像是在处理一堆并发任务。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "本栖湖的风景，背景是富士山。凛正在独自搭建帐篷，身边放着一堆露营装备。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "既然是任务，那用协程 (Coroutines) 来解决最快了。我只要把它们全部“发射”出去就行了吧？看我的“不管不顾流”写法！",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔴 错误示范：Rin 的 "Fire and Forget" (射后不理) 模式

function startCampTasks() {
  // GlobalScope 的生命周期贯穿整个 App
  // 它们不受当前 Activity/Fragment 的管控
  GlobalScope.launch { boilWater() } // 烧水
  GlobalScope.launch { chopWood() }  // 劈柴
}

// ⚠️ 问题：如果凛突然决定回家(页面关闭)，
// 这些任务还在后台跑，没人能叫停它们！`
    }
  },
  {
    id: 3,
    speaker: "Rin",
    text: "好，现在我要开始干活了！点击下面的按钮启动任务，然后试着点击“离开营地”看看会发生什么。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'CHAOS', requiredAction: 'START_LEAK' }
    }
  },
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "啊！！凛酱！！着火啦！！你人走了怎么火还在烧呀！这在程序里可是严重的“内存泄漏”哦！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子惊慌失措地从树后跳出来，指着还在冒烟的篝火堆。"
    }
  },
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "听好啦！要用“结构化并发”！把 CoroutineScope 想象成“露营队长”。所有任务必须经过队长批准（在 Scope 内启动）。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 正确示范：结构化并发 (Structured Concurrency)

class CampingSite {
    // 1. 创建一个 Scope (露营队长)
    // 通常绑定到生命周期 (如 viewModelScope, lifecycleScope)
    val campScope = CoroutineScope(Job())

    fun startWork() {
        // 2. 在 Scope 内部启动任务
        campScope.launch { boilWater() }
        campScope.launch { chopWood() }
    }

    fun goHome() {
        // 3. 队长下令：全员撤退！
        // 这一行代码会递归取消所有子协程
        campScope.cancel() 
    }
}`
    }
  },
  {
    id: 6,
    speaker: "Nadeshiko",
    text: "这次我们按规矩来！先启动任务，然后点击“scope.cancel()”来结束露营。观察一下任务是怎么立刻停止的。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'STRUCTURED', requiredAction: 'USE_SCOPE_CANCEL' }
    }
  },
  {
    id: 7,
    speaker: "Rin",
    text: "原来如此……只要取消了 Scope，它管理的所有子任务都会自动收到取消信号。这样写代码既整洁又安全。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛坐在收拾得干干净净的营地里，手里捧着热茶，表情放松。"
    }
  },
  {
    id: 8,
    speaker: "System",
    text: "恭喜！你已经掌握了协程作用域的基础概念。",
    viewType: "VICTORY",
    viewContent: {}
  }
];