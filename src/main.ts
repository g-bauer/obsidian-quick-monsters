import {
    Notice,
    Plugin,
    parseYaml,
    PluginSettingTab,
    App,
    Setting,
    EventRef,
    addIcon
} from "obsidian";
import { QuickMonster } from "./lib/monster";
import Monster from "./svelte/Monster.svelte";
import Encounter from "./svelte/Encounter.svelte";

interface QuickMonstersSetting {
    displayType: "table" | "list";
    displayBudget: boolean;
}

const DefaultSetting: QuickMonstersSetting = {
    displayType: "table",
    displayBudget: true
};

declare module "obsidian" {
    interface App {
        plugins: {
            isEnabled(name: string): boolean;
        };
    }
    interface Workspace {
        on(
            name: "initiative-tracker:start-encounter",
            creatures: InitiativeTrackerCreature[]
        ): EventRef;
    }
}

interface InitiativeTrackerCreature {
    name: string;
    hp?: number;
    ac?: number;
    modifier?: number;
}
const START_ENCOUNTER_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M27.43 918.8l30.374-30.374 80.793 80.793-30.374 30.374L27.43 918.8zm422.393-253.815c0-48.521-39.36-87.882-87.882-87.882s-87.88 39.36-87.88 87.88c0 48.521 39.338 87.859 87.882 87.882s87.902-39.338 87.88-87.88zm-175.351 8.401l-.807-.807-166.337 166.336 80.794 80.794 166.337-166.337-.92-.92c-41.832-3.986-75.099-37.253-79.067-79.065zm-.411-8.402c0-45.507 34.621-82.952 78.95-87.431-46.731-53.121-88.214-110.883-123.852-172.613L117.593 516.506 274.47 673.383a88.927 88.927 0 0 1-.409-8.399zm175.315 8.962c-4.472 44.334-41.914 78.942-87.433 78.92a89.137 89.137 0 0 1-8.406-.413l157.058 157.058 111.566-111.566c-62.063-35.842-119.841-77.405-172.785-123.999zM815.497 74.632L392.493 497.636c6.535 9.622 10.729 21.41 10.729 33.817 0 19.234-9.188 36.441-23.375 47.483 34.711 7.191 61.918 34.869 68.453 69.814 11.013-14.625 28.5-24.14 48.078-24.14 12.407 0 23.51 3.51 32.978 9.891l423.002-423.002 29.691-166.555-166.553 29.688zM41.964 872.58l112.539 112.539 49.514-49.514L91.478 823.066 41.964 872.58z"/></svg>';

export default class QuickMonsters extends Plugin {
    settings: QuickMonstersSetting;

    get trackerEnabled() {
        return this.app.plugins.isEnabled("initiative-tracker");
    }

    async onload() {
        console.log("loading quick-monsters-5e plugin");
        await this.loadSettings();

        /** Add launch encounter icon. */
        addIcon("crossed-swords", START_ENCOUNTER_ICON);

        this.addSettingTab(new QuickMonstersSettingTab(this.app, this));

        this.registerMarkdownCodeBlockProcessor(
            "quick-monster",
            (src, el, ctx) => {
                const div1 = el.createDiv("monster-div");
                const data = parseYaml(src);
                try {
                    const monsters = data.map((m: any) => {
                        return new QuickMonster(
                            m.name,
                            m.cr,
                            m.damageDice,
                            m.multiAttack
                        );
                    });
                    const svelteComponent = new Monster({
                        target: div1,
                        props: {
                            monsters: monsters,
                            displayType: this.settings.displayType
                        }
                    });
                } catch (e) {
                    new Notice(e);
                }
            }
        );

        this.registerMarkdownCodeBlockProcessor(
            "quick-encounter",
            (src, el, ctx) => {
                const div1 = el.createDiv("encounter-div");
                const data = parseYaml(src);
                let playerLevels: number[] = [];
                let monsters: QuickMonster[] = [];
                try {
                    data.forEach((obj: any) => {
                        if ("name" in obj) {
                            monsters.push(
                                new QuickMonster(
                                    obj.name,
                                    obj.cr,
                                    obj.damageDice,
                                    obj.multiAttack,
                                    obj.amount
                                )
                            );
                        } else if ("levels" in obj) {
                            playerLevels.push(obj.levels);
                        }
                    });
                } catch (e) {
                    new Notice(e);
                }
                if (playerLevels.length !== 1) {
                    new Notice(
                        "Please define a single entry for character levels. E.g. 'levels: [2, 2]' if your group consists of two level 2 characters."
                    );
                }
                console.log(this.settings.displayType);
                const svelteComponent = new Encounter({
                    target: div1,
                    props: {
                        tracker: this.trackerEnabled,
                        monsters: monsters,
                        levels: playerLevels[0],
                        displayType: this.settings.displayType,
                        displayBudget: this.settings.displayBudget
                    }
                });

                /** Add begin encounter hook from Svelte Component */
                svelteComponent.$on("begin-encounter", () => {
                    this.app.workspace.trigger(
                        "initiative-tracker:start-encounter",
                        monsters
                    );
                });
            }
        );
    }

    onunload() {
        console.log("unloading quick-monsters-5e plugin");
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DefaultSetting,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class QuickMonstersSettingTab extends PluginSettingTab {
    plugin: QuickMonsters;

    constructor(app: App, plugin: QuickMonsters) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl("h2", { text: "Quick Monsters 5e Settings" });

        new Setting(containerEl)
            .setName("Monster Display Type")
            .setDesc("Select the way monsters are listed.")
            .addDropdown((d) => {
                d.addOption("list", "list");
                d.addOption("table", "table");
                d.setValue(this.plugin.settings.displayType);
                d.onChange(async (v: "list" | "table") => {
                    this.plugin.settings.displayType = v;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName("XP Budget")
            .setDesc("Show XP Budget of Encounter.")
            .addToggle((t) => {
                t.setValue(this.plugin.settings.displayBudget);
                t.onChange(async (v) => {
                    this.plugin.settings.displayBudget = v;
                    await this.plugin.saveSettings();
                });
            });
    }
}
