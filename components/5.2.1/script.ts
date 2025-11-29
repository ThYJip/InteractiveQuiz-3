
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: INSTANT SNAP (PROBLEM) ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "凛酱！我想做一个按一下就会变大的魔法棉花糖！像这样……*戳*",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "抚子用手指戳一个棉花糖。棉花糖瞬间从很小变成了很大，看起来非常突兀。"
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "哇！它瞬间变大了！像是瞬移一样，好生硬哦。我想要那种‘咻——’的一下变大的感觉。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'INSTANT_SNAP' }
    }
  },
  
  // --- ACT 2: ANIMATE*ASSTATE (SOLUTION) ---
  {
    id: 3,
    speaker: "Rin",
    text: "那是因为你直接修改了状态。在 Compose 里，我们要用 `animate*AsState` 来让变化过程平滑过渡。这叫‘发射后不管’。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✨ 魔法咒语
val size by animateDpAsState(
    targetValue = if (isBig) 200.dp else 100.dp
)

// 现在使用 'size' 而不是固定的数值
Box(Modifier.size(size))`
    }
  },
  {
    id: 4,
    speaker: "Rin",
    text: "试试‘Tween’（补间）咒语。它会自动计算开始和结束之间的所有帧。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SMOOTH_MORPH' }
    }
  },

  // --- ACT 3: SPRING ANIMATION ---
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "哦哦，变流畅了！但是棉花糖应该更有弹性才对！能让它像果冻一样晃动吗？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'BOUNCY_JELLY' }
    }
  },
  {
    id: 6,
    speaker: "Sensei",
    text: "那就是物理学了！`spring()` 使用阻尼和刚度来模拟真实世界的力。不需要指定时间，物理法则决定它何时停止。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `animateDpAsState(
    targetValue = ...,
    animationSpec = spring(
        dampingRatio = Spring.DampingRatioHighBouncy,
        stiffness = Spring.StiffnessLow
    )
)`
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 7,
    speaker: "Sensei",
    text: "小测验。如果我把阻尼比 (`dampingRatio`) 设为 `HighBouncy` 会发生什么？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "记住：`animate*AsState` 适合简单的状态变化。它会自动处理中断——如果你在动画中途改变目标，它会平滑地转向新目标。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "最终试炼。写代码来让颜色动起来。根据布尔状态，在红色和蓝色之间切换。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `animateColorAsState` 根据布尔值 `isRed` 在 `Color.Red` 和 `Color.Blue` 之间切换颜色。"
      }
    }
  },

  // --- ACT 7: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "耶！我的棉花糖活过来了！又弹又软，太神奇了！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
