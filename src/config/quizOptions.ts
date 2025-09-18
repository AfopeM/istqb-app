export type SessionType = "short" | "medium" | "long";

export interface SessionOption {
  type: SessionType;
  label: string;
  questionCount: number;
  description: string;
  estimatedTime: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export const quizOptions: SessionOption[] = [
  {
    type: "short",
    label: "Quick Practice",
    questionCount: 10,
    description: "Perfect for a quick review or when you have limited time",
    estimatedTime: "10-15 min",
    difficulty: "beginner",
  },
  {
    type: "medium",
    label: "Standard Practice",
    questionCount: 20,
    description: "Comprehensive practice session covering key concepts",
    estimatedTime: "20-30 min",
    difficulty: "intermediate",
  },
  {
    type: "long",
    label: "Intensive Practice",
    questionCount: 40,
    description: "Deep dive session for thorough preparation and mastery",
    estimatedTime: "40-60 min",
    difficulty: "advanced",
  },
];
