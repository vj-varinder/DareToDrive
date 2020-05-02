$(function() {

    var checkGamePause = false;

    var otherCarsspeed = 0.4;
    var lineSpeed = 0.7;
    var coinSpeed = 0.5;
    var spikeSpeed = 0.3;
    var spikeCount = 1;

    var availableWidth = $(window).width();
    var availableHeight = $(window).height();
    var playerCar;
    var containerG;
    var body;

    var carCount = 1;
    var lineCount = 1;
    var coinCount = 1;

    var scoreValue = 0;
    var timeValue;
    var coinValue = 0;
    // var gameEndMode = ["GAMEOVER", "TIMEOUT", "PAUSE"];
    var gameEndMode = {
        GAMEOVER: "GO",
        TIMEOUT: "TO",
        PAUSE: "P"
    };
    var currentEndMode;
    var gameInteruptPage;

    // for avoiding spelling mistake and making task easy.
    var gameLevels = {
        LEVEL1: "beginner",
        LEVEL2: "moderate",
        LEVEL3: "expert",
        NONE: "none"
    };
    var currentLevel;
    var scale;

    $(document).ready(function() {

        playerCar = $("#car");
        body = $("body");
        containerG = $("#container");
        gameInteruptPage = $("#gameInteruptPage");
        message = $("#message");
        currentLevel = gameLevels.NONE;
        otherCarsspeed = 0.4;
        lineSpeed = 0.7;
        coinSpeed = 0.5;
        spikeSpeed = 0.3;
        availableWidth = $(window).width();
        availableHeight = $(window).height();

        /**
         * Below code is for resizing the game on different devices.
         */
        scale =1;
        if(availableHeight<1000)
        {
            scale = 0.7;
        }
        $(".displayNumber").css("transform","scale("+scale+")");
        $(".car").css("transform","scale("+scale+")");
        $(".line").css("transform","scale("+scale+")");

        /**
        * this will be called on resizing.
         */

        $(window).resize(function() {
            console.log("Resize");
            scale = 1;
            availableWidth = $(window).width();
            availableHeight = $(window).height();
            if(availableHeight<1000)
            {
                scale = 0.7;
            }
            $(".displayNumber").css("transform","scale("+scale+")");
            $(".car").css("transform","scale("+scale+")");

        });

        /*
            This is for playing background music.
         */
        var back_music = document.getElementById("back_music");
        // then we can call .play() / .pause() on it
        back_music.play();

        // On the tap of play button of home Page.
        $("#play").onTap(function() {
            // Id of div tag is exteracted.
            var parentId = $("#play").parents().eq(1).attr('id');
            // Then, parent page is making hidden
            $("#" + parentId).removeClass("show");
            $("#menuPage").addClass("show");
            // Menu Page is displayed.
        });

        // On the tap of beginner level button.
        $("#beginner").onTap(function() {
            currentLevel = gameLevels.LEVEL1;

            // Hiding of Menu page
            $("#menuPage").removeClass("show");
            // Level 1 is displayed to user
            $("#playPage").addClass("show");
            // Level1 functionality and appearance is set.
            body.css("background-color", "#ab401f");
            $("#coin_div").addClass("hideDiv");
            $("#levelNumDiv").html("Level 1");
            moveOtherCars();
            moveRoad();

        });

        // On the tap of moderate level button.
        $("#moderate").onTap(function() {
            currentLevel = gameLevels.LEVEL2;

            // Hiding of Menu page
            $("#menuPage").removeClass("show");
            // Level 2 is displayed to user
            $("#playPage").addClass("show");
            // Level2 functionality and appearance is set.
            body.css("background-color", "#256aa0");
            // Coins introduced in this level
            if ($("#coin_div").hasClass("hideDiv")) {
                $("#coin_div").removeClass("hideDiv");
            }
            $("#levelNumDiv").html("Level 2");
            moveOtherCars();
            moveRoad();
            moveCoins();

        });

        // On the tap of expert level button.
        $("#expert").onTap(function() {
            currentLevel = gameLevels.LEVEL3;

            $("#menuPage").removeClass("show");
            $("#playPage").addClass("show");

            // setting functionality and appearance of level 3
            body.css("background-color", "#336600");
            // making coins available
            if ($("#coin_div").hasClass("hideDiv")) {
                $("#coin_div").removeClass("hideDiv");
            }
            // Displaying level number on the screen.
            $("#levelNumDiv").html("Level 3");
            moveOtherCars();
            moveRoad();
            moveCoins();
            // Pointed objects introduced for the increasing difficulty.
            moveSprikes();
            // Speed is going to increase automatically util collision occurs.
            incrementSpeed();
        });

        // On Tap of help button on home page
        // help page is displayed.
        $("#help").onTap(function() {
            $("#helpPage").addClass("show");
        });

        // This is in game page so that user can view help
        // wile playing game.
        $("#help_div").onTap(function() {
            // First game is paused.
            currentEndMode = gameEndMode.PAUSE;
            gameOver(currentEndMode);
            // display help page.
            $("#helpPage").addClass("show");
        });

        // On tap of OK button of help page.
        $("#helpOk").onTap(function() {
            // Help page disappeared.
            $("#helpPage").removeClass("show");

            // If help page was not accessed from the home page and
            // accessed from the game page, only then game should resume.
            if ((currentLevel === gameLevels.NONE)) {

            } else {
                gameResume();
            }
        });

        // On tap of credit button on home page
        $("#credit").onTap(function() {

            $("#licensepage").css("background-size", availableWidth + "px" + availableHeight + "px");
            $("#licensepage").css("width", availableWidth + "px");
            $("#licensepage").css("height", availableHeight + "px");
            // credit page displayed.
            $("#licensePage").addClass("show");
        });

        // On the tap of OK button of credit page
        $("#creditOk").onTap(function() {
            // credit page disappeared
            $("#licensePage").removeClass("show");
        });


        playerCar.autoBounceOff(true);

        // on collision of player car with other objects
        playerCar.onCollision(function(object) {

            //  If collision happens with coin
            if (object.hasClass("coin")) {

                //  play the background music of coin
                var coin = document.getElementById("coin");
                coin.play();

                // coin is removed.
                object.remove();

                // coin counter is increased by one
                coinValue++;

                // coin value is incresed
                $("#coinValue").html(coinValue);

            } else  {

                // If colliding object is another car or spiked object.
                // Then background music is played.
                var crash = document.getElementById("crash");
                crash.play();

                //  Game get over.
                currentEndMode = gameEndMode.GAMEOVER;
                gameOver(currentEndMode);
            }

        });

        // On the click of back button on the menu page for different levels
        $("#backButton").onTap(function() {
            // menuPage is hidden
            $("#menuPage").removeClass("show");
            // home page displayed.
            $("#homePage").addClass("show");
        });

        // on tap of left arrow on gaming page to move the car left side.
        $("#moveLeft").onTap(function() {
            //  This will work only when game is not paused or over.
            if (checkGamePause === false) {

                // Music played for taping.
                var tap = document.getElementById("tap");
                tap.play();

                // Update the left position of player's car by the value.
                // That value is 1/10th of the availableWidth of screen.
                playerCar.css("left", playerCar.position().left - Math.floor(containerG.width() / 10) + "px");

            }
        });

        // On the tap of pause button
        $("#pauseDiv").onTap(function() {
            // game is paused and value passed to gameOver method.
            currentEndMode = gameEndMode.PAUSE;
            gameOver(currentEndMode);
        });

        // on tap of right arrow on gaming page to move the car right side.
        $("#moveRight").onTap(function() {
            // This will work only when game is not paused or over.
            if (checkGamePause === false) {

                document.getElementById("tap").play();

                playerCar.css("left", playerCar.position().left + Math.floor(containerG.width() / 10) + "px");
            }
        });

        // This is resuming the game after play.
        $("#playButton").onTap(function() {
            gameResume();
        });

        // this is resetting the game.
        $("#resetButton").onTap(function() {
            location.reload();
        });

        // For mute the sounds playing in background.
        $("#soundOff").onTap(function() {
            var back_music = document.getElementById("back_music");
            // then we can call .play() / .pause() on it
            back_music.pause();
        });

        // For playing background music.
        $("#soundOn").onTap(function() {
            var back_music = document.getElementById("back_music");
            // then we can call .play() / .pause() on it
            back_music.play();
        });

        // For creating the others cars.
        function carsComing() {
            // This will work only when game is not paused or over.
            if (checkGamePause === false) {

                containerG.append("<div id='car" + carCount + "' class='otherCar car'>       <div class='f_glass'></div>                    <div class='b_glass'></div>                    <div class='f_light_l'></div>                    <div class='f_light_r'></div>                    <div class='f_tyre_l'></div>                    <div class='f_tyre_r'></div>                    <div class='b_tyre_l'></div>                    <div class='b_tyre_r'></div> </div>");
                var carCreated = $("#car" + carCount);
                // moving car from top of scrren
                carCreated.moveTo(180).speed(otherCarsspeed).css("top", "0px");
                scale =1;
                if(availableHeight<1000)
                {
                    scale = 0.7;
                }
                carCreated.css("transform","scale("+scale+")");
                // left position of cars is set by random function.
                carCreated.css("left", random(carCreated.width(), containerG.width() - carCreated.width()) + "px");
                carCount++;

                scoreValue++;
                // score displayed
                $("#scoreValue").html(scoreValue);
            }
        }

        // For creating divider lines on the road
        function linesComing() {
            // This will work only when game is not paused or over.
            if (checkGamePause === false) {

                containerG.append("<div id='line" + lineCount + "' class='line'></div>");
                var lineCreated = $("#line" + lineCount);
                scale =1;
                if(availableHeight<1000)
                {
                    scale = 0.7;
                }
                lineCreated.css("transform","scale("+scale+")");
                lineCreated.moveTo(180).speed(lineSpeed).css("top", "-5px");

                lineCount++;
            }
        }

        // For creating coins on the gaming screen.
        function coinsComing() {
            // This will work only when game is not paused or over.
            if (checkGamePause === false) {
                containerG.append("<div id='coin" + coinCount + "' class='coin'></div>");
                var coinCreated = $("#coin" + coinCount);
                scale =1;
                if(availableHeight<1000)
                {
                    scale = 0.7;
                }
                coinCreated.css("transform","scale("+scale+")");
                coinCreated.moveTo(180).speed(coinSpeed).css("top", "-5px");
                coinCreated.css("left", random(coinCreated.width(), containerG.width() - coinCreated.width()) + "px");

                coinCount++;
            }
        }

        // For creating spike objects in the screen.
        function spikesComing() {
            // This will work only when game is not paused or over.
            if (checkGamePause === false) {
                containerG.append("<div id='spike" + spikeCount + "' class='spike'></div>");
                var spikeCreated = $("#spike" + spikeCount);
                scale =1;
                if(availableHeight<1000)
                {
                    scale = 0.7;
                }
                spikeCreated.css("transform","scale("+scale+")");
                spikeCreated.moveTo(180).speed(spikeSpeed).css("top", "-5px");
                spikeCreated.css("left", random(spikeCreated.width(), containerG.width() - spikeCreated.width()) + "px");

                spikeCount++;
            }
        }

        // for introducing each car after 2 seconds
        function moveOtherCars() {
            setInterval(carsComing, 2000);
        }

        // for creating each line on the road after less than a second.
        function moveRoad() {
            setInterval(linesComing, 800);
        }

        // for creating coins after 3 sec.
        function moveCoins() {
            setInterval(coinsComing, 3000);
        }

        //  for creating spike objects after 4 sec.
        function moveSprikes() {
            setInterval(spikesComing, 4000);
        }

        // for incremeting speed of game
        function incrementSpeed() {
            setInterval(function() {
                // This will work only when game is not paused or over.
                if (checkGamePause === false) {
                    spikeSpeed = spikeSpeed + 0.05;
                    otherCarsspeed = otherCarsspeed + 0.05;
                    coinSpeed = coinSpeed + 0.05;
                    // console.log("spike,car,coin: "+spikeSpeed+" "+otherCarsspeed+" "+coinSpeed);
                }
            }, 4000);

        }

        // When game over happen, it takes two modes
        function gameOver(endMode) {
            // page is displayed.
            gameInteruptPage.addClass("show");
            pause(true);
            checkGamePause = true;

            if (endMode == gameEndMode.GAMEOVER) {

                message.html("GAME OVER");
                message.css("left", "35%");

                $("#playButton").addClass("hideDiv");
            }
            else if (endMode == gameEndMode.PAUSE) {

                //whether the game is paused.
                message.html("PAUSED");
                message.css("left", "38%");
                if ($("#playButton").hasClass("hideDiv")) {
                    $("#playButton").removeClass("hideDiv");
                }

            }

        }

        // when game resumes.
        function gameResume() {
            // objects starts moving again
            pause(false);
            checkGamePause = false;
            // pause page hidden.
            gameInteruptPage.removeClass("show");
        }
    });

});
