
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
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
  {
    id: 4,
    speaker: "Rin",
    text: "这就是 Android 世界的自然法则。当你旋转屏幕时，为了适应新布局，系统会把当前的“世界”（Activity）销毁并重建。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 📸 拍照危机 (Configuration Change)

// 1. 竖屏 -> 横屏
// 系统认为布局可能变了，需要重新加载资源
Activity.onDestroy() // 旧世界毁灭，remember 的内存被清空

// 2. 重建世界
Activity.onCreate()  // 新世界诞生
// 3. 代码重新运行
var count by remember { ... } // 重新初始化为 0`
    }
  },
  {
    id: 5,
    speaker: "Sensei",
    text: "普通的 `remember` 就像一个敞口的篮子。手机一倒（Activity 销毁），东西就掉光了。你需要一个“带拉链的背包”—— `rememberSaveable`。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "前辈拿出一个带有坚固拉链的登山背包，示意图显示它可以把数据锁在里面。"
    }
  },
  {
    id: 6,
    speaker: "Sensei",
    text: "它会把数据打包存进系统的 Bundle（保险箱）里。即使世界重建，它也能从保险箱里把数据取回来。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🎒 使用带拉链的背包

@Composable
fun PineconeCounter() {
    // rememberSaveable: 即使旋转屏幕，数据也不会丢！
    // 它自动把数据存入 Bundle (onSaveInstanceState)
    var count by rememberSaveable { mutableStateOf(0) }
    
    // ...
}`
    }
  },
  {
    id: 7,
    speaker: "Nadeshiko",
    text: "噢噢！带拉链的背包！让我们再试一次！这次左边放敞口篮子，右边放拉链背包，看看旋转后会发生什么！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'BACKPACK_FIX' }
    }
  },
  {
    id: 8,
    speaker: "Nadeshiko",
    text: "太棒了！背包里的松果一个都没少！以后重要的东西（比如用户输入的名字、滚动位置）我都要放在背包里！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
