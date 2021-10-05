<script lang="ts">
  import type { QuickMonster } from "../lib/monster";
  import { icons } from "../lib/icons";

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
            {@html icons["health"]}
            {monster.hp}
            {@html icons["shield"]}
            {monster.ac}
            {@html icons["player-thunder-struck"]}
            {monster.save}
            {@html icons["archery-target"]}
            {monster.toHit}
            {@html icons["bowie-knife"]}
            {@html monster.damageToDiceCode()}
            {@html icons["dragon-breath"]}
            {monster.dc}
          </span>
        </li>
      {/each}
    </ul>
  {:else}
    <table>
      <tr>
        <th>Name</th>
        <th title="Hit Points">{@html icons["health"]}</th>
        <!-- <th>HP</th> -->
        <th title="Armor Class">{@html icons["shield"]}</th>
        <!-- <th>AC</th> -->
        <th title="Best Saving Throw">{@html icons["player-thunder-struck"]}</th
        >
        <!-- <th>SAVE</th> -->
        <th title="To Hit Bonus">{@html icons["archery-target"]}</th>
        <!-- <th>Hit</th> -->
        <th title="Damage">{@html icons["bowie-knife"]}</th>
        <!-- <th>Damage</th> -->
        <th title="DC (Difficulty Class)">{@html icons["dragon-breath"]}</th>
        <!-- <th>DC</th> -->
        <th title="Challenge Rating">CR</th>
        <th title="Number of Monsters">#</th>
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
