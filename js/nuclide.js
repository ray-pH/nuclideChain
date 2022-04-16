const timeUnit = {
    second : 's',
    minute : 'min',
    hour   : 'h',
    day    : 'day',
    month  : 'mo',
    year   : 'yr',
}

const parentType = {
    decay   : 0,
    capture : 1,
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

class Nuclide {
    constructor (name, halfLife = 1.0, transCrosssection = 0.0) {
        this.name   = name;
        this.abbrev = null;
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
    addParent(parentNuclide, parentType, decayMode, percentage) { 
        this.parentModes.push({
            nuclide    : parentNuclide,
            parentType : parentType,
            decayMode  : decayMode,
            percentage : percentage
        }); 
    }
    getTransInfo(parentId){
        for (var i in this.parentModes){
            var parentMode = this.parentModes[i]
            if (parentMode.nuclide.nodeId == parentId)
                return parentMode;
        }
        return null;
    }

}
