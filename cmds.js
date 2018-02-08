var RandExp = require('randexp');
class CMDS {
    constructor(options) {



    }

    name() {
        return 'samer';
    }

    radnom(r) {
        r = r[0];
        if (r === undefined) return new RandExp(/[a-zA-Z0-9]{8}/).gen();
        var reg = new RegExp(r);

        return new RandExp(reg).gen();
    }


}



module.exports = CMDS;