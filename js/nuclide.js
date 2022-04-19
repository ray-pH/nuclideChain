const timeUnit = {
    second : 's',
    minute : 'min',
    hour   : 'h',
    day    : 'day',
    month  : 'mo',
    year   : 'yr',
}

const transType = {
    decay   : 'decay',
    capture : 'neutron capture',
}

const decayMode = {
    misc    : "",
    alpha   : "α",
    betaPos : "β+",
    betaNeg : "β-",
    proton  : "p",
    neutron : "n",
    EC      : "EC",
    SF      : "SF",
};

class transMode {
    constructor(parentNuclide, transType, decayMode, crossSect, percentage){
        this.nuclide    = parentNuclide;
        this.transType  = transType;
        this.decayMode  = decayMode;
        this.crossSect  = crossSect;
        this.percentage = percentage;
    }
}

class Nuclide {
    constructor (name, initialCount = 0.0, halfLife = 0.0, transCrosssection = 0.0) {
        this.name   = name;
        this.abbrev = null;
        this.initialCount = initialCount;
        this.halfLife     = halfLife;
        this.halfLifeUnit = timeUnit.second;
        this.transCrosssection = transCrosssection;
        this.parentModes = [];

        this.nodeId = null;
    }

    // setNode(node){ this.node = node; }
    // TODO
    // addChild(childNuclide) { this.childs.push(childNuclide); }
    setNodeId(id) { this.nodeId = id; }
    // addParent(parentNuclide, transType, decayMode, percentage) { 
    addParent(parentMode) { 
        this.parentModes.push(parentMode);
        // this.parentModes.push(new transMode(parentNuclide, transType, decayMode, percentage)); 
    }
    getTransInfo(parentId){
        for (var i in this.parentModes){
            var parentMode = this.parentModes[i]
            if (parentMode.nuclide.nodeId == parentId)
                return parentMode;
        }
        return null;
    }

    parseHalfLife(){
        switch(this.halfLifeUnit){
            case timeUnit.second : return this.halfLife;
            case timeUnit.minute : return this.halfLife * 60;
            case timeUnit.hour   : return this.halfLife * 60 * 60;
            case timeUnit.day    : return this.halfLife * 60 * 60 * 24;
            case timeUnit.month  : return this.halfLife * 60 * 60 * 24 * 30;
            case timeUnit.year   : return this.halfLife * 60 * 60 * 24 * 365;
        }
    }
}

