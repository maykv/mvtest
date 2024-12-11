const videoPlayer = document.getElementById('videoPlayer');
const playPauseButton = document.getElementById('playPause');
const seekBar = document.getElementById('seekBar');
const volumeControl = document.getElementById('volumeControl');
const toggleSubtitlesButton = document.getElementById('toggleSubtitles');
const subtitleDisplay = document.getElementById('subtitle');

let showSubtitles = false;
let subtitles = [];

// Play/Pause 이벤트
playPauseButton.addEventListener('click', () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playPauseButton.innerText = '❚ Pause';
  } else {
    videoPlayer.pause();
    playPauseButton.innerText = '▶';
  }
});

// Seek 기능
videoPlayer.addEventListener('timeupdate', () => {
  const value = (videoPlayer.currentTime / videoPlayer.duration) * 100 || 0;
  seekBar.value = value;
});

seekBar.addEventListener('input', () => {
  const seekTime = (seekBar.value / 100) * videoPlayer.duration;
  videoPlayer.currentTime = seekTime;
});

// Load subtitles from SRT
fetch('example.srt')
  .then(response => response.text())
  .then(parseSRT);

// Parse SRT
function parseSRT(data) {
  const srtRegex = /(\d+)\s+(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\s+([\s\S]*?)(?=\n\n|\n?$)/g;
  let match;
  subtitles = [];
  while ((match = srtRegex.exec(data)) !== null) {
    subtitles.push({
      start: parseTime(match[2]),
      end: parseTime(match[3]),
      text: match[4]
    });
  }
}

// Subtitle Sync Logic
videoPlayer.addEventListener('timeupdate', () => {
  const currentTimeMs = videoPlayer.currentTime * 1000;
  const currentSubtitle = subtitles.find(sub => currentTimeMs >= sub.start && currentTimeMs <= sub.end);
  subtitleDisplay.innerText = showSubtitles && currentSubtitle ? currentSubtitle.text : '';
});

// Subtitle toggle
toggleSubtitlesButton.addEventListener('click', () => {
  showSubtitles = !showSubtitles;
  toggleSubtitlesButton.innerText = showSubtitles ? 'Hide Subtitles' : 'Show Subtitles';
});
