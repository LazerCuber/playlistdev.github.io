// DOM Elements
const playlistNameInput = document.getElementById('playlistName');
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const playlistListEl = document.getElementById('playlistList');
const playlistSearchInput = document.getElementById('playlistSearch');
const noPlaylistsMessageEl = document.getElementById('noPlaylistsMessage');
const videoUrlInput = document.getElementById('videoUrl');
const addVideoBtn = document.getElementById('addVideoBtn');
const videoGridEl = document.getElementById('videoGrid');
const currentPlaylistTitleEl = document.getElementById('currentPlaylistTitle');
const videoFormEl = document.getElementById('videoForm');
const playerWrapperEl = document.getElementById('playerWrapper');
const videoPlaceholderEl = document.getElementById('videoPlaceholder');
const playlistActionsEl = document.getElementById('playlistActions');
const autoplaySwitchDiv = document.querySelector('.control-group .switch');
const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');
const importFileEl = document.getElementById('importFile');
const toastContainerEl = document.getElementById('toastContainer');
const htmlEl = document.documentElement;
const bodyEl = document.body;
const closePlayerBtn = document.getElementById('closePlayerBtn');
const sidebarEl = document.querySelector('.sidebar');
const sidebarResizerEl = document.getElementById('sidebarResizer');
const shufflePlaylistBtn = document.getElementById('shufflePlaylistBtn'); // Added
// Pagination Elements
const paginationControlsEl = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfoEl = document.getElementById('pageInfo');

// --- State ---
let playlists = [];
let currentPlaylistId = null;
let ytPlayer = null;
let isPlayerReady = false; // New state variable
let videoIdToPlayOnReady = null; // New state variable
let isAutoplayEnabled = false;
let currentlyPlayingVideoId = null; // ID of the video *successfully* playing
let intendedVideoId = null; // ID of the video we are *trying* to play
let draggedVideoId = null; // ID of the video being dragged
let dragTargetElement = null; // Element we are dragging over
let currentTheme = 'light';
let isResizing = false;
let lastSidebarWidth = null;
// Touch drag state
let isTouchDragging = false;
let touchDragStartY = 0;
let touchDraggedElement = null;
// Pagination State
const videosPerPage = 20; // Number of videos to show per page
let currentPage = 1;
// Web Audio Keep-Alive
let audioContext = null; // Added for silent audio hack
let silentSource = null; // Added for silent audio hack

