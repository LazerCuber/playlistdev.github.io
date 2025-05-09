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
const autoplayToggle = document.getElementById('autoplayToggle');
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
let currentlyPlayingVideoId = null; // ID of video in YT.Player
let draggedVideoId = null; // For video DnD
let dragTargetElement = null; // For video DnD
let currentTheme = 'light';
let isResizing = false; // Sidebar resizing
let isTouchDragging = false; // Video touch drag state
let touchDraggedElement = null; // Element being touch-dragged
let potentialPlayVideoId = null; // For tap-to-play on touch devices
let potentialPlayCard = null; // Card associated with potentialPlayVideoId
const videosPerPage = 20;
let currentPage = 1;
let isYTApiReady = false;
let userGesture = false; // True after first user interaction
let draggedPlaylistId = null; // For playlist DnD
let dragTargetPlaylistElement = null; // For playlist DnD

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
const escapeElement = document.createElement('div'); // Reusable element for HTML escaping

// --- Initialization ---
function init() {
    loadTheme();
    loadPlaylists();
    loadAutoplaySetting();
    loadAudioOnlySetting();
    loadSidebarWidth();
    loadYouTubePlayerAPI(); // Preload

    renderPlaylists();

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
    document.addEventListener('click', () => { userGesture = true; }, { once: true });
}

// --- YouTube Player API ---
let ytApiLoadPromise = null;
function loadYouTubePlayerAPI() {
    if (ytApiLoadPromise) return ytApiLoadPromise;

    ytApiLoadPromise = new Promise((resolve, reject) => {
        if (window.YT && window.YT.Player) { // API might already be loaded
            isYTApiReady = true;
            resolve();
            return;
        }
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        const timeoutId = setTimeout(() => reject(new Error('YouTube API load timeout.')), 10000);

        window.onYouTubeIframeAPIReady = () => {
            clearTimeout(timeoutId);
            isYTApiReady = true;
            resolve();
        };
    }).catch(error => {
        console.error("YouTube API load error:", error);
        showToast('Failed to load YouTube player. Please refresh.', 'error');
        throw error; // Propagate error for awaiters
    });
    return ytApiLoadPromise;
}

// This function MUST be global for the API to find it if `window.onYouTubeIframeAPIReady` is set after script load
function onYouTubeIframeAPIReady() {
    // This function is primarily a fallback. loadYouTubePlayerAPI handles its own resolve.
    isYTApiReady = true;
    if (videoIdToPlayOnReady && ytPlayer) { // Check if ytPlayer exists because onPlayerReady might initialize it
        playVideo(videoIdToPlayOnReady);
    }
}

function createPlayer(videoId) {
    return new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: { 'playsinline': 1, 'rel': 0, 'enablejsapi': 1, 'autoplay': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    videoIdToPlayOnReady = null; // Clear queue
    // Autoplay is handled by playerVars or explicit playVideo call
    try {
        if (userGesture) event.target.playVideo();
    } catch (e) {
        console.warn("Autoplay on ready blocked:", e);
    }
}

function onPlayerStateChange(event) {
    if (!ytPlayer) return;

    let videoIdFromEvent = null;
    try {
        const videoData = event.target.getVideoData();
        videoIdFromEvent = videoData ? videoData.video_id : null;
    } catch (e) { /* Silently ignore */ }

    if (videoIdFromEvent) {
        currentlyPlayingVideoId = videoIdFromEvent;
    }

    const currentVideo = getCurrentVideo(currentlyPlayingVideoId);

    if (event.data === YT.PlayerState.PLAYING) {
        updatePlayerRelatedUI(currentlyPlayingVideoId);
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "playing";
    } else if (event.data === YT.PlayerState.PAUSED) {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "paused";
    } else if (event.data === YT.PlayerState.ENDED) {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "none";
        if (isAutoplayEnabled) {
            playNextVideo();
        } else {
            updatePlayerRelatedUI(null);
        }
    } else if (event.data === YT.PlayerState.CUED) {
        updateMediaSessionMetadata(currentVideo); // Ensure metadata is set for cued video
        if ('mediaSession' in navigator && navigator.mediaSession.playbackState !== 'playing') {
            navigator.mediaSession.playbackState = "paused"; // Treat cued as paused for media controls
        }
    } else if (event.data === YT.PlayerState.UNSTARTED) {
         if ('mediaSession' in navigator && navigator.mediaSession.playbackState !== 'playing' && navigator.mediaSession.playbackState !== 'paused') {
            navigator.mediaSession.playbackState = "none";
        }
    }
}

function onPlayerError(event) {
    if (!ytPlayer) return;
    console.error('YouTube Player Error:', event.data);

    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none';

    let errorMsg = 'An unknown player error occurred.';
    let shouldSkip = true;
    switch (event.data) {
        case 2: errorMsg = 'Invalid video ID or player parameter.'; break;
        case 5: errorMsg = 'Error in the HTML5 player.'; break;
        case 100: errorMsg = 'Video not found (removed or private).'; break;
        case 101: case 150: errorMsg = 'Playback disallowed by video owner.'; break;
        default: errorMsg = `Player error code: ${event.data}`; break;
    }
    showToast(`Player Error: ${errorMsg}`, 'error');

    if (isAutoplayEnabled && shouldSkip) {
        showToast(`Skipping to next video.`, 'info', 4000);
        setTimeout(() => { // Delay to prevent rapid error loops
            if (ytPlayer && isAutoplayEnabled) playNextVideo(); else handleClosePlayer();
        }, 500);
    } else {
        handleClosePlayer();
    }
}

// --- Sidebar Resizing ---
function loadSidebarWidth() {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) sidebarEl.style.width = savedWidth + 'px';
}
function saveSidebarWidth(width) { localStorage.setItem('sidebarWidth', width); }
function initSidebarResize(e) {
    isResizing = true;
    sidebarResizerEl.classList.add('resizing');
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleSidebarResize);
    document.addEventListener('mouseup', stopSidebarResize);
    e.preventDefault();
}
function handleSidebarResize(e) {
    if (!isResizing) return;
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const newWidth = Math.max(
        parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-min-width')),
        Math.min(e.clientX - containerRect.left, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-max-width')))
    );
    sidebarEl.style.width = newWidth + 'px';
}
function stopSidebarResize() {
    isResizing = false;
    sidebarResizerEl.classList.remove('resizing');
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleSidebarResize);
    document.removeEventListener('mouseup', stopSidebarResize);
    saveSidebarWidth(sidebarEl.getBoundingClientRect().width);
}

