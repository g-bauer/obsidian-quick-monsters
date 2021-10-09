# Create Monster Stat Blocks and Encounters Quickly - for Obsidian.md

This plugin can be used to:

1. create simplified stat blocks for 5e monsters given their challenge rating (CR)
2. and compute encounter difficulties, and
3. run the encounter if you have [initiative-tracker](https://github.com/valentine195/obsidian-initiative-tracker) installed and enabled.

The created stats are based on the analysis of published 5e monsters done by Paul Hughes. Please, read the original post on his blog "Blog of Holding" titled **["5e monster manual on a business card"](http://blogofholding.com/?p=7338)**.

## Usage in Obsidian: `quick-monster`

In your note, use

````yaml
```quick-monster
- { name: Goblin, cr: 1/4 }
```
````

which will render as

<img src="https://github.com/g-bauer/obsidian-quick-monsters/blob/main/img/goblin.png">

The stats shown are:
- Name
- Hit Points (HP)
- Armor Class (AC)git 
- Best Saving Throw
- To Hit Bonus
- Damage
- DC (of any ability or spell)
- CR (Challenge Rating)
- Number of monsters (important for encounters)

The same result can be achieved via

````yaml
```quick-monster
- name: Goblin
  cr: 1/4
```
````

The input must be a YAML array. You can add multiple monster like so:

````yaml
```quick-monster
- { name: Goblin, cr: 1/4 }
- { name: Goblin Boss, cr: 1/2 }
- { name: Dire Wolf, cr: 1 }
```
````

<img src="https://github.com/g-bauer/obsidian-quick-monsters/blob/main/img/multiple_monsters.PNG">

### Turning your list of monsters into an encounter

You can turn the list of monsters into an encounter by adding a line with your character's levels.
Let's add more Goblins (setting `amount: 4`)  and see how difficult that encounter would be for our group of three level 3 adventures.

````yaml
```quick-encounter
- levels: [3, 3, 3]
- { name: Goblin, cr: 1/4, amount: 4 }
- { name: Goblin Boss, cr: 1/2 }
- { name: Dire Wolf, cr: 1 }
```
````
This yields:

<img src="https://github.com/g-bauer/obsidian-quick-monsters/blob/main/img/encounter.PNG">

If you hover over the difficulty, you'll see a breakdown of the difficulty threshold.

<img src="https://github.com/g-bauer/obsidian-quick-monsters/blob/main/img/encounter-tooltip.PNG">

### Running an encounter with the `initiative-tracker` plugin

If you have the [obsidian-initiative-tracker](https://github.com/valentine195/obsidian-initiative-tracker) plugin installed and enabled in the settings, instead of adding `levels` to your encounter, the players that are registered within the initiative-tracker settings will be used. You can start the encounter by clicking on the button.

<img src="https://github.com/g-bauer/obsidian-quick-monsters/blob/main/img/initiative-tracker-integration.PNG">

### Options

You can add additional information:
- `damageDice` defines which dice are shown for damage, and
- `multiAttack` can be used to split damage into multiple attacks.
- `amount` can be used to add multiple monsters to an encounter.

For example, using

````yaml
```quick-monster
- name: Kyr, the Shadow
  cr: 5
  damageDice: 8
  multiAttack: 2
```
````

yields

<img src="https://github.com/g-bauer/obsidian-quick-monsters/blob/main/img/kyr.PNG">

The total damage is split into two "attacks" and instead of the default 6-sided die, 8-sided dice are used.

## The Stats are your Starting Point

These stat blocks should be used as a solid base to come up quickly with your own monsters - **they are not set in stone**.
You can use them directly at the table and improvise attacks and spells or as a starting point to build your own monster.

Consider this stat block:

<img src="https://github.com/g-bauer/obsidian-quick-monsters/blob/main/img/ythanar.PNG">

We can use these statistics and improvise this creature's attacks (may be we make some notes below the block):

- **Multiattack**: Ythanar attacks once with his *Claw* and once with his *Tail*:
  -  *Claw*: 18 (2d6 slashing + 3d6 necrotic) damage
  -  *Tail*: 18 (5d6) bludgeoning damage. Target must make a Strenght Saving Throw (DC 14) or is knocked prone.
- **Necrotic Breath** (1 charge): 60 ft cone. 36 (6d6 + 15) necrotic damage on a failed Constitution Saving Throw (DC 14), half on a success. When Ythanar drops below 50% HP, he regains 1 charge and can use his reaction to use this ability.

It's easy to run. You only need one type of die to roll damage and all attacks have the same to Hit bonus and the same DC.
If you can do the math in your head, you can always change the dice from `5d6` to `3d6 + 8` if you prefer a smaller variance.

### Adjusting the Statistics

The author of the formulas (see [here](http://blogofholding.com/?p=7338)) evaluated how much stats spread for each CR and derived some heuristics. Adjustments *should be informed by the concept/type of your monster*.

**Defensive**

- **AC**: &pm; 3
- **HP**: &pm; 50%  
- **Best Save**: adjust according to monster theme
  
**Offensive**
- **Hit**: &pm; 2
- **Damage**: &pm; 50%
- **DC**: &pm; 2

## Useful Additions

- [ ] Add options for modifiers ("add 50% damage", "+2 AC")
- [ ] Add monster roles (a role defines a set of modifications to the base stats)
- [ ] Better scaling for higher CR monsters.

# Installation

Currently, you can only use this addon from github.

## From GitHub

- Download the latest release.
- Extract the directory into your plugin directory. You can find this directory in `your-vault/.obsidian/plugins` (where `your-vault` is the name of the directory that acts as you Obsidian vault).
- Activate the plugin in Obsidian (you might have to restart or reload Obsidian).
- There are currently no parameters / settings for this plugin.

> Please note that this code comes without any warranty. I am new to developing plugins for Obsidian. **Please, consider backing up your data** before using this plugin.
