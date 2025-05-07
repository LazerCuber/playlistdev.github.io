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
const shufflePlaylistBtn = document.getElementById('shufflePlaylistBtn');
const audioOnlyToggle = document.getElementById('audioOnlyToggle');
const paginationControlsEl = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfoEl = document.getElementById('pageInfo');
const audioOnlyInfoEl = document.getElementById('audioOnlyInfo');
const audioOnlyTitleEl = audioOnlyInfoEl.querySelector('.audio-title');

// --- State ---
let playlists = [];
let currentPlaylistId = null;
let ytPlayer = null;
let isPlayerReady = false;
let videoIdToPlayOnReady = null;
let isAutoplayEnabled = false;
let isAudioOnlyMode = false;
let currentlyPlayingVideoId = null;
let draggedVideoId = null;
let dragTargetElement = null;
let currentTheme = 'light';
let isResizing = false;
let lastSidebarWidth = null;
let isTouchDragging = false;
let touchDragStartY = 0;
let touchDraggedElement = null;
let potentialPlayVideoId = null;
let potentialPlayCard = null;
const videosPerPage = 20;
let currentPage = 1;
let isYTApiReady = false;

// --- Icons ---
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
    loadAudioOnlySetting();
    loadSidebarWidth();
    renderPlaylists();

    // Preload YouTube Player API immediately
    loadYouTubePlayerAPI();

    const lastSelectedId = localStorage.getItem('lastSelectedPlaylistId');
    if (lastSelectedId && playlists.some(p => p.id === parseInt(lastSelectedId))) {
        selectPlaylist(parseInt(lastSelectedId));
    } else if (playlists.length > 0) {
        selectPlaylist(playlists[0].id);
    } else {
        updateUIForNoSelection();
    }

    setupEventListeners();
    updateThemeIcon();
}

// --- YouTube Player API ---
let ytApiLoadPromise = null;

function loadYouTubePlayerAPI() {
    if (ytApiLoadPromise) return ytApiLoadPromise; // Return existing promise if already loading

    ytApiLoadPromise = new Promise((resolve) => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Ensure the global callback is set
        window.onYouTubeIframeAPIReady = () => {
            isYTApiReady = true;
            resolve();
        };
    });

    return ytApiLoadPromise;
}

// --- Sidebar Resizing ---
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
    document.body.style.userSelect = 'none';
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

    const currentWidth = sidebarEl.getBoundingClientRect().width;
    saveSidebarWidth(currentWidth);
}

// --- Event Listeners ---
function setupEventListeners() {
    createPlaylistBtn.addEventListener('click', handleCreatePlaylist);
    playlistNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleCreatePlaylist(); });
    addVideoBtn.addEventListener('click', handleAddVideo);
    videoUrlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !addVideoBtn.disabled) handleAddVideo(); });
    videoUrlInput.addEventListener('input', () => { addVideoBtn.disabled = videoUrlInput.value.trim() === ''; });
    autoplayToggle.addEventListener('change', handleAutoplayToggle);
    audioOnlyToggle.addEventListener('change', handleAudioOnlyToggle);

    autoplaySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    const audioOnlySwitchDiv = audioOnlyToggle.closest('.switch');
    if (audioOnlySwitchDiv) {
        audioOnlySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    }

    clearPlaylistBtn.addEventListener('click', handleClearPlaylist);
    themeToggleBtn.addEventListener('click', toggleTheme);
    shufflePlaylistBtn.addEventListener('click', handleShufflePlaylist);
    playlistSearchInput.addEventListener('input', debounce(handlePlaylistSearch, 300));
    importBtn.addEventListener('click', () => importFileEl.click());
    importFileEl.addEventListener('change', handleImportPlaylists);
    exportBtn.addEventListener('click', handleExportPlaylists);

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
        } else if (!event.target.closest('.controls')) {
            selectPlaylist(playlistId);
        }
    });

    // Video Actions (Delegation)
    videoGridEl.addEventListener('click', (event) => {
        const videoCard = event.target.closest('.video-card');
        if (!videoCard) return;
        const videoId = videoCard.dataset.videoId;

        if (event.target.closest('.delete-video-btn')) {
            event.stopPropagation(); handleDeleteVideo(videoId);
        } else if (!event.target.closest('.drag-handle')) {
            playVideo(videoId);
        }
    });

    setupDragAndDropListeners();
    closePlayerBtn.addEventListener('click', handleClosePlayer);

    // Pagination Listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderVideos();
        }
    });
    nextPageBtn.addEventListener('click', () => {
        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        if (!currentPlaylist) return;
        const totalPages = Math.ceil(currentPlaylist.videos.length / videosPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderVideos();
        }
    });

    // Touch Events for Drag/Drop
    videoGridEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    videoGridEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    videoGridEl.addEventListener('touchend', handleTouchEnd);
    videoGridEl.addEventListener('touchcancel', handleTouchEnd);

    // Playlist Drag & Drop
    playlistListEl.addEventListener('dragstart', handlePlaylistDragStart);
    playlistListEl.addEventListener('dragend', handlePlaylistDragEnd);
    playlistListEl.addEventListener('dragover', handlePlaylistDragOver);
    playlistListEl.addEventListener('dragleave', handlePlaylistDragLeave);
    playlistListEl.addEventListener('drop', handlePlaylistDrop);
}

