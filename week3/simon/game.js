//Note: AI (Codex) was used to update and extend Simon game code. Please see html file for details.
// Beginner note: The four possible button colors for the game.
var buttonColours = ["red", "blue", "green", "yellow"];

// Beginner note: The game’s sequence and the player’s clicks.
var gamePattern = [];
var userClickedPattern = [];

// Beginner note: Track if the game has started and the current level.
var started = false;
var level = 0;

// AI-Generated: ASSIGNMENT ADDITION: Added Practice / Normal / Master modes with lives/replays, mode switching via UI (restart without refresh), instruction UI, and checkpoint celebrations.
// AI-Generated: Mode settings and runtime state.
// Beginner note: These variables control the current game mode and playback rules.
var currentMode = null;
var livesRemaining = 0;
var replaysRemaining = 0;
var isPlayingSequence = false;
var playbackToken = 0;

// AI-Generated: Mode configuration for lives, replay limits, and playback speed.
// Beginner note: Settings for each mode (lives, replays, speed).
//Addition note: added levels: easy and hard modes
var modeSettings = {
  practice: { lives: 3, replays: Infinity, playbackSpeed: 650 },
  normal: { lives: 0, replays: 3, playbackSpeed: 600 },
  master: { lives: 0, replays: 0, playbackSpeed: 350 }
};

// AI-Generated: Checkpoint levels for celebrations.
// Beginner note: Levels where we show a celebration effect.
//Addition note: added levels: easy and hard modes with checkpoints
var checkpointLevels = [5, 10, 15, 20, 100];

// Beginner note: Start the game when any key is pressed.
//Addition note: added levels: easy and hard modes
$(document).keypress(function() {
  // AI-Generated: Keypress start remains supported.
  startGame();
});

// AI-Generated: Mode selection handlers (always enabled).
// Beginner note: Click a mode button to choose a mode.
$(".mode-btn").click(function(event) {
  event.preventDefault();
  var selectedMode = $(this).data("mode");
  setMode(selectedMode);
});

// AI-Generated: Start and replay button handlers.
// Beginner note: Start button begins a new game.
$("#start-button").click(function() {
  startGame();
});

// Beginner note: Replay button replays the current sequence.
$("#replay-button").click(function() {
  handleReplay();
});

// AI-Generated: More info toggle.
// Beginner note: Show or hide the full instructions.
$("#more-info-toggle").click(function() {
  toggleMoreInfo();
});

// Beginner note: Handle clicks on the colored buttons.
$(".btn").click(function() {
  if (!started || isPlayingSequence) {
    return;
  }

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length-1);
});

// Beginner note: Compare the player's input to the game sequence.
function checkAnswer(currentLevel) {

    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gamePattern.length){
        // AI-Generated: Status message for successful level.
        updateStatus("Nice! Next level.");
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      // AI-Generated: Handle mistakes based on mode.
      handleMistake();
    }
}

// Beginner note: Add a new color to the sequence and play it.
function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // AI-Generated: Play full sequence every level.
  if (isCheckpointLevel(level)) {
    triggerCheckpointCelebration(level === 100);
    setTimeout(function () {
      playSequence();
    }, level === 100 ? 900 : 600);
  } else {
    playSequence();
  }
}

// Beginner note: Animate a button press by adding/removing a CSS class.
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

// Beginner note: Play the sound that matches a color.
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// Beginner note: Reset everything back to the initial state.
function startOver() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  isPlayingSequence = false;
  playbackToken++;
  // AI-Generated: Reset UI and unlock mode selection.
  $("#level-title").text("Press Start to begin");
  updateStatus("Press Start to begin");
  setButtonInputEnabled(true);
  updateCounters();
  updateReplayButtonState();
}

// AI-Generated: Start a new game with current mode settings.
// Beginner note: Start a new game if a mode is selected.
function startGame() {
  if (started) {
    return;
  }
  if (!currentMode) {
    updateStatus("Press Start to begin");
    return;
  }
  started = true;
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  livesRemaining = modeSettings[currentMode].lives;
  replaysRemaining = modeSettings[currentMode].replays;
  updateCounters();
  nextSequence();
}

