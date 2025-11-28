
export type Speaker = "Chi" | "Rin" | "Nadeshiko" | "Sensei";

export type ViewType = "IMAGE" | "CODE_EXPLAIN" | "INTERACTIVE_LAB" | "TECH_SUMMARY" | "VICTORY";

export interface InteractiveState {
    mode: 'CHAOS_HANDS' | 'BENTO_BOX' | 'VENDING_MACHINE' | 'QUIZ' | 'AI_ASSIGNMENT';
    targetCode?: string; // For typing
    assignmentPrompt?: string; // For AI
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