// --- Drag and Drop (Videos) ---
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
        setTimeout(() => videoCard.classList.add('dragging'), 0); // Add class after a tick for visual feedback
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
    event.preventDefault();
    if (!draggedVideoId) return;
    event.dataTransfer.dropEffect = 'move';

    const targetCard = event.target.closest('.video-card');
    let currentTarget = null;
    if (targetCard && targetCard.dataset.videoId !== draggedVideoId) {
        currentTarget = targetCard;
    }

    if (currentTarget !== dragTargetElement) {
        if (dragTargetElement) {
            dragTargetElement.classList.remove('drag-over');
        }
        if (currentTarget) {
            currentTarget.classList.add('drag-over');
        }
        dragTargetElement = currentTarget;
    }

    if (!currentTarget) {
         event.dataTransfer.dropEffect = 'none';
    }
}

function handleDragLeave(event) {
    // Prevents flicker when moving between cards.
    if (!event.relatedTarget || !videoGridEl.contains(event.relatedTarget)) {
        if (dragTargetElement) {
            dragTargetElement.classList.remove('drag-over');
        }
        dragTargetElement = null;
    }
}

function handleDrop(event) {
    event.preventDefault();
    const dropTargetId = dragTargetElement ? dragTargetElement.dataset.videoId : null;

    clearDragOverStyles();

    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
        handleReorderVideo(draggedVideoId, dropTargetId);
    }
    // Resetting state happens in handleDragEnd
}

function clearDragOverStyles() {
    const highlightedCard = videoGridEl.querySelector('.video-card.drag-over');
    if(highlightedCard) {
        highlightedCard.classList.remove('drag-over');
    }
    if (dragTargetElement) {
         dragTargetElement.classList.remove('drag-over');
    }
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

// --- YouTube Player API ---

// This function MUST be global for the API to find it
function onYouTubeIframeAPIReady() {
    isYTApiReady = true;
    // If a video was queued *before* the API was ready,
    // the playVideo call will now handle initialization.
    if (videoIdToPlayOnReady) {
        playVideo(videoIdToPlayOnReady);
    }
}

function createPlayer(videoId) {
    return new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'playsinline': 1,
            'rel': 0,
            'enablejsapi': 1,
            'autoplay': 1,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    const videoData = event.target.getVideoData();
    const readyVideoId = videoData ? videoData.video_id : null;

    if (readyVideoId) {
         try {
            event.target.playVideo();
         } catch (e) {
             console.error("Error during playVideo() in onPlayerReady:", e); // Keep critical errors
         }
    }
    videoIdToPlayOnReady = null;
}

function onPlayerStateChange(event) {
    if (!ytPlayer) return;

    let videoData = null;
    let videoIdFromEvent = null;
    try {
        videoData = event.target.getVideoData();
        videoIdFromEvent = videoData ? videoData.video_id : null;
    } catch (e) {
        // Silently ignore if getting data fails
    }

    if (videoIdFromEvent) {
        currentlyPlayingVideoId = videoIdFromEvent;
    }

    if (event.data === YT.PlayerState.PLAYING) {
        if (currentlyPlayingVideoId) {
            updatePlayingVideoHighlight(currentlyPlayingVideoId);
            const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
            if (currentPlaylist) {
                const video = currentPlaylist.videos.find(v => v.id === currentlyPlayingVideoId);
                if (video) {
                    updateMediaSessionMetadata(video);
                    updateAudioOnlyDisplay(video.title);
                } else {
                    updateAudioOnlyDisplay(null);
                    updateMediaSessionMetadata(null);
                }
            } else {
                updateAudioOnlyDisplay(null);
                updateMediaSessionMetadata(null);
            }
        } else {
            const freshVideoData = event.target.getVideoData();
            const freshVideoId = freshVideoData ? freshVideoData.video_id : null;
            if (freshVideoId) {
                currentlyPlayingVideoId = freshVideoId;
                updatePlayingVideoHighlight(freshVideoId);
            } else {
                updatePlayingVideoHighlight(null);
                updateAudioOnlyDisplay(null);
                updateMediaSessionMetadata(null);
            }
        }
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
    } else if (event.data === YT.PlayerState.PAUSED) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "paused";
        }
    } else if (event.data === YT.PlayerState.ENDED) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "none";
        }
        if (isAutoplayEnabled) {
             playNextVideo();
        } else {
            updatePlayingVideoHighlight(null);
            updateAudioOnlyDisplay(null);
            updateMediaSessionMetadata(null);
        }
    } else if (event.data === YT.PlayerState.BUFFERING) {
         // No explicit state change needed for buffering for media session
    } else if (event.data === YT.PlayerState.CUED) {
         if ('mediaSession' in navigator) {
            if (navigator.mediaSession.playbackState !== 'playing' && navigator.mediaSession.playbackState !== 'paused') {
                 navigator.mediaSession.playbackState = "paused";
            }
         }
    } else if (event.data === YT.PlayerState.UNSTARTED) {
         if ('mediaSession' in navigator) {
             if (navigator.mediaSession.playbackState !== 'playing' && navigator.mediaSession.playbackState !== 'paused') {
                 navigator.mediaSession.playbackState = "none";
             }
         }
    }
}

