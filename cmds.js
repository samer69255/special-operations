var RandExp = require('randexp');
class CMDS {
    constructor(options) {



    }

    name() {
        return 'samer';
    }

    random(r) {
        r = r[0];
        if (r === undefined) return new RandExp(/[a-zA-Z0-9]{8}/).gen();
        var reg = new RegExp(r);

        return new RandExp(reg).gen();
    }

    sum(s) {
        var f = s[0];
        var e = s[1];
        var j = s[2] || '';
        var txt = [];
       for (var i=f; i<=e; i++) {
           txt.push(i);
        }
        return txt.join(j);
    }

    Sum2(s) {
        var n = s[0];
        if ((n % 9) == 0 || (n == 0)) return 9; else return n % 9;
    }


}



module.exports = CMDS;