// --- Event Listeners ---
function setupInputListeners(input, button, handler) {
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handler(); });
    button.addEventListener('click', handler);
}
function setupEventListeners() {
    setupInputListeners(playlistNameInput, createPlaylistBtn, handleCreatePlaylist);
    setupInputListeners(videoUrlInput, addVideoBtn, handleAddVideo);
    videoUrlInput.addEventListener('input', () => { addVideoBtn.disabled = videoUrlInput.value.trim() === ''; });

    autoplayToggle.addEventListener('change', handleAutoplayToggle);
    audioOnlyToggle.addEventListener('change', handleAudioOnlyToggle);

    autoplaySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    const audioOnlySwitchDiv = audioOnlyToggle.closest('.switch');
    if (audioOnlySwitchDiv) audioOnlySwitchDiv.addEventListener('click', handleVisualSwitchClick);

    clearPlaylistBtn.addEventListener('click', handleClearPlaylist);
    themeToggleBtn.addEventListener('click', toggleTheme);
    shufflePlaylistBtn.addEventListener('click', handleShufflePlaylist);
    playlistSearchInput.addEventListener('input', debounce(handlePlaylistSearch, 300));
    importBtn.addEventListener('click', () => importFileEl.click());
    importFileEl.addEventListener('change', handleImportPlaylists);
    exportBtn.addEventListener('click', handleExportPlaylists);
    sidebarResizerEl.addEventListener('mousedown', initSidebarResize);
    closePlayerBtn.addEventListener('click', handleClosePlayer);

    // Event Delegation
    playlistListEl.addEventListener('click', handlePlaylistListClick);
    videoGridEl.addEventListener('click', handleVideoGridClick);

    // Video Drag & Drop (Desktop)
    videoGridEl.addEventListener('dragstart', handleVideoDragStart);
    videoGridEl.addEventListener('dragend', handleVideoDragEnd);
    videoGridEl.addEventListener('dragover', handleVideoDragOver);
    videoGridEl.addEventListener('dragleave', handleVideoDragLeave);
    videoGridEl.addEventListener('drop', handleVideoDrop);

    // Video Drag & Drop (Touch)
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

    // Pagination
    prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderVideos(); } });
    nextPageBtn.addEventListener('click', () => {
        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        if (!currentPlaylist) return;
        const totalPages = Math.ceil(currentPlaylist.videos.length / videosPerPage);
        if (currentPage < totalPages) { currentPage++; renderVideos(); }
    });
}

function handlePlaylistListClick(event) {
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
}

function handleVideoGridClick(event) {
    const videoCard = event.target.closest('.video-card');
    if (!videoCard) return;
    const videoId = videoCard.dataset.videoId;

    if (event.target.closest('.delete-video-btn')) {
        event.stopPropagation(); handleDeleteVideo(videoId);
    } else if (!event.target.closest('.drag-handle')) {
        playVideo(videoId);
    }
}

