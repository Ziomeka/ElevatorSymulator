$(function () {

    function validateRange() {
        var wartosc = 0;
        var selector='';
        for (var i = 1; i <= 5; i++) {
            selector = "#p" + i;
            console.log(selector);
            wartosc = Number($(selector).val());
            if (wartosc > 20 || wartosc < 0) {
                return false;
            }
        }
        return true;
    };

    var get_data = function () {
        var winda = [0, 0, 0, 0, 0, 0];
        winda[1] = Math.abs(Number($("#p1").val()));
        winda[2] = Math.abs(Number($("#p2").val()));
        winda[3] = Math.abs(Number($("#p3").val()));
        winda[4] = Math.abs(Number($("#p4").val()));
        winda[5] = Math.abs(Number($("#p5").val()));
        return winda;
    };

    var algorytmMaxPietro = function (winda) {
        var rozkladPasazerow = JSON.parse(JSON.stringify(winda));
        var algorytm = [{ pietro: 0, osoby: 0 }];
        var max = max_pietro(rozkladPasazerow);
        var osobyAkt = 0;
        var pietroJazdy = 0;
        var liczbaOsobDoZabrania = 0;

        function max_pietro(x) {
            var i = 5;
            while (x[i] <= 0) {
                i--;
            }
            return i;
        };

        while (max > 0) {
            pietroJazdy = max;
            if (8 - osobyAkt > rozkladPasazerow[max]) {
                liczbaOsobDoZabrania = rozkladPasazerow[max];
                console.log(pietroJazdy + " " + liczbaOsobDoZabrania);
                algorytm.push({
                    pietro: pietroJazdy,
                    osoby: liczbaOsobDoZabrania
                });
                osobyAkt = osobyAkt + rozkladPasazerow[max];
                rozkladPasazerow[max] = 0;
            }
            else {
                liczbaOsobDoZabrania = 8 - osobyAkt;
                console.log(pietroJazdy + " " + liczbaOsobDoZabrania);
                algorytm.push({
                    pietro: pietroJazdy,
                    osoby: liczbaOsobDoZabrania
                });
                rozkladPasazerow[max] = rozkladPasazerow[max] - (8 - osobyAkt);
                pietroJazdy = 0;
                liczbaOsobDoZabrania = 8;
                console.log(pietroJazdy + " " + liczbaOsobDoZabrania);
                algorytm.push({
                    pietro: pietroJazdy,
                    osoby: liczbaOsobDoZabrania
                });
                osobyAkt = 0;
            };
            max = max_pietro(rozkladPasazerow);
        }
        pietroJazdy = 0;
        liczbaOsobDoZabrania = osobyAkt;
        if (algorytm[algorytm.length - 1].pietro !== 0) {
            algorytm.push({
                pietro: pietroJazdy,
                osoby: liczbaOsobDoZabrania
            });
        }
        return algorytm;

    };

    var symulatorWindy = function (algorytm, rozklad) {
        var pietro = 0;
        var czas = 0;
        var osobyOgolem = 0;
        var droga = 0;

        var rysujLudki = function (ileLudkow) {
            $(".ludek").remove();
            for (var i = 0; i <= 5; i++) {
                numerPietra = "#pietro" + i;
                for (j = 0; j < rozklad[i]; j++) {
                    div = '<div class="ludek"></div>';
                    $(numerPietra).append(div);
                };
            };
        };

        var draw_move = function (akt_pietro) {
            $('.pietro').removeClass('winda open');
            $('.pietro').addClass('drzwi');
            $($('.szyb').children().get(5 - akt_pietro)).find(">:first-child").addClass('winda');
        };

        var draw_stop = function (akt_pietro) {
            $('.pietro').removeClass('winda open');
            $('.pietro').addClass('drzwi');
            $($('.szyb').children().get(5 - akt_pietro)).find(">:first-child").addClass('open');
        };

        var animateResults = function (aktPietro, text, animate) {
            return function () {
                $(".result").append(text);
                animate(aktPietro);
            }
        };

        var usunLudki = function (text) {
            return function () {
                $(text).remove();
            }
        };
        var wstawLudki = function (text) {
            return function () {
                $(text).append('<div class="ludek"></div>');
            }
        };

        var pietro_w_gore = function () {
            czas = czas + 1;
            pietro = pietro + 1;
            setTimeout(animateResults(pietro, "<p>Jazda  w górę: piętro " + pietro + "</p>", draw_move), czas * 1000);
        };

        var pietro_w_dol = function () {
            czas = czas + 1;
            pietro = pietro - 1;
            setTimeout(animateResults(pietro, "<p>Jazda  w dół: piętro " + pietro + "</p>", draw_move), czas * 1000);
        };

        var stop = function (ile, co) {
            setTimeout(animateResults(pietro, "<p>Postój:" + co + ": " + ile + "</p>", draw_stop), czas * 1000);
            czas = czas + 1;

            if (co === "Wsiada") {
                for (var i = 1; i <= ile; i++) {
                    czas = czas + 0.5;
                    setTimeout(usunLudki("#pietro" + pietro + " div:nth-child(2)"), czas * 1000);
                }
            }
            if (co === "Wysiada") {
                for (var i = 1; i <= ile; i++) {
                    czas = czas + 0.5;
                    setTimeout(wstawLudki("#pietro" + pietro), czas * 1000);
                }
            }
        };

        var jazda = function (na_pietro) {
            if (na_pietro > pietro) {
                for (var i = pietro + 1; i <= na_pietro; i++) {
                    pietro_w_gore();
                }
            }
            else if (na_pietro < pietro) {
                for (var i = pietro - 1; i >= na_pietro; i--) {
                    pietro_w_dol();
                }
            }
        };

        var sekwencja = function (sek) {
            rysujLudki(rozklad);

            for (var i = 1; i < sek.length; i++) {
                console.log("sekwencja " + sek.length)
                jazda(sek[i].pietro);
                if (sek[i].pietro === 0) {
                    stop(sek[i].osoby, "Wysiada");
                }
                else {
                    stop(sek[i].osoby, "Wsiada");
                };
            }

        };

        var wszystkieOsoby = function (ileLudkow) {
            var zliczaj = 0;
            for (var i = 0; i < ileLudkow.length; i++) {
                zliczaj = zliczaj + ileLudkow[i];
            }
            return zliczaj
        };

        var sumarycznaDroga = function (sek) {
            var zliczaj = 0;
            for (var i = 1; i < sek.length; i++) {
                zliczaj = zliczaj + (Math.abs(sek[i].pietro - sek[i - 1].pietro));
            }
            return zliczaj
        }

        //var run = function () {
        $(".result").empty()
        sekwencja(algorytm);
        $("#run").attr("disabled", true);

        $("#czas").html(czas);

        droga = sumarycznaDroga(algorytm);
        $("#droga").html(droga);

        osobyOgolem = wszystkieOsoby(rozklad);
        $("#osoby").html(osobyOgolem);

        var czasObslugi = czas / osobyOgolem;
        $("#czasObslugi").html(czasObslugi);


        setTimeout(function () { $("#run").attr("disabled", false); }, czas * 1000);
        setTimeout(function () { draw_move(0); }, czas * 1000);
        //};

        //run();


    };

    $("#run").click(function () {
        var valid=validateRange();
        if (valid){
        var daneUzytkownika = get_data();
        var sekwencjaRuchu = algorytmMaxPietro(daneUzytkownika);
        symulatorWindy(sekwencjaRuchu, daneUzytkownika);
    }
    else
    {
        alert('Liczba pasażerów musi mieścić się w przedziale <0,20>')
    }
    });

});


