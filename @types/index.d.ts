export type XpBudget = { easy: number; medium: number; hard: number; deadly: number };

export type DifficultyReport = {
    difficulty: string;
    group: Record<number, number>,
    totalXp: number;
    adjustedXp: number;
    multiplier: number;
    budget: XpBudget;
};

export interface BudgetDict {
    [index: number]: XpBudget;
}
