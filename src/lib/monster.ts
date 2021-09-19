import { timeStamp } from "console";

const specialCrs = new Set([0, "0", "1/8", "1/4", "1/2"]);
type specialCr = typeof specialCrs[];

export class QuickMonster {
    name: string;
    cr: string | number;
    crNumeric: number;
    hp: number;
    ac: number;
    save: number;
    toHit: number;
    damage: number;
    dc: number;
    damageDice: number;
    multiAttack: number;

    constructor(name: string, cr: string | number, damageDice?: number, multiAttack?: number) {
        this.name = name;
        this.cr = cr;

        if (specialCrs.has(cr)) {
            if (cr === "0" || cr === 0) {
                this.crNumeric = -3;
                this.hp = 3;
                this.damage = 1;
            } else if (cr === "1/8") {
                this.crNumeric = -2;
                this.hp = 9;
                this.damage = 3;
            } else if (cr === "1/4") {
                this.crNumeric = -1;
                this.hp = 15;
                this.damage = 5;
            } else if (cr === "1/2") {
                this.crNumeric = 0;
                this.hp = 24;
                this.damage = 8;
            }
        } else if (typeof cr === "number") {
            if (!Number.isInteger(cr) && cr > 0) {
                throw `cr: "${cr}" cannot be parsed! Please use a positive integer or one of '1/8', '1/4, '1/2'`;
            }
            this.crNumeric = cr;
            this.damage = 5 + 5 * this.crNumeric;
            this.hp = 3 * this.damage;
        } else {
            throw `cr: "${cr}" cannot be parsed! Please use a positive integer or one of '1/8', '1/4, '1/2'`;
        }
        this.toHit = Math.round(4 + 0.5 * this.crNumeric);
        this.dc = Math.round(11 + 0.5 * this.crNumeric);
        this.ac = Math.round(13 + 1.0 / 3.0 * this.crNumeric);
        this.save = Math.round(3 + 0.5 * this.crNumeric);

        this.multiAttack = multiAttack ?? 1;
        this.damageDice = damageDice ?? 6;
    }

    damageToDiceCode(): string {
        const damagePerAttack = this.damage / this.multiAttack;
        const diceMean = 0.5 * (this.damageDice + 1);
        let numberOfDice = Math.round(damagePerAttack / diceMean);
        let rem = Math.round(damagePerAttack - numberOfDice * diceMean);
        if (rem < 0) {
            numberOfDice -= 1;
            rem = Math.round(damagePerAttack - numberOfDice * diceMean);
        }
        const diceResult = numberOfDice === 0 ? '' : `${numberOfDice}d${this.damageDice}`;
        const staticResult = rem === 0 ? '' : `${Math.abs(rem)}`;
        const sign = diceResult === '' || staticResult === '' ? '' : '+';
        const maString = this.multiAttack === 1 ? '' : `Multiattack(${this.multiAttack}), each `;
        return `${maString} ${Math.round(
            damagePerAttack
        )} (${diceResult}${sign}${staticResult})`;
    }
}