// --- Icons (Replace with actual SVG content or library calls) ---
const ICONS = {
    add: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>`,
    loading: `<span class="spinner"></span>`,
    rename: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`,
    drag: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>`
};

// --- Initialization ---
function init() {
    loadTheme();
    loadPlaylists();
    loadAutoplaySetting();
    loadSidebarWidth();
    renderPlaylists();

    // YouTube API script is loaded externally via <script> tag.
    // onYouTubeIframeAPIReady will be called automatically by the API when ready.

    const lastSelectedId = localStorage.getItem('lastSelectedPlaylistId');
    if (lastSelectedId && playlists.some(p => p.id === parseInt(lastSelectedId))) {
        selectPlaylist(parseInt(lastSelectedId));
    } else if (playlists.length > 0) {
        selectPlaylist(playlists[0].id);
    } else {
        updateUIForNoSelection();
    }

    setupEventListeners();
    updateThemeIcon(); // Set initial theme icon

    // --- Add Visibility Change Listener ---
    // Keep this for potential background audio context management
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            startSilentAudio();
        }
    });
    // --- End Visibility Change Listener ---
}

// --- Sidebar Resizing Functions ---
function loadSidebarWidth() {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
        sidebarEl.style.width = savedWidth + 'px';
    }
}

function saveSidebarWidth(width) {
    localStorage.setItem('sidebarWidth', width);
}

function initSidebarResize(e) {
    isResizing = true;
    sidebarResizerEl.classList.add('resizing');
    document.body.style.userSelect = 'none'; // Prevent text selection while resizing
    lastSidebarWidth = sidebarEl.getBoundingClientRect().width;
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mouseup', stopSidebarResize);
    e.preventDefault();
}

function handleSidebarResize(e) {
    if (!isResizing) return;

    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const newWidth = Math.max(
        parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-min-width')),
        Math.min(e.clientX - containerRect.left,
            parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-max-width')))
    );

    sidebarEl.style.width = newWidth + 'px';
}

function stopSidebarResize() {
    isResizing = false;
    sidebarResizerEl.classList.remove('resizing');
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleSidebarResize);
    document.removeEventListener('mouseup', stopSidebarResize);

    // Save the new width
    const currentWidth = sidebarEl.getBoundingClientRect().width;
    saveSidebarWidth(currentWidth);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    createPlaylistBtn.addEventListener('click', handleCreatePlaylist);
    playlistNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleCreatePlaylist(); });
    addVideoBtn.addEventListener('click', handleAddVideo);
    videoUrlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !addVideoBtn.disabled) handleAddVideo(); });
    videoUrlInput.addEventListener('input', () => { addVideoBtn.disabled = videoUrlInput.value.trim() === ''; }); // Enable/disable add button
    autoplayToggle.addEventListener('change', handleAutoplayToggle);
    autoplaySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    clearPlaylistBtn.addEventListener('click', handleClearPlaylist);
    themeToggleBtn.addEventListener('click', toggleTheme);
    shufflePlaylistBtn.addEventListener('click', handleShufflePlaylist); // Added
    playlistSearchInput.addEventListener('input', debounce(handlePlaylistSearch, 300));
    importBtn.addEventListener('click', () => importFileEl.click());
    importFileEl.addEventListener('change', handleImportPlaylists);
    exportBtn.addEventListener('click', handleExportPlaylists);

    // Sidebar resize event
    sidebarResizerEl.addEventListener('mousedown', initSidebarResize);

    // Playlist Actions (Delegation)
    playlistListEl.addEventListener('click', (event) => {
        const playlistItem = event.target.closest('.playlist-item');
        if (!playlistItem) return;
        const playlistId = parseInt(playlistItem.dataset.id);

        if (event.target.closest('.rename-btn')) {
            event.stopPropagation(); handleRenamePlaylist(playlistId);
        } else if (event.target.closest('.delete-btn')) {
            event.stopPropagation(); handleDeletePlaylist(playlistId);
        } else {
            selectPlaylist(playlistId);
        }
    });

    // Video Actions (Delegation on Grid)
    videoGridEl.addEventListener('click', (event) => {
        const videoCard = event.target.closest('.video-card');
        if (!videoCard) return;
        const videoId = videoCard.dataset.videoId;

        if (event.target.closest('.delete-video-btn')) {
            event.stopPropagation(); handleDeleteVideo(videoId);
        } else if (!event.target.closest('.drag-handle')) { // Don't play if clicking the handle
            playVideo(videoId);
        }
    });

    // Drag and Drop Event Listeners
    setupDragAndDropListeners();

    closePlayerBtn.addEventListener('click', handleClosePlayer); // Add listener for close button

    // --- Pagination Listeners ---
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderVideos(); // Re-render videos for the new page
            // renderPaginationControls() is called by renderVideos
        }
    });
    nextPageBtn.addEventListener('click', () => {
        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        if (!currentPlaylist) return;
        const totalPages = Math.ceil(currentPlaylist.videos.length / videosPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderVideos(); // Re-render videos for the new page
            // renderPaginationControls() is called by renderVideos
        }
    });

    // --- Touch Event Listeners for Drag/Drop ---
    videoGridEl.addEventListener('touchstart', handleTouchStart, { passive: false }); // Need passive: false for preventDefault
    videoGridEl.addEventListener('touchmove', handleTouchMove, { passive: false }); // Need passive: false for preventDefault
    videoGridEl.addEventListener('touchend', handleTouchEnd);
    videoGridEl.addEventListener('touchcancel', handleTouchEnd); // Treat cancel same as end
}

// --- Drag and Drop ---
function setupDragAndDropListeners() {
    videoGridEl.addEventListener('dragstart', handleDragStart);
    videoGridEl.addEventListener('dragend', handleDragEnd);
    videoGridEl.addEventListener('dragover', handleDragOver);
    videoGridEl.addEventListener('dragleave', handleDragLeave);
    videoGridEl.addEventListener('drop', handleDrop);
}

function handleDragStart(event) {
    const videoCard = event.target.closest('.video-card');
    if (videoCard && videoCard.draggable) {
        draggedVideoId = videoCard.dataset.videoId;
        event.dataTransfer.effectAllowed = 'move';
        // event.dataTransfer.setData('text/plain', draggedVideoId); // Optional data transfer
        setTimeout(() => videoCard.classList.add('dragging'), 0); // Add class after a tick
    }
}

function handleDragEnd(event) {
    const draggingElement = videoGridEl.querySelector('.video-card.dragging');
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
    }
    clearDragOverStyles();
    draggedVideoId = null;
    dragTargetElement = null;
}

function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow drop
    if (!draggedVideoId) return; // Only react if dragging started within the grid

    const targetCard = event.target.closest('.video-card');
    if (targetCard && targetCard.dataset.videoId !== draggedVideoId) {
        // Only add drag-over style if it's a new target or different from the current one
        if (dragTargetElement !== targetCard) {
            clearDragOverStyles(); // Clear previous styles
            targetCard.classList.add('drag-over');
            dragTargetElement = targetCard;
        }
        event.dataTransfer.dropEffect = 'move';
    } else {
        // If hovering over empty space or the dragged item itself, clear styles
        if (dragTargetElement) {
            clearDragOverStyles();
            dragTargetElement = null;
        }
        event.dataTransfer.dropEffect = 'none'; // Indicate not droppable here
    }
}

function handleDragLeave(event) {
    // Check if the mouse truly left the potential drop target
    const targetCard = event.target.closest('.video-card');
    if (targetCard && targetCard === dragTargetElement && !targetCard.contains(event.relatedTarget)) {
        clearDragOverStyles();
        dragTargetElement = null;
    }
}

function handleDrop(event) {
    event.preventDefault();
    clearDragOverStyles();
    const targetCard = event.target.closest('.video-card');
    const dropTargetId = targetCard ? targetCard.dataset.videoId : null;

    if (draggedVideoId && dropTargetId !== draggedVideoId) {
        handleReorderVideo(draggedVideoId, dropTargetId);
    }
    draggedVideoId = null;
    dragTargetElement = null;
}

function clearDragOverStyles() {
    videoGridEl.querySelectorAll('.video-card.drag-over').forEach(card => {
        card.classList.remove('drag-over');
    });
}

// --- Theme Management ---
function loadTheme() {
    const savedTheme = localStorage.getItem('uiTheme') || 'light';
    applyTheme(savedTheme);
}
function applyTheme(themeName) {
    currentTheme = themeName;
    htmlEl.dataset.theme = themeName;
    updateThemeIcon();
    localStorage.setItem('uiTheme', themeName);
}
function toggleTheme() {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}
function updateThemeIcon() {
    themeToggleBtn.innerHTML = currentTheme === 'dark' ? ICONS.sun : ICONS.moon;
    themeToggleBtn.title = currentTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme';
}

// --- Font Management --- // Removed entire section
// function loadFont() { ... }
// function applyFont(fontName) { ... }
// function setFont(fontName) { ... }

// --- YouTube Player API ---
// This function MUST be global for the API to find it
function onYouTubeIframeAPIReady() {
    console.log("YT API Ready. Initializing Player."); // Keep essential init log
    // Only create player if the element exists
    if (document.getElementById('player')) {
        ytPlayer = new YT.Player('player', {
            height: '100%', width: '100%',
            playerVars: { 'playsinline': 1, 'rel': 0 }, // playsinline for mobile, rel=0 to reduce related videos
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError // Add error handler
            }
        });
    } else {
        console.warn("Player element ('#player') not found when API was ready."); // Keep warning
    }
}

// No longer needed - initialization happens via onYouTubeIframeAPIReady
// function ensurePlayerInitialized() { ... }

function onPlayerReady(event) {
    console.log("Player Ready"); // Keep essential init log
    isPlayerReady = true;

    // --- Start Silent Audio Hack ---
    startSilentAudio();
    // --- End Silent Audio Hack ---

    setupMediaSessionActionHandlers(); // Setup handlers once player is ready
    // If a video was requested before the player was ready, play it now
    if (videoIdToPlayOnReady) {
        // console.log("Playing queued video on ready:", videoIdToPlayOnReady); // Removed verbose log
        const videoToPlay = videoIdToPlayOnReady;
        videoIdToPlayOnReady = null;
        playVideo(videoToPlay);
    }
}

function onPlayerStateChange(event) {
    const state = event.data;

    if (state === YT.PlayerState.PLAYING) {
        currentlyPlayingVideoId = intendedVideoId;
        updatePlayingVideoHighlight(currentlyPlayingVideoId);
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
        startSilentAudio(); // Keep context active during playback

    } else if (state === YT.PlayerState.PAUSED) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "paused";
        }
        // No need to stop silent audio here, keep it running for background potential

    } else if (state === YT.PlayerState.ENDED) {
        const endedVideoId = currentlyPlayingVideoId || intendedVideoId;
        currentlyPlayingVideoId = null;
        intendedVideoId = null;
        updatePlayingVideoHighlight(null);
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "none";
        }
        if (isAutoplayEnabled) {
            // Ensure audio context is primed for the next video, especially in background
            startSilentAudio();
            playNextVideo(endedVideoId);
        }

    } else if (state === YT.PlayerState.BUFFERING) {
        // Keep playback state as 'playing' during buffering for MediaSession
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
        startSilentAudio(); // Ensure context stays active

    } else if (state === YT.PlayerState.CUED) {
         // Video is cued, waiting for play command. MediaSession state depends on intention.
         // If `intendedVideoId` is set, we are likely trying to play, so keep 'playing'.
         // Otherwise, it might be 'paused' or 'none'. Let's be optimistic.
        if ('mediaSession' in navigator && intendedVideoId) {
             navigator.mediaSession.playbackState = "playing";
        }
        startSilentAudio();
    }
}

function onPlayerError(event) {
    const erroredVideoId = intendedVideoId;
    console.error(`YouTube Player Error: ${event.data} for video ID: ${erroredVideoId || 'unknown'}`); // Keep error log

    let errorMsg = 'An unknown player error occurred.';
    const videoUrl = erroredVideoId ? `https://www.youtube.com/watch?v=${erroredVideoId}` : 'Unknown video';
    console.error(`Error occurred for video URL: ${videoUrl}`); // Keep error log

    // Reset player/session state
    if ('mediaSession' in navigator) {
        // console.log("MediaSession: Setting state to 'none' (Player Error)"); // Removed verbose log
        navigator.mediaSession.playbackState = 'none';
    }
    updatePlayingVideoHighlight(null);

    let shouldSkip = false;

    switch (event.data) {
        case 2: errorMsg = 'Invalid video ID or player parameter.'; shouldSkip = true; break;
        case 5: errorMsg = 'Error in the HTML5 player.'; shouldSkip = true; break;
        case 100: errorMsg = 'Video not found (removed or private).'; shouldSkip = true; break;
        case 101: case 150: errorMsg = 'Playback disallowed by video owner.'; shouldSkip = true; break;
        default: errorMsg = `Player error code: ${event.data}`; shouldSkip = true;
    }

    showToast(`Player Error: ${errorMsg}`, 'error'); // Keep toast feedback

    if (isAutoplayEnabled && shouldSkip && erroredVideoId) {
        showToast(`Skipping to next video.`, 'info', 4000); // Keep toast feedback
        setTimeout(() => playNextVideo(erroredVideoId), 500);
    } else {
        intendedVideoId = null;
    }
}

