
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: CHAOS (No NavHost) ---
  {
    id: 1,
    speaker: "Chi",
    text: "欢迎来到‘露营剧场’！今天我们不只是搭帐篷，我们要上演一出大戏！",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "小奇戴着导演帽，拿着扩音器，站在一个聚光灯下的舞台中央。背景是红色幕布。"
    }
  },
  {
    id: 2,
    speaker: "Chi",
    text: "但是……现在舞台上只有 Nadeshiko 一个人在发呆。她想去森林场景，却不知道怎么去。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'NO_DIRECTOR_CHAOS' }
    }
  },
  
  // --- ACT 2: THE SOLUTION (NavHost) ---
  {
    id: 3,
    speaker: "Rin",
    text: "因为少了导演（NavController）和剧本（NavHost）。在 Compose 中，页面切换就像换幕布。NavHost 是舞台，NavController 是遥控器。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 1. 创建导演 (Controller)
val navController = rememberNavController()

// 2. 搭建舞台 (NavHost)
NavHost(navController = navController, startDestination = "home") {
    // 3. 定义剧本 (Routes)
    composable("home") { HomeScreen(navController) }
    composable("forest") { ForestScreen(navController) }
}`
    }
  },
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "原来如此！只要对着导演喊一句 `navigate('forest')`，舞台就会自动变样！让我试试这套系统！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'NAV_SIMULATOR' }
    }
  },

  // --- ACT 3: PASSING CONTROLLER ---
  {
    id: 5,
    speaker: "Sensei",
    text: "但是要注意，不要让每个演员都直接抱着导演大腿（全局传递 NavController）。最好的做法是只给他们一个“对讲机”（Lambda）。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ❌ 错误：强依赖
fun ProfileScreen(navController: NavController) {
    Button(onClick = { navController.navigate("settings") })
}

// ✅ 正确：解耦
fun ProfileScreen(onNavigateToSettings: () -> Unit) {
    Button(onClick = onNavigateToSettings)
}`
    }
  },

  // --- ACT 4: QUIZ ---
  {
    id: 6,
    speaker: "Sensei",
    text: "考考你。为什么推荐使用 Lambda (`() -> Unit`) 而不是直接传递 `NavController` 给底层组件？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: SUMMARY ---
  {
    id: 7,
    speaker: "Rin",
    text: "NavHost 是单 Activity 架构的核心。记住：一个 NavController，一个 NavHost，无数个 Route。",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI ASSIGNMENT ---
  {
    id: 8,
    speaker: "Rin",
    text: "最后的试炼。请写出一段完整的导航配置代码。包含 NavController 的创建和 NavHost 的定义，有两个页面：'start' 和 'game'。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：编写 Compose 代码。1. 使用 `rememberNavController` 创建控制器。2. 创建 `NavHost`，起始页为 'start'。3. 定义 'start' 和 'game' 两个 composable 路由。"
      }
    }
  },

  // --- ACT 7: VICTORY ---
  {
    id: 9,
    speaker: "Nadeshiko",
    text: "演出大成功！我想去哪里就去哪里，舞台随我心意而动！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
