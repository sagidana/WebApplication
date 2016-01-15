/*
to do:
- more checks for null var (timeFrame, valid date..)
- check more inputs
*/

// after 5 cycle which none of the mes display -> reload page
var _threshold = 5;


// Main function for the user - only need the Data array.
//function MesDisplay(Messages) {
var _Messages = {};
var _ON;
var i = 0;
var flag = false;
var cycle = 1;
//StartCycle(Messages, i, flag, cycle);
//}


// _Messages- Data list to diplay (see Data.js for more instrudters),
// i- index of Mes to check for display - need to start as 0,
// flag - true- 1 or moe Mes were displyed at this round, false- outherwise,
// cycle - number of times we got to the end of the Data array.

//function StartCycle(list, i, flag, cycle) {
function StartCycle() {
    // console.log('start Cycle ' + i);                                            // Debug

    if (CheckTimeFrame(_Messages[i]) == false) { // sholde not be display

        // print the current status
        console.log('Mes ' + _Messages[i].name + ' num ' + i + ' result is- ' + CheckTimeFrame(_Messages[i]));     // Debug

        // preper for next Mes
        i = i + 1;

        // if that is the last Mes, go back to first mes
        if (i > _Messages.length - 1) {
            i = 0;

            // try to privent: Maximum call stack size exceeded
            if (flag == false && cycle > _threshold) { // no Mes were displaued at this round  
                console.log(_threshold + ' cycles with no item to display.');
                _ON = false;
                // location.reload(); // realod page after X cycle with no item to display.
                return;  // end the progrem agter X cycle with no item to display.
            }

            flag = false;       // reset flag each round
            cycle = cycle + 1;

            console.log('end of the cycle, start from 0 again');                    // Debug
            // return; // Debug -for one runtime
        }

        // (not display) go to the next Mes
        //StartCycle(_Messages, i, (false || flag), cycle);
        flag = (false || flag);
        StartCycle();
    }

    else { // do display

        var time = _Messages[i].dispTimeSec;

        // print the current status
        console.log('Mes ' + _Messages[i].name + ' num ' + i + ' result is- ' + CheckTimeFrame(_Messages[i]) + ' time: ' + time);     // Debug

        // start the show + use callback for the next Mes (i+1)
        //var stop = setInterval(function () { Show(stop, _Messages, i + 1, (true || flag), cycle) }, time);

        setTimeout(function () { Show() }, time);
    }
}

// change the TEMPLATE and set the next Mes
function Show() {
    i = i + 1;
    flag = (true || flag);
    // make sure the Interval will only run once.
    //clearInterval(stop);

    // if that is the last Mes, go back to first mes
    if (i > _Messages.length - 1) {
        //console.log('end of the array, start from 0 again');                        // Debug
        i = 0;

        // try to privent: Maximum call stack size exceeded
        if (flag == false && cycle > _threshold) { // no Mes were displaued at this round  
            console.log(_threshold + ' cycles with no item to display.');
            _ON = false;
            // location.reload(); // realod page after X cycle with no item to display.
            return;  // end the progrem agter X cycle with no item to display.
        }

        flag = false;       // reset flag each round
        cycle = cycle + 1;

        // return; // Debug -for one runtime
    }

    //Display the Mes
    ShowMes(_Messages[i]);
    //Set next Mes
    StartCycle();
}

// check if the mes need to be display (using all 3 type of check for all the times on the timeFrame)
// Assume there are no overlap between the times
function CheckTimeFrame(DisplayData) {

    var flag = false;

    $.each(DisplayData.TimeFrame, function (i, Time) {
        //console.log('***'+ CheckDates(Time));
        //console.log(CheckDays(Time));
        //console.log(CheckTime(Time));

        if (CheckDates(Time) && CheckDays(Time) && CheckTime(Time))
            flag = true;
    });
    return flag;
}

// today is between x and y?  // **** MM.DD.YYYY ****
function CheckDates(timeF) {
    // if new Date will return Invalid - func will return False	

    var nowD = new Date();
    var fromD = new Date(timeF.FromDate);
    var toD = new Date(timeF.ToDate);

    //console.log('f '+fromD+ ' n ' + nowD + ' t ' + toD); // Debug
    if (nowD > fromD && nowD < toD) {
        return true;
    }
    return false;
}

