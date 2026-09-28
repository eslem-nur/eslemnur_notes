/* ============================================
   iKURAN - GLOBAL JAVASCRIPT
   Tüm Diller ve Renk Temaları İçin Ortak JS
   ============================================ */

// --- DİL MESAJLARI ---
const iKuranMessages = {
    tr: {
        loading: "Yükleniyor...",
        playing: "Oynatılıyor",
        paused: "Duraklatıldı",
        prev: "Önceki",
        next: "Sonraki",
        settings: "Ayarlar",
        repeatOn: "Tekrar Modu Açık",
        repeatOff: "Tekrar Modu Kapalı",
        shuffleOn: "Karıştır Modu Açık",
        shuffleOff: "Karıştır Modu Kapalı",
        playlistComplete: "Süre Tamamlandı",
        error: "Hata oluştu.",
        cannotPlay: "Oynatılamadı",
        darkMode: "Koyu Mod",
        lightMode: "Aydınlık Mod"
    },
    en: {
        loading: "Loading...",
        playing: "Playing",
        paused: "Paused",
        prev: "Previous",
        next: "Next",
        settings: "Settings",
        repeatOn: "Repeat Mode On",
        repeatOff: "Repeat Mode Off",
        shuffleOn: "Shuffle Mode On",
        shuffleOff: "Shuffle Mode Off",
        playlistComplete: "Playlist Complete",
        error: "An error occurred.",
        cannotPlay: "Could not play",
        darkMode: "Dark Mode",
        lightMode: "Light Mode"
    },
    de: {
        loading: "Ladet...",
        playing: "Läuft",
        paused: "Pausiert",
        prev: "Vorherige",
        next: "Nächste",
        settings: "Einstellungen",
        repeatOn: "Wiederholmodus aktiv",
        repeatOff: "Wiederholmodus deaktiviert",
        shuffleOn: "Shuffle-Modus aktiv",
        shuffleOff: "Shuffle-Modus deaktiviert",
        playlistComplete: "Fertig",
        error: "Fehler",
        cannotPlay: "Abgebrochen",
        darkMode: "Dark Mode",
        lightMode: "Light Mode"
    },
    fr: {
        loading: "Chargement...",
        playing: "Lecture",
        paused: "Pause",
        prev: "Précédent",
        next: "Suivant",
        settings: "Paramètres",
        repeatOn: "Mode Répétition Activé",
        repeatOff: "Mode Répétition Désactivé",
        shuffleOn: "Mode Aléatoire Activé",
        shuffleOff: "Mode Aléatoire Désactivé",
        playlistComplete: "Terminé",
        error: "Une erreur est survenue.",
        cannotPlay: "Impossible de lire",
        darkMode: "Mode Sombre",
        lightMode: "Mode Clair"
    },
    ar: {
        loading: "جاري التحميل...",
        playing: "جاري التشغيل",
        paused: "موقوف مؤقتاً",
        prev: "السابق",
        next: "التالي",
        settings: "الإعدادات",
        repeatOn: "وضع التكرار مفعل",
        repeatOff: "وضع التكرار معطل",
        shuffleOn: "وضع العشوائية مفعل",
        shuffleOff: "وضع العشوائية معطل",
        playlistComplete: "تم الانتهاء",
        error: "حدث خطأ",
        cannotPlay: "تعذر التشغيل",
        darkMode: "الوضع الداكن",
        lightMode: "الوضع الفاتح"
    }
};

// --- DİL TESPİT ---
function getiKuranLanguage() {
    const htmlLang = document.documentElement.getAttribute('lang');
    
    if (htmlLang === 'tr') return 'tr';
    if (htmlLang === 'en') return 'en';
    if (htmlLang === 'de') return 'de';
    if (htmlLang === 'fr') return 'fr';
    if (htmlLang === 'ar') return 'ar';
    
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/en/')) return 'en';
    if (path.includes('/de/')) return 'de';
    if (path.includes('/fr/')) return 'fr';
    if (path.includes('/ar/')) return 'ar';
    
    return 'tr';
}