// --- Drag and Drop (Videos - Desktop) ---
function handleVideoDragStart(event) {
    const videoCard = event.target.closest('.video-card[draggable="true"]');
    if (videoCard) {
        draggedVideoId = videoCard.dataset.videoId;
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => videoCard.classList.add('dragging'), 0);
    }
}
function handleVideoDragEnd() {
    const draggingElement = videoGridEl.querySelector('.video-card.dragging');
    if (draggingElement) draggingElement.classList.remove('dragging');
    clearDragOverStyles(videoGridEl, '.video-card.drag-over');
    draggedVideoId = null;
    dragTargetElement = null;
}
function handleVideoDragOver(event) {
    event.preventDefault();
    if (!draggedVideoId) return;
    event.dataTransfer.dropEffect = 'move';
    const targetCard = event.target.closest('.video-card[draggable="true"]');
    if (targetCard && targetCard.dataset.videoId !== draggedVideoId) {
        if (dragTargetElement !== targetCard) {
            if (dragTargetElement) dragTargetElement.classList.remove('drag-over');
            targetCard.classList.add('drag-over');
            dragTargetElement = targetCard;
        }
    } else if (targetCard && targetCard.dataset.videoId === draggedVideoId) {
        // Hovering over itself, clear any other drag-over
        if (dragTargetElement && dragTargetElement !== targetCard) {
            dragTargetElement.classList.remove('drag-over');
        }
        dragTargetElement = null; // No valid drop target
    }
}
function handleVideoDragLeave(event) {
    if (!event.relatedTarget || !videoGridEl.contains(event.relatedTarget)) {
        clearDragOverStyles(videoGridEl, '.video-card.drag-over');
        dragTargetElement = null;
    }
}
function handleVideoDrop(event) {
    event.preventDefault();
    const dropTargetId = dragTargetElement ? dragTargetElement.dataset.videoId : null;
    clearDragOverStyles(videoGridEl, '.video-card.drag-over');
    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
        handleReorderVideo(draggedVideoId, dropTargetId);
    }
    // State reset in handleVideoDragEnd
}

// --- Drag and Drop (Playlists - Desktop) ---
function handlePlaylistDragStart(event) {
    const playlistItem = event.target.closest('.playlist-item[draggable="true"]');
    if (playlistItem && !event.target.closest('.controls')) {
        draggedPlaylistId = parseInt(playlistItem.dataset.id);
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => playlistItem.classList.add('dragging'), 0);
        dragTargetPlaylistElement = null;
    } else if (playlistItem && event.target.closest('.controls')) {
        event.preventDefault(); // Prevent dragging by controls
    }
}
function handlePlaylistDragEnd() {
    const draggingItem = playlistListEl.querySelector('.playlist-item.dragging');
    if (draggingItem) draggingItem.classList.remove('dragging');
    clearDragOverStyles(playlistListEl, '.playlist-item.drag-over');
    draggedPlaylistId = null;
    dragTargetPlaylistElement = null;
}
function handlePlaylistDragOver(event) {
    event.preventDefault();
    if (!draggedPlaylistId) return;
    event.dataTransfer.dropEffect = 'move';
    const targetItem = event.target.closest('.playlist-item[draggable="true"]');
    if (targetItem && parseInt(targetItem.dataset.id) !== draggedPlaylistId) {
        if (dragTargetPlaylistElement !== targetItem) {
            if (dragTargetPlaylistElement) dragTargetPlaylistElement.classList.remove('drag-over');
            targetItem.classList.add('drag-over');
            dragTargetPlaylistElement = targetItem;
        }
    } else if (targetItem && parseInt(targetItem.dataset.id) === draggedPlaylistId) {
        if (dragTargetPlaylistElement && dragTargetPlaylistElement !== targetItem) {
             dragTargetPlaylistElement.classList.remove('drag-over');
        }
        dragTargetPlaylistElement = null;
    }
}
function handlePlaylistDragLeave(event) {
    if (!event.relatedTarget || !playlistListEl.contains(event.relatedTarget)) {
        clearDragOverStyles(playlistListEl, '.playlist-item.drag-over');
        dragTargetPlaylistElement = null;
    }
}
function handlePlaylistDrop(event) {
    event.preventDefault();
    const dropTargetId = dragTargetPlaylistElement ? parseInt(dragTargetPlaylistElement.dataset.id) : null;
    clearDragOverStyles(playlistListEl, '.playlist-item.drag-over');
    if (draggedPlaylistId && dropTargetId && dropTargetId !== draggedPlaylistId) {
        handleReorderPlaylist(draggedPlaylistId, dropTargetId);
    }
    // State reset in handlePlaylistDragEnd
}

function clearDragOverStyles(container, selector) {
    const highlighted = container.querySelector(selector);
    if (highlighted) highlighted.classList.remove('drag-over');
    // Also clear direct target reference if it exists and wasn't caught by selector
    if (container === videoGridEl && dragTargetElement) dragTargetElement.classList.remove('drag-over');
    if (container === playlistListEl && dragTargetPlaylistElement) dragTargetPlaylistElement.classList.remove('drag-over');
}


