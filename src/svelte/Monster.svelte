<script lang="ts">
  import type { QuickMonster } from '../lib/monster';
  import { icons } from '../lib/icons';

  export let monsters: QuickMonster[];
  export let displayType: string;
</script>

<div class="container">
  {#if displayType === "list"}
    {#each monsters as monster}
      <div class="monster">
        <span>
          <strong>{monster.amount}x {monster.name} (CR {monster.cr})</strong>
          {@html icons['health']}
          {monster.hp}
          {@html icons['shield']}
          {monster.ac}
          {@html icons['aura']}
          {monster.save}
          {@html icons['targeted']}
          {monster.toHit}
          {@html icons['bowie-knife']}
          {@html monster.damageToDiceCode()}
          {@html icons['burning-embers']}
          {monster.dc}
        </span>
      </div>
    {/each}
  {:else}
    <table>
      <tr>
        <th>Name</th>
        <th>{@html icons['health']}</th>
        <th>{@html icons['shield']}</th>
        <th>{@html icons['aura']}</th>
        <th>{@html icons['targeted']}</th>
        <th>{@html icons['bowie-knife']}</th>
        <th>{@html icons['burning-embers']}</th>
        <th>CR</th>
        <th>#</th>
      </tr>
      {#each monsters as monster}
        <tr>
          <td><strong>{monster.name}</strong></td>
          <td>{monster.hp}</td>
          <td>{monster.ac}</td>
          <td>{monster.save}</td>
          <td>{monster.toHit}</td>
          <td>{@html monster.damageToDiceCode()}</td>
          <td>{monster.dc}</td>
          <td>{monster.cr}</td>
          <td>{monster.amount}</td>
        </tr>
      {/each}
    </table>
  {/if}
</div>
