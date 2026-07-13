import { SkillNode } from "./SkillNode";

export type Roadmap = {
  id: number;
  nodes: SkillNode[];
  name: string;
  description: string;
};