function onPlayerError(event) {
    if (!ytPlayer) return;

    console.error('YouTube Player Error:', event.data); // Keep critical errors
    let errorMsg = 'An unknown player error occurred.';
    const videoData = event.target.getVideoData ? event.target.getVideoData() : null;
    const videoId = videoData ? videoData.video_id : currentlyPlayingVideoId;

    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';

    let shouldSkip = false;

    switch (event.data) {
        case 2: errorMsg = 'Invalid video ID or player parameter.'; shouldSkip = true; break;
        case 5: errorMsg = 'Error in the HTML5 player.'; shouldSkip = true; break;
        case 100: errorMsg = 'Video not found (removed or private).'; shouldSkip = true; break;
        case 101: case 150: errorMsg = 'Playback disallowed by video owner.'; shouldSkip = true; break;
        default: errorMsg = `Player error code: ${event.data}`; shouldSkip = true; break;
    }

    showToast(`Player Error: ${errorMsg}`, 'error');

    if (isAutoplayEnabled && shouldSkip) {
        showToast(`${errorMsg} Skipping to next video.`, 'info', 4000);
        setTimeout(() => {
            if (ytPlayer && isAutoplayEnabled) {
                playNextVideo();
            } else {
                handleClosePlayer();
            }
        }, 500); // Delay to prevent potential error loops
    } else {
        handleClosePlayer();
    }
}

function getCurrentPlayingVideoIdFromApi() {
    if (ytPlayer && isPlayerReady && typeof ytPlayer.getVideoData === 'function') {
        try {
            const videoData = ytPlayer.getVideoData();
            return videoData ? videoData.video_id : null;
        } catch (e) {
            return null;
        }
    }
    return null;
}

function playNextVideo() {
    if (!ytPlayer || !currentPlaylistId) return;

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1) return;

    if (!currentlyPlayingVideoId && currentPlaylist.videos.length > 0) {
        playVideo(currentPlaylist.videos[0].id);
        return;
    }
    if (!currentlyPlayingVideoId || currentPlaylist.videos.length < 2) {
        handleClosePlayer();
        return;
    }

    const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
    if (currentIndex === -1) {
        if (currentPlaylist.videos.length > 0) {
            playVideo(currentPlaylist.videos[0].id);
        } else {
             handleClosePlayer();
        }
        return;
    }

    const nextIndex = (currentIndex + 1) % currentPlaylist.videos.length;
    const nextVideo = currentPlaylist.videos[nextIndex];
    if (nextVideo) {
        playVideo(nextVideo.id);
    } else {
        handleClosePlayer();
    }
}

