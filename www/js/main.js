document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
// $(document).ready(function(){
googleplaygame.auth();

$(function() {
    // var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    // alert(deviceType);
    // parsePlugin.initialize("P7FJO3DLoq4XkyrwYC0xlRKOumaIeYJiqbBEa03K", "UXMf5ajPDXzQlFMqbJ7c1ku3GCyhKx3buVyXVHJX");
    FastClick.attach(document.body);
});
// function loadSound () {
//   createjs.Sound.registerSound("audio/right.ogg", "right");
//   createjs.Sound.registerSound("audio/wrong.ogg", "wrong");
// }
// loadSound();

var highScore,
    sound, 
    soundUpdate;

var rightSound = new Media("/android_asset/www/audio/right.ogg"),
    wrongSound = new Media("/android_asset/www/audio/wrong.ogg");

var db = openDatabase('ngjyrat', '1.0', 'Loja Ngjyrat - Databaza', 3 * 1024 * 1024);
// var db = window.sqlitePlugin.openDatabase({name: "ngjyrat.db"});

/* Insertimi ne Databaze */
db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS CLASSIC (id unique, type, value)');
    tx.executeSql('INSERT INTO CLASSIC (id, type, value) VALUES (1, "highScore", 0)');
    tx.executeSql('INSERT INTO CLASSIC (id, type, value) VALUES (3, "sound", 1)');
});
function updateSound(update) {

    if(update == true) {
        $('a.zeri').toggleClass('on off');
        $("a.zeri i").toggleClass('ion-android-volume-up ion-android-volume-off');
    }
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM CLASSIC WHERE id=3", [], function(tx, res) {
            $('#sound').val(res.rows.item(0).value);
            // console.log(res.rows.item(0).value);
            sound = $('#sound').val();
            if( sound == 0 ) {
                if($('a.zeri').hasClass("on")) {
                    $('a.zeri').removeClass('on').addClass('off');
                    $("a.zeri i").toggleClass('ion-android-volume-up ion-android-volume-off');
                }
            }
        }, function(tx, error){
            alert('Sound was not updated on function: ' + error);
        });
    });
    // console.log("sound: "+sound);
}
function startHome() {
    $.ajax({
        url: "ajax/home.html",
        cache: false
    }).done(function( html ) {
        $( "#content" ).html( html );
        $('section#home').fadeIn("slow");

        $('.luaj-button .colors').animo({
            animation: "spinner",
            duration: 20,
            iterate: "infinite"
        });
        $('.luaj-button a').animo({
            animation: 'pulse',
            duration: 3,
            iterate: "infinite"
        });

        getResults();
        updateSound(false);
        $('#luaj').click(function(event) {
            event.preventDefault();
            startGame();
        });

        $('a.zeri').click(function() {
            if(sound == 1){
                soundUpdate = 0 
            } else { 
                soundUpdate = 1 
            }
            // console.log("soundUpdate: " + soundUpdate);
            db.transaction(function(tx) {
                tx.executeSql("UPDATE CLASSIC SET value = "+ soundUpdate +" WHERE id=3", [], function(tx, res) {
                    updateSound(true);
                }, function(tx, error){
                    alert('Sound was not updated on click: ' + error);
                });
            });
        });

        $('.about').click(function() {
            $('section#home').fadeOut("slow");
            rrethNesh();
        });

        $('.share').click(function() {
            googleplaygame.isSignedIn(function (result) {
                if(result) {
                    googleplaygame.showPlayer(function (playerData) {
                        alert("True: "+playerData['displayName']);
                    });
                } else {
                    alert("False");
                }
            });
        });

        $('.leaderboard').click(function() {
            var data = {
                leaderboardId: "CgkIy6HVt5oOEAIQAA"
            };
            googleplaygame.showLeaderboard(leaderboardId);
        });
    });
}

startHome();


function getResults() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM CLASSIC WHERE id = 1", [], function(tx, res) {
            $('#input_highScore').val(res.rows.item(0).value);
            // console.log(res.rows.item(0).value);
            highScore = $('#input_highScore').val();
        });
    });
}




function startGame() {
    $.ajax({
        url: "ajax/klasik.html",
        cache: false
    }).done(function( html ) {
        $( "#content" ).html( html );
        if (highScore != "undefined" && highScore >= 0 ) {
            $('.rekordi').text("Rekordi: " + highScore);
        }
        klasik();
        $('section#loja-classic').fadeIn('slow');
    });
}

var ngjyrat = [
    ["e kuqe", "#e74c3c"],          // 0
    ["e kaltër", "#3498db"],        // 1
    ["e gjelbër", "#2ecb71"],       // 2
    ["e portokallët", "#e67e22"],   // 3
    ["e kafët", "#a67235"],         // 4
    ["vjollcë", "#9e5fb8"],         // 5
    ["rozë", "#ff89e5"],            // 6
    ["e verdhë", "#f1c40f"]         // 7
];

function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}


