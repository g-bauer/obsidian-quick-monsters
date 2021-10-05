<script lang="ts">
  import type { QuickMonster } from "src/lib/monster";
  import type { DifficultyReport } from "src/lib/encounter";
  import { encounterDifficulty } from "src/lib/encounter";
  import Monster from "./Monster.svelte";
  import { icons } from "../lib/icons";

  import { createEventDispatcher } from "svelte";
  import { ExtraButtonComponent } from "obsidian";

  const dispatch = createEventDispatcher();

  export let monsters: QuickMonster[];
  export let levels: number[];
  export let displayType: string;
  export let displayBudget: boolean;
  export let tracker: boolean = false;
  const difficulty: DifficultyReport = encounterDifficulty(levels, monsters);
</script>

<div class="container">
  <p>
    {#if tracker}
      <button on:click={() => dispatch("begin-encounter")}
        ><strong>{@html icons["crossed-swords"]} Run Encounter</strong></button
      >
      <br />
    {/if}
    <strong> Difficulty: </strong>
    <em>{difficulty.difficulty.toUpperCase()}</em>
    {#if displayBudget}
      <br />
      <strong>Total XP:</strong>
      {difficulty.totalXp}
      <br />
      <strong>Adjusted XP:</strong>
      {difficulty.adjustedXp} (x {difficulty.multiplier})
      <br />
      <strong>Tresholds:</strong> <em>Easy:</em>
      {difficulty.budget.easy} | <em>Medium:</em>
      {difficulty.budget.medium} | <em>Hard:</em>
      {difficulty.budget.hard} | <em>Deadly:</em>
      {difficulty.budget.deadly}
    {/if}
    <Monster {monsters} {displayType} />
  </p>
</div>