// --- Removed getCurrentPlayingVideoIdFromApi() as it's less reliable than tracking state ---
// function getCurrentPlayingVideoIdFromApi() { ... }

function playNextVideo(previousVideoId) {
    // console.log(`playNextVideo: Called. Trying to advance from video ID: ${previousVideoId || 'N/A'}. Page Visibility: ${document.visibilityState}`); // Removed verbose log
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1) {
        // console.log("playNextVideo: No playlist or empty playlist."); // Removed verbose log
        stopVideo();
        handleClosePlayer();
        return;
    }

    let currentIndex = -1;
    if (previousVideoId) {
        currentIndex = currentPlaylist.videos.findIndex(v => v.id === previousVideoId);
    }

    if (currentIndex === -1 && previousVideoId) {
         console.warn(`playNextVideo: Previous video ID "${previousVideoId}" not found in current playlist. Playing first video.`); // Keep warning
         if (currentPlaylist.videos.length > 0) {
             playVideo(currentPlaylist.videos[0].id);
         } else {
             // console.log("playNextVideo: Playlist is empty after failing to find previous video."); // Removed verbose log
             stopVideo();
             handleClosePlayer();
         }
         return;
     } else if (currentIndex === -1 && !previousVideoId) {
          // console.log("playNextVideo: No previous video ID provided. Playing first video."); // Removed verbose log
         if (currentPlaylist.videos.length > 0) {
             playVideo(currentPlaylist.videos[0].id);
         } else {
             // console.log("playNextVideo: Playlist is empty."); // Removed verbose log
             stopVideo();
             handleClosePlayer();
         }
         return;
     }

    const nextIndex = (currentIndex + 1) % currentPlaylist.videos.length;
    const nextVideo = currentPlaylist.videos[nextIndex];

    if (nextVideo) {
        // console.log(`playNextVideo: Playing next video: ${nextVideo.title} (ID: ${nextVideo.id}, Index: ${nextIndex})`); // Removed verbose log
        playVideo(nextVideo.id);
    } else {
        console.error(`playNextVideo: Could not find next video data at index ${nextIndex}. Stopping.`); // Keep error log
        stopVideo();
        handleClosePlayer();
    }
}

// --- Local Storage & State ---
function savePlaylists() { localStorage.setItem('playlists', JSON.stringify(playlists)); }
function loadPlaylists() {
    playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    // Ensure structure consistency (add videos array if missing)
    playlists.forEach(p => { if (!p.videos) p.videos = []; });
}
function saveLastSelectedPlaylist(id) { localStorage.setItem('lastSelectedPlaylistId', id ? String(id) : ''); }
function saveAutoplaySetting() { localStorage.setItem('autoplayEnabled', isAutoplayEnabled); }
function loadAutoplaySetting() {
    isAutoplayEnabled = localStorage.getItem('autoplayEnabled') === 'true';
    autoplayToggle.checked = isAutoplayEnabled;
}

// --- Playlist Management ---
function handleCreatePlaylist() {
    const name = playlistNameInput.value.trim();
    if (!name) { showToast('Please enter a playlist name.', 'error'); playlistNameInput.focus(); return; }
    const newPlaylist = { id: Date.now(), name: name, videos: [] };
    playlists.unshift(newPlaylist); // Add to top for visibility
    savePlaylists();
    playlistSearchInput.value = ''; // Clear search on create
    renderPlaylists();
    selectPlaylist(newPlaylist.id);
    playlistNameInput.value = '';
    showToast(`Playlist "${escapeHTML(name)}" created.`, 'success');
}

function handleDeletePlaylist(id) {
    const playlistIndex = playlists.findIndex(p => p.id === id);
    if (playlistIndex === -1) return;
    const playlistName = playlists[playlistIndex].name;

    if (!confirm(`Are you sure you want to delete the playlist "${escapeHTML(playlistName)}"? This cannot be undone.`)) return;

    playlists.splice(playlistIndex, 1);

    if (currentPlaylistId === id) {
        currentPlaylistId = null;
        saveLastSelectedPlaylist(null);
        if (playlists.length > 0) {
            // Try selecting the next or previous playlist, otherwise the first
            const nextIndex = Math.min(playlistIndex, playlists.length - 1);
            selectPlaylist(playlists[nextIndex >= 0 ? nextIndex : 0]?.id);
        } else {
            updateUIForNoSelection();
        }
    }
    savePlaylists();
    renderPlaylists(); // Re-render filtered list if needed
    showToast(`Playlist "${escapeHTML(playlistName)}" deleted.`, 'info');
}