// AI-Generated: Mode selection and UI state with restart.
// Beginner note: Switch modes and restart the game right away.
function setMode(mode) {
  var wasInProgress = started || gamePattern.length > 0 || level > 0;

  currentMode = mode;
  $(".mode-btn").removeClass("selected");
  $("#mode-" + mode).addClass("selected");

  livesRemaining = modeSettings[mode].lives;
  replaysRemaining = modeSettings[mode].replays;

  // AI-Generated: Reset game state immediately on mode change.
  resetGameStateForModeChange();
  updateCounters();

  if (wasInProgress) {
    updateStatus("Mode changed to " + capitalize(mode) + ". Game restarted. Press Start to begin.");
  } else {
    updateStatus("Press Start to begin");
  }
}

// AI-Generated: Play the entire sequence with playback lock.
// Beginner note: Play back the full pattern so the player can watch.
function playSequence() {
  isPlayingSequence = true;
  setButtonInputEnabled(false);
  updateReplayButtonState();
  updateStatus("Watch the sequence...");

  var index = 0;
  var speed = modeSettings[currentMode].playbackSpeed;
  var token = ++playbackToken;

  function playStep() {
    if (token !== playbackToken) {
      return;
    }
    if (index >= gamePattern.length) {
      isPlayingSequence = false;
      setButtonInputEnabled(true);
      updateReplayButtonState();
      updateStatus("Your turn: repeat the pattern.");
      return;
    }
    var color = gamePattern[index];
    $("#" + color).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(color);
    animatePress(color);
    index++;
    setTimeout(playStep, speed);
  }

  playStep();
}

// AI-Generated: Replay current sequence with mode rules.
// Beginner note: Replay the sequence if the rules allow it.
function handleReplay() {
  if (!started || isPlayingSequence || gamePattern.length === 0) {
    return;
  }
  if (currentMode === "master") {
    updateStatus("Replay is not available in Master mode.");
    return;
  }
  if (currentMode === "normal" && replaysRemaining <= 0) {
    updateStatus("No replays left.");
    updateReplayButtonState();
    return;
  }
  if (currentMode === "normal") {
    replaysRemaining--;
    updateCounters();
  }
  playSequence();
}

// AI-Generated: Mistake handling by mode.
// Beginner note: What happens when the player clicks the wrong color.
function handleMistake() {
  playSound("wrong");
  $("body").addClass("game-over");

  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 200);

  if (currentMode === "practice") {
    livesRemaining--;
    updateCounters();
    if (livesRemaining <= 0) {
      $("#level-title").text("Game Over");
      updateStatus("Game over! Press Start to try again.");
      resetGameStateKeepStatus();
    } else {
      updateStatus("Oops! Try again! Lives left: " + livesRemaining);
      userClickedPattern = [];
    }
    return;
  }

  $("#level-title").text("Game Over");
  updateStatus("Game over! Press Start to try again.");
  resetGameStateKeepStatus();
}

// AI-Generated: Status text and counters.
// Beginner note: Update the message shown to the player.
function updateStatus(message) {
  $("#status-message").text(message);
}

// AI-Generated: Show lives and replay counters based on mode.
// Beginner note: Update lives/replay UI based on current mode.
function updateCounters() {
  if (!currentMode) {
    $("#lives-counter").addClass("hidden");
    $("#replay-counter").addClass("hidden");
    $("#master-indicator").addClass("hidden");
    return;
  }

  if (currentMode === "practice") {
    $("#lives-counter").removeClass("hidden").text("Lives: " + livesRemaining);
    $("#replay-counter").removeClass("hidden").text("Replays: Unlimited");
    $("#master-indicator").addClass("hidden");
  } else if (currentMode === "normal") {
    $("#lives-counter").addClass("hidden");
    $("#replay-counter").removeClass("hidden").text("Replays: " + replaysRemaining);
    $("#master-indicator").addClass("hidden");
  } else {
    $("#lives-counter").addClass("hidden");
    $("#replay-counter").addClass("hidden");
    $("#master-indicator").removeClass("hidden").text("No Lives. No Replays");
  }

  updateReplayButtonState();
}