// --- Touch Event Handlers for Video Drag/Drop ---
function handleTouchStart(event) {
    const videoCard = event.target.closest('.video-card[draggable="true"]');
    if (!videoCard) return;

    if (event.target.closest('button, .delete-video-btn, .controls')) return;

    if (event.target.closest('.drag-handle')) {
        event.preventDefault(); // Prevent scroll only when starting drag from handle
        touchDraggedElement = videoCard;
        draggedVideoId = videoCard.dataset.videoId;
        isTouchDragging = true;
        requestAnimationFrame(() => {
            if (isTouchDragging && touchDraggedElement) touchDraggedElement.classList.add('dragging');
        });
        potentialPlayVideoId = null; // Not a play attempt
        potentialPlayCard = null;
    } else {
        potentialPlayVideoId = videoCard.dataset.videoId;
        potentialPlayCard = videoCard;
        videoCard.classList.add('touch-active');
    }
}
function handleTouchMove(event) {
    if (isTouchDragging && touchDraggedElement) {
        event.preventDefault(); // Prevent scroll while dragging
        const touch = event.touches[0];
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetCard = elementUnderTouch ? elementUnderTouch.closest('.video-card[draggable="true"]') : null;

        if (targetCard && targetCard !== touchDraggedElement) {
            if (dragTargetElement) dragTargetElement.classList.remove('drag-over');
            targetCard.classList.add('drag-over');
            dragTargetElement = targetCard;
        } else if (!targetCard && dragTargetElement) {
            dragTargetElement.classList.remove('drag-over');
            dragTargetElement = null;
        }
    } else if (potentialPlayVideoId && potentialPlayCard) {
        // If moved significantly, cancel tap-to-play intent
        potentialPlayCard.classList.remove('touch-active');
        potentialPlayVideoId = null;
        potentialPlayCard = null;
    }
}
function handleTouchEnd() {
    if (isTouchDragging) {
        if (draggedVideoId && dragTargetElement && dragTargetElement.dataset.videoId !== draggedVideoId) {
            handleReorderVideo(draggedVideoId, dragTargetElement.dataset.videoId);
        }
        if (touchDraggedElement) touchDraggedElement.classList.remove('dragging');
        clearDragOverStyles(videoGridEl, '.video-card.drag-over');
        isTouchDragging = false;
        touchDraggedElement = null;
        draggedVideoId = null;
        dragTargetElement = null;
    } else if (potentialPlayVideoId && potentialPlayCard) {
        playVideo(potentialPlayVideoId);
        potentialPlayCard.classList.remove('touch-active');
    } else if (potentialPlayCard) { // Just cleanup if no action
        potentialPlayCard.classList.remove('touch-active');
    }
    potentialPlayVideoId = null;
    potentialPlayCard = null;
}

// --- Theme Management ---
function loadTheme() { applyTheme(localStorage.getItem('uiTheme') || 'light'); }
function applyTheme(themeName) {
    currentTheme = themeName;
    htmlEl.dataset.theme = themeName;
    updateThemeIcon();
    localStorage.setItem('uiTheme', themeName);
}
function toggleTheme() { applyTheme(currentTheme === 'light' ? 'dark' : 'light'); }
function updateThemeIcon() {
    themeToggleBtn.innerHTML = currentTheme === 'dark' ? ICONS.sun : ICONS.moon;
    themeToggleBtn.title = `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Theme`;
}

