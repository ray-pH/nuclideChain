class Nuclide {
    constructor (name) {
        this.name   = name;
        this.abbrev = null;
        // this.node   = null;
        this.childs  = [];
        this.parents = [];
    }

    // setNode(node){ this.node = node; }
    // TODO
    addChild(childNuclide) { this.childs.push(childNuclide); }

}