// AI-Generated: Disable or enable the colored buttons during playback.
// Beginner note: Prevent clicks while the sequence is playing.
function setButtonInputEnabled(enabled) {
  if (enabled) {
    $(".btn").removeClass("disabled");
  } else {
    $(".btn").addClass("disabled");
  }
}

// AI-Generated: Update replay button state based on mode and playback.
// Beginner note: Show/hide and enable/disable the Replay button.
function updateReplayButtonState() {
  var canReplay = started && !isPlayingSequence && gamePattern.length > 0;

  if (currentMode === "master") {
    $("#replay-button").addClass("hidden");
    canReplay = false;
  } else {
    $("#replay-button").removeClass("hidden");
  }

  if (currentMode === "normal" && replaysRemaining <= 0) {
    canReplay = false;
  }

  $("#replay-button").prop("disabled", !canReplay);
}

// AI-Generated: Toggle info panel.
// Beginner note: Show/hide the instructions panel and update ARIA.
function toggleMoreInfo() {
  var panel = $("#more-info-panel");
  var isHidden = panel.hasClass("hidden");
  panel.toggleClass("hidden");
  $("#more-info-toggle").attr("aria-expanded", isHidden ? "true" : "false");
  panel.attr("aria-hidden", isHidden ? "false" : "true");
}

// AI-Generated: Simple helper for labels.
// Beginner note: Capitalize a word for nicer text.
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// AI-Generated: Checkpoint helper.
// Beginner note: True when the level is a checkpoint.
function isCheckpointLevel(currentLevel) {
  return checkpointLevels.indexOf(currentLevel) !== -1;
}

// AI-Generated: Visual celebration for checkpoints.
// Beginner note: Create animated dots to celebrate checkpoints.
function triggerCheckpointCelebration(isUltimate) {
  if (isUltimate) {
    updateStatus("Ultimate checkpoint reached! Level 100!");
  } else {
    updateStatus("Checkpoint reached!");
  }

  var container = $("#checkpoint-burst");
  container.empty();

  var burstCount = isUltimate ? 36 : 16;
  var maxDistance = isUltimate ? 160 : 120;

  for (var i = 0; i < burstCount; i++) {
    var dot = $("<span class='burst-dot'></span>");
    var angle = Math.random() * Math.PI * 2;
    var distance = (isUltimate ? 100 : 80) + Math.random() * maxDistance;
    var x = Math.cos(angle) * distance;
    var y = Math.sin(angle) * distance;
    var colors = ["#ffd36e", "#76c7ff", "#b7f5d0", "#ff8fb1", "#ffffff"]; 
    var color = colors[Math.floor(Math.random() * colors.length)];

    if (isUltimate) {
      dot.addClass("ultimate");
    }

    dot.css({
      left: "50%",
      top: "30%",
      "--x": x + "px",
      "--y": y + "px",
      background: color
    });

    container.append(dot);
  }

  setTimeout(function () {
    container.empty();
  }, isUltimate ? 1400 : 900);
}

// AI-Generated: Reset the game on mode change.
// Beginner note: Reset state when switching modes.
function resetGameStateForModeChange() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  isPlayingSequence = false;
  playbackToken++;
  $("#level-title").text("Press Start to begin");
  setButtonInputEnabled(true);
  updateReplayButtonState();
}

// AI-Generated: Reset the game while preserving the current status message.
// Beginner note: Reset state but keep the message text.
function resetGameStateKeepStatus() {
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  isPlayingSequence = false;
  playbackToken++;
  $("#level-title").text("Press Start to begin");
  setButtonInputEnabled(true);
  updateReplayButtonState();
}

// AI-Generated: Initialize default mode without forcing a status change.
// Beginner note: Set the default mode and update counters.
function initializeMode(mode) {
  currentMode = mode;
  $(".mode-btn").removeClass("selected");
  $("#mode-" + mode).addClass("selected");
  livesRemaining = modeSettings[mode].lives;
  replaysRemaining = modeSettings[mode].replays;
  updateCounters();
}

// AI-Generated: Initial UI state.
// Beginner note: Start in Normal mode with the default status.
initializeMode("normal");
updateStatus("Press Start to begin");
updateReplayButtonState();
