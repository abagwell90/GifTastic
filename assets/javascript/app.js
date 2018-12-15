$(document).ready(function () {

    var topics = ["Rocket Ship", "The Moon", "Eclipse", "Saturn", "Pluto", "Galaxy", "Nebula", "Space Ship", "Astronaut"];

    function displaySpaceStuff() {
        var space = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + space + "&api_key=mePpseQoZWWEY5RregXq0iDwpYlq2U9J&limit=10";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            $("#space-value").empty();

            for (var i = 0; i < response.data.length; i++) {
                var space = $("<div class='spaceGif'>");
                var rating = response.data[i].rating;
                var picRating = $("<p>").text("Rating: " + rating);
                var picStill = response.data[i].images.fixed_height_still.url;
                var picAnimate = response.data[i].images.fixed_height.url;
                var image = $("<img>").addClass("image").attr("src", picStill).attr("data-still", picStill).attr("data-animate", picAnimate).attr("data-state", "still");

                space.append(image);
                space.append(picRating);

                if (rating === 'pg' || rating === 'g') {
                    space.append(image);
                    $("#space-value").append(space);
                }
            }

            $(".image").on("click", function () {
                var state = $(this).attr("data-state");

                if (state === "still") {
                    $(this).attr("src", $(this).attr("data-animate"));
                    $(this).attr("data-state", "animate");
                } else {
                    $(this).attr("src", $(this).attr("data-still"));
                    $(this).attr("data-state", "still");
                }
            });
        });
    }

    function myButtons() {
        $("#myButtons").empty();
        for (var i = 0; i < topics.length; i++) {
            var z = $("<button>");
            z.addClass("spaceClass");
            z.attr("data-name", topics[i]);
            z.text(topics[i]);
            $("#myButtons").append(z);
        }
    }

    $("#spaceTheme").on("click", function (event) {
        event.preventDefault();
        var space = $("#space-input").val().trim();
        topics.push(space);
        $("#space-input").val(" ");
        myButtons();
    });

    $(document).on("click", ".spaceClass", displaySpaceStuff);
    myButtons();
});



//noting that code below is not my code -Andrew. This is for animated header. Citing code below:
//Traveling through Space a Pen By @ CopyRight Chris: https://codepen.io/chrisyboy53/pen/oXZzQb 

var canvas = document.getElementById('canvas');
var flr = Math.floor;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var halfw = canvas.width / 2,
    halfh = canvas.height / 2,
    step = 2,
    warpZ = 12,
    speed = 0.075;
var stampedDate = new Date();

var ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function rnd(num1, num2) {
    return flr(Math.random() * num2 * 2) + num1;
}

function getColor() {
    return 'hsla(200,100%, ' + rnd(50, 100) + '%, 1)';
}

var star = function () {
    var v = vec3.fromValues(rnd(0 - halfw, halfw), rnd(0 - halfh, halfh), rnd(1, warpZ));


    this.x = v[0];
    this.y = v[1];
    this.z = v[2];
    this.color = getColor();


    this.reset = function () {
        v = vec3.fromValues(rnd(0 - halfw, halfw), rnd(0 - halfh, halfh), rnd(1, warpZ));

        this.x = v[0];
        this.y = v[1];
        this.color = getColor();
        vel = this.calcVel();
    }

    this.calcVel = function () {

        return vec3.fromValues(0, 0, 0 - speed);
    };

    var vel = this.calcVel();

    this.draw = function () {
        vel = this.calcVel();
        v = vec3.add(vec3.create(), v, vel);
        var x = v[0] / v[2];
        var y = v[1] / v[2];
        var x2 = v[0] / (v[2] + speed * 0.50);
        var y2 = v[1] / (v[2] + speed * 0.50);

        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (x < 0 - halfw || x > halfw || y < 0 - halfh || y > halfh) {
            this.reset();
        }
    };

}

var starfield = function () {
    var numOfStars = 250;

    var stars = [];

    function _init() {
        for (var i = 0, len = numOfStars; i < len; i++) {
            stars.push(new star());
        }
    }

    _init();

    this.draw = function () {
        ctx.translate(halfw, halfh);

        for (var i = 0, len = stars.length; i < len; i++) {
            var currentStar = stars[i];

            currentStar.draw();
        }
    };

}

var mStarField = new starfield();

function draw() {

    // make 5 seconds
    var millSeconds = 1000 * 10;

    var currentTime = new Date();

    speed = 0.025;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    mStarField.draw();

    window.requestAnimationFrame(draw);
}

draw();

window.onresize = function () {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    halfw = canvas.width / 2;
    halfh = canvas.height / 2;
};


