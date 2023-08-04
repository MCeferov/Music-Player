"use strict";

const backwardBtn = document.getElementById("backward__btn");
const prevBtn = document.getElementById("prev__btn");
const playBtn = document.getElementById("play__btn");
const nextBtn = document.getElementById("next__btn");
const forwardBtn = document.getElementById("forward__btn");
const volumeBtn = document.getElementById("volume__btn");

const songEl = document.getElementById("song");

const imageEl = document.getElementById("song__image");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");

const progressContainerEl = document.getElementById("progress-container");
const progressEl = document.getElementById("progress");

const volumeIncrease = document.getElementById("volume-container");
const sound = document.getElementById("volume");

const currentTimeEl = document.getElementById("current__time");
const durationEl = document.getElementById("duration");

const playlist = document.getElementById("playlist");

// Data
const songs = [
  {
    name: "glimpse-of-us",
    artist: "Joji",
    title: "Glimpse of Us",
    duration: "3:53",
  },
  {
    name: "fourth-of-july",
    artist: "Sufjan Stevens",
    title: "Fourth of July",
    duration: "4:38",
  },
  {
    name: "indigo-night",
    artist: "Tamino",
    title: "Indigo Night",
    duration: "4:14",
  },
  {
    name: "remembrance",
    artist: "Balmorhea",
    title: "Remembrance",
    duration: "5:59",
  },
  {
    name: "summertime-sadness",
    artist: "Lana del Rey",
    title: "Summertime Sadness",
    duration: "4:25",
  },
  {
    name: "i-know-i-am-not-the-only-one",
    artist: "Sam Smith",
    title: "I Know I'm Not The Only One",
    duration: "3:57",
  },
];

let isPlaying = false;
let songIndex = 0;

const displaySong = (song) => {
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  songEl.src = `/audio/${song.name}.mp3`;
  imageEl.src = `/images/${song.name}.jpeg`;
};

const displaySongList = () => {
  playlist.innerHTML = "";

  songs.forEach((song, index) => {
    const songListItem = document.createElement("li");

    songListItem.className =
      "hover:font-bold text-xs flex justify-between mb-2 cursor-pointer";

    if (songIndex === index) {
      songListItem.classList.add("font-bold", "text-red-600");
    } else {
      songListItem.classList.remove("font-bold", "text-red-600");
    }

    const nameSpan = document.createElement("span");
    const durationSpan = document.createElement("span");

    nameSpan.textContent = song.title;
    durationSpan.textContent = song.duration;

    songListItem.insertAdjacentElement("afterbegin", durationSpan);
    songListItem.insertAdjacentElement("afterbegin", nameSpan);

    songListItem.addEventListener("click", () => {
      songIndex = index;
      displaySong(song);
      displaySongList();
      playSong();
    });

    playlist.insertAdjacentElement("beforeend", songListItem);
  });
};

const playSong = () => {
  songEl.play();
  playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  isPlaying = true;
};

const pauseSong = () => {
  songEl.pause();
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  isPlaying = false;
};

const playNextSong = () => {
  songIndex = songIndex === songs.length - 1 ? 0 : songIndex + 1;
  displaySong(songs[songIndex]);
  playSong();
};

const updateCurrentSongInPlaylist = () => {
  const allListItems = playlist.querySelectorAll("li");
  allListItems.forEach((item, index) => {
    if (index === songIndex) {
      item.classList.add("font-bold", "text-red-600");
    } else {
      item.classList.remove("font-bold", "text-red-600");
    }
  });
};

playBtn.addEventListener("click", () => {
  !isPlaying ? playSong() : pauseSong();
});

const nextSong = () => {
  songIndex = songIndex === songs.length - 1 ? 0 : songIndex + 1;
  displaySong(songs[songIndex]);
  playSong();
  updateCurrentSongInPlaylist();
};

const prevSong = () => {
  songIndex = songIndex === 0 ? songs.length - 1 : songIndex - 1;
  displaySong(songs[songIndex]);
  playSong();
  updateCurrentSongInPlaylist();
};

const seekBackwardBy10Seconds = () => {
  if (songEl.currentTime >= 10) {
    songEl.currentTime -= 10;
  } else {
    songEl.currentTime = 0;
  }
};

const seekForwardBy10Seconds = () => {
  if (songEl.currentTime + 10 <= songEl.duration) {
    songEl.currentTime += 10;
  } else {
    songEl.currentTime = songEl.duration;
  }
};

songEl.addEventListener("timeupdate", (event) => {
  const { currentTime, duration } = event.target;

  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = Math.floor(duration % 60);

  if (!duration) return;
  durationEl.textContent = `${durationMinutes}:${String(
    durationSeconds
  ).padStart(2, "0")}`;

  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);

  currentTimeEl.textContent = `${currentMinutes}:${String(
    currentSeconds
  ).padStart(2, "0")}`;
  progressEl.style.width = `${(currentTime / duration) * 100}%`;

  if (Math.abs(currentTime - duration) < 0.1) {
    playNextSong();
    updateCurrentSongInPlaylist();
  }
});

progressContainerEl.addEventListener("click", function (e)  {


  const width = this.clientWidth
  const clicked = e.offsetX
  const {duration } = songEl


  songEl.currentTime = (clicked / width) * songEl.duration;
}); 


nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
backwardBtn.addEventListener("click", seekBackwardBy10Seconds);
forwardBtn.addEventListener("click", seekForwardBy10Seconds);
displaySongList();

const maxVolume = 1;
const minVolume = 0;
let currentVolume = 1;

volumeIncrease.addEventListener("click", (event) => {
  const { offsetY: clicked } = event;
  const containerHeight = volumeIncrease.clientHeight;

  currentVolume = ((containerHeight - clicked) / containerHeight).toFixed(1);
  songEl.volume = currentVolume;

  console.log(((containerHeight - clicked) / containerHeight) * 100);
  console.log(clicked);

  sound.style.height = `${
    ((containerHeight - clicked) / containerHeight) * 100
  }%`;
});
