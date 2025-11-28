
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: CHAOS (PROBLEM) ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "凛酱，我试图把这次露营的所有东西都拿在手上！左手拿Loading（等待），右手拿Error（垃圾），嘴里还叼着Data（饭团）……",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "Nadeshiko 手忙脚乱地拿着一堆东西，有些东西还在往下掉，表情慌张。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "你这样太危险了。如果同时 Loading 和 Error 都在手上，你要先展示哪个？这种分散的状态管理会导致 UI 逻辑混乱。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'CHAOS_HANDS' }
    }
  },
  
  // --- ACT 2: DATA CLASS (BENTO) ---
  {
    id: 3,
    speaker: "Rin",
    text: "第一种整理方法是“便当盒”（Data Class）。把所有东西整齐地放进一个盒子里。更新时，我们换掉整个盒子（Copy），保证一致性。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🍱 便当盒模式 (Single Data Class)
data class CampUiState(
    val isLoading: Boolean = false,
    val items: List<Item> = emptyList(),
    val error: String? = null
)

// 更新时，原子化操作，避免状态竞争
_uiState.update { it.copy(isLoading = false, items = newData) }`
    }
  },
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "就像把饭团和炸鸡都装进一个盒子里！这样我就不用担心掉这掉那了！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'BENTO_BOX' }
    }
  },

  // --- ACT 3: SEALED INTERFACE (VENDING MACHINE) ---
  {
    id: 5,
    speaker: "Sensei",
    text: "但是，有时候状态必须是“互斥”的。比如自动贩卖机，它不能同时处于“正在出货”和“缺货报错”的状态。这时要用 Sealed Interface。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🤖 自动贩卖机模式 (Sealed Interface)
sealed interface MachineState {
    data object Idle : MachineState      // 待机
    data object Dispensing : MachineState // 出货中 (Loading)
    data class Success(val item: Item) : MachineState // 成功
    data class Error(val msg: String) : MachineState  // 故障
}

// UI 使用 when 表达式，穷尽所有可能
when(state) {
    is Dispensing -> ShowSpinner()
    is Success -> ShowItem(state.item)
    // ...
}`
    }
  },
  {
    id: 6,
    speaker: "Rin",
    text: "这种模式最安全。编译器会强迫你处理所有情况，而且绝对不会出现“既加载又报错”的灵异现象。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'VENDING_MACHINE' }
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 7,
    speaker: "Sensei",
    text: "考考你。如果你的页面既要显示列表，又要显示一个“是否开启过滤”的开关，应该用 Data Class 还是 Sealed Interface？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "Data Class 适合组合状态（便当），Sealed Interface 适合互斥状态（贩卖机）。灵活运用这两种工具。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "最后，为你的“露营签到”功能设计一个 Sealed Interface 状态模型。包含：未签到、签到中、签到成功（含排名）、失败（含原因）。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：定义一个名为 `CheckInState` 的 sealed interface。包含 `Idle`, `Loading`, `Success(rank: Int)`, `Error(msg: String)` 四种状态。"
      }
    }
  },

  // --- ACT 7: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "状态整理完毕！现在我的代码就像露营装备一样井井有条！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
