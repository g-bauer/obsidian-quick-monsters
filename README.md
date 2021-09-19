# Create Monster Stat Blocks Quickly - for Obsidian.md

This plugin can be used to create simplified stat blocks for 5e monsters given their challenge rating (CR).

The created statistics are based on the analysis of published 5e monsters done by Paul Hughes. Please, read the original post on his blog "Blog of Holding" titled **["5e monster manual on a business card"](http://blogofholding.com/?p=7338)**.

## Usage in Obsidian

In your note, use

````yaml
```quick-monster
- { name: Goblin, cr: "1/4" }
```
````

which will render as

<img src="./img/goblin.png">

The same result can be achieved via

````yaml
```quick-monster
- name: Goblin
  cr: "1/4"
```
````

The input must be a YAML array. You can add multiple monster like so:

````yaml
```quick-monster
- { name: Goblin, cr: "1/4" }
- { name: Goblin Boss, cr: "1/2" }
- { name: Dire Wolf, cr: 1 }
```
````

<img src="./img/multiple_monsters.png">

### Options

You can add additional information:
- `damageDice` defines which dice are shown for damage, and
- `multiAttack` can be used to split damage into multiple attacks.

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

<img src="./img/kyr.png">

The total damage is split into two "attacks" and instead of the default 6-sided die, 8-sided dice are used.


### Statistics

The statistics shown are:

- **Name** and **CR** (your input)
- **HP**: monster hit points
- **AC**: monster armor class
- **Best Save**: bonus to the saving throw the monster is most proficient in (informed by your monster theme)
- **Hit**: to hit bonus for weapon and spell attacks (yes - only remember one value for all attacks)
- **Damage**: the damage *per* attack or spell, with the dice formula according to the selected dice (default is a 6-sided die)
- **DC**: difficulty class for spells or other effects such as attack riders (knock down, etc.)

The statistics are divided into *offensive* and *defensive* values. From my experience, as DMs, we often need only one of these information at a given time: On our turn, we need offensive stats - when our players act, we mostly need defensive stats.

## The Stats are your Starting Point

These stat blocks should be used as a solid base to come up quickly with your own monsters - **they are not set in stone**.
You can use them directly at the table and improvise attacks and spells or as a starting point to build your own monster.

Consider this stat block:

<img src="./img/ythanar.png">

We can use these statistics and improvise this creature's attacks (may be we make some notes below the block):

- **Multiattack**: Ythanar attacks once with his *Claw* and once with his *Tail*:
  -  *Claw*: 18 (2d8 slashing + 2d8 necrotic) damage
  -  *Tail*: 18 (4d8) bludgeoning damage. Target must make a Strenght Saving Throw (DC 14) or is knocked prone.
- **Necrotic Breath** (1 charge): 60 ft cone. 36 (8d8) necrotic damage on a failed Constitution Saving Throw (DC 14), half on a success. When Ythanar drops below 50% HP, he regains 1 charge and can use his reaction to use this ability.

It's easy to run. You only need one type of die to roll damage and all attacks have the same to Hit bonus and the same DC.
If you can do the math in your head, you can always change the dice from `4d8` to `3d8 + 4` if you prefer a smaller variance.

## Adjusting the Statistics

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