// --- Local Storage & State Helpers ---
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
function applyAudioOnlyClass() { bodyEl.classList.toggle('audio-only-active', isAudioOnlyMode); }
function getCurrentVideo(videoId) {
    if (!currentPlaylistId || !videoId) return null;
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    return currentPlaylist?.videos.find(v => v.id === videoId);
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
    createPlaylistBtn.disabled = true;
    showToast(`Playlist "${name}" created.`, 'success');
}
function handleDeletePlaylist(id) {
    const playlistIndex = playlists.findIndex(p => p.id === id);
    if (playlistIndex === -1) return;
    const playlistName = playlists[playlistIndex].name;
    if (!confirm(`Are you sure you want to delete playlist "${playlistName}"?`)) return;

    playlists.splice(playlistIndex, 1);
    if (currentPlaylistId === id) {
        currentPlaylistId = null; // Will be handled by selectPlaylist or updateUIForNoSelection
        saveLastSelectedPlaylist(null);
        if (playlists.length > 0) {
            const nextIndexToSelect = Math.max(0, Math.min(playlistIndex, playlists.length - 1));
            selectPlaylist(playlists[nextIndexToSelect]?.id);
        } else {
            updateUIForNoSelection();
        }
    }
    savePlaylists();
    renderPlaylists();
    showToast(`Playlist "${playlistName}" deleted.`, 'info');
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
        if (currentPlaylistId === id) currentPlaylistTitleEl.textContent = playlist.name;
        showToast(`Playlist renamed from "${oldName}" to "${playlist.name}".`, 'info');
    }
}
function selectPlaylist(id) {
    const selectedPlaylist = playlists.find(p => p.id === id);
    if (!selectedPlaylist) { updateUIForNoSelection(); return; }

    currentPlaylistId = id;
    currentPage = 1;
    saveLastSelectedPlaylist(id);
    if (playlistSearchInput.value !== '') playlistSearchInput.value = '';

    currentPlaylistTitleEl.textContent = selectedPlaylist.name;
    videoFormEl.classList.remove('hidden');
    playlistActionsEl.classList.remove('hidden');
    addVideoBtn.disabled = videoUrlInput.value.trim() === '';
    videoPlaceholderEl.classList.add('hidden');

    // If player is open for a different playlist's video, or just open, close it.
    // If it was playing a video from THIS playlist, it's fine to leave it.
    // Simpler: always close unless the video being played is from the newly selected playlist.
    const currentPlayingVideoFromThisPlaylist = selectedPlaylist.videos.some(v => v.id === currentlyPlayingVideoId);
    if (ytPlayer && !currentPlayingVideoFromThisPlaylist) {
         handleClosePlayer(); // Resets player and related UI
    } else if (ytPlayer && currentPlayingVideoFromThisPlaylist) {
        // Video is from this playlist, ensure highlight and audio-only display are correct
        updatePlayerRelatedUI(currentlyPlayingVideoId);
    } else { // No player active
        playerWrapperEl.classList.add('hidden');
        updatePlayerRelatedUI(null); // Clear any lingering player UI state
    }
    
    renderPlaylists(); // Update active item
    renderVideos();
}
function handleClearPlaylist() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        showToast('Playlist is already empty.', 'info'); return;
    }
    if (!confirm(`Remove all videos from "${currentPlaylist.name}"?`)) return;

    currentPlaylist.videos = [];
    savePlaylists();
    if (currentlyPlayingVideoId) handleClosePlayer(); // Close player if it was playing from this list
    renderVideos(); // Will show empty state
    renderPlaylists(); // Update count
    showToast(`All videos removed from "${currentPlaylist.name}".`, 'info');
}
function handlePlaylistSearch() { renderPlaylists(); }
function handleShufflePlaylist() {
    if (!currentPlaylistId) { showToast('Select a playlist to shuffle.', 'info'); return; }
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 2) {
        showToast('Playlist needs at least two videos to shuffle.', 'info'); return;
    }
    // Fisher-Yates Shuffle
    for (let i = currentPlaylist.videos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentPlaylist.videos[i], currentPlaylist.videos[j]] = [currentPlaylist.videos[j], currentPlaylist.videos[i]];
    }
    savePlaylists();
    currentPage = 1;
    renderVideos();
    showToast(`Playlist "${currentPlaylist.name}" shuffled!`, 'success');
}
function handleReorderPlaylist(playlistIdToMove, targetPlaylistId) {
    const playlistToMoveIndex = playlists.findIndex(p => p.id === playlistIdToMove);
    if (playlistToMoveIndex === -1) return;
    const [playlistToMove] = playlists.splice(playlistToMoveIndex, 1);
    const targetIndex = playlists.findIndex(p => p.id === targetPlaylistId);
    playlists.splice(targetIndex !== -1 ? targetIndex : playlists.length, 0, playlistToMove);
    savePlaylists();
    renderPlaylists();
    showToast('Playlist order updated.', 'info', 1500);
}