// today day is on days?
function CheckDays(Time) {
    //console.log(new Date().getDay().toString(), Time.days.indexOf(new Date().getDay().toString())); // Debug
    if (Time.days[new Date().getDay()])
        return true;
    return false;
}

function CheckTime(Time) {
    var nowH = new Date().getHours();
    var nowM = new Date().getMinutes();

    var fromH = new Date(Time.FromTime).getHours();
    var fromM = new Date(Time.FromTime).getMinutes();

    var toH = new Date(Time.ToTime).getHours();
    var toM = new Date(Time.ToTime).getMinutes();

    //console.log('f '+fromH+':'+fromM+ ' n ' + nowH+':'+nowM + ' t ' + toH+':'+toM); // Debug


    if (nowH > fromH && nowH < toH && nowM > fromM && nowM < toM)
        return true;
    return false;
}

// .load() and activate text and img replace
function ShowMes(mes) {

    $("#pageTemplate").load('Templates/' + mes.template, function () {
        addText(mes.text);
        addImage(mes.images);
    });
}

//  text replace
function addText(textArr) {

    var index = 0;
    for (; index < textArr.length; index++){
        $('#text' + (index+1)).html(textArr[index]);
    };

    while(index < 10)
    {
        $('#text' + (index+1)).hide();
        index++;
    }
}

// img replace
function addImage(imgArr) {
    var index = 0;

    for (; index < imgArr.length; index++){
        $('#image' + (index + 1)).attr("src", imgArr[index]);
    };

    while(index < 5) {
        $('#image' + (index + 1)).hide();
        index++;
    }
}

// return the value of param Name from the URL
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}














////////////////////////////////////////////////// not in use:
/*
// create new list each hour of this hour items.
function UpdateDisplayQ(DisplayDataA) {

    var DisplayQ = [];

    $.each(DisplayDataA, function (i, DisplayData) {
        $.each(DisplayData.TimeFreame, function (j, Time) {
            if (CheckDates(Time) && CheckDays(Time) && CheckTime(Time)) {
                // only the first meach is insert to the Q, is it ok?
                DisplayQ.push({ item: DisplayData, sec: 1000 });
                return true;
            }
        })
    });

    return DisplayQ;
};

// Schedule the display for all itmes on AllMes.
function DisplayQ() {

    var time = 0;
    $.each(allMes, function (i, Mes) {
        if (i == 0)
            time = 0;
        else
            time = time + Mes.dispTimeSec;
        console.log(time);
        setTimeout(function () {
            $('#screen').text(Mes.name);
            console.log('i=' + Mes.dispTimeSec + ' ' + Mes.name + ' after ' + Mes.dispTimeSec / 1000 + ' sec.');
        }, time);
    });
};
*/


////////////////////////////////////////////////// need to check:

/*
var block = $('#screen');

function show_mes(block,text){
block.delay(5000).text(text);
};


for (var i = 0; i < allMes.length; i++) {
//setTimeout(show_mes(block, allMes[i].name), 500000); // 5000 = 5 seconds
// setTimeout(block.text(allMes[i].name), 500000); // 5000 = 5 seconds

show_mes(block, allMes[i].name);

console.log(allMes[i].name);
}*/

/*
// print displayQ items 
console.log('q data:');
if (displayQ.length != 0) {
//console.log('length: ' +displayQ.length);
//console.log(displayQ);
$.each(displayQ, function (k, dis) {
console.log(dis.name);
});
}
*/


/////////////////////////////////
// Schedule the display for all itmes on AllMes.
function show_mes(block, text) {
    block.text(text);
};
/*
var time = 0;
$.each(allMes, function (i, Mes) {
if (i == 0)
time = 0;
else
time = time + Mes.dispTimeSec;
console.log(time);
setTimeout(function () {
$('#screen').text(Mes.name);
console.log('i=' + Mes.dispTimeSec + ' ' + Mes.name + ' after ' + Mes.dispTimeSec / 1000 + ' sec.');
}, time);
});
*/

///////////////////////////////// not in use
// convert 'inputFormat' to format: dd/mm/yyyy
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('.');
}

// clock
//var myVar = setInterval(function () { myTimer() }, 1000);
function myTimer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("timer").innerHTML = t;
}
/////////////////////////////////


/*
var check = new Date;
var testt = allMes[0];
if ((check.getTime() <= testt.TimeFreame[0].ToDate.getTime() && check.getTime() >= testt.TimeFreame[0].FromDate.getTime())) console.log("date contained");
*/



/////////////////////////////////