function playPreviousVideo() {
    if (!ytPlayer || !currentPlaylistId) return;

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1) return;

    if (!currentlyPlayingVideoId && currentPlaylist.videos.length > 0) {
        // If nothing is playing, maybe play the last video? Or first? Let's play the last.
        playVideo(currentPlaylist.videos[currentPlaylist.videos.length - 1].id);
        return;
    }
    if (!currentlyPlayingVideoId || currentPlaylist.videos.length < 2) {
        // Only one video, just replay it? Or stop? Let's replay.
        if (currentlyPlayingVideoId) playVideo(currentlyPlayingVideoId);
        else handleClosePlayer();
        return;
    }

    const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
    if (currentIndex === -1) {
        // If current video not found, play the last video as a sensible default
        playVideo(currentPlaylist.videos[currentPlaylist.videos.length - 1].id);
        return;
    }

    const prevIndex = (currentIndex - 1 + currentPlaylist.videos.length) % currentPlaylist.videos.length;
    const prevVideo = currentPlaylist.videos[prevIndex];
    if (prevVideo) {
        playVideo(prevVideo.id);
    } else {
        handleClosePlayer(); // Should not happen with modulo logic, but safeguard
    }
}


// --- Local Storage & State ---
function savePlaylists() { localStorage.setItem('playlists', JSON.stringify(playlists)); }
function loadPlaylists() {
    playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    playlists.forEach(p => { if (!p.videos) p.videos = []; });
}
function saveLastSelectedPlaylist(id) { localStorage.setItem('lastSelectedPlaylistId', id ? String(id) : ''); }
function saveAutoplaySetting() { localStorage.setItem('autoplayEnabled', isAutoplayEnabled); }
function loadAutoplaySetting() {
    isAutoplayEnabled = localStorage.getItem('autoplayEnabled') === 'true';
    autoplayToggle.checked = isAutoplayEnabled;
}
function saveAudioOnlySetting() { localStorage.setItem('audioOnlyEnabled', isAudioOnlyMode); }
function loadAudioOnlySetting() {
    isAudioOnlyMode = localStorage.getItem('audioOnlyEnabled') === 'true';
    audioOnlyToggle.checked = isAudioOnlyMode;
    applyAudioOnlyClass();
}
function applyAudioOnlyClass() {
    if (isAudioOnlyMode) {
        bodyEl.classList.add('audio-only-active');
    } else {
        bodyEl.classList.remove('audio-only-active');
    }
}

// --- Playlist Management ---
function handleCreatePlaylist() {
    const name = playlistNameInput.value.trim();
    if (!name) { showToast('Please enter a playlist name.', 'error'); playlistNameInput.focus(); return; }
    const newPlaylist = { id: Date.now(), name: name, videos: [] };
    playlists.unshift(newPlaylist);
    savePlaylists();
    playlistSearchInput.value = '';
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
            const nextIndex = Math.min(playlistIndex, playlists.length - 1);
            selectPlaylist(playlists[nextIndex >= 0 ? nextIndex : 0]?.id);
        } else {
            updateUIForNoSelection();
        }
    }
    savePlaylists();
    renderPlaylists();
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
        renderPlaylists();
        if (currentPlaylistId === id) {
            currentPlaylistTitleEl.textContent = escapeHTML(playlist.name);
        }
        showToast(`Playlist renamed from "${escapeHTML(oldName)}" to "${escapeHTML(playlist.name)}".`, 'info');
    }
}

function selectPlaylist(id) {
    const selectedPlaylist = playlists.find(p => p.id === id);
    if (!selectedPlaylist) {
        updateUIForNoSelection();
        return;
    }

    currentPlaylistId = id;
    currentPage = 1;
    saveLastSelectedPlaylist(id);

    if (playlistSearchInput.value !== '') {
        playlistSearchInput.value = '';
    }

    currentPlaylistTitleEl.textContent = escapeHTML(selectedPlaylist.name);
    videoFormEl.classList.remove('hidden');
    playlistActionsEl.classList.remove('hidden');
    addVideoBtn.disabled = videoUrlInput.value.trim() === '';
    videoPlaceholderEl.classList.add('hidden');
    playerWrapperEl.classList.add('hidden');
    stopVideo();
    updatePlayingVideoHighlight(null);

    renderPlaylists();
    renderVideos();
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
    renderVideos();
    renderPlaylists();
    showToast(`All videos removed from "${escapeHTML(currentPlaylist.name)}".`, 'info');
}

