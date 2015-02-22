/* Databaza Taxi */
// var db = openDatabase('ngjyrat', '1.0', 'Loja Ngjyrat - Databaza', 3 * 1024 * 1024);
var db = window.sqlitePlugin.openDatabase({name: "ngjyrat.db", location: 1})

/* Insertimi ne Databaze */
db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS CLASSIC (id unique, type, value)');
    tx.executeSql('INSERT INTO CLASSIC (id, type, value) VALUES (1, "highScore", 0)');
    tx.executeSql('INSERT INTO CLASSIC (id, type, value) VALUES (2, "lastScore", 0)');
});