// --- Değişkenler ---
let surahs = [];
let currentIndex = 0;
let isPlaying = false;
let currentLang = 'tr';
let msgs = {};

const audio = document.getElementById('audio-player');
const listEl = document.getElementById('surah-list');
const playerView = document.getElementById('player-view');
const settingsView = document.getElementById('settings-view');
const npTitle = document.getElementById('np-title');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const centerBtn = document.getElementById('center-btn');
const wheel = document.getElementById('wheel');

const btnTheme = document.getElementById('btn-theme');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

const btnPrevTrack = document.getElementById('btn-prev-track');
const btnNextTrack = document.getElementById('btn-next-track');
const btnRepeat = document.getElementById('btn-repeat');
const btnShuffle = document.getElementById('btn-shuffle');
const btnSpeedDown = document.getElementById('btn-speed-down');
const btnSpeedUp = document.getElementById('btn-speed-up');
const speedDisplay = document.getElementById('speed-display');

let repeatMode = false;
let shuffleMode = false;
let shuffledIndices = [];
let currentShuffleIndex = 0;
let playbackSpeed = 1.0;
const speedLevels = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
let targetVolume = 1.0;
let volumeInterval = null;
let isDragging = false;
let lastAngle = 0;
let lastSkipTime = 0;
const SKIP_SECONDS = 5;
let wheelLongPressTimer = null;

// --- Mesaj Göster ---
function showMessage(msgId, text, timeout = 1000) {
    document.querySelectorAll('.status-msg').forEach(el => el.style.opacity = '0');
    
    const msgEl = document.getElementById(msgId);
    if (msgEl) {
        msgEl.textContent = text;
        msgEl.style.opacity = '1';
        
        if (timeout > 0) {
            setTimeout(() => {
                msgEl.style.opacity = '0';
            }, timeout);
        }
    }
}

// --- Veri Çek ---
async function fetchSurahs() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/edition?format=audio&language=ar');
        const data = await response.json();
        
        const metaResponse = await fetch('https://api.alquran.cloud/v1/surah');
        const metaData = await metaResponse.json();
        surahs = metaData.data;

        renderList();
    } catch (error) {
        if (listEl) {
            listEl.innerHTML = '<li style="padding:10px;">' + msgs.error + '</li>';
        }
        console.error(error);
    }
}

// --- Listeyi Göster ---
function renderList() {
    if (!listEl) return;
    
    listEl.innerHTML = '';
    
    surahs.forEach((surah, index) => {
        const li = document.createElement('li');
        li.className = `surah-item ${index === currentIndex ? 'active' : ''}`;
        li.textContent = `${surah.number}. ${surah.name}`;
        
        if (shuffleMode) {
            li.addEventListener('click', () => selectSurahByShuffle(index));
        } else {
            li.addEventListener('click', () => selectSurah(index));
        }
        
        listEl.appendChild(li);
    });
    
    const activeItem = listEl.children[currentIndex];
    if (activeItem) {
        activeItem.scrollIntoView({ block: 'center' });
    }
}

// --- Sure Seç ---
function selectSurah(index) {
    currentIndex = index;
    renderList(); 
    
    const surah = surahs[currentIndex];
    showMessage('msg-loading', msgs.loading, 0);
    
    const directUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah.number}.mp3`;
    loadAndPlay(directUrl, surah.name);
}

function selectSurahByShuffle(shuffledIndex) {
    if (!shuffledIndices.length) return;
    
    currentIndex = shuffledIndices[shuffledIndex];
    currentShuffleIndex = shuffledIndex;
    renderList();
    
    const surah = surahs[currentIndex];
    showMessage('msg-loading', msgs.loading, 0);
    
    const directUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah.number}.mp3`;
    loadAndPlay(directUrl, surah.name);
}

