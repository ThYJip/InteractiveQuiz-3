
import { ScriptStep } from './types';

export const script: ScriptStep[] = [
  // --- ACT 1: INSTANT SNAP (PROBLEM) ---
  {
    id: 1,
    speaker: "Nadeshiko",
    text: "Rin-chan! I want to make a magic marshmallow that grows when I poke it! Like this... *poke*",
    viewType: "IMAGE",
    viewContent: {
      imagePrompt: "Nadeshiko pokes a marshmallow. It instantly teleports from small to huge, looking glitchy."
    }
  },
  {
    id: 2,
    speaker: "Nadeshiko",
    text: "Whoa! It just... snapped! It teleported! That's not magic, that's just a glitch. I want it to *morph*.",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'INSTANT_SNAP' }
    }
  },
  
  // --- ACT 2: ANIMATE*ASSTATE (SOLUTION) ---
  {
    id: 3,
    speaker: "Rin",
    text: "That's because you're changing state instantly. In Compose, we use `animate*AsState` to smooth out the change over time. It's 'Fire-and-Forget'.",
    viewType: "CODE_EXPLAIN",
    viewContent: {
      codeSnippet: `// ✨ The Magic Spell
val size by animateDpAsState(
    targetValue = if (isBig) 200.dp else 100.dp
)

// Now use 'size' instead of a hardcoded value
Box(Modifier.size(size))`
    }
  },
  {
    id: 4,
    speaker: "Rin",
    text: "Try the 'Tween' spell. It calculates all the frames between start and end for you.",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'SMOOTH_MORPH' }
    }
  },

  // --- ACT 3: SPRING ANIMATION ---
  {
    id: 5,
    speaker: "Nadeshiko",
    text: "Ooh, smooth! But marshmallows should be bouncy! Can we make it wobble like jelly?",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'BOUNCY_JELLY' }
    }
  },
  {
    id: 6,
    speaker: "Sensei",
    text: "That's physics! `spring()` uses damping and stiffness to simulate real-world forces. No duration needed—physics decides when it stops.",
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
    text: "Quick quiz. What happens if I set `dampingRatio` to `HighBouncy`?",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { mode: 'QUIZ' }
    }
  },

  // --- ACT 5: SUMMARY ---
  {
    id: 8,
    speaker: "Rin",
    text: "Remember: `animate*AsState` is for simple state changes. It handles interruption automatically—if you change the target mid-animation, it retargets smoothly.",
    viewType: "TECH_SUMMARY",
    viewContent: {}
  },

  // --- ACT 6: AI ASSIGNMENT ---
  {
    id: 9,
    speaker: "Rin",
    text: "Final test. Write code to animate a Color. It should change between Red and Blue depending on a boolean state.",
    viewType: "INTERACTIVE_LAB",
    viewContent: {
      interactiveConfig: { 
          mode: 'AI_ASSIGNMENT',
          assignmentPrompt: "Task: Use `animateColorAsState` to toggle a color between `Color.Red` and `Color.Blue` based on a boolean `isRed`."
      }
    }
  },

  // --- ACT 7: VICTORY ---
  {
    id: 10,
    speaker: "Nadeshiko",
    text: "Yay! My marshmallows are alive! Bouncy, squishy, and magical!",
    viewType: "VICTORY",
    viewContent: {}
  }
];