// --- Video Management ---
async function handleAddVideo() {
    const url = videoUrlInput.value.trim();
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!url) { showToast('Please enter a YouTube video URL.', 'error'); return; }
    if (!currentPlaylist) { showToast('No playlist selected.', 'error'); return; }

    const videoId = extractVideoId(url);
    if (!videoId) { showToast('Invalid YouTube URL.', 'error'); videoUrlInput.focus(); return; }
    if (currentPlaylist.videos.some(v => v.id === videoId)) {
        showToast(`Video is already in "${currentPlaylist.name}".`, 'info'); return;
    }

    addVideoBtn.disabled = true;
    addVideoBtn.innerHTML = ICONS.loading + ' Adding...';
    videoUrlInput.disabled = true;

    try {
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Failed to fetch video info (HTTP ${response.status})`);
        }
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const video = {
            id: videoId,
            title: data.title || 'Untitled Video',
            thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
            url: `https://youtu.be/${videoId}`
        };
        currentPlaylist.videos.push(video);
        currentPage = Math.ceil(currentPlaylist.videos.length / videosPerPage); // Go to last page
        savePlaylists();
        renderVideos();
        renderPlaylists(); // Update count
        videoUrlInput.value = '';
        showToast(`Video "${video.title}" added.`, 'success');
    } catch (error) {
        showToast(`Error adding video: ${error.message}`, 'error');
    } finally {
        addVideoBtn.disabled = videoUrlInput.value.trim() === ''; // Re-evaluate based on input
        addVideoBtn.innerHTML = ICONS.add + ' Add Video';
        videoUrlInput.disabled = false;
        if (!addVideoBtn.disabled) videoUrlInput.focus(); else addVideoBtn.focus();
    }
}
function handleDeleteVideo(videoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;
    const videoIndex = currentPlaylist.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) return;

    const deletedVideo = currentPlaylist.videos.splice(videoIndex, 1)[0];
    savePlaylists();
    renderVideos(); // Will adjust pagination if needed
    renderPlaylists(); // Update count

    if (videoId === currentlyPlayingVideoId) {
        showToast(`Removed currently playing video: "${deletedVideo.title}".`, 'info');
        handleClosePlayer(); // Close player as the video is gone
    } else {
        showToast(`Video "${deletedVideo.title}" removed.`, 'info');
    }
}
function handleReorderVideo(videoIdToMove, targetVideoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;
    const videoToMoveIndex = currentPlaylist.videos.findIndex(v => v.id === videoIdToMove);
    if (videoToMoveIndex === -1) return;

    const [videoToMove] = currentPlaylist.videos.splice(videoToMoveIndex, 1);
    const targetIndex = currentPlaylist.videos.findIndex(v => v.id === targetVideoId);
    currentPlaylist.videos.splice(targetIndex !== -1 ? targetIndex : currentPlaylist.videos.length, 0, videoToMove);

    savePlaylists();
    renderVideos(); // Re-render current page
}
async function playVideo(videoId) {
    if (!videoId) return;

    try {
        if (!isYTApiReady) await loadYouTubePlayerAPI();

        playerWrapperEl.classList.remove('hidden');
        updatePlayerRelatedUI(videoId); // Update highlight, audio display, media session immediately

        if (!ytPlayer || !isPlayerReady) { // Player needs to be created or is not ready
            if (ytPlayer && typeof ytPlayer.destroy === 'function') ytPlayer.destroy(); // Destroy old instance if exists but not ready
            ytPlayer = createPlayer(videoId); // This will call onPlayerReady, which might autoplay
        } else {
            ytPlayer.loadVideoById(videoId); // This should autoplay due to playerVars
            if (userGesture && typeof ytPlayer.playVideo === 'function') { // Ensure play if user has interacted
                 try { ytPlayer.playVideo(); } catch(e) { console.warn("playVideo call failed", e); }
            }
        }
        // Scroll player into view if it's not fully visible (especially in audio-only or after adding video)
        if (playerWrapperEl.offsetParent !== null && !isAudioOnlyMode) {
            playerWrapperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

    } catch (error) {
        console.error("Playback error:", error);
        showToast("Failed to play video.", "error");
        handleClosePlayer();
    }
}
function stopVideo(clearPlayerInstance = false) {
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        try { ytPlayer.stopVideo(); } catch (e) { /* Ignore */ }
    }
    const oldPlayingVideoId = currentlyPlayingVideoId;
    currentlyPlayingVideoId = null;
    updatePlayerRelatedUI(null); // Clears highlight, audio display, media session

    if (clearPlayerInstance && ytPlayer) {
        if (typeof ytPlayer.destroy === 'function') {
            try { ytPlayer.destroy(); } catch (e) { console.error("Error destroying player:", e); }
        }
        ytPlayer = null;
        isPlayerReady = false;
        const playerContainer = document.getElementById('player');
        if (playerContainer) playerContainer.innerHTML = ''; // Clear the div
    }
    return oldPlayingVideoId; // Return ID of video that was stopped
}
function handleClosePlayer() {
    stopVideo(true); // Stop video and destroy player instance

    if ('mediaSession' in navigator) { // Explicitly clear media session
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
    }
    videoIdToPlayOnReady = null;
    playerWrapperEl.classList.add('hidden');
}
function playNextVideo() {
    if (!currentPlaylistId) return;
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length === 0) { handleClosePlayer(); return; }

    let nextVideoId = null;
    if (!currentlyPlayingVideoId && currentPlaylist.videos.length > 0) {
        nextVideoId = currentPlaylist.videos[0].id; // Play first if nothing was playing
    } else {
        const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
        if (currentIndex === -1 || currentIndex >= currentPlaylist.videos.length - 1) { // Not found or last video
            if (currentPlaylist.videos.length > 0) { // Loop to first video
                 nextVideoId = currentPlaylist.videos[0].id;
            } else {
                 handleClosePlayer(); return;
            }
        } else {
            nextVideoId = currentPlaylist.videos[currentIndex + 1].id;
        }
    }
    if (nextVideoId) playVideo(nextVideoId); else handleClosePlayer();
}
function playPreviousVideo() {
    if (!currentPlaylistId) return;
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length === 0) { handleClosePlayer(); return; }

    let prevVideoId = null;
    if (!currentlyPlayingVideoId && currentPlaylist.videos.length > 0) {
        prevVideoId = currentPlaylist.videos[currentPlaylist.videos.length - 1].id; // Play last if nothing was playing
    } else {
        const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
        if (currentIndex === -1 || currentIndex === 0) { // Not found or first video
            if (currentPlaylist.videos.length > 0) { // Loop to last video
                prevVideoId = currentPlaylist.videos[currentPlaylist.videos.length - 1].id;
            } else {
                handleClosePlayer(); return;
            }
        } else {
            prevVideoId = currentPlaylist.videos[currentIndex - 1].id;
        }
    }
    if (prevVideoId) playVideo(prevVideoId); else handleClosePlayer();
}

