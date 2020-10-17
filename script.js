(() => {
  /** DOM Elements */
  const releasesRoot = document.getElementById('releases');
  const playlistContainer = document.querySelector('.playlist');
  const playlist = document.getElementById('playlist');
  const playPauseLabel = document.querySelector('label#play-pause-label')
  const playPause = document.querySelector('input#play-pause')
  const showHideLabel = document.querySelector('label#show-hide-labe')

  const audio = document.querySelector('audio');

  /** Templates */
  function releaseTemplate(release) {
    return `
    <h3>${release.title}</h3>
    <div class="artwork">
      <img src="${release.img}" alt="${release.alt}" width="400"
        height="400">
      <div class="play">
        <button type="button" aria-label="Play ${release.title}"></button>
      </div>
    </div>
    `;
  }

  function trackTemplate(track) {
    return `
    <p tabindex="-1">${track.title}</p>
    <button><span class="visually-hidden">Play ${track.title}</span></button>
    `;
  }

  /** Interaction */
  const playlistState = {
    currentPlaylist: undefined,
    currentTrack: 0,
    playing: false
  }

  function setPlaying(to) {
    if (to) {
      playPauseLabel.setAttribute('aria-label', `Pause ${playlistState.currentPlaylist[playlistState.currentTrack].title}`);
      playlistContainer.classList.add('playing');
      playlistState.playing = true;
      audio.play();
    } else {
      audio.pause();
      playlistState.playing = false;
      playlistContainer.classList.remove('playing');
      playPauseLabel.setAttribute('aria-label', `Play ${playlistState.currentPlaylist[playlistState.currentTrack].title}`);
    }
  }

  function setPlayingTrack(index) {
    if (index < playlistState.currentPlaylist.length) {
      playlistState.currentTrack = index;
      audio.src = playlistState.currentPlaylist[playlistState.currentTrack].src;
      setPlaying(true);
    } else {
      playlistState.currentTrack = 0;
      setPlaying(false);
    }
  }

  function onPlayPauseChange(event) {
    if (playlistState.currentPlaylist) {
      setPlaying(event.target.checked);
    }
  }

  function onAudioPlay() {
    if (playlistState.playing) {
      return;
    }
    setPlaying(true);
  }

  function onAudioPause() {
    if (!playlistState.playing) {
      return;
    }
    setPlaying(false);
  }

  function onAudioEnd() {
    setPlayingTrack(playlistState.currentTrack + 1);
  }

  function play(release) {
    if (!release.tracks || playlistState.currentPlaylist === release.tracks) {
      return;
    }
    if (!playlistState.currentPlaylist) {
      playlistContainer.classList.add('active');
    }
    // clear previous playlist
    playlist.innerHTML = "";

    const ul = document.createElement('ul');
    // update state
    playlistState.currentPlaylist = release.tracks;

    playlistState.currentPlaylist.forEach(function (track, index) {
      const li = document.createElement('li');

      li.innerHTML = trackTemplate(track);

      const playButton = li.querySelector('button');
      if (playButton) {
        playButton.addEventListener('click', function () { setPlayingTrack(index) });
      }

      ul.appendChild(li);
    });
    playlist.appendChild(ul);

    setPlayingTrack(0);
  }

  /** Setup */
  const releases = [
    {
      title: 'Zela [mixtape]',
      img: 'assets/MIXTAPE-2019-min.jpg',
      alt: 'Cover artwork for Zela by Olha Danylchenko.',
      tracks: [
        {
          title: 'OPG',
          src: 'assets/Zela/01OPG.mp3'
        },
        {
          title: 'Slippy',
          src: 'assets/Zela/02Slippy.mp3'
        },
        {
          title: 'Passing Through',
          src: 'assets/Zela/03Passing_Through.mp3'
        },
        {
          title: 'When You Find It',
          src: 'assets/Zela/04When_You_Find_It.mp3'
        },
        {
          title: 'Show',
          src: 'assets/Zela/05Show.mp3'
        }
      ]
    },
    {
      title: 'Fields EP',
      img: 'assets/EP-2018.jpg',
      alt: 'Cover artwork for Fields by Spence Rudnick.',
      tracks: [
        {
          title: 'Passing Through 2nd Edit',
          src: 'assets/Fields/01Passing_Through_2nd_Edit.mp3'
        },
        {
          title: 'Glitch Trick 2nd Edit',
          src: 'assets/Fields/02Glitch_Trick_2nd_Edit.mp3'
        },
        {
          title: 'Opal Magma (Afternoon Mix)',
          src: 'assets/Fields/03Opal_Magma_Afternoon_Mix.mp3'
        },
        {
          title: 'Coffee Jar',
          src: 'assets/Fields/04Coffee_Jar.mp3'
        },
        {
          title: 'Field 1',
          src: 'assets/Fields/05Field_1.mp3'
        }
      ]
    }
  ];

  function init() {
    playPause.addEventListener('change', onPlayPauseChange);
    audio.addEventListener('play', onAudioPlay);
    audio.addEventListener('pause', onAudioPause);
    audio.addEventListener('ended', onAudioEnd);

    releases.forEach(function (release) {
      const article = document.createElement('article');

      article.innerHTML = releaseTemplate(release);

      const playButton = article.querySelector('button');
      if (playButton) {
        playButton.addEventListener('click', function () { play(release) });
      }

      releasesRoot.appendChild(article);
    });
    setTimeout(() => { releasesRoot.hidden = false; });
  }

  init();
})();