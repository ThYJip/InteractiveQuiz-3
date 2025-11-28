
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: RIGID CRISIS ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "今天要为大家制作特制便当！我买了一个叫 `BentoBox` 的组件盒子。它看起来很漂亮，但是……",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子手里拿着一个非常精致但格格不入的塑料便当盒，无论如何也塞不进一个巨大的饭团。"
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "这个盒子规定死了：左边只能放字符串(String) 米饭，右边只能放整数(Int) 咸菜。可是我想放一张超级可爱的咖喱饭照片进去呀！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'RIGID_BENTO' }
    }
  },
  
  // --- ACT 2: SLOT SOLUTION ---
  {
    id: 3,
    speaker: "Rin",
    text: "这是典型的“硬编码”组件。为了灵活性，我们需要使用“插槽”(Slot) 模式。把参数从具体的数据变成 Composable 函数。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 🔴 死板的便当盒
fun RigidBento(rice: String, pickleCount: Int) { ... }

// ✅ 灵活的插槽便当盒
// content 参数是一个 Composable 函数，
// 意味着你可以传 Text, Image, Button... 任何东西！
@Composable
fun SlotBento(
    // 这是一个 Slot (插槽)
    content: @Composable () -> Unit 
) {
    Box(modifier = Modifier.padding(16.dp)) {
        content() // 在这里调用传入的 UI
    }
}`
    }
  },

  // --- ACT 3: SLOT LAB ---
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "哇！原来把参数变成函数，就像把格子变成了万能空间！让我来重新组装我的梦幻便当！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SLOT_BENTO' }
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 5,
    speaker: "Sensei",
    text: "在 Kotlin 中，如果函数的最后一个参数是 Lambda 表达式（比如 Slot），我们可以怎么调用它？这是 Compose 代码变得像 HTML 结构一样的关键。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: TYPING ---
  {
    id: 6,
    speaker: "Rin",
    text: "这叫“尾随 Lambda 语法”(Trailing Lambda)。来，亲手写出 Slot API 的定义，感受一下它的结构。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "fun MyCard(content: @Composable () -> Unit)"
      }
    }
  },

  // --- ACT 6: SUMMARY ---
  {
    id: 7,
    speaker: "Sensei",
    text: "插槽模式是 Compose 复用性的核心。记住，不要把子组件的数据传给父组件，而是要把子组件本身（作为插槽）传给父组件。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 7: AI ASSIGNMENT ---
  {
    id: 8,
    speaker: "Rin",
    text: "实战演练。普通的 `Button` 只能显示文字吗？不。请写一个 `CustomButton`，它接受一个 content 插槽，并在内部使用 `Row` 来布局。尝试放入一个图标和文字。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：编写一个 Composable `CustomButton`，它接受一个名为 `content` 的 `@Composable RowScope.() -> Unit` 参数。并在实现中使用 `Row` 来调用这个 content。"
      }
    }
  },

  // --- ACT 8: VICTORY ---
  {
    id: 9,
    speaker: "Nadeshiko",
    text: "做到了！我可以自由地把任何食材（组件）放进便当（插槽）里了！我要开动咯！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
