
var uceFault = function (i) {
    if (i > 9997)
        uceFault = function (i) { return true; };
    return false;
}

function ra(i) {
    var x = (-1 >> 1) + 308641 * i;
    uceFault(i); uceFault(i);
    //    return ; // print("not int32:" + x);
    print(x | 0);
}

for (var i = 0; i < 10000; i++)
    ra(i);