function loadAndPlay(url, name) {
    audio.src = url;
    audio.playbackRate = playbackSpeed;
    audio.loop = repeatMode;
    
    audio.play().then(() => {
        isPlaying = true;
        showPlayerView(name);
        showMessage('msg-player', msgs.playing);
    }).catch(e => {
        console.log("Playback error", e);
        showMessage('msg-loading', msgs.cannotPlay, 2000);
    });
}

function showPlayerView(name) {
    if (listEl) listEl.style.display = 'none';
    if (settingsView) settingsView.style.display = 'none';
    if (playerView) playerView.style.display = 'flex';
    if (npTitle) npTitle.textContent = name;
}

function showListView() {
    if (playerView) playerView.style.display = 'none';
    if (settingsView) settingsView.style.display = 'none';
    if (listEl) listEl.style.display = 'block';
    audio.pause();
    isPlaying = false;
    showMessage('msg-player', '', 0);
}

// --- Click Wheel ---
wheel.addEventListener('mousedown', startDrag);
wheel.addEventListener('touchstart', startDrag, {passive: false});
window.addEventListener('mousemove', onDrag);
window.addEventListener('touchmove', onDrag, {passive: false});
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

function startDrag(e) {
    if(e.target === centerBtn) return;
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    lastAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    
    wheelLongPressTimer = setTimeout(() => {
        if (playerView && playerView.style.display === 'flex') {
            toggleVolumeControl();
        }
    }, 800);
}

function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    let delta = currentAngle - lastAngle;

    if (delta < -180) delta += 360;
    if (delta > 180) delta -= 360;

    if (Math.abs(delta) > 15) {
        clearTimeout(wheelLongPressTimer);
        
        if (playerView && playerView.style.display === 'flex') {
            if (Date.now() - lastSkipTime < 300) return;
            
            if (delta > 0) {
                audio.currentTime = Math.min(audio.duration, audio.currentTime + SKIP_SECONDS);
                showMessage('msg-skip', "+" + SKIP_SECONDS + "s");
            } else {
                audio.currentTime = Math.max(0, audio.currentTime - SKIP_SECONDS);
                showMessage('msg-skip', "-" + SKIP_SECONDS + "s");
            }
            lastSkipTime = Date.now();
        } else if (settingsView && settingsView.style.display !== 'none') {
            const scrollAmount = delta > 0 ? 40 : -40; 
            settingsView.scrollTop += scrollAmount;
            showMessage('msg-player', '', 0);
        } else {
            changeSelection(delta > 0 ? 1 : -1);
        }
        
        lastAngle = currentAngle;
    }
}

function endDrag() {
    isDragging = false;
    clearTimeout(wheelLongPressTimer);
}

function changeSelection(direction) {
    if (playerView && playerView.style.display === 'flex') return;
    
    let newIndex;
    if (shuffleMode && shuffledIndices.length) {
        currentShuffleIndex = (currentShuffleIndex + direction + shuffledIndices.length) % shuffledIndices.length;
        newIndex = shuffledIndices[currentShuffleIndex];
    } else {
        newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = surahs.length - 1;
        if (newIndex >= surahs.length) newIndex = 0;
    }
    
    currentIndex = newIndex;
    renderList();
}

// --- Orta Tuş ---
let lastClickTime = 0;

centerBtn.addEventListener('click', () => {
    const now = Date.now();
    
    if (playerView && playerView.style.display === 'flex') {
        if (now - lastClickTime < 300) {
            toggleRepeatMode();
        } else {
            if (audio.paused) {
                audio.play();
                isPlaying = true;
                showMessage('msg-player', msgs.playing);
            } else {
                audio.pause();
                isPlaying = false;
                showMessage('msg-player', msgs.paused);
            }
        }
    } else {
        if (settingsView && settingsView.style.display !== 'none') {
            showListView();
        } else {
            selectSurah(currentIndex);
        }
    }
    
    lastClickTime = now;
});

