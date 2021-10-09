import { XP_PER_CR, DIFFICULTY_THRESHOLDS } from "src/lib/constants";
import type { XpBudget, DifficultyReport } from "@types";

function xpBudget(characterLevels: number[]): XpBudget {
    const easy = characterLevels.reduce(
        (acc, lvl) => acc + DIFFICULTY_THRESHOLDS[lvl].easy,
        0
    );
    const medium = characterLevels.reduce(
        (acc, lvl) => acc + DIFFICULTY_THRESHOLDS[lvl].medium,
        0
    );
    const hard = characterLevels.reduce(
        (acc, lvl) => acc + DIFFICULTY_THRESHOLDS[lvl].hard,
        0
    );
    const deadly = characterLevels.reduce(
        (acc, lvl) => acc + DIFFICULTY_THRESHOLDS[lvl].deadly,
        0
    );
    return { easy: easy, medium: medium, hard: hard, deadly: deadly };
}

export function formatDifficultyReport(report: DifficultyReport): string {
    const group = Object.entries(report.group).map((c) => `${c[1]} level ${c[0]} character${c[1] === 1 ? "" : "s"}`).join(", ")
    return `${[
        `Encounter is ${report.difficulty}`,
        `Total XP: ${report.totalXp}`,
        `Adjusted XP: ${report.adjustedXp} (x${report.multiplier})`,
        ` `,
        `Threshold (${group})`,
        `Easy: ${report.budget.easy}`,
        `Medium: ${report.budget.medium}`,
        `Hard: ${report.budget.hard}`,
        `Deadly: ${report.budget.deadly}`
    ].join("\n")}`;
}

export function encounterDifficulty(
    characterLevels: number[],
    monsterXp: number[]
): DifficultyReport {
    if (!characterLevels?.length || !monsterXp?.length) return;
    const xp: number = monsterXp.reduce((acc, xp) => acc + xp, 0);
    const numberOfMonsters = monsterXp.length;
    let numberMultiplier: number;
    let group = {};
    characterLevels.forEach((level) => { group[level] = group[level] ? group[level] += 1 : 1 });
    if (numberOfMonsters === 1) {
        numberMultiplier = 1;
    } else if (numberOfMonsters === 2) {
        numberMultiplier = 1.5;
    } else if (numberOfMonsters < 7) {
        numberMultiplier = 2.0;
    } else if (numberOfMonsters < 11) {
        numberMultiplier = 2.5;
    } else if (numberOfMonsters < 15) {
        numberMultiplier = 3.0;
    } else {
        numberMultiplier = 4.0;
    }
    const adjustedXp = numberMultiplier * xp;
    const budget = xpBudget(characterLevels);
    let difficulty = "easy";
    if (adjustedXp >= budget.deadly) {
        difficulty = "deadly";
    } else if (adjustedXp >= budget.hard) {
        difficulty = "hard";
    } else if (adjustedXp >= budget.medium) {
        difficulty = "medium";
    }
    let result = {
        difficulty: difficulty,
        group: group,
        totalXp: xp,
        adjustedXp: adjustedXp,
        multiplier: numberMultiplier,
        budget: budget
    };
    return result;
}
