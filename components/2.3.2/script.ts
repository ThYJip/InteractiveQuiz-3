
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: CRISIS ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "哇！篮子里装满了松果！这可是战利品。我要拍一张照片发给千明她们看！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子举着满满一篮子松果，拿出手机准备拍照。背景是美丽的秋季森林。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "这么多的松果，竖屏拍不全吧？你把手机横过来拍（旋转屏幕）试试？",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "凛在一旁喝茶，建议抚子旋转手机。"
    }
  },
  {
    id: 3,
    speaker: "Nadeshiko",
    text: "好主意！那我旋转一下……咦？！等等！我的松果计数怎么变成 0 了？！刚才明明是 5 个的！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'PHOTO_CRISIS' }
    }
  },
  
  // --- ACT 2: SOLUTION ---
  {
    id: 4,
    speaker: "Rin",
    text: "这就是 Android 的法则。旋转屏幕会导致 Activity 销毁并重建。普通的 `remember` 就像敞口篮子，东西全撒了。你需要 `rememberSaveable`。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'CODE_CHALLENGE' }
    }
  },

  // --- ACT 3: VERIFICATION ---
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "使用了 `rememberSaveable` 之后，代码好像变强了！我们再旋转一次试试！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'BACKPACK_FIX' }
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 6,
    speaker: "Sensei",
    text: "干得好。但在深入之前，我要考考你。`rememberSaveable` 使用 Bundle 存储数据，以下哪种数据**不能**放进去？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: GUIDED TYPING ---
  {
    id: 7,
    speaker: "Nadeshiko",
    text: "原来如此……Socket 是不能存的。好，为了防止忘记，我要把正确的代码抄写在我的露营笔记上！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "val count by rememberSaveable { mutableStateOf(0) }"
      }
    }
  },

  // --- ACT 6: TECH SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "笔记记得不错。在你去实战之前，我们最后复习一下所有的生存法则。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 7: OPEN ASSIGNMENT (AI) ---
  {
    id: 9,
    speaker: "Rin",
    text: "既然你已经懂了理论，那就去“试炼场”吧。写一个即使旋转屏幕也不会重置的 Checkbox（复选框）状态。我会检查你的代码。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'OPEN_ASSIGNMENT',
          assignmentPrompt: "任务：创建一个名为 `isChecked` 的 Boolean 状态，初始值为 false。要求使用 `rememberSaveable` 确保它在屏幕旋转后依然保持状态。"
      }
    }
  },

  // --- ACT 8: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "太厉害了！你不仅修好了计数器，还通过了凛的魔鬼训练！今天的烤肉归你了！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