// --- Yan Tuşlar ---
document.querySelector('.lbl-menu').addEventListener('click', () => {
    if (playerView && playerView.style.display === 'flex') {
        showListView();
        return;
    }

    if (listEl && listEl.style.display !== 'none') {
        listEl.style.display = 'none';
        if (settingsView) settingsView.style.display = 'flex';
        showMessage('msg-player', msgs.settings, 0);
    } else if (settingsView && settingsView.style.display !== 'none') {
        settingsView.style.display = 'none';
        if (listEl) listEl.style.display = 'block';
        showMessage('msg-player', '', 0);
    }
});

document.querySelector('.lbl-prev').addEventListener('click', () => {
    if (playerView && playerView.style.display === 'flex') {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
        showMessage('msg-skip', "-10s");
    } else if (settingsView && settingsView.style.display !== 'none') {
        settingsView.scrollTop = Math.max(0, settingsView.scrollTop - 50);
    } else {
        changeSelection(-1);
    }
});

document.querySelector('.lbl-next').addEventListener('click', () => {
    if (playerView && playerView.style.display === 'flex') {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
        showMessage('msg-skip', "+10s");
    } else if (settingsView && settingsView.style.display !== 'none') {
        const maxScroll = settingsView.scrollHeight - settingsView.clientHeight;
        settingsView.scrollTop = Math.min(maxScroll, settingsView.scrollTop + 50);
    } else {
        changeSelection(1);
    }
});

// --- Play/Pause ---
const playPauseBtn = document.querySelector('.lbl-play');
let longPressTimer;

playPauseBtn.addEventListener('mousedown', startButtonLongPress);
playPauseBtn.addEventListener('touchstart', startButtonLongPress);

function startButtonLongPress(e) {
    e.preventDefault();
    longPressTimer = setTimeout(() => {
        toggleVolumeControl();
    }, 800);
    
    if (playerView && playerView.style.display === 'flex') {
        if (audio.paused) {
            audio.play();
            isPlaying = true;
            showMessage('msg-player', msgs.playing);
        } else {
            audio.pause();
            isPlaying = false;
            showMessage('msg-player', msgs.paused);
        }
    } else if (listEl && listEl.style.display !== 'none') {
        selectSurah(currentIndex);
    }
}

playPauseBtn.addEventListener('mouseup', () => clearTimeout(longPressTimer));
playPauseBtn.addEventListener('mouseleave', () => clearTimeout(longPressTimer));
playPauseBtn.addEventListener('touchend', () => clearTimeout(longPressTimer));

// --- Player Kontroller ---
btnPrevTrack.addEventListener('click', () => {
    if (currentIndex > 0) {
        selectSurah(currentIndex - 1);
    } else {
        selectSurah(surahs.length - 1);
    }
});

btnNextTrack.addEventListener('click', () => {
    if (currentIndex < surahs.length - 1) {
        selectSurah(currentIndex + 1);
    } else {
        selectSurah(0);
    }
});

progressContainer.addEventListener('click', function(e) {
    if (!audio.duration) return;
    
    const rect = this.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    audio.currentTime = percent * audio.duration;
    showMessage('msg-skip', formatTime(audio.currentTime));
});

// --- Tema ---
function updateThemeButton() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const langMsg = msgs.darkMode || 'Dark Mode';
    const lightMsg = msgs.lightMode || 'Light Mode';
    
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = lightMsg;
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = langMsg;
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const themeText = theme === 'light' || theme === 'light-pink' ? msgs.lightMode : msgs.darkMode;
    showMessage('msg-player', themeText);
}

btnTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const currentColor = document.documentElement.getAttribute('data-color');
    
    let newTheme;
    
    // Light → Dark
    if (currentTheme === 'light') {
        newTheme = 'dark';
    } else {
        newTheme = 'light';
    }
    
    setTheme(newTheme);
    updateThemeButton();
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}
updateThemeButton(); 

