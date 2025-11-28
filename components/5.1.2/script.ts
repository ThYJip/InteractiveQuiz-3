
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: PATH ARGS (ADDRESS) ---
  {
    id: 1,
    speaker: "Chi",
    text: "欢迎来到露营邮局！我是局长小奇。我们每天都要处理成千上万个包裹（导航请求）。",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "小奇戴着邮递员帽子，站在一个繁忙的邮件分拣中心，周围堆满了包裹。"
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "我要给在富士山露营的凛寄快递！但是……我只写了“送到露营地”，没有写具体的编号……",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'ADDRESS_FAIL' }
    }
  },
  {
    id: 3,
    speaker: "Rin",
    text: "这是“路径参数”错误。在路由 `profile/{id}` 中，`{id}` 是必填的。就像你不能只写“送到北京”，必须写具体的门牌号。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 1. 定义路由：{userId} 是必填占位符
composable(
    route = "profile/{userId}", 
    arguments = listOf(navArgument("userId") { type = NavType.StringType })
) { ... }

// ❌ 错误调用：缺少参数
navController.navigate("profile/") 
// 💥 Crash: IllegalArgumentException`
    }
  },
  {
    id: 4,
    speaker: "Nadeshiko",
    text: "原来如此！那我把编号补上！这次一定能寄出去！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'ADDRESS_SUCCESS' }
    }
  },

  // --- ACT 2: QUERY ARGS (NOTES) ---
  {
    id: 5,
    speaker: "Sensei",
    text: "除了地址，有时候你还需要加一些备注，比如“易碎品”或者“加急”。这就是“查询参数”（Query Arguments）。",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// 2. 定义查询参数：?key={value}
// 它是可选的，必须提供默认值
composable(
    route = "search?query={q}", 
    arguments = listOf(
        navArgument("q") { 
            defaultValue = "all" // ✨ 没填就用这个
            type = NavType.StringType
        }
    )
) { ... }`
    }
  },
  {
    id: 6,
    speaker: "Chi",
    text: "查询参数很灵活。你可以写，也可以不写。如果不写，我们就会按默认规矩办事。来试试看！",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'OPTIONAL_NOTES' }
    }
  },

  // --- ACT 3: QUIZ ---
  {
    id: 7,
    speaker: "Sensei",
    text: "考考你。如果我想定义一个名为 'details' 的路由，它接受一个必填的 `itemId` 和一个可选的 `showImage` (默认 true)，路由字符串该怎么写？",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 4: SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "必填参数用 `/` (路径)，可选参数用 `?` (查询)。这和网页 URL 的规则是一样的，记住了吗？",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 5: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "最后的任务。写一个 Composable 定义。路由是 `user/{id}?mode={mode}`。`id` 是 String，`mode` 是 Int（默认 0）。",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "任务：使用 `composable` 函数定义路由。Route 为 `\"user/{id}?mode={mode}\"`。`arguments` 列表中包含两个 `navArgument`：`id` (String) 和 `mode` (Int, defaultValue = 0)。"
      }
    }
  },

  // --- ACT 6: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "所有包裹都精准送达了！我也收到了凛的回礼！大家都是合格的邮递员了！",
    viewType: "VICTORY",
    viewContent: {}
  }
];
