cha: new Decimal(1),
addLayer("w", {
    name: "wall", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#A9A9A9",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "wall", // Name of prestige currency
    baseResource: "time", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasChallenge('w',12)) mult=mult.times(4)
        if(inChallenge('w',12)||inChallenge('w',13)) mult=mult.div(5)
        if(hasUpgrade('w',22)) mult=mult.times(upgradeEffect('w',22))
        if(hasUpgrade('w',31)) mult=mult.times(upgradeEffect('w',31))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp=new Decimal(1)
        if(hasChallenge('w',13)) exp=exp.times(1.05)
        if(inChallenge('w',14)) exp=exp.times(0.6)
        if(hasChallenge('w',14)) exp=exp.times(challengeEffect('w',14))
        return exp
    },
    passiveGeneration(){
            if(hasUpgrade('w',23)) return 0.1
            if(hasUpgrade('w',11)) return 0.01
    },
    Speedup(){
        dev=new Decimal(1)
        if(hasUpgrade('w',33)) dev=dev.times(2)
        player.devSpeed=dev
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades:{
        11:{
            name:"wu1",
            title(){
                return "自动被墙"
            },
            description(){
                return "每秒获取重置时获取的墙的%1"
            },
            cost:new Decimal(1),
        },
        12:{
            name:"wu2",
            title:"哪来的挑战？",
            description:"根据已完成挑战数加成时间获取",
            effect(){return player.cha},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            cost:new Decimal(1)
        },
        13:{
            name:"unlwc1",
            title:"挑战来了",
            description:"解锁墙挑战1",
            cost:new Decimal(5)
        },
        14:{
            name:"unlwc2",
            title:"比上个还墙",
            description:"解锁墙挑战2",
            cost:new Decimal(10)
        },
        15:{
            name:"unlwc3",
            title:"我不想被墙了",
            description:"解锁墙挑战3",
            cost:new Decimal(20)
        },
        21:{
            name:"wu3",
            title:"没一个够墙的",
            description:"获取时间速度*3",
            cost:new Decimal(30),
            unlocked(){return hasChallenge('w',13)}
        },
        22:{
            name:"wu4",
            title:"这游戏越来越简单了",
            description:"基于时间数加成墙获取",
            cost:new Decimal(100),
            effect(){return player.points.add(1).pow(0.02)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked(){return hasChallenge('w',13)}
        },
        23:{
            name:"wu5",
            title:"这款游戏是给婴儿玩的吗",
            description:"升级11效果%1 -> %10",
            cost:new Decimal(150),
            unlocked(){return hasChallenge('w',13)}
        },
        24:{
            name:"unlwc4",
            title:"再不上强度我都要退游了",
            description:"解锁墙挑战4",
            cost:new Decimal(300),
            unlocked(){return hasChallenge('w',13)}
        },
        31:{
            name:"wu6",
            title:"从未墙过",
            description:"基于墙数量加成墙获取",
            effect(){return player.points.add(1).pow(0.1)},
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            cost:new Decimal(1e3),
            unlocked(){return hasChallenge('w',14)}
        },
        32:{
            name:"wu7",
            title:"无用的升级",
            description:"时间获取速度x5",
            effect(){return 5},
            effectDisplay() { return "5x" },
            cost:new Decimal(2e3),
            unlocked(){return hasChallenge('w',14)}
        },
        33:{
            name:"wu8",
            title:"时间太慢了！",
            description:"将游戏速度x2",
            cost:new Decimal(1e4),
            unlocked(){return hasChallenge('w',14)}
        }
    },
    challenges: {
        11: {
            name: "wc1",
            challengeDescription: "时间获取速度/10<br><p style=\"color:rgb(255, 0, 0);\">不要点击重置，会退出挑战</p>",
            goalDescription:"拥有1墙",
            canComplete: function() {return player[this.layer].points.gte(1)},
            onEnter(){
                player.points=new Decimal(0)
                player.w.points=new Decimal(0)
            },
            onExit(){
                player.points=new Decimal(0)
                player.w.points=new Decimal(0)
            },
            onComplete(){
                player.cha=player.cha.add(1)
            },
            rewardDescription:"时间获取速度*9",
            unlocked(){return hasUpgrade('w',13)}
        },
        12: {
            name: "wc2",
            challengeDescription: "墙获取/5<br><p style=\"color:rgb(255, 0, 0);\">不要点击重置，会退出挑战</p>",
            goalDescription:"拥有5墙",
            canComplete: function() {return player[this.layer].points.gte(5)},
            onEnter(){
                player.points=new Decimal(0)
                player.w.points=new Decimal(0)
            },
            onExit(){
                player.points=new Decimal(0)
                player.w.points=new Decimal(0)
            },
            onComplete(){
                player.cha=player.cha.add(1)
            },
            rewardDescription:"墙获取*4",
            unlocked(){return hasUpgrade('w',14)}
        },
        13: {
            name: "wc3",
            challengeDescription: "时间获取速度/10,墙获取/5<br><p style=\"color:rgb(255, 0, 0);\">不要点击重置，会退出挑战</p>",
            goalDescription:"拥有10墙",
            canComplete: function() {return player[this.layer].points.gte(10)},
            onEnter(){
                player.points=new Decimal(0)
                player.w.points=new Decimal(0)
            },
            onExit(){
                player.points=new Decimal(0)
                player.w.points=new Decimal(0)
            },
            onComplete(){
                player.cha=player.cha.add(1)
            },
            rewardDescription:"时间获取速度和墙获取^1.05,解锁一些新升级",
            unlocked(){return hasUpgrade('w',15)}
        },
        14: {
            name: "wc4",
            challengeDescription: "时间获取速度^0.01,墙获取^0.6<br><p style=\"color:rgb(255, 0, 0);\">不要点击重置，会退出挑战</p>",
            goalDescription:"拥有10墙",
            canComplete: function() {return player[this.layer].points.gte(10)},
            onEnter(){
                player.points=new Decimal(0)
                player.w.points=new Decimal(0)
            },
            onExit(){
                player.points=new Decimal(0)
                player.w.points=new Decimal(0)
            },
            onComplete(){
                player.cha=player.cha.add(1)
            },
            rewardDescription:"墙获取基于当前时间数获得一个加成,解锁一些新升级",
            rewardEffect(){return player.points.add(1).pow(0.03)},
            rewardDisplay(){return "^"+format(challengeEffect(this.layer, this.id))},
            unlocked(){return hasUpgrade('w',24)}
        },
    },
    layerShown(){return true}
})
