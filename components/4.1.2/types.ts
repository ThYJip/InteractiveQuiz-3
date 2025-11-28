export type Speaker = "Rin" | "Nadeshiko" | "Sensei" | "System";

export type ViewType = "IMAGE" | "CODE_EXPLAIN" | "INTERACTIVE_LAB" | "VICTORY";

export interface InteractiveState {
    mode: 'CHAOS' | 'STRUCTURED'; // Chaos = No Scope, Structured = With Scope
    requiredAction?: 'START_LEAK' | 'USE_SCOPE_CANCEL';
}

export interface ScriptStep {
  id: number;
  speaker: Speaker;
  text: string;
  viewType: ViewType;
  viewContent: {
    imagePrompt?: string; // Abstract description for the placeholder
    codeSnippet?: string;
    interactiveConfig?: InteractiveState;
  };
  triggerNext?: boolean; // If true, auto-advance after animation (not used in MVP, manual click preferred)
}

export interface GameState {
  currentStepIndex: number;
  isTyping: boolean;
  labCompleted: boolean; // Tracks if user finished the interactive task
}