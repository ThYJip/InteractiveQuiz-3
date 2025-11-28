
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: IMAGE SCALE ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "凛酱！快看我拍的富士山！……咦？为什么照片里的山变得扁扁的，像个烧饼一样？",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "手机屏幕上显示着一张被压扁变形的富士山照片，Nadeshiko 一脸失望。"
    }
  },
  {
    id: 2,
    speaker: "Rin",
    text: "因为你强制把长方形的照片塞进了正方形的相框里，又没告诉它怎么缩放。它只能“拉伸”自己来填满空间了。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SCALE_LAB' }
    }
  },
  {
    id: 3,
    speaker: "Rin",
    text: "记住：`ContentScale.Crop` 适合填充背景（裁剪掉多余部分），`ContentScale.Fit` 适合完整展示内容（可能会留白）。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `Image(
    painter = painterResource(id = R.drawable.fuji),
    contentDescription = "富士山",
    modifier = Modifier.size(200.dp),
    // 关键参数：决定图片如何适应容器
    contentScale = ContentScale.Crop 
)`
    }
  },

  // --- ACT 2: ICON TINT ---
  {
    id: 4,
    speaker: "Sensei",
    text: "接下来是路标。我们用 `Icon` 组件。你会发现，Icon 很神奇，它会自己“变色”。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'TINT_LAB' }
    }
  },
  {
    id: 5,
    speaker: "Sensei",
    text: "Icon 默认使用 `LocalContentColor`。如果你把它放在红色按钮里，它就变红（或白色）；放在灰色背景上，它就变灰。这就是“语义化”图标。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// Icon 自动跟随文本颜色
Button(onClick = {}) {
    Icon(Icons.Default.Add, contentDescription = null) // 自动变成白色
    Text("Add") // 白色文本
}

// 也可以手动覆盖颜色
Icon(
    imageVector = Icons.Default.Favorite,
    tint = Color.Red // ❤️ 强制红色
)`
    }
  },

  // --- ACT 3: ACCESSIBILITY ---
  {
    id: 6,
    speaker: "Chi",
    text: "但是，如果有一位看不见的露营者使用“屏幕阅读器”来这里，他能知道这些图片是什么吗？",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "小奇闭着眼睛戴着耳机，试图通过触摸屏幕来理解周围的环境。"
    }
  },
  {
    id: 7,
    speaker: "Rin",
    text: "这就是 `contentDescription` 的作用。如果是重要图片，要写描述；如果是装饰品，必须填 `null`，否则阅读器会读出“未加标签的图片”，很吵。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'A11Y_AUDIT' }
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 8,
    speaker: "Sensei",
    text: "考考你。对于一个纯粹为了好看的背景花纹图片，contentDescription 应该怎么填？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: TYPING ---
  {
    id: 9,
    speaker: "Nadeshiko",
    text: "我知道了！填 `null` 就是告诉它“别管我，我是空气”！我要把这个重要规则记下来。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'GUIDED_TYPING',
          targetCode: "contentDescription = null"
      }
    }
  },

  // --- ACT 6: SUMMARY ---
  {
    id: 10,
    speaker: "Rin",
    text: "图片负责视觉冲击，图标负责功能引导，无障碍描述负责包容所有用户。缺一不可。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 7: AI ASSIGNMENT ---
  {
    id: 11,
    speaker: "Rin",
    text: "写一个“点赞”按钮。包含一个爱心 Icon。要求：图标必须是红色的，且要有无障碍描述“Like”。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：创建一个 Icon。使用 `Icons.Default.Favorite`。设置 `tint` 为 `Color.Red`。设置 `contentDescription` 为 \"Like\"。"
      }
    }
  },

  // --- ACT 8: FINAL PROJECT ---
  {
    id: 12,
    speaker: "Nadeshiko",
    text: "最后，我们要制作一张完整的“个人名片”！有头像（图片）和联系方式（图标）。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: {
          mode: 'FINAL_PROJECT'
      }
    }
  },

  // --- ACT 9: VICTORY ---
  {
    id: 13,
    speaker: "Nadeshiko",
    text: "名片做好啦！既漂亮又规范！大家都能看懂！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
