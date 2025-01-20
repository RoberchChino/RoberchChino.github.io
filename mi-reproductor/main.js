const video = document.getElementById("videoPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeRange = document.getElementById("volumeRange");
const volumeLabel = document.getElementById("volumeLabel");
const speedRange = document.getElementById("speedRange");
const speedLabel = document.getElementById("speedLabel");
const progressBar = document.getElementById("progressBar");
const smallBtn = document.getElementById("smallBtn");
const mediumBtn = document.getElementById("mediumBtn");
const largeBtn = document.getElementById("largeBtn");
const snapshotBtn = document.getElementById("snapshotBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const videoSelectButtons = document.querySelectorAll(".videoSelect");
const subsToggleBtn = document.getElementById("subsToggleBtn");

const snapshotCanvas = document.getElementById("snapshotCanvas");
const snapshotImage = document.getElementById("snapshotImage");
const downloadLink = document.getElementById("downloadLink");

const playlist = [
  {
    src: "videos/video1.mp4",
    sub: "captions/subs-video1.vtt",
  },
  {
    src: "videos/video2.mp4",
    sub: "captions/subs-video2.vtt",
  },
];
let currentVideoIndex = 0;

let subsActive = false;

playPauseBtn.addEventListener("click", () => {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
});

video.addEventListener("play", () => {
  playPauseBtn.textContent = "Pause";
});
video.addEventListener("pause", () => {
  playPauseBtn.textContent = "Play";
});

muteBtn.addEventListener("click", () => {
  video.muted = !video.muted;
  muteBtn.textContent = video.muted ? "Unmute" : "Mute";
});

volumeRange.addEventListener("input", () => {
  video.volume = volumeRange.value;
  volumeLabel.textContent = Math.round(video.volume * 100) + "%";
});

speedRange.addEventListener("input", () => {
  video.playbackRate = speedRange.value;
  speedLabel.textContent = video.playbackRate.toFixed(1) + "x";
});

video.addEventListener("timeupdate", () => {
  if (video.duration) {
    const percentage = (video.currentTime / video.duration) * 100;
    progressBar.value = percentage;
  }
});
progressBar.addEventListener("input", () => {
  const newTime = (progressBar.value * video.duration) / 100;
  video.currentTime = newTime;
});

smallBtn.addEventListener("click", () => {
  video.width = 480;
  video.height = 270;
});
mediumBtn.addEventListener("click", () => {
  video.width = 640;
  video.height = 360;
});
largeBtn.addEventListener("click", () => {
  video.width = 960;
  video.height = 540;
});

function loadVideo(index) {
  if (index < 0 || index >= playlist.length) return;
  currentVideoIndex = index;

  video.src = playlist[index].src;

  replaceSubtitleTrack(playlist[index].sub);

  video.load();
  video.play();
}

prevBtn.addEventListener("click", () => {
  let newIndex = currentVideoIndex - 1;
  if (newIndex < 0) {
    newIndex = playlist.length - 1;
  }
  loadVideo(newIndex);
});

nextBtn.addEventListener("click", () => {
  let newIndex = currentVideoIndex + 1;
  if (newIndex >= playlist.length) {
    newIndex = 0;
  }
  loadVideo(newIndex);
});

videoSelectButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-src");
    const sub = btn.getAttribute("data-sub");
    const foundIndex = playlist.findIndex(
      (item) => item.src === src && item.sub === sub
    );
    if (foundIndex !== -1) {
      loadVideo(foundIndex);
    }
  });
});

function replaceSubtitleTrack(subURL) {
  const oldTrack = document.getElementById("subtitles");
  if (oldTrack) {
    oldTrack.remove();
  }
  const track = document.createElement("track");
  track.id = "subtitles";
  track.kind = "subtitles";
  track.label = "Español";
  track.srclang = "es";
  track.src = subURL;

  video.appendChild(track);

  video.addEventListener("loadedmetadata", () => toggleSubtitlesMode(), {
    once: true,
  });
}

subsToggleBtn.addEventListener("click", () => {
  subsActive = !subsActive;
  toggleSubtitlesMode();

  subsToggleBtn.textContent = subsActive ? "Subtítulos On" : "Subtítulos Off";
});

function toggleSubtitlesMode() {
  for (let i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = subsActive ? "showing" : "hidden";
  }
}

snapshotBtn.addEventListener("click", () => {
  const ctx = snapshotCanvas.getContext("2d");
  snapshotCanvas.width = video.videoWidth;
  snapshotCanvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

  const dataURL = snapshotCanvas.toDataURL("image/png");
  snapshotImage.src = dataURL;
  downloadLink.href = dataURL;
});

loadVideo(currentVideoIndex);

toggleSubtitlesMode();
