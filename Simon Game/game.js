
var userCLickPattern =[];
var gamePattern = [];

var buttonColours = ["red", "blue", "green", "yellow"];
var randomNumber = 0;
var level = 0;
var length = 0;

function nextSequence() {
  randomNumber = Math.round(Math.random() * 3);
  randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);
  makesound(buttonColours[randomNumber]);
  console.log(buttonColours[randomNumber]);
  $("#"+buttonColours[randomNumber]).fadeOut(100).fadeIn(100);
  level++;
  ChangeLevel(level);
}

var randomChosenColour = 0;
var userChosenColor = 0;


$(".btn").on("click", function () {
  var buttonClicked = this.id;
  Click(buttonClicked);
  makesound(buttonClicked);
  animatePress(buttonClicked);
  
  

});


function Click(colour) {
  userChosenColor = colour;
  userCLickPattern.push(userChosenColor);
  length = userCLickPattern.length - 1;
  checkAnswer(length);
  
}

function checkAnswer(currentLevel) {
    if (userCLickPattern[currentLevel] === gamePattern[currentLevel]){
      console.log("success");

        if (userCLickPattern.length === gamePattern.length){
 
          setTimeout(function () {
            nextSequence();
          }, 1000);
          userCLickPattern=[];
  
        }
    }
    else {
      console.log("wrong");
      $("body").addClass( "game-over");
      setTimeout(() => {
        $("body").removeClass( "game-over");
      }, 200);
      $("h1").text("Game Over. Press any key to restart");
      startOver();
    }
}

function startOver() {
    level=0;
    gamePattern=[];
    userCLickPattern=[];
    length=0;
    $(document).keydown( function(){nextSequence();
      setTimeout(() => {
        $(document).off("keyup keydown keypress");
        
      }, 10);
    
    });

}
 
function makesound(key) {
  switch (key) {
    case "green":
      var green = new Audio("sounds/green.mp3");
      green.play();
      break;

    case "red":
      var red = new Audio("sounds/red.mp3");
      red.play();
      break;

    case "yellow":
      var yellow = new Audio("sounds/yellow.mp3");
      yellow.play();
      break;

    case "blue":
      var blue = new Audio("sounds/blue.mp3");
      blue.play();
      break;

    default:
      break;
  }
}



function animatePress(currentColour) {
  $("#"+currentColour).addClass("pressed");
  setTimeout(() => {
    $("#"+currentColour).removeClass( "pressed");
  }, 100);
 }



$(document).keydown( function(){nextSequence();
  setTimeout(() => {
    $(document).off("keyup keydown keypress");
    
  }, 10);

});

 


function ChangeLevel(level){
  $("h1").text("Level "+level);
}