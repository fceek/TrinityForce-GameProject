class Char {
    constructor(hp, atk, def, crit, critDmg) {
        this.hp = (hp !== '') ? hp : 100;
        this.atk = (atk !== '') ? atk : 30;
        this.def = (def !== '') ? def : 10;
        this.crit = (crit !== '') ? crit : 0;
        this.critDmg = (critDmg !== '') ? critDmg : 100;
    }
}

class Battle {
    heroHp;
    conHp;
    constructor(hero, con, defFactor, regPer, conNum) {
        this.hero = hero;
        this.con = con;
        this.defFactor = (defFactor !== '') ? defFactor : 3;
        this.regPer = (regPer !== '') ? regPer : 20;
        this.conNum = (conNum !== '') ? conNum : 3;
    }

    dealDamage(atk, def) {
        atk = parseInt(atk);
        def = parseInt(def);
        let randomFactor = (Math.random() * 10 - 5) / 100 + 1;
        return Math.round(((atk * atk)/(this.defFactor * def + atk)) * randomFactor);
    }

    /**
    * @returns 0: Both alive, 1: Hero dead, 2: Con dead.
    */
    fight() {
        let dmg;
        if (this.heroTurn) {
            dmg = this.dealDamage(this.hero.atk, this.con.def);
            this.conHp = this.conHp - dmg;
            appendLogs('英雄对敌方造成了' + dmg + '点伤害');
            appendLogs('敌方剩余生命值：' + this.conHp);
        } else {
            dmg = this.dealDamage(this.con.atk, this.hero.def);
            this.heroHp = this.heroHp - dmg;
            appendLogs('敌方对英雄造成了' + dmg + '点伤害');
            appendLogs('英雄剩余生命值：' + this.heroHp);
        }
        this.heroTurn = !this.heroTurn;
        if (this.heroHp <= 0) {
            return 1;
        }
        if (this.conHp <= 0) {
            return 2;
        }
        return 0;
    }

    simulate() {
        this.heroHp = this.hero.hp;
        this.conHp = this.con.hp;
        for (let i = 0; i < this.conNum; i++) {
            this.heroTurn = true;
            let endFight = 0;
            while (!endFight) {
                endFight = this.fight();
            }
            if (endFight == 1) {
                appendLogs('--> 英雄阵亡，被第' + (i + 1) + '只敌人击杀');
                break;
            }
            if (endFight == 2) {
                appendLogs('--> 英雄消灭了第' + (i + 1) + '只敌人');
            }
            this.heroHp = this.heroHp + Math.round((this.hero.hp - this.heroHp) * (this.regPer / 100));
            this.conHp = this.con.hp;
        }
        if (this.heroHp >= 0) {
            appendLogs(this.conNum + '只敌人已被全部消灭')
        }
    }
}

function runSimulation() {
    let hero = new Char($('#hero-hp').val(), $('#hero-atk').val(), $('#hero-def').val(), $('#hero-crit').val(), $('#hero-critdmg').val());
    let con = new Char($('#con-hp').val(), $('#con-atk').val(), $('#con-def').val(), 0, 100);
    let battleField = new Battle(hero, con, $('#def-factor').val(), $('#reg-per').val(), $('#con-num').val());
    battleField.simulate();
}

function appendLogs(text) {
    text = $('#logs').val() + '\n' + text;
    $('#logs').val(text);
}

$(document).ready(function(){
    $('#sim-start').click(function(){
        runSimulation();
    })
    $('#logs-clear').click(function(){
        $('#logs').val('');
    })
})