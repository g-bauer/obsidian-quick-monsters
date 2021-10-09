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
import type InitiativeTrackerData from "../../obsidian-initiative-tracker/src/main";


interface QuickMonstersSetting {
    displayType: "table" | "list";
    displayBudget: boolean;
    useInitiativeTracker: boolean;
}

const DefaultSetting: QuickMonstersSetting = {
    displayType: "table",
    displayBudget: true,
    useInitiativeTracker: true,
};

declare module "obsidian" {
    interface App {
        plugins: {
            isEnabled(name: string): boolean;
            plugins: {
                "obsidian-dice-roller": {
                    parseDice(text: string): Promise<{ result: number }>;
                };
                "initiative-tracker": {
                    data: InitiativeTrackerData
                }
            }
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

    get canUseInitiativeTracker() {
        return "initiative-tracker" in this.app.plugins.plugins;
    }

    get canUseDiceRoller() {
        return "obsidian-dice-roller" in this.app.plugins.plugins;
    }

    get initiativeTracker(): InitiativeTrackerData {
        if (this.canUseInitiativeTracker) {
            return this.app.plugins.plugins["initiative-tracker"].data;
        }
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
                        }
                    });
                } catch (e) {
                    new Notice(e);
                }
                const svelteComponent = new Monster({
                    target: div1,
                    props: {
                        monsters: monsters,
                        displayType: this.settings.displayType,
                    }
                });
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
                // Get player levels from initiative tracker
                if (this.settings.useInitiativeTracker) {
                    if (playerLevels.length && this.initiativeTracker.players.length) {
                        new Notice('You specified "levels" and players in the initiative-tracker settings. Consider removing "levels".');
                    }
                    playerLevels = this.initiativeTracker.players.map((p) => p.level);
                }
                if (!playerLevels.flat().length) {
                    const svelteComponent = new Monster({
                        target: div1,
                        props: {
                            monsters: monsters,
                            displayType: this.settings.displayType,
                        }
                    });
                } else {
                    const svelteComponent = new Encounter({
                        target: div1,
                        props: {
                            tracker: (this.canUseInitiativeTracker && this.settings.useInitiativeTracker),
                            monsters: monsters,
                            levels: playerLevels.flat(),
                            displayType: this.settings.displayType,
                            displayBudget: this.settings.displayBudget,
                        }
                    });
                    /** Add begin encounter hook from Svelte Component */
                    svelteComponent.$on("begin-encounter", () => {
                        let entities: any = [];
                        monsters.filter((m) => "amount" in m).forEach((m) => { entities.push(Array(m.amount).fill(m)) });
                        this.app.workspace.trigger(
                            "initiative-tracker:start-encounter",
                            entities.flat()
                        );
                    });
                };
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

        if (this.plugin.canUseInitiativeTracker) {
            new Setting(containerEl)
                .setName("Enable Inititative Tracker")
                .setDesc("Uses player data from initiative tracker and option to start encounters.")
                .addToggle((t) => {
                    t.setValue(this.plugin.settings.useInitiativeTracker);
                    t.onChange(async (v) => {
                        this.plugin.settings.useInitiativeTracker = v;
                        await this.plugin.saveSettings();
                    });
                });
        }
    }
}