function handleRenamePlaylist(id) {
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) return;
    const newName = prompt('Enter new name for playlist:', playlist.name);
    if (newName && newName.trim() && newName.trim() !== playlist.name) {
        const oldName = playlist.name;
        playlist.name = newName.trim();
        savePlaylists();
        renderPlaylists(); // Re-render filtered list if needed
        if (currentPlaylistId === id) {
            currentPlaylistTitleEl.textContent = escapeHTML(playlist.name);
        }
        showToast(`Playlist renamed from "${escapeHTML(oldName)}" to "${escapeHTML(playlist.name)}".`, 'info');
    }
}

function selectPlaylist(id) {
    const selectedPlaylist = playlists.find(p => p.id === id);
    if (!selectedPlaylist) {
        console.error("Playlist not found:", id);
        updateUIForNoSelection();
        return;
    }

    currentPlaylistId = id;
    currentPage = 1; // Reset to first page when selecting a playlist
    saveLastSelectedPlaylist(id);

    // --- UX Improvement: Clear search when selecting a playlist ---
    if (playlistSearchInput.value !== '') {
        playlistSearchInput.value = '';
        // Re-rendering playlists will happen below anyway
    }
    // --- End UX Improvement ---

    // Update UI
    currentPlaylistTitleEl.textContent = escapeHTML(selectedPlaylist.name);
    videoFormEl.classList.remove('hidden');
    playlistActionsEl.classList.remove('hidden');
    addVideoBtn.disabled = videoUrlInput.value.trim() === ''; // Set initial state based on input
    videoPlaceholderEl.classList.add('hidden');
    playerWrapperEl.classList.add('hidden');
    stopVideo(); // This will also clear the highlight
    updatePlayingVideoHighlight(null); // Explicitly clear highlight

    renderPlaylists(); // Update active state
    renderVideos(); // Render videos for the selected playlist
}

function handleClearPlaylist() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        showToast('Playlist is already empty.', 'info');
        return;
    }
    if (!confirm(`Are you sure you want to remove all videos from "${escapeHTML(currentPlaylist.name)}"?`)) return;

    currentPlaylist.videos = [];
    savePlaylists();
    stopVideo();
    playerWrapperEl.classList.add('hidden');
    renderVideos(); // Re-render the empty grid/placeholder
    renderPlaylists(); // Update video count in sidebar
    showToast(`All videos removed from "${escapeHTML(currentPlaylist.name)}".`, 'info');
}

function handlePlaylistSearch() {
    renderPlaylists(); // Re-render with the current search term
}

// --- Playlist Shuffle Functionality (Added) ---
function handleShufflePlaylist() {
    if (!currentPlaylistId) {
        showToast('Please select a playlist to shuffle.', 'info');
        return;
    }
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 2) {
        showToast('Playlist needs at least two videos to shuffle.', 'info');
        return;
    }

    // Fisher-Yates (Knuth) Shuffle Algorithm
    let currentIndex = currentPlaylist.videos.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [currentPlaylist.videos[currentIndex], currentPlaylist.videos[randomIndex]] = [
            currentPlaylist.videos[randomIndex], currentPlaylist.videos[currentIndex]];
    }

    savePlaylists();
    currentPage = 1; // Reset to first page after shuffle
    renderVideos(); // Re-render the video grid with the shuffled order
    showToast(`Playlist "${escapeHTML(currentPlaylist.name)}" shuffled!`, 'success');
}
// --- End Playlist Shuffle Functionality ---

// --- Video Management ---

// Helper function to update the visual highlight on the playing video card
function updatePlayingVideoHighlight(videoId) {
    // Remove 'playing' class from all video cards first
    videoGridEl.querySelectorAll('.video-card.playing').forEach(card => {
        card.classList.remove('playing');
    });

    // Add 'playing' class to the current video card if an ID is provided
    if (videoId) {
        const currentVideoCard = videoGridEl.querySelector(`.video-card[data-video-id="${videoId}"]`);
        if (currentVideoCard) {
            currentVideoCard.classList.add('playing');
        }
    }
}

async function handleAddVideo() {
    const url = videoUrlInput.value.trim();
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!url) { showToast('Please enter a YouTube video URL.', 'error'); return; }
    if (!currentPlaylist) return; // Should not happen if form is visible

    const videoId = extractVideoId(url);
    if (!videoId) { showToast('Invalid YouTube URL. Please paste a valid video link.', 'error'); videoUrlInput.focus(); return; }
    if (currentPlaylist.videos.some(v => v.id === videoId)) { showToast(`Video is already in "${escapeHTML(currentPlaylist.name)}".`, 'info'); return; }

    // UI Feedback: Loading state
    addVideoBtn.disabled = true;
    addVideoBtn.innerHTML = ICONS.loading + ' Adding...';
    videoUrlInput.disabled = true;

    try {
        // Use noembed.com - Add error handling!
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        if (!response.ok) {
            // Try to get error message, fallback to status text
            let errorMsg = `Failed to fetch video info (HTTP ${response.status}).`;
            try { const errData = await response.json(); errorMsg = errData.error || errorMsg; } catch (_) { }
            throw new Error(errorMsg);
        }

        const data = await response.json();
        if (data.error) { throw new Error(data.error); } // Handle errors reported by noembed

        const video = {
            id: videoId,
            title: data.title || 'Untitled Video',
            thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`, // Fallback thumbnail
            url: `https://youtu.be/${videoId}`
        };

        currentPlaylist.videos.push(video);
        currentPage = Math.ceil(currentPlaylist.videos.length / videosPerPage); // Go to the last page where the new video is
        savePlaylists();
        renderVideos();
        renderPlaylists(); // Update count in sidebar
        videoUrlInput.value = ''; // Clear input on success
        showToast(`Video "${escapeHTML(video.title)}" added.`, 'success');

    } catch (error) {
        console.error('Add video error:', error);
        showToast(`Error adding video: ${error.message}`, 'error');
    } finally {
        // Restore button state
        addVideoBtn.disabled = false; // Re-enable, state depends on input now
        addVideoBtn.innerHTML = ICONS.add + ' Add Video';
        videoUrlInput.disabled = false;
        videoUrlInput.focus(); // Focus back for next add
    }
}

