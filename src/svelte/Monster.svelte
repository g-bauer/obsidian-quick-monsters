<script lang="ts">
  import type { QuickMonster } from "../lib/monster";
  import { ICONS } from "../lib/icons";

  export let monsters: QuickMonster[];
  export let displayType: string;
</script>

<div class="container">
  {#if displayType === "list"}
    <ul>
      {#each monsters as monster}
        <li>
          <span>
            <strong>{monster.amount}x {monster.name} (CR {monster.cr})</strong>
            {@html ICONS["health"]}
            {monster.hp}
            {@html ICONS["shield"]}
            {monster.ac}
            {@html ICONS["player-thunder-struck"]}
            {monster.save}
            {@html ICONS["archery-target"]}
            {monster.toHit}
            {@html ICONS["bowie-knife"]}
            {@html monster.damageToDiceCode()}
            {@html ICONS["dragon-breath"]}
            {monster.dc}
          </span>
        </li>
      {/each}
    </ul>
  {:else}
    <table>
      <tr>
        <th>Name</th>
        <th aria-label="Hit Points">{@html ICONS["health"]}</th>
        <!-- <th>HP</th> -->
        <th aria-label="Armor Class">{@html ICONS["shield"]}</th>
        <!-- <th>AC</th> -->
        <th aria-label="Best Saving Throw"
          >{@html ICONS["player-thunder-struck"]}</th
        >
        <!-- <th>SAVE</th> -->
        <th aria-label="To Hit Bonus">{@html ICONS["archery-target"]}</th>
        <!-- <th>Hit</th> -->
        <th aria-label="Damage">{@html ICONS["bowie-knife"]}</th>
        <!-- <th>Damage</th> -->
        <th aria-label="DC (Difficulty Class)"
          >{@html ICONS["dragon-breath"]}</th
        >
        <!-- <th>DC</th> -->
        <th aria-label="Challenge Rating">CR</th>
        <th aria-label="Number of Monsters">#</th>
      </tr>
      {#each monsters as monster}
        <tr>
          <td><strong>{monster.name}</strong></td>
          <td>{monster.hp}</td>
          <td>{monster.ac}</td>
          <td>{monster.save}</td>
          <td>{monster.toHit}</td>
          <td>{@html monster.damageToDiceCode().readable} </td>
          <td>{monster.dc}</td>
          <td>{monster.cr}</td>
          <td>{monster.amount}</td>
        </tr>
      {/each}
    </table>
  {/if}
</div>

<style>
  th,
  td {
    border-style: hidden;
  }
</style>
