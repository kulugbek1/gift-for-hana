const confetti = document.getElementById("confetti");
const starsBg = document.getElementById("starsBg");
const reveal = document.getElementById("reveal");
const partyBtn = document.getElementById("partyBtn");
const letter = document.getElementById("letter");
const letterBody = document.getElementById("letterBody");
const giftBtn = document.getElementById("giftBtn");
const giftStatus = document.getElementById("giftStatus");
const giftSpark = giftBtn.querySelector(".gift-spark");
const packRow = document.getElementById("packRow");
const packStatus = document.getElementById("packStatus");
const suitcaseFill = document.getElementById("suitcaseFill");
const taskList = document.getElementById("taskList");
const taskProgress = document.getElementById("taskProgress");

const note =
  "Hana, happy birthday! i wish u achive all your goals in this age and also finally u will finish your university and i hope from day one of this age (idk is it correct but anyways) starts with greaaaaaat moments and with a good luck. One day we visit to Japan for sure!!! at least i hope. and we will beee soo fluent in japanese even japanese people start thinking that they are not japanese";

const packItems = [
  {
    label: "Passport",
    message: "Passport packed. Tokyo stamps loading… someday.",
  },
  {
    label: "Snacks",
    message: "Emergency snacks secured. Airport hunger: defeated.",
  },
  {
    label: "Camera",
    message: "Camera in. Those neon streets won’t photograph themselves.",
  },
  {
    label: "Phrasebook",
    message: "Phrasebook packed. Fluent mode: work in progress.",
  },
  {
    label: "Sneakers",
    message: "Walking shoes ready. Kyoto will take a lot of steps.",
  },
];

const discordTasks = [
  "Watch a horror movie together (Discord stream or synced tabs)",
  "Play video games together",
  "Just chill and talk about anything",
];

const beat = 0.34;
const HAPPY_BIRTHDAY = [
  [261.63, beat * 0.75],
  [261.63, beat * 0.25],
  [293.66, beat],
  [261.63, beat],
  [349.23, beat],
  [329.63, beat * 2],

  [261.63, beat * 0.75],
  [261.63, beat * 0.25],
  [293.66, beat],
  [261.63, beat],
  [392.0, beat],
  [349.23, beat * 2],

  [261.63, beat * 0.75],
  [261.63, beat * 0.25],
  [523.25, beat],
  [440.0, beat],
  [349.23, beat],
  [329.63, beat],
  [293.66, beat * 2],

  [466.16, beat * 0.75],
  [466.16, beat * 0.25],
  [440.0, beat],
  [349.23, beat],
  [392.0, beat],
  [349.23, beat * 2],
];

const SONG_LENGTH = HAPPY_BIRTHDAY.reduce((sum, [, d]) => sum + d, 0) + 0.6;

let audioCtx = null;
let musicTimer = null;
let partyRainTimer = null;
let typingTimer = null;

function getAudioCtx() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!audioCtx) {
    audioCtx = new AudioCtx();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

function playTone(ctx, frequency, start, duration) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    start + Math.max(duration - 0.04, 0.05)
  );

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function scheduleHappyBirthday() {
  const ctx = getAudioCtx();
  if (!ctx) return;

  let time = ctx.currentTime + 0.05;
  HAPPY_BIRTHDAY.forEach(([freq, duration]) => {
    playTone(ctx, freq, time, duration);
    time += duration;
  });
}

function startBirthdayMusic() {
  stopBirthdayMusic();
  scheduleHappyBirthday();
  musicTimer = window.setInterval(scheduleHappyBirthday, SONG_LENGTH * 1000);
}

function stopBirthdayMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }

  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
  }
}

function startPartyRain() {
  stopPartyRain();
  partyRainTimer = window.setInterval(() => {
    spawnBits(8, { burst: true, originX: 20 + Math.random() * 60 });
  }, 900);
}

function stopPartyRain() {
  if (partyRainTimer !== null) {
    window.clearInterval(partyRainTimer);
    partyRainTimer = null;
  }
}

function spawnBits(count, { burst = false, originX } = {}) {
  const maxBits = 120;
  while (confetti.childElementCount > maxBits) {
    confetti.firstElementChild.remove();
  }

  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement("span");
    bit.className = burst ? "bit burst" : "bit";
    bit.style.left =
      originX !== undefined
        ? `${originX + (Math.random() * 20 - 10)}%`
        : `${Math.random() * 100}%`;
    bit.style.setProperty("--dx", `${Math.random() * 80 - 40}px`);
    bit.style.animationDuration = burst
      ? `${2.2 + Math.random() * 2}s`
      : `${7 + Math.random() * 8}s`;
    bit.style.animationDelay = burst
      ? `${Math.random() * 0.25}s`
      : `${Math.random() * 6}s`;
    confetti.appendChild(bit);

    if (burst) {
      window.setTimeout(() => bit.remove(), 5000);
    }
  }
}