function handleDeleteVideo(videoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;

    const videoIndex = currentPlaylist.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) return;

    const videoTitle = currentPlaylist.videos[videoIndex].title;
    // No confirmation needed for removing a single video, maybe add later if desired
    // if (!confirm(`Remove "${escapeHTML(videoTitle)}" from this playlist?`)) return;

    // Stop if playing this video
    if (videoId === currentlyPlayingVideoId) {
        stopVideo();
        playerWrapperEl.classList.add('hidden');
        handleClosePlayer(); // Also ensure player is hidden if its video is deleted
    }

    currentPlaylist.videos.splice(videoIndex, 1);

    // Adjust current page if necessary (e.g., deleting the last item on a page)
    const totalPages = Math.ceil(currentPlaylist.videos.length / videosPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (currentPlaylist.videos.length === 0) {
        currentPage = 1; // Reset if playlist becomes empty
    }

    savePlaylists();
    renderVideos();
    renderPlaylists(); // Update count in sidebar
    showToast(`Removed "${escapeHTML(videoTitle)}".`, 'info');
}

function handleReorderVideo(videoIdToMove, targetVideoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;

    const videoToMoveIndex = currentPlaylist.videos.findIndex(v => v.id === videoIdToMove);
    if (videoToMoveIndex === -1) return;

    const [videoToMove] = currentPlaylist.videos.splice(videoToMoveIndex, 1); // Remove the video

    if (targetVideoId === null) {
        // Dropped at the end (or empty space)
        currentPlaylist.videos.push(videoToMove);
    } else {
        const targetIndex = currentPlaylist.videos.findIndex(v => v.id === targetVideoId);
        if (targetIndex !== -1) {
            // Insert before the target video
            currentPlaylist.videos.splice(targetIndex, 0, videoToMove);
        } else {
            // Target not found (should not happen if drag logic is correct), append to end
            currentPlaylist.videos.push(videoToMove);
        }
    }

    savePlaylists();
    renderVideos(); // Re-render the grid with the new order
    // No toast needed for reorder unless desired
}

function playVideo(videoId) {
    if (!videoId) {
        console.error("playVideo called with null or undefined videoId.");
        return;
    }

    intendedVideoId = videoId;
    playerWrapperEl.classList.remove('hidden');
    updatePlayingVideoHighlight(videoId);

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    const videoData = currentPlaylist?.videos.find(v => v.id === videoId);

    // Update MediaSession metadata immediately, even if the player isn't ready
    if ('mediaSession' in navigator) {
        updateMediaSessionMetadata(videoData || null);
        // Set state to playing optimistically. It will be corrected by onStateChange if needed.
        navigator.mediaSession.playbackState = "playing";
    }

    // Ensure silent audio context is active *before* potential playback attempts
    startSilentAudio();

    if (ytPlayer && isPlayerReady) {
        try {
            // Ensure audio context is active right before loading
            startSilentAudio();
            ytPlayer.loadVideoById(videoId);
        } catch (error) {
            console.error("playVideo: Error calling loadVideoById:", error);
            showToast("Failed to load video in player.", "error");
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';
            updatePlayingVideoHighlight(null);
            playerWrapperEl.classList.add('hidden');
            intendedVideoId = null;
            videoIdToPlayOnReady = null;
        }
    } else {
        // Queue the video ID if player isn't ready
        videoIdToPlayOnReady = videoId;
        // If player isn't ready, ensure silent audio is running for when it becomes ready
        startSilentAudio();
    }
}

function stopVideo() {
    // console.log("stopVideo called."); // Removed verbose log
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        try {
            ytPlayer.stopVideo();
        } catch (e) {
            console.warn("Error calling ytPlayer.stopVideo():", e); // Keep warning
        }
    }
    currentlyPlayingVideoId = null;
    intendedVideoId = null;
    videoIdToPlayOnReady = null;
    updatePlayingVideoHighlight(null);
    if ('mediaSession' in navigator) {
        // console.log("MediaSession: Setting state to 'none' (stopVideo)"); // Removed verbose log
        navigator.mediaSession.playbackState = 'none';
    }
}

function extractVideoId(url) {
    // Regex covers various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// --- Rendering ---
function renderPlaylists() {
    const searchTerm = playlistSearchInput.value.toLowerCase();
    const filteredPlaylists = playlists.filter(p => p.name.toLowerCase().includes(searchTerm));

    if (filteredPlaylists.length === 0) {
        playlistListEl.innerHTML = '';
        noPlaylistsMessageEl.classList.remove('hidden');
        noPlaylistsMessageEl.textContent = searchTerm ? 'No playlists match your search.' : 'No playlists created yet.';
    } else {
        noPlaylistsMessageEl.classList.add('hidden');
        playlistListEl.innerHTML = ''; // Clear existing content first
        const fragment = document.createDocumentFragment(); // Create a fragment
        filteredPlaylists.forEach(playlist => {
            const li = document.createElement('li');
            li.className = `playlist-item ${playlist.id === currentPlaylistId ? 'active' : ''}`;
            li.dataset.id = playlist.id;
            li.innerHTML = `
                        <span class="playlist-name">${escapeHTML(playlist.name)}</span>
                        <span class="playlist-count">${playlist.videos.length}</span>
                        <div class="controls">
                            <button class="icon-button rename-btn" title="Rename Playlist">
                                ${ICONS.rename}
                                <span class="visually-hidden">Rename ${escapeHTML(playlist.name)}</span>
                            </button>
                            <button class="icon-button delete-btn" title="Delete Playlist">
                                ${ICONS.delete}
                                <span class="visually-hidden">Delete ${escapeHTML(playlist.name)}</span>
                            </button>
                        </div>
                    `;
            fragment.appendChild(li); // Add the item to the fragment
        });
        playlistListEl.appendChild(fragment); // Append the fragment to the DOM once
    }
}

function renderVideos() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);

    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        videoGridEl.innerHTML = ''; // Clear grid
        paginationControlsEl.classList.add('hidden'); // Hide pagination if no videos
        videoPlaceholderEl.textContent = currentPlaylist ? `Playlist "${escapeHTML(currentPlaylist.name)}" is empty. Add some videos!` : 'Select or create a playlist.';
        videoPlaceholderEl.classList.remove('hidden');
        return;
    }

    // --- Pagination Logic ---
    const totalVideos = currentPlaylist.videos.length;
    const totalPages = Math.ceil(totalVideos / videosPerPage);

    // Ensure currentPage is valid (e.g., after deletion)
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1; // Should be handled by the empty check above, but safety first
    }

    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const videosToRender = currentPlaylist.videos.slice(startIndex, endIndex);
    // --- End Pagination Logic ---

    videoPlaceholderEl.classList.add('hidden'); // Hide placeholder
    videoGridEl.innerHTML = ''; // Clear existing grid content
    const fragment = document.createDocumentFragment(); // Create a fragment

    videosToRender.forEach(video => { // Iterate over the page's videos only
        const div = document.createElement('div');
        div.className = 'video-card';
        div.dataset.videoId = video.id;
        div.draggable = true;
        div.innerHTML = `
                    <div class="video-card" data-video-id="${video.id}" draggable="true">
                        <div class="thumbnail-wrapper">
                           <img src="${escapeHTML(video.thumbnail)}" class="thumbnail" alt="" loading="lazy"> <!-- Alt can be empty as title is below -->
                        </div>
                        <div class="video-info">
                             <h4>${escapeHTML(video.title)}</h4>
                             <div class="video-controls">
                                 <span class="drag-handle" title="Drag to reorder">
                                    ${ICONS.drag}
                                    <span class="visually-hidden">Drag to reorder ${escapeHTML(video.title)}</span>
                                 </span>
                                 <button class="icon-button delete-video-btn" title="Remove from playlist">
                                    ${ICONS.delete}
                                    <span class="visually-hidden">Remove ${escapeHTML(video.title)} from playlist</span>
                                 </button>
                             </div>
                        </div>
                    </div>
                `;
        fragment.appendChild(div.firstElementChild); // Append the actual card element from the innerHTML
    });

    videoGridEl.appendChild(fragment); // Append the fragment to the DOM once

    // Render pagination controls after rendering videos
    renderPaginationControls(totalVideos, totalPages);
}

