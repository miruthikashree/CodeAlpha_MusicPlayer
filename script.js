
const songs = [
  {
    title: "The NeverEnding Story",
    artist: "Dustin Henderson and Suzie",
    src: "songs/song1.mp3",
    cover: "images/cover1.jpg"
  },
  {
    title: "Imagine Dragons",
    artist: "Believer alternative rock",
    src: "songs/song2.mp3",
    cover: "images/cover2.jpg"
  },
  {
    title: "Love Me Like You Do",
    artist: "Ellie Goulding",
    src: "songs/song3.mp3",
    cover: "images/cover3.jpg"
  },
  {
    title: "Moral of the Story",
    artist: "Ashe",
    src: "songs/song4.mp3",
    cover: "images/cover4.jpg"
  },
  {
    title: "kutty story",
    artist: "anirudh",
    src: "songs/song5.mp3",
    cover: "images/cover5.jpg"
  },
  {
    title: "motivation",
    artist: "vibes",
    src: "songs/song6.mp3",
    cover: "images/cover6.jpg"
  },
  {
    title: "The Song of Alone",
    artist: "Heartfelt",
    src: "songs/song7.mp3",
    cover: "images/cover7.jpg"
  },
  {
    title: "Summer Vibes",
    artist: "cool",
    src: "songs/song8.mp3",
    cover: "images/cover8.jpg"
  },
  {
    title: "Dancing into the light",
    artist: "Album talent",
    src: "songs/song9.mp3",
    cover: "images/cover9.jpg"
  },
  {
    title: "Golden Hour Dreams",
    artist: "music tracks",
    src: "songs/song10.mp3",
    cover: "images/cover10.jpg"
  }
];

const audio = document.getElementById("audio");
const title = document.getElementById("song-title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeText = document.getElementById("current-time");
const durationText = document.getElementById("duration");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const statusText = document.getElementById("status");

let currentSong = 0;

// Display time in minutes and seconds
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

// Load a selected song
function loadSong(index) {
  currentSong = (index + songs.length) % songs.length;

  const song = songs[currentSong];

  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  document.getElementById("album-cover").src = song.cover;
  document.getElementById("album-cover").alt = song.title;

  progress.value = 0;
  currentTimeText.textContent = "0:00";
  durationText.textContent = "0:00";

  renderPlaylist();
}

// Play music
async function playSong() {
  try {
    statusText.textContent = "";
    await audio.play();
    document.getElementById("album-cover").classList.add("playing");
    playBtn.textContent = "⏸";
    playBtn.setAttribute("aria-label", "Pause music");
  } catch (error) {
    playBtn.textContent = "▶";
    console.error("Could not play audio:", error);
statusText.textContent = "Unable to play this song. Check the audio file."; 
}
}

// Pause music
function pauseSong() {
  audio.pause();
  document.getElementById("album-cover").classList.remove("playing");
  playBtn.textContent = "▶";
  playBtn.setAttribute("aria-label", "Play music");
}

// Play/pause button
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Next song
function nextSong() {
  loadSong(currentSong + 1);
  playSong();
}

// Previous song
function previousSong() {
  loadSong(currentSong - 1);
  playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

// Show playlist
function renderPlaylist() {
  playlist.innerHTML = "";

  songs.forEach((song, index) => {
    const item = document.createElement("li");

    item.textContent = `${song.title} — ${song.artist}`;

    if (index === currentSong) {
      item.classList.add("active");
    }

    item.addEventListener("click", () => {
      loadSong(index);
      playSong();
    });

    playlist.appendChild(item);
  });
}

// Update duration when the audio loads
audio.addEventListener("loadedmetadata", () => {
  durationText.textContent = formatTime(audio.duration);
});

// Update progress while playing
audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }

  currentTimeText.textContent = formatTime(audio.currentTime);
});

// Seek to a different position
progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime =
      (Number(progress.value) / 100) * audio.duration;
  }
});

// Volume control
volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

// Autoplay the next track when a song finishes
audio.addEventListener("ended", nextSong);

// Show an error if the audio file cannot load
audio.addEventListener("error", () => {
  console.error("Audio file failed to load:", audio.src);
});

audio.volume = Number(volume.value);

// Initialize player
loadSong(0);
