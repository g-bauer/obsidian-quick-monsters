<script lang="ts">
  import type { QuickMonster } from "src/lib/monster";
  import type { DifficultyReport } from "@types";
  import {
    encounterDifficulty,
    formatDifficultyReport,
  } from "src/lib/encounter-difficulty";
  import Monster from "./Monster.svelte";
  import { ICONS } from "../lib/icons";

  import { createEventDispatcher } from "svelte";
  import { ExtraButtonComponent } from "obsidian";

  const dispatch = createEventDispatcher();

  export let monsters: QuickMonster[];
  export let levels: number[];
  export let displayType: string;
  export let tracker: boolean = false;
  const difficulty: DifficultyReport = encounterDifficulty(
    levels,
    monsters.map((m): number[] => Array(m.amount).fill(m.xp)).flat()
  );
</script>

<div class="container">
  <div>
    {#if tracker}
      <button on:click={() => dispatch("begin-encounter")}
        ><strong>{@html ICONS["crossed-swords"]} Run Encounter</strong></button
      >
      <br />
    {/if}
    <span aria-label={formatDifficultyReport(difficulty)}
      ><strong> Difficulty: </strong>
      <em>{difficulty.difficulty.toUpperCase()}</em>
    </span>
    <Monster {monsters} {displayType} />
  </div>
</div>