// --- Rendering ---
function renderPlaylists() {
    const searchTerm = playlistSearchInput.value.toLowerCase();
    const filteredPlaylists = playlists.filter(p => p.name.toLowerCase().includes(searchTerm));

    if (filteredPlaylists.length === 0) {
        playlistListEl.innerHTML = '';
        noPlaylistsMessageEl.classList.remove('hidden');
        noPlaylistsMessageEl.textContent = searchTerm ? 'No playlists match search.' : 'No playlists yet.';
    } else {
        noPlaylistsMessageEl.classList.add('hidden');
        const fragment = document.createDocumentFragment();
        filteredPlaylists.forEach(playlist => {
            const li = document.createElement('li');
            li.className = `playlist-item ${playlist.id === currentPlaylistId ? 'active' : ''}`;
            li.dataset.id = playlist.id;
            li.draggable = true;
            // Use textContent for names to prevent XSS if names could somehow contain HTML
            const nameSpan = document.createElement('span');
            nameSpan.className = 'playlist-name';
            nameSpan.textContent = playlist.name;

            const countSpan = document.createElement('span');
            countSpan.className = 'playlist-count';
            countSpan.textContent = playlist.videos.length;

            li.appendChild(nameSpan);
            li.appendChild(countSpan);
            li.innerHTML += `
                <div class="controls">
                    <button class="icon-button rename-btn" title="Rename Playlist">
                        ${ICONS.rename}<span class="visually-hidden">Rename ${playlist.name}</span>
                    </button>
                    <button class="icon-button delete-btn" title="Delete Playlist">
                        ${ICONS.delete}<span class="visually-hidden">Delete ${playlist.name}</span>
                    </button>
                </div>`;
            fragment.appendChild(li);
        });
        playlistListEl.innerHTML = ''; // Clear before append
        playlistListEl.appendChild(fragment);
    }
}
function renderVideos() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        videoGridEl.innerHTML = '';
        paginationControlsEl.classList.add('hidden');
        videoPlaceholderEl.textContent = currentPlaylist ? `Playlist "${currentPlaylist.name}" is empty.` : 'Select or create a playlist.';
        videoPlaceholderEl.classList.remove('hidden');
        return;
    }

    const totalVideos = currentPlaylist.videos.length;
    const totalPages = Math.ceil(totalVideos / videosPerPage);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    else if (totalPages === 0) currentPage = 1;

    const startIndex = (currentPage - 1) * videosPerPage;
    const videosToRender = currentPlaylist.videos.slice(startIndex, startIndex + videosPerPage);

    videoPlaceholderEl.classList.add('hidden');
    const fragment = document.createDocumentFragment();
    videosToRender.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        if (video.id === currentlyPlayingVideoId) card.classList.add('playing');
        card.dataset.videoId = video.id;
        card.draggable = true;

        // Using textContent for title for security and correctness
        const titleEl = document.createElement('h4');
        titleEl.textContent = video.title;

        card.innerHTML = `
            <div class="thumbnail-wrapper">
                <img src="${escapeHTML(video.thumbnail)}" class="thumbnail" alt="" loading="lazy">
            </div>
            <div class="video-info">
                 ${titleEl.outerHTML}
                 <div class="video-controls">
                     <span class="drag-handle" title="Drag to reorder">
                        ${ICONS.drag}<span class="visually-hidden">Drag to reorder ${video.title}</span>
                     </span>
                     <button class="icon-button delete-video-btn" title="Remove from playlist">
                        ${ICONS.delete}<span class="visually-hidden">Remove ${video.title} from playlist</span>
                     </button>
                 </div>
            </div>`;
        fragment.appendChild(card);
    });
    videoGridEl.innerHTML = '';
    videoGridEl.appendChild(fragment);
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
    paginationControlsEl.classList.add('hidden');
    if (ytPlayer) handleClosePlayer(); // Close player if one was active
    else playerWrapperEl.classList.add('hidden'); // Ensure it's hidden if no player
    updatePlayerRelatedUI(null); // Clear any player-related UI like audio info
    videoPlaceholderEl.textContent = 'Create or select a playlist.';
    videoPlaceholderEl.classList.remove('hidden');
    renderPlaylists();
}
function updatePlayingVideoHighlight(videoId) {
    videoGridEl.querySelectorAll('.video-card.playing').forEach(card => card.classList.remove('playing'));
    if (videoId) {
        const currentVideoCard = videoGridEl.querySelector(`.video-card[data-video-id="${videoId}"]`);
        if (currentVideoCard) currentVideoCard.classList.add('playing');
    }
}
function updateAudioOnlyDisplay(videoTitle) {
    if (isAudioOnlyMode && videoTitle) {
        audioOnlyTitleEl.textContent = videoTitle;
        audioOnlyInfoEl.classList.remove('hidden');
    } else {
        audioOnlyTitleEl.textContent = '';
        audioOnlyInfoEl.classList.add('hidden');
    }
}
function updatePlayerRelatedUI(videoId) {
    updatePlayingVideoHighlight(videoId);
    const video = videoId ? getCurrentVideo(videoId) : null;
    updateMediaSessionMetadata(video);
    updateAudioOnlyDisplay(video?.title);
}
function handleAutoplayToggle() {
    isAutoplayEnabled = autoplayToggle.checked;
    saveAutoplaySetting();
    showToast(`Autoplay ${isAutoplayEnabled ? 'enabled' : 'disabled'}.`, 'info');
}
function handleAudioOnlyToggle() {
    isAudioOnlyMode = audioOnlyToggle.checked;
    saveAudioOnlySetting();
    applyAudioOnlyClass();
    showToast(`Audio-Only Mode ${isAudioOnlyMode ? 'enabled' : 'disabled'}.`, 'info');

    const currentVideo = getCurrentVideo(currentlyPlayingVideoId);
    updateAudioOnlyDisplay(currentVideo?.title); // Update based on new mode

    if (ytPlayer) { // If player is active
        playerWrapperEl.classList.remove('hidden'); // Ensure wrapper is visible
        if (!isAudioOnlyMode && playerWrapperEl.offsetParent !== null) {
            // If switching from audio-only to video, scroll player into view
            setTimeout(() => playerWrapperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }
    } else if (!isAudioOnlyMode && !videoIdToPlayOnReady) {
        // If no video playing/queued and audio-only disabled, hide wrapper
        playerWrapperEl.classList.add('hidden');
    }
}
function renderPaginationControls(totalVideos, totalPages) {
    if (totalVideos <= videosPerPage) {
        paginationControlsEl.classList.add('hidden');
        return;
    }
    paginationControlsEl.classList.remove('hidden');
    pageInfoEl.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// --- Import / Export ---
function handleExportPlaylists() {
    if (playlists.length === 0) { showToast('No playlists to export.', 'info'); return; }
    try {
        const dataStr = JSON.stringify(playlists, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `playlists_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url); // Clean up
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
            if (!Array.isArray(importedData)) throw new Error("Invalid file: Not an array.");

            const existingIds = new Set(playlists.map(p => p.id));
            let addedCount = 0, skippedCount = 0;

            importedData.forEach(p => {
                if (p && typeof p.id !== 'undefined' && typeof p.name === 'string') {
                    if (!Array.isArray(p.videos)) p.videos = [];
                    p.videos = p.videos.filter(v => v && v.id && v.title); // Basic video validation
                    if (!existingIds.has(p.id)) {
                        playlists.push(p);
                        existingIds.add(p.id);
                        addedCount++;
                    } else skippedCount++;
                } else skippedCount++;
            });
            savePlaylists();
            playlistSearchInput.value = '';
            renderPlaylists();
            showToast(`Imported ${addedCount} playlists. Skipped ${skippedCount}.`, 'success');
            if (!currentPlaylistId && playlists.length > 0) selectPlaylist(playlists[0].id);
        } catch (error) {
            console.error("Import error:", error);
            showToast(`Import failed: ${error.message}`, 'error');
        } finally {
            importFileEl.value = ''; // Reset file input
        }
    };
    reader.onerror = () => { showToast('Error reading file.', 'error'); importFileEl.value = ''; };
    reader.readAsText(file);
}

// --- Utility Functions ---
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    escapeElement.textContent = str;
    return escapeElement.innerHTML;
}
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = ICONS.info;
    if (type === 'success') icon = ICONS.success;
    else if (type === 'error') icon = ICONS.error;
    toast.innerHTML = `${icon}<span>${escapeHTML(message)}</span>`; // Message is escaped here
    toastContainerEl.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    const timeoutId = setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
    toast.addEventListener('click', () => {
        clearTimeout(timeoutId);
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, { once: true });
}
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
function handleVisualSwitchClick(event) {
    const switchElement = event.target.closest('.switch');
    const checkbox = switchElement?.querySelector('input[type="checkbox"]');
    if (checkbox && event.target !== checkbox) checkbox.click();
}
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// --- Media Session API Integration ---
function updateMediaSessionMetadata(video) {
    if (!('mediaSession' in navigator)) return;
    try {
        if (video) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: video.title || 'Untitled Video',
                artist: 'YouTube', // Or extract channel if available
                album: playlists.find(p => p.id === currentPlaylistId)?.name || 'Playlist',
                artwork: [
                    { src: video.thumbnail?.replace('mqdefault', 'hqdefault') || '', sizes: '480x360', type: 'image/jpeg' },
                    { src: video.thumbnail || '', sizes: '320x180', type: 'image/jpeg' }
                ]
            });
        } else {
            navigator.mediaSession.metadata = null;
        }
        // Handlers should be set once, or re-set if player instance changes
        // For simplicity, setting them here ensures they are active when metadata is set.
        setupMediaSessionActionHandlers();
    } catch (error) {
        console.warn("MediaSession metadata error:", error);
    }
}
function setupMediaSessionActionHandlers() {
    if (!('mediaSession' in navigator)) return;
    const actions = {
        'play': () => ytPlayer?.playVideo?.(),
        'pause': () => ytPlayer?.pauseVideo?.(),
        'previoustrack': playPreviousVideo,
        'nexttrack': () => { if (isAutoplayEnabled) playNextVideo(); },
        'stop': handleClosePlayer // Or just ytPlayer?.stopVideo?.() if you don't want full close
    };
    for (const [action, handler] of Object.entries(actions)) {
        try {
            navigator.mediaSession.setActionHandler(action, handler);
        } catch (error) {
            console.warn(`Failed to set media action handler for ${action}:`, error);
        }
    }
}

// --- Start the app ---
init();