import { Notice, Plugin, parseYaml } from 'obsidian';
import { QuickMonster } from './lib/monster';
import Monster from './svelte/Monster.svelte';

export default class QuickMonsters extends Plugin {
	async onload() {
		console.log('loading quick-monsters-5e plugin');

		this.registerMarkdownCodeBlockProcessor("quick-monster", (src, el, ctx) => {
			const div1 = el.createDiv("monster-div");
			const data = parseYaml(src);
			try {
				const monsters = data.map((m: any) => {
					return new QuickMonster(m.name, m.cr, m.damageDice, m.multiAttack)
				});
				const svelteComponent = new Monster({
					target: div1,
					props: {
						monsters: monsters
					}
				});
			} catch (e) {
				new Notice(e);
			}
		});
	}

	onunload() {
		console.log('unloading quick-monsters-5e plugin');
	}
}