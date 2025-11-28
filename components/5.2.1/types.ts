
export type Speaker = "Chi" | "Rin" | "Nadeshiko" | "Sensei";

export type ViewType = "IMAGE" | "CODE_EXPLAIN" | "INTERACTIVE_LAB" | "TECH_SUMMARY" | "VICTORY";

export interface InteractiveState {
    mode: 'INSTANT_SNAP' | 'SMOOTH_MORPH' | 'BOUNCY_JELLY' | 'QUIZ' | 'AI_ASSIGNMENT';
    assignmentPrompt?: string; 
}

export interface ScriptStep {
  id: number;
  speaker: Speaker;
  text: string;
  viewType: ViewType;
  viewContent: {
    imagePrompt?: string; 
    codeSnippet?: string;
    interactiveConfig?: InteractiveState;
  };
}

export interface GameState {
  currentStepIndex: number;
  isTyping: boolean;
  labCompleted: boolean; 
}