// --- UI Updates ---
function updateUIForNoSelection() {
    currentPlaylistId = null;
    saveLastSelectedPlaylist(null);

    currentPlaylistTitleEl.textContent = 'No playlist selected';
    videoFormEl.classList.add('hidden');
    playlistActionsEl.classList.add('hidden');
    addVideoBtn.disabled = true;
    videoGridEl.innerHTML = '';
    playerWrapperEl.classList.add('hidden');
    stopVideo();
    videoPlaceholderEl.textContent = 'Create or select a playlist to get started.';
    videoPlaceholderEl.classList.remove('hidden');

    renderPlaylists(); // Ensure playlist list is updated (e.g., no active item)
}

function handleAutoplayToggle() {
    isAutoplayEnabled = autoplayToggle.checked;
    saveAutoplaySetting();
    showToast(`Autoplay ${isAutoplayEnabled ? 'enabled' : 'disabled'}.`, 'info');
}

// --- Import / Export ---
function handleExportPlaylists() {
    if (playlists.length === 0) {
        showToast('No playlists to export.', 'info');
        return;
    }
    try {
        const dataStr = JSON.stringify(playlists, null, 2); // Pretty print JSON
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `playlists_backup_${new Date().toISOString().split('T')[0]}.json`; // YYYY-MM-DD
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Playlists exported successfully!', 'success');
    } catch (error) {
        console.error("Export error:", error);
        showToast('Failed to export playlists.', 'error');
    }
}

function handleImportPlaylists(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            // Basic validation: Is it an array? Does it look like playlists?
            if (!Array.isArray(importedData) || (importedData.length > 0 && typeof importedData[0].id === 'undefined')) {
                throw new Error("Invalid file format. Expected an array of playlists.");
            }

            // Merge or replace? Ask user? For simplicity, let's merge and avoid duplicates by ID.
            const existingIds = new Set(playlists.map(p => p.id));
            let addedCount = 0;
            let skippedCount = 0;

            importedData.forEach(importedPlaylist => {
                // Basic validation of playlist structure
                if (importedPlaylist && typeof importedPlaylist.id !== 'undefined' && typeof importedPlaylist.name === 'string') {
                    // Ensure videos array exists and has basic structure
                    if (!Array.isArray(importedPlaylist.videos)) importedPlaylist.videos = [];
                    importedPlaylist.videos = importedPlaylist.videos.filter(v => v && typeof v.id === 'string' && typeof v.title === 'string');

                    if (!existingIds.has(importedPlaylist.id)) {
                        playlists.push(importedPlaylist);
                        existingIds.add(importedPlaylist.id);
                        addedCount++;
                    } else {
                        skippedCount++;
                        // Optionally implement merging logic here (e.g., update existing)
                    }
                } else {
                    skippedCount++; // Skip malformed playlist entries
                }
            });

            savePlaylists();
            playlistSearchInput.value = ''; // Clear search after import
            renderPlaylists();
            showToast(`Imported ${addedCount} playlists. Skipped ${skippedCount} duplicates or invalid entries.`, 'success');
            // Select the first imported playlist if none was selected before
            if (!currentPlaylistId && playlists.length > 0) {
                selectPlaylist(playlists[0].id);
            }

        } catch (error) {
            console.error("Import error:", error);
            showToast(`Import failed: ${error.message}`, 'error');
        } finally {
            // Reset file input value to allow importing the same file again
            importFileEl.value = '';
        }
    };
    reader.onerror = () => {
        showToast('Error reading file.', 'error');
        importFileEl.value = '';
    };
    reader.readAsText(file);
}

function handleVisualSwitchClick(event) {
    // We only want to react if the click wasn't directly on the hidden input itself
    // (though that's unlikely as it's visually hidden).
    // This primarily ensures clicking the visual parts (slider/background) works.
    // The label click is handled natively by the 'for' attribute.
    if (event.target !== autoplayToggle) {
        // Programmatically click the hidden checkbox.
        // This will toggle its 'checked' state AND trigger the 'change' event listener
        // that we already have attached (handleAutoplayToggle).
        autoplayToggle.click();
    }
}

// --- Utility ---
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

let toastTimeout = null;
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // type can be 'info', 'success', 'error'

    let icon = ICONS.info;
    if (type === 'success') icon = ICONS.success;
    if (type === 'error') icon = ICONS.error;

    toast.innerHTML = `
                ${icon}
                <span>${escapeHTML(message)}</span>
            `;
    toastContainerEl.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10); // Small delay for transition

    // Auto-dismiss
    const timeoutId = setTimeout(() => {
        toast.classList.remove('show');
        // Remove from DOM after transition
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);

    // Allow manual dismiss
    toast.addEventListener('click', () => {
        clearTimeout(timeoutId);
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    });
}

function handleClosePlayer() {
    console.log("handleClosePlayer called.");
    stopVideo(); // stopVideo now handles clearing state and highlight
    playerWrapperEl.classList.add('hidden');
    if ('mediaSession' in navigator) {
        console.log("MediaSession: Clearing metadata (handleClosePlayer)");
        updateMediaSessionMetadata(null); // Clear metadata as well
        // Ensure state is none
        navigator.mediaSession.playbackState = 'none';
    }
}

