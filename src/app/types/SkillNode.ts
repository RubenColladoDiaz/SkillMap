export enum SkillNodeStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}
export enum Difficulty {
  EASY = "EASY",
  NORMAL = "NORMAL",
  HARD = "HARD",
}

export type SkillNode = {
  id: string;
  title: string;
  description: string;
  status: SkillNodeStatus;
  category: string;
  difficulty: Difficulty;
  x: number;
  y: number;
  dependsOn: string[];
};