function spawnFloatingStars(count) {
  for (let i = 0; i < count; i += 1) {
    const star = document.createElement("span");
    star.className = "float-star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.bottom = `${-10 - Math.random() * 30}%`;
    star.style.animationDuration = `${12 + Math.random() * 14}s`;
    star.style.animationDelay = `${Math.random() * 10}s`;
    const size = `${8 + Math.random() * 10}px`;
    star.style.width = size;
    star.style.height = size;
    starsBg.appendChild(star);
  }
}

function typeNote(text) {
  if (typingTimer !== null) {
    window.clearTimeout(typingTimer);
    typingTimer = null;
  }

  letterBody.textContent = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  letterBody.appendChild(cursor);

  let index = 0;
  const tick = () => {
    if (index < text.length) {
      cursor.insertAdjacentText("beforebegin", text[index]);
      index += 1;
      typingTimer = window.setTimeout(tick, 22);
    } else {
      cursor.remove();
      typingTimer = null;
    }
  };
  tick();
}

function replayGiftSpark() {
  giftSpark.classList.remove("sparking");
  void giftSpark.offsetWidth;
  giftSpark.classList.add("sparking");
}

function buildPackList() {
  let packed = 0;

  packItems.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pack-btn";
    btn.textContent = item.label;
    btn.setAttribute("aria-label", `Pack ${item.label}`);

    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      btn.disabled = true;
      packed += 1;
      suitcaseFill.style.height = `${(packed / packItems.length) * 52}px`;
      packStatus.textContent = item.message;

      if (packed === packItems.length) {
        packStatus.textContent =
          "Bag full. Japan trip officially on the wishlist.";
        spawnBits(24, { burst: true, originX: 50 });
      } else {
        spawnBits(10, { burst: true, originX: 50 });
      }
    });

    packRow.appendChild(btn);
  });
}

function updateTaskProgress(doneCount) {
  const total = discordTasks.length;
  if (doneCount === 0) {
    taskProgress.textContent = `0 / ${total} done — hop on Discord and start`;
  } else if (doneCount === total) {
    taskProgress.textContent = `${total} / ${total} done — long-distance legends.`;
    spawnBits(28, { burst: true, originX: 50 });
  } else {
    taskProgress.textContent = `${doneCount} / ${total} done — keep the call going`;
  }
}

function buildTaskList() {
  let doneCount = 0;

  discordTasks.forEach((task) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "task-btn";
    btn.innerHTML =
      '<span class="task-check" aria-hidden="true"></span><span class="task-label"></span>';
    btn.querySelector(".task-label").textContent = task;
    btn.setAttribute("aria-pressed", "false");

    btn.addEventListener("click", () => {
      const nowDone = !btn.classList.contains("done");
      btn.classList.toggle("done", nowDone);
      btn.setAttribute("aria-pressed", String(nowDone));
      doneCount += nowDone ? 1 : -1;
      updateTaskProgress(doneCount);
      if (nowDone) {
        spawnBits(8, { burst: true, originX: 50 });
      }
    });

    taskList.appendChild(btn);
  });
}

spawnBits(18);
spawnFloatingStars(10);
buildPackList();
buildTaskList();

reveal.addEventListener("click", () => {
  letter.hidden = false;
  typeNote(note);
  letter.scrollIntoView({ behavior: "smooth", block: "start" });
  spawnBits(18, { burst: true, originX: 50 });
  reveal.textContent = "Have a good one";
  reveal.disabled = true;
});

partyBtn.addEventListener("click", () => {
  document.body.classList.toggle("party");
  const on = document.body.classList.contains("party");
  partyBtn.textContent = on ? "Chill mode" : "Party mode";
  partyBtn.setAttribute("aria-pressed", String(on));
  spawnBits(on ? 40 : 12, { burst: true, originX: 50 });

  if (on) {
    startBirthdayMusic();
    startPartyRain();
  } else {
    stopBirthdayMusic();
    stopPartyRain();
  }
});

giftBtn.addEventListener("click", () => {
  if (giftBtn.classList.contains("open")) {
    giftBtn.classList.remove("open");
    giftSpark.classList.remove("sparking");
    giftStatus.textContent = "Still wrapped — tap to open";
    giftBtn.setAttribute("aria-label", "Open the birthday gift");
    return;
  }

  giftBtn.classList.add("open");
  replayGiftSpark();
  giftStatus.textContent = "Opened! Inside: good vibes and a great year ahead.";
  giftBtn.setAttribute("aria-label", "Close the birthday gift");
  spawnBits(28, { burst: true, originX: 50 });
});

window.addEventListener("pagehide", () => {
  stopBirthdayMusic();
  stopPartyRain();
});