function renderPaginationControls(totalVideos, totalPages) {
    // const currentPlaylist = playlists.find(p => p.id === currentPlaylistId); // Data already available
    // if (!currentPlaylist || currentPlaylist.videos.length <= videosPerPage) {
    if (totalVideos <= videosPerPage) { // Simpler check based on passed data
        // Hide controls if not needed (single page or empty)
        paginationControlsEl.classList.add('hidden');
        return;
    }

    paginationControlsEl.classList.remove('hidden'); // Show controls
    // const totalVideos = currentPlaylist.videos.length; // Passed as argument
    // const totalPages = Math.ceil(totalVideos / videosPerPage); // Passed as argument

    pageInfoEl.textContent = `Page ${currentPage} of ${totalPages}`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// --- Utility ---

// Debounce function: prevents function from running too often
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// --- Media Session API Integration ---

function updateMediaSessionMetadata(video) {
    if (!('mediaSession' in navigator)) {
        // console.log("Media Session API not supported.");
        return;
    }

    if (!video) {
        // Clear metadata if no video is provided (e.g., on stop)
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
        // console.log("Media Session metadata cleared.");
        return;
    }

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    const playlistName = currentPlaylist ? currentPlaylist.name : 'Playlist';

    // console.log("Updating Media Session Metadata for:", video.title);

    navigator.mediaSession.metadata = new MediaMetadata({
        title: video.title,
        artist: 'YouTube', // Or extract channel if available from noembed/API later
        album: playlistName,
        artwork: [
            // Provide different sizes if available, starting with largest
            // { src: video.thumbnail.replace('mqdefault', 'maxresdefault'), sizes: '1280x720', type: 'image/jpeg' }, // Might not exist
            { src: video.thumbnail.replace('mqdefault', 'hqdefault'), sizes: '480x360', type: 'image/jpeg' }, // High quality
            { src: video.thumbnail, sizes: '320x180', type: 'image/jpeg' }, // Medium quality (mqdefault)
            // { src: video.thumbnail.replace('mqdefault', 'sddefault'), sizes: '640x480', type: 'image/jpeg' }, // Standard definition
        ]
    });

    // Update playback state (usually done in onPlayerStateChange)
    // navigator.mediaSession.playbackState = "playing"; // Set this when playback actually starts

    // setupMediaSessionActionHandlers(); // Ensure handlers are set up -- REMOVED FROM HERE
}

function setupMediaSessionActionHandlers() {
     if (!('mediaSession' in navigator)) return;

    // Clear previous handlers
    navigator.mediaSession.setActionHandler('play', null);
    navigator.mediaSession.setActionHandler('pause', null);
    navigator.mediaSession.setActionHandler('stop', null);
    navigator.mediaSession.setActionHandler('previoustrack', null);
    navigator.mediaSession.setActionHandler('nexttrack', null);


    navigator.mediaSession.setActionHandler('play', () => {
        const videoToPlayId = intendedVideoId || currentlyPlayingVideoId;
        // Ensure audio context is active when play is triggered from lock screen/OS
        startSilentAudio();

        if (ytPlayer && typeof ytPlayer.playVideo === 'function' && isPlayerReady) {
            navigator.mediaSession.playbackState = "playing";
            ytPlayer.playVideo();
        } else if (videoToPlayId) {
             // If player isn't ready or video wasn't playing, restart playVideo sequence
             navigator.mediaSession.playbackState = "playing";
             playVideo(videoToPlayId);
        } else {
             // No video context found.
             navigator.mediaSession.playbackState = "none";
        }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        navigator.mediaSession.playbackState = "paused";
        if (ytPlayer && typeof ytPlayer.pauseVideo === 'function' && isPlayerReady) {
            ytPlayer.pauseVideo();
        }
        // Keep silent audio running even when paused
        startSilentAudio();
    });

    navigator.mediaSession.setActionHandler('stop', () => {
        handleClosePlayer(); // This already calls stopVideo and updates MediaSession
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        const referenceVideoId = intendedVideoId || currentlyPlayingVideoId;
        // Ensure audio context is active for track change
        startSilentAudio();
        if (!referenceVideoId) {
             console.warn("PreviousTrack action: No current or intended video ID found.");
             const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
             if (currentPlaylist && currentPlaylist.videos.length > 0) {
                 playVideo(currentPlaylist.videos[currentPlaylist.videos.length - 1].id); // Play last video
             }
             return;
        }
        playPreviousVideo(referenceVideoId); // Ensure playPreviousVideo exists or implement it
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
         const referenceVideoId = intendedVideoId || currentlyPlayingVideoId;
         // Ensure audio context is active for track change
         startSilentAudio();
         if (!referenceVideoId) {
             console.warn("NextTrack action: No current or intended video ID found.");
             const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
             if (currentPlaylist && currentPlaylist.videos.length > 0) {
                 playVideo(currentPlaylist.videos[0].id); // Play first video
             }
             return;
         }
        playNextVideo(referenceVideoId);
    });
}

// --- Touch Drag and Drop Handlers ---

function handleTouchStart(event) {
    const targetCard = event.target.closest('.video-card[draggable="true"]');
    const dragHandle = event.target.closest('.drag-handle');

    if (targetCard && dragHandle) {
        isTouchDragging = true;
        draggedVideoId = targetCard.dataset.videoId;
        touchDraggedElement = targetCard;
        touchDragStartY = event.touches[0].clientY;

        touchDraggedElement.classList.add('dragging');

        // Removed haptic feedback
        // if (navigator.vibrate) {
        //     navigator.vibrate(50);
        // }
    } else {
        isTouchDragging = false;
        draggedVideoId = null;
        touchDraggedElement = null;
    }
}

function handleTouchMove(event) {
    if (!isTouchDragging || !touchDraggedElement) return;

    event.preventDefault(); // *** Crucial: Prevent page scrolling while dragging ***

    const touch = event.touches[0];
    const currentY = touch.clientY;

    // Find the element under the current touch position
    // Temporarily hide the dragged element to find what's underneath
    touchDraggedElement.style.visibility = 'hidden';
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    touchDraggedElement.style.visibility = ''; // Restore visibility

    const targetCard = elementUnderTouch ? elementUnderTouch.closest('.video-card') : null;

    // Clear previous drag-over styles
    clearDragOverStyles();

    if (targetCard && targetCard !== touchDraggedElement) {
        targetCard.classList.add('drag-over');
        dragTargetElement = targetCard; // Use the same variable as mouse drag for consistency
    } else {
        dragTargetElement = null; // No valid drop target under finger
    }

    // Optional: Move the element visually with the touch (more complex)
    // const deltaY = currentY - touchDragStartY;
    // touchDraggedElement.style.transform = `translateY(${deltaY}px)`;
}

function handleTouchEnd(event) {
    if (!isTouchDragging || !touchDraggedElement) {
         clearDragOverStyles();
         if (touchDraggedElement) {
            touchDraggedElement.classList.remove('dragging');
         }
         isTouchDragging = false;
         draggedVideoId = null;
         touchDraggedElement = null;
         dragTargetElement = null;
        return;
    }

    touchDraggedElement.classList.remove('dragging');
    clearDragOverStyles();

    const dropTargetId = dragTargetElement ? dragTargetElement.dataset.videoId : null;

    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
        handleReorderVideo(draggedVideoId, dropTargetId);
        // Removed haptic feedback
        // if (navigator.vibrate) {
        //      navigator.vibrate(50);
        // }
    } else if (draggedVideoId && !dropTargetId) {
        // Handle dropping outside - no action needed here now
    }

    isTouchDragging = false;
    draggedVideoId = null;
    touchDraggedElement = null;
    dragTargetElement = null;
}

