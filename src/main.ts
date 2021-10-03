import {
    Notice,
    Plugin,
    parseYaml,
    PluginSettingTab,
    App,
    Setting,
    EventRef,
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

export default class QuickMonsters extends Plugin {
    settings: QuickMonstersSetting;

    get trackerEnabled() {
        return this.app.plugins.isEnabled("initiative-tracker");
    }

    async onload() {
        console.log("loading quick-monsters-5e plugin");
        await this.loadSettings();

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
                let playerLevels: any = [];
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
                                    obj.amount,
                                    obj.ini
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