function klasik(r) {
    $('.rrethi').html('<div id="timer"><span class="ngjyra"></span></div>');
    var saktesia = null;
    var saktesiaDy = null;
    var timer = false;
    var rezultatiNeLoj = 0;

    if(r == true) {
        saktesia = null;
        rezultatiNeLoj = 0;
        $('.rezultatiNeLoj').text(rezultatiNeLoj);
    }

    var n1 = null; // Ngjyra 1
    var n2 = null; // Ngjyra 2
    var shpejtesia = null;


    function loop() {
        n1 = ngjyrat[Math.floor((Math.random() * 7) + 0)];
        n2 = ngjyrat[Math.floor((Math.random() * 7) + 0)];

        if (n1[1] == n2[1]) {
            saktesia = 1;
            // console.log(saktesia);
        } else {
            saktesia = 2;
            // console.log(saktesia);
        }


        if(rezultatiNeLoj > 70 ) {
            shpejtesia = 1000;
        } else if (rezultatiNeLoj > 40 ) {
            shpejtesia = 2000;
        } else if (rezultatiNeLoj > 30 ) {
            shpejtesia = 3000;
        } else if (rezultatiNeLoj > 20 ) {
            shpejtesia = 4000;
        } else if (rezultatiNeLoj > 10 ) {
            shpejtesia = 5000;
        } else {
            shpejtesia = 6000;
        }

        // if(rezultatiNeLoj == 0) {
        //     saktesia = 0;
        //     console.log(saktesia);
        // }


        $('#timer span').text(n2[0]).css("color", n1[1]);
        $('.rezultatiNeLoj').html(rezultatiNeLoj);
        $.circleProgress.defaults.size = 250;
        $('#timer').circleProgress({
            value: 1,
            fill: {
                color: n1[1]
            },
            animation: {
                duration: shpejtesia
            },
            emptyFill: convertHex(n1[1],10)
        }).on('circle-animation-progress', function(event, progress) {
            if (progress > 0.99 && progress != 1) { timer = true }
        }).on('circle-animation-end', function(event) {
            if (timer == true) { fundiLojes(rezultatiNeLoj, "Kaloki koha!");}
        });

        return;
    }


   


    function loja() {
        loop();

        $('.kontrollat a.sakt').click(function(event) {
            event.preventDefault();
            if(saktesia == 1) {
                rezultatiNeLoj++;
                $('.rezultatiNeLoj').text(rezultatiNeLoj);
                // if(sound == 1){ createjs.Sound.play("right"); }
                if(sound == 1){ rightSound.play(); }
                loop();
                return;
            } else if (saktesia == 2) {
                // if(sound == 1){ createjs.Sound.play("wrong"); }
                if(sound == 1){ wrongSound.play(); }
                fundiLojes(rezultatiNeLoj, "Duhet te shtypej Jo Sakt");
                return;
            } else {
                alert("Error: Saktesia = 0");
            }
        });

        $('.kontrollat a.pasakt').click(function(event) {
            event.preventDefault();
            if(saktesia == 2) {
                rezultatiNeLoj++;
                $('.rezultatiNeLoj').text(rezultatiNeLoj);
                if(sound == 1){ rightSound.play(); }
                loop();
                return;
            } else if (saktesia == 1) {
                if(sound == 1){ wrongSound.play(); }
                fundiLojes(rezultatiNeLoj, "Duhej te shtypej Sakt");
                return;
            } else if (saktesia == 0) {
                alert("Error: Saktesia = " + saktesia);
            }
        });
    }

    loja();

    return;
}
function fundiLojes(rezultatiNeLoj, mesazhi) {
    // alert("Humbet! Rezultati juaj eshte: "+ rezultatiNeLoj);
    // $('#timer').remove();
    // $('section#loja-classic').fadeOut('fast', function() {
    //     $('section#rezultati').fadeIn('slow');

        // UPDATE High Score in DB

    //     // UPDATE Last Score in DB
    //     // localStorage.lastScore = rezultatiNeLoj;
    //     db.transaction(function(tx) {
    //         tx.executeSql("UPDATE CLASSIC SET value = "+ rezultatiNeLoj +" WHERE id = 2", [], function(tx, res) {
    //             // $('input_highScore').val(res.rows.item(0).value);
    //             updateResults();
    //         });
    //     });
    //     // window.plugins.toast.showShortBottom("Last Score: "+ localStorage.lastScore);

    //     $('.rezultatiFinal').text(rezultatiNeLoj);
    // });
    // return;
    $.ajax({
        url: "ajax/rezultati.html",
        cache: false
    }).done(function( html ) {
        $( "#content" ).html( html );
        if(highScore != "undefined" && rezultatiNeLoj > highScore) {
            db.transaction(function(tx) {
                tx.executeSql("UPDATE CLASSIC SET value = "+ rezultatiNeLoj +" WHERE id = 1", [], function(tx, res) {
                    $('#input_highScore').val(res.rows.value);
                    getResults();
                    // window.plugins.toast.showShortBottom("Highscore Updated: "+ highScore);

                    // Mesazhi per Rekord te ri
                    $('.highScore').fadeIn('slow', function(){
                        $('.highScore .yllat i:first-child').fadeTo( "fast" , 1, function(){
                            $('.highScore .yllat i:nth-child(2)').fadeTo( "fast" , 1, function(){
                                $('.highScore .yllat i:last-child').fadeTo( "fast" , 1);
                            });
                        });
                    });
                });
            });

            var data = {
                score: rezultatiNeLoj,
                leaderboardId: "CgkIy6HVt5oOEAIQAA"
            };
            googleplaygame.submitScore(data);
        }
        $('.rezultatiFinal').text(rezultatiNeLoj);
        $('section#rezultati').fadeIn('slow');


        $('.kontrollat a.back').click(function(event) {
            event.preventDefault();
            startHome();
        });

        $('.kontrollat a.replay').click(function(event) {
            event.preventDefault();
            startGame();
        });
    });
    
}

function rrethNesh(){

    $.ajax({
        url: "ajax/rreth-nesh.html",
        cache: false
    }).done(function( html ) {
        $( "#content" ).html( html );
        $('section#rethNesh').fadeIn('slow');

        $('#backButton').click(function(event) {
            event.preventDefault();
            $('section#rethNesh').fadeOut("slow");
            startHome();
        });
    });
}
    }

// });