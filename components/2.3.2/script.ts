
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
    text: "这就是 Android 的法则。旋转屏幕会导致 Activity 销毁并重建。普通的 remember 就像敞口篮子，东西全撒了。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 📸 拍照危机 (Configuration Change)
// 1. 旋转屏幕 -> Activity 销毁
onDestroy() // 内存被清空

// 2. 重建 -> onCreate()
// 3. 代码重新运行 -> 重新初始化为 0
var count by remember { mutableStateOf(0) }`
    }
  },
  {
    id: 5,
    speaker: "Sensei",
    text: "这时候需要 `rememberSaveable`。它像一个带拉链的背包，会自动把数据存进系统保险箱 (Bundle)。不过，考考你...",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "前辈推了推眼镜，拿出黑板，准备进行露营地小测验。"
    }
  },
  {
    id: 6,
    speaker: "Sensei",
    text: "虽然背包很厉害，但系统保险箱 (Bundle) 容量有限且有类型限制。以下哪样东西 **不能** 直接放进 `rememberSaveable` 里？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },
  {
    id: 7,
    speaker: "Sensei",
    text: "正确！Socket 连接、文件流等对象无法被序列化，不能存入 Bundle。只有基本类型或实现了 Parcelable 的对象才行。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✅ 支持的类型：
// Int, String, Boolean, Array...
// @Parcelize 数据类 (推荐)

// ❌ 不支持的类型：
// Socket, Thread, Context, InputStream
// (这些一旦 Activity 销毁，它们也失效了，存也没用)`
    }
  },
  {
    id: 8,
    speaker: "Nadeshiko",
    text: "懂了！松果数量是整数 (Int)，完全没问题。那我现在就来改造代码！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'CODE_CHALLENGE' }
    }
  },
  {
    id: 9,
    speaker: "Nadeshiko",
    text: "改造完成！现在的计数器是“防风”的了。让我们再试一次旋转，见证奇迹的时刻！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'BACKPACK_FIX' }
    }
  },
  {
    id: 10,
    speaker: "Rin",
    text: "哼，还赖。看来你已经完全掌握“配置变更持久化”了。这张照片可以发了。",
    viewType: "VICTORY",
    viewContent: {}
  }
];