function handlePlaylistSearch() {
    renderPlaylists();
}

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

    // Fisher-Yates Shuffle
    let currentIndex = currentPlaylist.videos.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [currentPlaylist.videos[currentIndex], currentPlaylist.videos[randomIndex]] = [
            currentPlaylist.videos[randomIndex], currentPlaylist.videos[currentIndex]];
    }

    savePlaylists();
    currentPage = 1;
    renderVideos();
    showToast(`Playlist "${escapeHTML(currentPlaylist.name)}" shuffled!`, 'success');
}

// --- Video Management ---
function updatePlayingVideoHighlight(videoId) {
    videoGridEl.querySelectorAll('.video-card.playing').forEach(card => {
        card.classList.remove('playing');
    });
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
    if (!currentPlaylist) return;

    const videoId = extractVideoId(url);
    if (!videoId) { showToast('Invalid YouTube URL.', 'error'); videoUrlInput.focus(); return; }
    if (currentPlaylist.videos.some(v => v.id === videoId)) { showToast(`Video is already in "${escapeHTML(currentPlaylist.name)}".`, 'info'); return; }

    addVideoBtn.disabled = true;
    addVideoBtn.innerHTML = ICONS.loading + ' Adding...';
    videoUrlInput.disabled = true;

    try {
        // Using noembed.com as a simple proxy
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        if (!response.ok) {
            let errorMsg = `Failed to fetch video info (HTTP ${response.status}).`;
            try { const errData = await response.json(); errorMsg = errData.error || errorMsg; } catch (_) { }
            throw new Error(errorMsg);
        }
        const data = await response.json();
        if (data.error) { throw new Error(data.error); }

        const video = {
            id: videoId,
            title: data.title || 'Untitled Video',
            thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`, // Fallback
            url: `https://youtu.be/${videoId}`
        };

        currentPlaylist.videos.push(video);
        currentPage = Math.ceil(currentPlaylist.videos.length / videosPerPage);
        savePlaylists();
        renderVideos();
        renderPlaylists();
        videoUrlInput.value = '';
        showToast(`Video "${escapeHTML(video.title)}" added.`, 'success');

    } catch (error) {
        showToast(`Error adding video: ${error.message}`, 'error');
    } finally {
        addVideoBtn.disabled = videoUrlInput.value.trim() === '';
        addVideoBtn.innerHTML = ICONS.add + ' Add Video';
        videoUrlInput.disabled = false;
        videoUrlInput.focus();
    }
}

function handleDeleteVideo(videoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;

    const videoIndex = currentPlaylist.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) return;

    const videoTitle = currentPlaylist.videos[videoIndex].title;

    if (videoId === currentlyPlayingVideoId) {
        stopVideo();
        playerWrapperEl.classList.add('hidden');
        handleClosePlayer();
    }

    currentPlaylist.videos.splice(videoIndex, 1);

    const totalPages = Math.ceil(currentPlaylist.videos.length / videosPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (currentPlaylist.videos.length === 0) {
        currentPage = 1;
    }

    savePlaylists();
    renderVideos();
    renderPlaylists();
    showToast(`Removed "${escapeHTML(videoTitle)}".`, 'info');
}

function handleReorderVideo(videoIdToMove, targetVideoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;

    const videoToMoveIndex = currentPlaylist.videos.findIndex(v => v.id === videoIdToMove);
    if (videoToMoveIndex === -1) return;

    const [videoToMove] = currentPlaylist.videos.splice(videoToMoveIndex, 1);
    const targetIndex = currentPlaylist.videos.findIndex(v => v.id === targetVideoId);

    if (targetIndex !== -1) {
        // Insert before the target video's new position
        currentPlaylist.videos.splice(targetIndex, 0, videoToMove);
    } else {
        // Fallback: Append to end if target not found
        currentPlaylist.videos.push(videoToMove);
    }

    savePlaylists();
    renderVideos();
}

async function playVideo(videoId) {
    if (!videoId) return;

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    const videoData = currentPlaylist?.videos.find(v => v.id === videoId);

    // Update UI and lock screen controls immediately
    playerWrapperEl.classList.remove('hidden');
    currentlyPlayingVideoId = videoId;
    updatePlayingVideoHighlight(videoId);
    
    // Critical: Set metadata BEFORE playback starts
    if (videoData) {
        updateMediaSessionMetadata(videoData);
        updateAudioOnlyDisplay(videoData.title);
    }

    try {
        if (!isYTApiReady) await loadYouTubePlayerAPI();

        if (!ytPlayer) {
            ytPlayer = createPlayer(videoId);
        } else {
            ytPlayer.loadVideoById(videoId);
            ytPlayer.playVideo(); // iOS requires this to be called synchronously after user interaction
        }
    } catch (error) {
        console.error("Playback error:", error);
        showToast("Failed to play video", "error");
        handleClosePlayer();
    }
}

