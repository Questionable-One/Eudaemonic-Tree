@ -1,178 +1,213 @@
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4CA7F0",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    passiveGeneration() { 
        if (getBuyableAmount('p', 11) < 1)
            return 0
        else
        return 0 + getBuyableAmount('p', 11).mul(0.01)
     },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 12)) mult = mult.times(2)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        if (hasUpgrade('p', 23)) mult = mult.times(10)
        if (hasUpgrade('c', 13)) mult = mult.times(4)
        if (hasUpgrade('c', 15)) mult = mult.times(mult^2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    autoUpgrade() {return hasUpgrade('c', 11)},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Starting Fresh",
            description: "Triple point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Trade Offer",
            description: "0.8x point gain but 2x prestige point gain.",
            cost: new Decimal(2),
            unlocked() {
                return hasUpgrade('p', 11)
            }
        },
         13: {
            title: "Self Duplication",
            description: "Prestige points boost themself.",
            cost: new Decimal(3),
            effect() {
               return player[this.layer].points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('p', 12)
            }
        },
        14: {
            title: "Self Duplication v2",
            description: "Points boost themself.",
            cost: new Decimal(5),
            effect() {
               return player.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('p', 13)
            }
        },
        15: {
            title: "Finally!",
            description: "Triple point gain.",
            cost: new Decimal(15),
            unlocked() {
                return hasUpgrade('p', 14)
            }
        },
         21: {
            title: "Self Duplication v1.5...?",
            description: "Points boost themself at a higher rate.",
            cost: new Decimal(30),
            effect() {
               return player.points.add(1).pow(0.225)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('p', 15)
            }
        },
        22: {
            title: "Above and beyond",
            description: "20x points, is this a good idea?",
            cost: new Decimal(100),
            tooltip: "Of course not, that's why we're doing it.",
            unlocked() {
                return hasUpgrade('p', 21)
            }
        },
         23: {
            title: "Reincarnation",
            description: "10x prestige points.",
            cost: new Decimal(500),
            unlocked() {
                return hasUpgrade('p', 22)
            }
        },
        24: {
            title: "New layer?",
            description: "Unlock Crystals",
            cost: new Decimal(10000),
            unlocked() {
                return hasUpgrade('p', 23)
            }
        },
        25: {
            title: "Prestiged Crystals",
            description: "1.5x crystals",
            cost: new Decimal(250000),
            unlocked() {
                return hasUpgrade('c', 14)
            }
        },
    },
    buyables: {
    11: {
        title: "Already???",
        cost(x) { return new Decimal(x).mul(x) },
        display() { const levels = getBuyableAmount(this.layer, this.id) 
            return `
            Generates +1% of the prestige points you get on reset every second.<br>
            Levels: ${levels}/100
            Cost: ${format(this.cost(levels))} prestige points<br>
            `
        },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buyMax() {return true},
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        unlocked() {return hasUpgrade('p', 21)},
        unlocked() {return hasUpgrade(this.layer, 21)},
        purchaseLimit: 100
    },
},
    },
    layerShown(){return true}
})
addLayer("c", {
    name: "crystals", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ff6cff",
    requires: new Decimal(1000000), // Can be a function that takes requirement increases into account
    resource: "crystals", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 25)) mult = mult.times(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for crystals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Dude we just did a reset",
            description: "Triple point gain, Autobuy prestige upgrades",
            cost: new Decimal(1),
        },
        12: {
            title: "Crystallized Points",
            description: "Quadruple points",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade(this.layer, 11)}
        },
        13: {
            title: "Crystallized Prestiges",
            description: "Quadruple prestige points",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade(this.layer, 11)}
        },
        14: {
            title: "Prestige stays relevant",
            description: "Unlock a prestige upgrade",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade(this.layer, 12) || hasUpgrade(this.layer, 13)}
        },
        15: {
            title: "Say goodbye to prestige",
            description: "2^ prestige points",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade(this.layer, 14)}
        },
    },
    layerShown(){return hasUpgrade('p', 24) || hasUpgrade('c', 11)}
    layerShown(){return hasUpgrade('p', 24) || hasUpgrade(this.layer, 11)}
})
