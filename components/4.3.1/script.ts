
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: THE FRAGILE TENT (PROBLEM) ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "终于搭好帐篷了！我要开始数我们要用的木柴了。一根、两根、三根……",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子在一个简单的帆布帐篷里数木柴，旁边堆着一小堆木头。"
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "但是最近这里风好大（屏幕旋转/配置变更）。每次风一吹，我的帐篷就会塌掉重建，我数的木柴数也就归零了！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'FRAGILE_TENT' }
    }
  },
  
  // --- ACT 2: THE STURDY CABIN (VIEWMODEL) ---
  {
    id: 3,
    speaker: "Rin",
    text: "把重要的物资放在临时的帐篷（Composable）里太危险了。你应该把它们存放在坚固的小木屋（ViewModel）里。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛指着帐篷旁边一座坚固的木屋。木屋上有“ViewModel Depot”的牌子。"
    }
  },
  {
    id: 4,
    speaker: "Rin",
    text: "ViewModel 是系统的“钉子户”。无论外面的帐篷（Activity）怎么塌、怎么重建，小木屋都会屹立不倒，直到我们彻底离开营地。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🏠 坚固的小木屋
class CabinViewModel : ViewModel() {
    // 🪵 存放在这里的物资（State）不会丢失
    private val _logs = MutableStateFlow(0)
    val logs = _logs.asStateFlow()

    fun addLog() { _logs.value++ }
}

// ⛺️ 临时的帐篷
@Composable
fun Tent(viewModel: CabinViewModel = viewModel()) {
    // 即使 Tent 重建，拿到的还是同一个 viewModel 实例
    val count by viewModel.logs.collectAsStateWithLifecycle() 
}`
    }
  },
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "太棒了！把木柴存在小木屋里，我就不用担心风把帐篷吹塌了！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'STURDY_CABIN' }
    }
  },

  // --- ACT 3: THE RADIO (LIFECYCLE) ---
  {
    id: 6,
    speaker: "Sensei",
    text: "但是，如果你去睡觉了（App 进入后台），还在听小木屋的广播（collectAsState），那你的收音机（手机）很快就会没电的。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'RADIO_BATTERY' }
    }
  },
  {
    id: 7,
    speaker: "Rin",
    text: "一定要用 `collectAsStateWithLifecycle`。它很智能，当你睡觉时（onStop），它会自动关掉收音机；当你醒来时（onStart），它会自动重新连接。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ❌ 费电：无论是否可见，持续监听
val state by viewModel.uiState.collectAsState()

// ✅ 省电：自动感知生命周期，后台停止收集
val state by viewModel.uiState.collectAsStateWithLifecycle()`
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 8,
    speaker: "Sensei",
    text: "来复习一下。当屏幕旋转（Configuration Change）发生时，ViewModel 会怎么样？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: TYPING ---
  {
    id: 9,
    speaker: "Nadeshiko",
    text: "我懂了！ViewModel 是仓库，collectAsStateWithLifecycle 是智能收音机！我要把这个“省电咒语”记下来！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "val state by viewModel.uiState.collectAsStateWithLifecycle()"
      }
    }
  },

  // --- ACT 6: SUMMARY ---
  {
    id: 10,
    speaker: "Rin",
    text: "ViewModel + StateFlow 是现代 Android 开发的标配。它让数据安全，让 UI 纯粹。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 7: AI ASSIGNMENT ---
  {
    id: 11,
    speaker: "Rin",
    text: "最后，自己动手建一个小木屋吧。写一个包含 `MutableStateFlow` 的简单 ViewModel 类。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：编写一个 `TimerViewModel` 类，继承自 `ViewModel`。内部定义一个名为 `_time` 的私有 `MutableStateFlow<Int>`，初始值为 0。并公开一个名为 `time` 的只读 `StateFlow`。"
      }
    }
  },

  // --- ACT 8: VICTORY ---
  {
    id: 12,
    speaker: "Nadeshiko",
    text: "物资安全，电力充足！这次露营一定会非常顺利！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