// --- Start the app ---
init();

// Function to initialize and play silent audio (More Aggressive Source Restart)
function startSilentAudio() {
    if (!(window.AudioContext || window.webkitAudioContext)) {
        console.warn("Web Audio API not supported. Silent audio hack disabled.");
        return;
    }

    const resumeAudio = () => {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log("AudioContext resumed via user interaction.");
                startSilentAudio(); // Re-run checks and restart source
            }).catch(e => console.error("Error resuming AudioContext via user interaction:", e));
        }
        // Clean up listeners after potential use
        document.removeEventListener('click', resumeAudio, { capture: true });
        document.removeEventListener('touchstart', resumeAudio, { capture: true });
        document.removeEventListener('keydown', resumeAudio, { capture: true });
    };

    const addInteractionListeners = () => {
         document.removeEventListener('click', resumeAudio, { capture: true });
         document.removeEventListener('touchstart', resumeAudio, { capture: true });
         document.removeEventListener('keydown', resumeAudio, { capture: true });
         console.log("Adding interaction listeners to resume AudioContext.");
         document.addEventListener('click', resumeAudio, { once: true, capture: true });
         document.addEventListener('touchstart', resumeAudio, { once: true, capture: true });
         document.addEventListener('keydown', resumeAudio, { once: true, capture: true });
    };

    // 1. Ensure AudioContext Exists and is Not Closed
    if (!audioContext || audioContext.state === 'closed') {
        try {
            console.log("Creating new AudioContext.");
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            silentSource = null; // Ensure silentSource is reset
            console.log("New AudioContext state:", audioContext.state);
            // Add a state change listener for debugging context suspensions
            audioContext.onstatechange = () => {
                 console.log("AudioContext state changed to:", audioContext.state);
                 // If it becomes suspended unexpectedly, try to resume or add listeners
                 if (audioContext.state === 'suspended') {
                     startSilentAudio(); // Re-run the logic to handle suspension
                 } else if (audioContext.state === 'running') {
                     startSilentAudio(); // Ensure source is playing if context resumes
                 }
            };
        } catch (e) {
            console.error("Web Audio API is not supported or failed to initialize:", e);
            audioContext = null;
            silentSource = null;
            return;
        }
    }

    // 2. Handle Suspended State
    if (audioContext.state === 'suspended') {
        console.log("AudioContext is suspended. Attempting programmatic resume...");
        audioContext.resume().then(() => {
            console.log("AudioContext resumed programmatically. State:", audioContext.state);
            // Crucially, call startSilentAudio *again* after successful resume
            // to ensure the silent source is created/restarted in the now running context.
            startSilentAudio();
        }).catch(e => {
            console.warn("Programmatic resume failed (likely requires user interaction). Adding listeners.", e);
            addInteractionListeners();
        });
        // Stop further execution in this call if suspended, wait for resume.
        return;
    }

    // 3. Ensure Silent Source is Playing if Context is Running
    if (audioContext.state === 'running') {
        // Stop and disconnect any *existing* source node.
        // This handles cases where the previous node might be in a bad state.
        if (silentSource) {
            try {
                silentSource.stop();
                silentSource.disconnect();
                // console.log("Stopped and disconnected existing silent source.");
            } catch (e) { /* Ignore errors (might be already stopped/disconnected) */ }
            silentSource = null;
        }

        // Create and start a *new* silent source node.
        try {
            // console.log("Creating and starting new silent audio buffer source.");
            silentSource = audioContext.createBufferSource();
            const sampleRate = audioContext.sampleRate;
            // Using a minimal buffer is often sufficient
            const buffer = audioContext.createBuffer(1, 1, sampleRate);
            silentSource.buffer = buffer;
            silentSource.loop = true;
            silentSource.connect(audioContext.destination);
            silentSource.start(0);
            // console.log("New silent audio source started.");

            // If source started successfully, remove interaction listeners
            document.removeEventListener('click', resumeAudio, { capture: true });
            document.removeEventListener('touchstart', resumeAudio, { capture: true });
            document.removeEventListener('keydown', resumeAudio, { capture: true });

        } catch (startError) {
            console.error("Could not start silent audio source:", startError);
            silentSource = null; // Ensure source is null if start failed
            // If starting failed even while context is 'running', something is wrong.
            // Maybe try adding interaction listeners as a fallback?
            addInteractionListeners();
        }
    }
}

// Add a 'playPreviousVideo' function if it doesn't exist
function playPreviousVideo(currentVideoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1) {
        stopVideo();
        handleClosePlayer();
        return;
    }

    let currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentVideoId);

    if (currentIndex === -1) {
        console.warn(`playPreviousVideo: Current video ID "${currentVideoId}" not found. Playing last video.`);
        if (currentPlaylist.videos.length > 0) {
            playVideo(currentPlaylist.videos[currentPlaylist.videos.length - 1].id);
        } else {
            stopVideo();
            handleClosePlayer();
        }
        return;
    }

    const previousIndex = (currentIndex - 1 + currentPlaylist.videos.length) % currentPlaylist.videos.length;
    const previousVideo = currentPlaylist.videos[previousIndex];

    if (previousVideo) {
        playVideo(previousVideo.id);
    } else {
        console.error(`playPreviousVideo: Could not find previous video data at index ${previousIndex}. Stopping.`);
        stopVideo();
        handleClosePlayer();
    }
}

// ... rest of the code ...