// --- Tekrar ---
function toggleRepeatMode() {
    repeatMode = !repeatMode;
    audio.loop = repeatMode;
    
    if (repeatMode) {
        showMessage('msg-repeat', msgs.repeatOn, 2000);
        btnRepeat.style.background = '#2E7D32';
        btnRepeat.style.color = '#fff';
    } else {
        showMessage('msg-repeat', msgs.repeatOff, 2000);
        btnRepeat.style.background = ''; 
        btnRepeat.style.color = '';
    }
}
btnRepeat.addEventListener('click', () => toggleRepeatMode());

// --- Karıştır ---
function toggleShuffleMode() {
    shuffleMode = !shuffleMode;
    
    if (shuffleMode) {
        shuffledIndices = [...Array(surahs.length).keys()];
        shuffleArray(shuffledIndices);
        currentShuffleIndex = 0;
        showMessage('msg-shuffle', msgs.shuffleOn, 2000);
        btnShuffle.style.background = '#EF6C00';
        btnShuffle.style.color = '#fff';
    } else {
        shuffledIndices = [];
        currentShuffleIndex = 0;
        showMessage('msg-shuffle', msgs.shuffleOff, 2000);
        btnShuffle.style.background = ''; 
        btnShuffle.style.color = '';
    }
    
    renderList();
}
btnShuffle.addEventListener('click', () => toggleShuffleMode());

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Ses ---
function toggleVolumeControl() {
    if (volumeInterval) {
        clearInterval(volumeInterval);
        volumeInterval = null;
        showMessage('msg-volume', '');
        return;
    }
    
    let direction = audio.volume < 0.5 ? 1 : -1;
    
    volumeInterval = setInterval(() => {
        targetVolume = Math.max(0, Math.min(1, audio.volume + (direction * 0.1)));
        audio.volume = targetVolume;
        showMessage('msg-volume', 'Volume: ' + Math.round(targetVolume * 100) + '%', 0);
        
        if ((direction === 1 && targetVolume >= 1) || (direction === -1 && targetVolume <= 0)) {
            clearInterval(volumeInterval);
            volumeInterval = null;
        }
    }, 200);
}

// --- Hız ---
function changePlaybackSpeed(direction) {
    let index = speedLevels.indexOf(playbackSpeed);
    index += direction;
    
    if (index < 0) index = speedLevels.length - 1;
    if (index >= speedLevels.length) index = 0;
    
    playbackSpeed = speedLevels[index];
    audio.playbackRate = playbackSpeed;
    speedDisplay.textContent = playbackSpeed + 'x';
    showMessage('msg-speed', playbackSpeed + 'x Speed');
}

btnSpeedDown.addEventListener('click', () => changePlaybackSpeed(-1));
btnSpeedUp.addEventListener('click', () => changePlaybackSpeed(1));

wheel.addEventListener('wheel', (e) => {
    if (settingsView && settingsView.style.display !== 'none') {
        e.preventDefault();
        const direction = e.deltaY > 0 ? -1 : 1;
        changePlaybackSpeed(direction);
    }
});

// --- Progress Bar ---
audio.addEventListener('timeupdate', () => {
    if(audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        
        const currTime = document.getElementById('curr-time');
        const durTime = document.getElementById('dur-time');
        if (currTime) currTime.textContent = formatTime(audio.currentTime);
        if (durTime) durTime.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener('ended', () => {
    if (repeatMode) return;
    
    if (shuffleMode && shuffledIndices.length) {
        currentShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
        currentIndex = shuffledIndices[currentShuffleIndex];
    } else {
        let next = currentIndex + 1;
        if(next >= surahs.length) {
            if (repeatMode) {
                next = 0;
            } else {
                showMessage('msg-player', msgs.playlistComplete, 2000);
                return;
            }
        }
        currentIndex = next;
    }
    
    selectSurah(currentIndex);
});

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// --- Başlat ---
document.addEventListener('DOMContentLoaded', () => {
    currentLang = getiKuranLanguage();
    msgs = iKuranMessages[currentLang] || iKuranMessages.tr;
    fetchSurahs();
});