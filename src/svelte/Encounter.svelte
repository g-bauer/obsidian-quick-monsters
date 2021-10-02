<script lang="ts">
  import type { QuickMonster } from 'src/lib/monster';
  import { Encounter } from 'src/lib/encounter';
  import type { DifficultyReport } from 'src/lib/encounter';
  import Monster from './Monster.svelte';

  export let monsters: QuickMonster[];
  export let levels: number[];
  export let displayType: string;
  export let displayBudget: boolean;
  const encounter: Encounter = new Encounter(monsters, levels);
  const difficulty: DifficultyReport = encounter.difficulty();
</script>

<div class="container">
  <p>
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
