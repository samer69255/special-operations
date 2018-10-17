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

    SUM(s)
    {
        return sum(s);
    }


}

function sum(text) {
    text = text.match(/[آ-ي]+/g);
    if (text) text = text.join('');
    else return null;
    var a = {


        "ا": "1",
        "أ": "1",
        "ٱ": "1",
        "إ": "1",
        "ئ": "10",
        "ب": "2",
        "آ": "1",
        "ج": "3",
        "د": "4",
        "ه": "5",
        "ة": "5",
        "و": "6",
        "ز": "7",
        "ح": "8",
        "ط": "9",
        "ى": "10",
        "ي": "10",
        "ك": "20",
        "ل": "30",
        "م": "40",
        "ن": "50",
        "س": "60",
        "ع": "70",
        "ف": "80",
        "ص": "90",
        "ق": "100",
        "ر": "200",
        "ش": "300",
        "ت": "400",
        "ث": "500",
        "خ": "600",
        "ذ": "700",
        "ض": "800",
        "ظ": "900",
        "غ": "1000"

    };

    var n = 0;
    for (var i=0; i<text.length; i++)
    {
        if (a[(text.charAt(i))]) n += eval(a[(text.charAt(i))]);
    }
    return n;
}



module.exports = new CMDS();