function stopVideo() {
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        try {
            ytPlayer.stopVideo();
        } catch (e) {
            // Player might be destroyed already, ignore error
        }
    }
    currentlyPlayingVideoId = null;
    updatePlayingVideoHighlight(null);
    updateAudioOnlyDisplay(null);
    updateMediaSessionMetadata(null);
    // Let onPlayerStateChange or handleClosePlayer manage MediaSession state.
}

function extractVideoId(url) {
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
        playlistListEl.innerHTML = '';
        const fragment = document.createDocumentFragment();
        filteredPlaylists.forEach(playlist => {
            const li = document.createElement('li');
            li.className = `playlist-item ${playlist.id === currentPlaylistId ? 'active' : ''}`;
            li.dataset.id = playlist.id;
            li.draggable = true;
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
            fragment.appendChild(li);
        });
        playlistListEl.appendChild(fragment);
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

    videosToRender.forEach(video => {
        const div = document.createElement('div');
        div.className = 'video-card';
        div.dataset.videoId = video.id;
        div.draggable = true;
        div.innerHTML = `
            <div class="video-card" data-video-id="${video.id}" draggable="true">
                <div class="thumbnail-wrapper">
                    <img src="${escapeHTML(video.thumbnail)}" class="thumbnail" alt="" loading="lazy">
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
        fragment.appendChild(div.firstElementChild);
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

// Added handler for the new toggle
function handleAudioOnlyToggle() {
    isAudioOnlyMode = audioOnlyToggle.checked;
    saveAudioOnlySetting();
    applyAudioOnlyClass(); // Apply/remove the class immediately
    showToast(`Audio-Only Mode ${isAudioOnlyMode ? 'enabled' : 'disabled'}.`, 'info');

    // If a video is currently playing, adjust visibility/scrolling and update display
    if (currentlyPlayingVideoId) {
        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        const videoData = currentPlaylist?.videos.find(v => v.id === currentlyPlayingVideoId);
        const videoTitle = videoData ? videoData.title : null;

        if (isAudioOnlyMode) {
            // Update and show the info display
            updateAudioOnlyDisplay(videoTitle);
            playerWrapperEl.classList.remove('hidden'); // Ensure wrapper is visible
        } else {
            // Hide the info display
            updateAudioOnlyDisplay(null);
            // Show video and scroll into view if it was hidden
            playerWrapperEl.classList.remove('hidden');
            setTimeout(() => {
                 if (playerWrapperEl.offsetParent !== null) {
                    playerWrapperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                 }
            }, 100);
        }
    } else {
        // If no video playing, ensure player wrapper is hidden if audio-only is disabled
        // and no video is selected to play next. Also clear audio display.
        updateAudioOnlyDisplay(null);
         if (!isAudioOnlyMode && !videoIdToPlayOnReady) {
            playerWrapperEl.classList.add('hidden');
         }
    }
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
    const switchElement = event.target.closest('.switch');
    if (!switchElement) return;
    const checkbox = switchElement.querySelector('input[type="checkbox"]');
    if (checkbox && event.target !== checkbox) {
        checkbox.click();
    }
}

// --- Utility ---

// Create a reusable element for HTML escaping
const escapeElement = document.createElement('div');

function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    // Use the pre-created element
    escapeElement.textContent = str;
    return escapeElement.innerHTML;
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
    stopVideo(); // stopVideo now primarily handles player stop/state, not destruction

    // Explicitly clear media session here
    if ('mediaSession' in navigator) {
        console.log("Media Session: Clearing metadata and state due to player close.");
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
        // Remove action handlers? Maybe not needed if metadata is null.
        // setupMediaSessionActionHandlers(); // Call with null? Let's see if clearing metadata is enough.
    }

    if (ytPlayer && typeof ytPlayer.destroy === 'function') {
        try {
            console.log("Destroying YT Player instance.");
            ytPlayer.destroy();
        } catch (e) {
            console.error("Error destroying player:", e);
        } finally {
            ytPlayer = null; // Nullify the reference AFTER destroying
            isPlayerReady = false;
            // Clean up any remaining elements in the player container
            const playerContainer = document.getElementById('player');
            if (playerContainer) {
                playerContainer.innerHTML = '';
            }
        }
    } else {
        // Ensure state is reset even if player wasn't fully initialized or already destroyed
        ytPlayer = null;
        isPlayerReady = false;
    }

    videoIdToPlayOnReady = null;
    playerWrapperEl.classList.add('hidden');
    updatePlayingVideoHighlight(null);
    updateAudioOnlyDisplay(null);

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
    if (!('mediaSession' in navigator) || !video) return;

    try {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: video.title || 'Untitled Video',
            artist: 'YouTube',
            album: playlists.find(p => p.id === currentPlaylistId)?.name || 'Playlist',
            artwork: [
                { src: video.thumbnail.replace('mqdefault', 'hqdefault'), sizes: '480x360', type: 'image/jpeg' },
                { src: video.thumbnail, sizes: '320x180', type: 'image/jpeg' }
            ]
        });

        // Must set handlers AFTER metadata
        setupMediaSessionActionHandlers();
    } catch (error) {
        console.error("MediaSession error:", error);
    }
}

function setupMediaSessionActionHandlers() {
    if (!('mediaSession' in navigator)) return;

    try {
        navigator.mediaSession.setActionHandler('play', () => {
            ytPlayer?.playVideo?.();
        });

        navigator.mediaSession.setActionHandler('pause', () => {
            ytPlayer?.pauseVideo?.();
        });

        // Include all standard handlers
        const handlers = {
            'previoustrack': playPreviousVideo,
            'nexttrack': () => isAutoplayEnabled && playNextVideo(),
            'stop': handleClosePlayer
        };

        Object.entries(handlers).forEach(([action, handler]) => {
            navigator.mediaSession.setActionHandler(action, handler);
        });
    } catch (error) {
        console.error("Failed to set media action handlers:", error);
    }
}

// --- End Media Session API Integration ---

// --- Drag and Drop (Playlists) ---
let draggedPlaylistId = null;
let dragTargetPlaylistElement = null;

function handlePlaylistDragStart(event) {
    const playlistItem = event.target.closest('.playlist-item');
    if (playlistItem && playlistItem.draggable) {
        // Prevent dragging if clicking on controls inside the item
        if (event.target.closest('.controls')) {
            event.preventDefault();
            return;
        }
        draggedPlaylistId = parseInt(playlistItem.dataset.id);
        event.dataTransfer.effectAllowed = 'move';
        // event.dataTransfer.setData('text/plain', draggedPlaylistId); // Optional
        setTimeout(() => playlistItem.classList.add('dragging'), 0);
        dragTargetPlaylistElement = null; // Reset target
    }
}

function handlePlaylistDragEnd(event) {
    const playlistItem = event.target.closest('.playlist-item.dragging');
    if (playlistItem) {
        playlistItem.classList.remove('dragging');
    }
    clearPlaylistDragOverStyles();
    draggedPlaylistId = null;
    dragTargetPlaylistElement = null;
}

function handlePlaylistDragOver(event) {
    event.preventDefault();
    if (!draggedPlaylistId) return;
    event.dataTransfer.dropEffect = 'move';

    const targetItem = event.target.closest('.playlist-item');
    if (targetItem && targetItem.draggable && parseInt(targetItem.dataset.id) !== draggedPlaylistId) {
        clearPlaylistDragOverStyles();
        targetItem.classList.add('drag-over');
        dragTargetPlaylistElement = targetItem;
    } else {
        event.dataTransfer.dropEffect = 'none';
    }
}

function handlePlaylistDragLeave(event) {
    // Clear styles only if leaving the list container bounds
    if (!event.relatedTarget || !playlistListEl.contains(event.relatedTarget)) {
        clearPlaylistDragOverStyles();
        dragTargetPlaylistElement = null;
    }
}

function handlePlaylistDrop(event) {
    event.preventDefault();
    if (draggedPlaylistId && dragTargetPlaylistElement) {
        const dropTargetId = parseInt(dragTargetPlaylistElement.dataset.id);
        if (dropTargetId !== draggedPlaylistId) {
            handleReorderPlaylist(draggedPlaylistId, dropTargetId);
        }
    }
    clearPlaylistDragOverStyles();
}

function clearPlaylistDragOverStyles() {
    const highlightedItem = playlistListEl.querySelector('.playlist-item.drag-over');
    if (highlightedItem) {
        highlightedItem.classList.remove('drag-over');
    }
     if (dragTargetPlaylistElement) {
         dragTargetPlaylistElement.classList.remove('drag-over');
     }
}

function handleReorderPlaylist(playlistIdToMove, targetPlaylistId) {
    const playlistToMoveIndex = playlists.findIndex(p => p.id === playlistIdToMove);
    if (playlistToMoveIndex === -1) return;

    const [playlistToMove] = playlists.splice(playlistToMoveIndex, 1); // Remove the playlist

    // Find the target's NEW index after the splice
    const targetIndex = playlists.findIndex(p => p.id === targetPlaylistId);

    if (targetIndex !== -1) {
        // Insert before the target's new position
        playlists.splice(targetIndex, 0, playlistToMove);
    } else {
        // Fallback: append to end if target not found (shouldn't happen in valid drop)
        console.warn("Playlist reorder target not found after splice, appending to end.");
        playlists.push(playlistToMove);
    }

    savePlaylists();
    renderPlaylists(); // Re-render the list with the new order
    showToast('Playlist order updated.', 'info', 1500); // Short confirmation
}

// --- Touch Event Handlers for Video Drag/Drop ---

function handleTouchStart(event) {
    const videoCard = event.target.closest('.video-card');
    if (!videoCard || !videoCard.draggable) return;
    
    // Don't prevent default on buttons/controls
    if (event.target.closest('button') || 
        event.target.closest('.delete-video-btn') || 
        event.target.closest('.controls')) {
        return;
    }
    
    // Only prevent default for drag handles to allow normal scrolling
    if (event.target.closest('.drag-handle')) {
        event.preventDefault();
        
        touchDraggedElement = videoCard;
        draggedVideoId = videoCard.dataset.videoId;
        isTouchDragging = true;
        touchDragStartY = event.touches[0].clientY;
        
        requestAnimationFrame(() => {
            if (isTouchDragging && touchDraggedElement) {
                touchDraggedElement.classList.add('dragging');
            }
        });
        
        potentialPlayVideoId = null;
        potentialPlayCard = null;
    } else {
        // For potential play, store ID but don't prevent scrolling
        potentialPlayVideoId = videoCard.dataset.videoId;
        potentialPlayCard = videoCard;
        videoCard.classList.add('touch-active');
    }
}

function handleTouchMove(event) {
    if (isTouchDragging) {
        if (!touchDraggedElement) return;
        event.preventDefault();

        const touch = event.touches[0];
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetCard = elementUnderTouch ? elementUnderTouch.closest('.video-card') : null;

        if (targetCard && targetCard.draggable && targetCard !== touchDraggedElement) {
            if (dragTargetElement) dragTargetElement.classList.remove('drag-over');
            targetCard.classList.add('drag-over');
            dragTargetElement = targetCard;
        }
    } else if (potentialPlayVideoId && potentialPlayCard) {
        potentialPlayCard.classList.remove('touch-active');
        potentialPlayVideoId = null;
        potentialPlayCard = null;
    }
}

function handleTouchEnd(event) {
    if (isTouchDragging) {
        if (draggedVideoId && dragTargetElement && dragTargetElement.dataset.videoId !== draggedVideoId) {
            handleReorderVideo(draggedVideoId, dragTargetElement.dataset.videoId);
        }
        if (touchDraggedElement) touchDraggedElement.classList.remove('dragging');
        clearDragOverStyles();
        isTouchDragging = false;
        touchDraggedElement = null;
        draggedVideoId = null;
        dragTargetElement = null;
        touchDragStartY = 0;
    } else if (potentialPlayVideoId && potentialPlayCard) {
        playVideo(potentialPlayVideoId);
        potentialPlayCard.classList.remove('touch-active');
    } else if (potentialPlayCard) {
        potentialPlayCard.classList.remove('touch-active');
    }
    potentialPlayVideoId = null;
    potentialPlayCard = null;
}

// --- Start the app ---
init();

// Function to update the audio-only info display
function updateAudioOnlyDisplay(videoTitle) {
    if (isAudioOnlyMode && videoTitle) {
        // Using both textContent and innerHTML is redundant
        audioOnlyTitleEl.textContent = videoTitle;
        escapeElement.textContent = videoTitle;
        audioOnlyTitleEl.innerHTML = escapeElement.innerHTML;
        audioOnlyInfoEl.classList.remove('hidden');
    } else {
        audioOnlyTitleEl.textContent = '';
        audioOnlyInfoEl.classList.add('hidden');
    }
}