<script lang="ts">
  import type { QuickMonster } from '../lib/monster';

  export let monsters: QuickMonster[];
</script>

<div class="container">
  {#each monsters as monster}
    <div class="monster">
      <h4>{monster.name} (CR {monster.cr})</h4>
      <ul class="monster-stats">
        <li>
          <span>
            <strong>DEFENSIVE</strong> |
            <b>HP:</b>
            {monster.hp} | <b>AC:</b>
            {monster.ac} | <b>Best Save:</b>
            {monster.save}
          </span>
        </li>
        <li>
          <span>
            <strong>OFFENSIVE</strong> |
            <b>Hit:</b>
            {monster.toHit} |
            <b>Damage:</b>
            {monster.damageToDiceCode()} |
            <b>DC:</b>
            {monster.dc}
          </span>
        </li>
      </ul>
      <hr />
    </div>
  {/each}
</div>

<style>
  .monster {
    margin-top: -5px;
    margin-bottom: 1px;
  }
  .monster-stats {
    margin-top: -10px;
    margin-bottom: -10px;
  }
</style>
