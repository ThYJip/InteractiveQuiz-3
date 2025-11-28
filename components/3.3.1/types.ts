
export type Speaker = "Chi" | "Rin" | "Nadeshiko" | "Sensei";

export type ViewType = "IMAGE" | "CODE_EXPLAIN" | "INTERACTIVE_LAB" | "TECH_SUMMARY" | "VICTORY";

export interface InteractiveState {
    mode: 'BROKEN_PEN' | 'UDF_LOOP' | 'DECORATION' | 'QUIZ' | 'GUIDED_TYPING' | 'AI_ASSIGNMENT' | 'FINAL_PROJECT';
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