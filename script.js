// DOM Elements - Cache frequently used elements
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
const paginationControlsEl = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfoEl = document.getElementById('pageInfo');
const audioOnlyToggle = document.getElementById('audioOnlyToggle');
const audioOnlySwitchDiv = document.getElementById('audioOnlyControlGroup').querySelector('.switch');

// State
let playlists = [];
let currentPlaylistId = null;
let ytPlayer = null;
let isPlayerReady = false;
let videoIdToPlayOnReady = null;
let isAutoplayEnabled = true;
let currentlyPlayingVideoId = null;
let draggedVideoId = null;
let dragTargetElement = null;
let draggedPlaylistId = null;
let playlistDragTargetElement = null;
let currentTheme = 'dark';
let isResizing = false;
let isTouchDragging = false;
let touchDraggedElement = null;
const videosPerPage = 20;
let currentPage = 1;
let isAudioOnlyMode = false;

// Icons
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
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>`,
};

// Initialization
function init() {
    loadTheme();
    loadPlaylists();
    loadAutoplaySetting();
    loadAudioOnlySetting();
    loadSidebarWidth();
    renderPlaylists();

    const lastSelectedId = localStorage.getItem('lastSelectedPlaylistId');
    const lastSelectedPlaylist = playlists.find(p => p.id === parseInt(lastSelectedId));
    if (lastSelectedPlaylist) {
        selectPlaylist(lastSelectedPlaylist.id);
    } else if (playlists.length > 0) {
        selectPlaylist(playlists[0].id);
    } else {
        updateUIForNoSelection();
    }

    setupEventListeners();
    updateThemeIcon();

    if (isIOS() && isInStandaloneMode()) {
        document.documentElement.classList.add('ios-pwa');
    }
}

// Sidebar Resizing
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
    document.addEventListener('mousemove', handleSidebarResize, { passive: false });
    document.addEventListener('mouseup', stopSidebarResize);
    e.preventDefault();
}

function handleSidebarResize(e) {
    if (!isResizing) return;
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const rootStyles = getComputedStyle(document.documentElement);
    const minWidth = parseInt(rootStyles.getPropertyValue('--sidebar-min-width'));
    const maxWidth = parseInt(rootStyles.getPropertyValue('--sidebar-max-width'));

    const newWidth = Math.max(minWidth, Math.min(e.clientX - containerRect.left, maxWidth));
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

// Event Listeners
function setupEventListeners() {
    createPlaylistBtn.addEventListener('click', handleCreatePlaylist);
    playlistNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleCreatePlaylist(); });
    addVideoBtn.addEventListener('click', handleAddVideo);
    videoUrlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !addVideoBtn.disabled) handleAddVideo(); });
    videoUrlInput.addEventListener('input', () => { addVideoBtn.disabled = videoUrlInput.value.trim() === ''; });
    autoplayToggle.addEventListener('change', handleAutoplayToggle);
    autoplaySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    clearPlaylistBtn.addEventListener('click', handleClearPlaylist);
    themeToggleBtn.addEventListener('click', toggleTheme);
    shufflePlaylistBtn.addEventListener('click', handleShufflePlaylist);
    playlistSearchInput.addEventListener('input', debounce(handlePlaylistSearch, 300));
    importBtn.addEventListener('click', () => importFileEl.click());
    importFileEl.addEventListener('change', handleImportPlaylists);
    exportBtn.addEventListener('click', handleExportPlaylists);
    audioOnlyToggle.addEventListener('change', handleAudioOnlyToggle);
    audioOnlySwitchDiv.addEventListener('click', handleVisualAudioOnlySwitchClick);
    sidebarResizerEl.addEventListener('mousedown', initSidebarResize);
    closePlayerBtn.addEventListener('click', handleClosePlayer);

    playlistListEl.addEventListener('click', handlePlaylistClick, { passive: false });
    videoGridEl.addEventListener('click', handleVideoGridClick);

    setupDragAndDropListeners();
    setupPlaylistDragAndDropListeners();

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

    setupTouchDragAndDropListeners();
    window.addEventListener('resize', debounce(handleWindowResize, 100));
}

// Event Delegation Handlers
function handlePlaylistClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const playlistItem = event.target.closest('.playlist-item');
    if (!playlistItem) return;
    const playlistId = parseInt(playlistItem.dataset.id);

    if (event.target.closest('.rename-btn')) {
        handleRenamePlaylist(playlistId);
    } else if (event.target.closest('.delete-btn')) {
        handleDeletePlaylist(playlistId);
    } else if (!event.target.closest('.playlist-drag-handle') && !event.target.closest('.controls')) {
        // Remove .active from all playlist items (extra safety for mobile)
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
        });
        playlistItem.classList.add('active');

        // Only scroll into view on desktop
        if (window.innerWidth >= 768) {
            playlistItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        selectPlaylist(playlistId);
    }
}

function handleVideoGridClick(event) {
    const videoCard = event.target.closest('.video-card');
    if (!videoCard) return;
    const videoId = videoCard.dataset.videoId;

    if (event.target.closest('.delete-video-btn')) {
        event.stopPropagation();
        handleDeleteVideo(videoId);
    } else if (!event.target.closest('.drag-handle')) {
        playVideo(videoId);
    }
}

// Drag and Drop (Videos) - Delegation
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
        setTimeout(() => videoCard.classList.add('dragging'), 0);
    } else {
        event.preventDefault();
    }
}

function handleDragEnd() {
    const draggingElement = videoGridEl.querySelector('.video-card.dragging');
    if (draggingElement) draggingElement.classList.remove('dragging');
    clearDragOverStyles(); // Explicitly clear styles
    draggedVideoId = null;
    dragTargetElement = null;
}

function handleDragOver(event) {
    event.preventDefault();
    if (!draggedVideoId) return;

    const targetCard = event.target.closest('.video-card');
    if (targetCard && targetCard.dataset.videoId !== draggedVideoId) {
        if (dragTargetElement !== targetCard) {
            clearDragOverStyles();
            targetCard.classList.add('drag-over');
            dragTargetElement = targetCard;
        }
        event.dataTransfer.dropEffect = 'move';
    } else {
        if (dragTargetElement) {
            clearDragOverStyles();
            dragTargetElement = null;
        }
        event.dataTransfer.dropEffect = 'none';
    }
}

function handleDragLeave(event) {
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

    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
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

// Drag and Drop (Playlists) - Delegation
function setupPlaylistDragAndDropListeners() {
    playlistListEl.addEventListener('dragstart', handlePlaylistDragStart);
    playlistListEl.addEventListener('dragend', handlePlaylistDragEnd);
    playlistListEl.addEventListener('dragover', handlePlaylistDragOver);
    playlistListEl.addEventListener('dragleave', handlePlaylistDragLeave);
    playlistListEl.addEventListener('drop', handlePlaylistDrop);
}

function handlePlaylistDragStart(event) {
    const playlistItem = event.target.closest('.playlist-item');
    if (playlistItem && playlistItem.draggable) {
        draggedPlaylistId = parseInt(playlistItem.dataset.id);
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => playlistItem.classList.add('dragging'), 0);
    } else {
        event.preventDefault();
    }
}

function handlePlaylistDragEnd() {
    const draggingElement = playlistListEl.querySelector('.playlist-item.dragging');
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
    }
    clearPlaylistDragOverStyles();
    draggedPlaylistId = null;
    playlistDragTargetElement = null;
}

function handlePlaylistDragOver(event) {
    event.preventDefault();
    if (draggedPlaylistId === null) return;

    const targetItem = event.target.closest('.playlist-item');
    if (targetItem && parseInt(targetItem.dataset.id) !== draggedPlaylistId) {
        if (playlistDragTargetElement !== targetItem) {
            clearPlaylistDragOverStyles();
            targetItem.classList.add('drag-over');
            playlistDragTargetElement = targetItem;
        }
        event.dataTransfer.dropEffect = 'move';
    } else {
        if (playlistDragTargetElement) {
            clearPlaylistDragOverStyles();
            playlistDragTargetElement = null;
        }
        event.dataTransfer.dropEffect = 'none';
    }
}

function handlePlaylistDragLeave(event) {
    const targetItem = event.target.closest('.playlist-item');
    if (targetItem && targetItem === playlistDragTargetElement && !targetItem.contains(event.relatedTarget)) {
        clearPlaylistDragOverStyles();
        playlistDragTargetElement = null;
    }
}

function handlePlaylistDrop(event) {
    event.preventDefault();
    clearPlaylistDragOverStyles();
    const targetItem = event.target.closest('.playlist-item');
    const dropTargetId = targetItem ? parseInt(targetItem.dataset.id) : null;

    if (draggedPlaylistId !== null && dropTargetId !== draggedPlaylistId) {
        const targetRect = targetItem ? targetItem.getBoundingClientRect() : null;
        let insertBeforeTarget = true;
        if (targetRect) {
            insertBeforeTarget = (event.clientY - targetRect.top) < (targetRect.height / 2);
        }
        handleReorderPlaylist(draggedPlaylistId, dropTargetId, insertBeforeTarget);
    }
    draggedPlaylistId = null;
    playlistDragTargetElement = null;
}

function clearPlaylistDragOverStyles() {
    playlistListEl.querySelectorAll('.playlist-item.drag-over').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleReorderPlaylist(playlistIdToMove, targetPlaylistId, insertBeforeTarget = true) {
    const playlistToMoveIndex = playlists.findIndex(p => p.id === playlistIdToMove);
    if (playlistToMoveIndex === -1) return;

    const [movedPlaylist] = playlists.splice(playlistToMoveIndex, 1);

    if (targetPlaylistId === null) {
        playlists.push(movedPlaylist);
    } else {
        const targetIndex = playlists.findIndex(p => p.id === targetPlaylistId);
        if (targetIndex !== -1) {
            const insertIndex = insertBeforeTarget ? targetIndex : targetIndex + 1;
            playlists.splice(insertIndex, 0, movedPlaylist);
        } else {
            playlists.push(movedPlaylist);
        }
    }
    savePlaylists();
    renderPlaylists();
}

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('uiTheme') || 'dark';
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

// YouTube Player API
function destroyPlayer() {
    if (ytPlayer) {
        try {
            ytPlayer.destroy();
        } catch (error) {
            console.error("Error destroying player:", error);
        }
        ytPlayer = null;
    }
    isPlayerReady = false;
    videoIdToPlayOnReady = null;
}

function onYouTubeIframeAPIReady() {
    if (document.getElementById('player')) {
        destroyPlayer(); // Ensure no duplicate player
        ytPlayer = new YT.Player('player', {
            height: '100%',
            width: '100%',
            playerVars: { 'playsinline': 1, 'rel': 0, 'enablejsapi': 1, 'autoplay': 1 },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } else {
        console.warn("Player element ('#player') not found when YouTube API was ready.");
    }
}

function onPlayerReady() {
    isPlayerReady = true;
    if (videoIdToPlayOnReady) {
        playVideo(videoIdToPlayOnReady);
        videoIdToPlayOnReady = null;
    }
}

function onPlayerStateChange(event) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (event.data === YT.PlayerState.PLAYING) {
        currentlyPlayingVideoId = getCurrentPlayingVideoIdFromApi();
        updatePlayingVideoHighlight(currentlyPlayingVideoId);
        updateAudioOnlyDisplay();
        if (currentPlaylist) {
            const videoData = currentPlaylist.videos.find(v => v.id === currentlyPlayingVideoId);
            if (videoData) updateMediaSessionMetadata(videoData);
        }
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "playing";
    }
    if (event.data === YT.PlayerState.PAUSED) {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "paused";
    }
    if (event.data === YT.PlayerState.ENDED) {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "none";
        if (isAutoplayEnabled) {
            playNextVideo();
        } else {
            stopVideo();
            playerWrapperEl.classList.add('hidden');
        }
    }
}

function onPlayerError(event) {
    console.error('YouTube Player Error:', event.data);
    let errorMsg = 'An unknown player error occurred.';
    const videoId = getCurrentPlayingVideoIdFromApi();
    const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'Unknown video';
    console.error(`Error occurred for video: ${videoUrl}`);
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
        setTimeout(playNextVideo, 500);
    } else {
        stopVideo();
        playerWrapperEl.classList.add('hidden');
    }
}

function getCurrentPlayingVideoIdFromApi() {
    if (ytPlayer && typeof ytPlayer.getVideoData === 'function') {
        const videoData = ytPlayer.getVideoData();
        return videoData ? videoData.video_id : null;
    }
    return null;
}

function playNextVideo() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1) return;

    const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);

    if (currentIndex === -1 || currentPlaylist.videos.length < 2) {
        if (currentIndex === -1 && currentPlaylist.videos.length > 0) {
            playVideo(currentPlaylist.videos[0].id);
        } else {
            stopVideo();
            playerWrapperEl.classList.add('hidden');
        }
        return;
    }

    const nextIndex = (currentIndex + 1) % currentPlaylist.videos.length;
    const nextVideo = currentPlaylist.videos[nextIndex];

    if (nextVideo) {
        playVideo(nextVideo.id);
    } else {
        console.error(`Could not find next video at index ${nextIndex}`);
        stopVideo();
        playerWrapperEl.classList.add('hidden');
    }
}

// Local Storage & State Persistence
function savePlaylists() {
    try {
        localStorage.setItem('playlists', JSON.stringify(playlists));
    } catch (e) {
        console.error("Error saving playlists to localStorage:", e);
        showToast("Failed to save playlists. Storage might be full.", "error");
    }
}

function loadPlaylists() {
    try {
        const savedPlaylists = localStorage.getItem('playlists');
        playlists = JSON.parse(savedPlaylists) || [];
        playlists.forEach(p => { if (!p.videos) p.videos = []; });
    } catch (e) {
        console.error("Error loading playlists from localStorage:", e);
        showToast("Failed to load playlists. Data might be corrupted.", "error");
        playlists = [];
    }
}

function saveLastSelectedPlaylist(id) {
    try {
        localStorage.setItem('lastSelectedPlaylistId', id ? String(id) : '');
    } catch (e) {
        console.error("Error saving last selected playlist ID:", e);
    }
}

function saveAutoplaySetting() {
    try {
        localStorage.setItem('autoplayEnabled', isAutoplayEnabled);
    } catch (e) {
        console.error("Error saving autoplay setting:", e);
    }
}

function loadAutoplaySetting() {
    try {
        isAutoplayEnabled = localStorage.getItem('autoplayEnabled') !== 'false'; // Defaults to true unless explicitly set to false
        autoplayToggle.checked = isAutoplayEnabled;
    } catch (e) {
        console.error("Error loading autoplay setting:", e);
        isAutoplayEnabled = true;
        autoplayToggle.checked = true;
    }
}

// Playlist Management
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

    // Apply animation to the newly created playlist
    const newPlaylistItem = playlistListEl.querySelector(`.playlist-item[data-id="${newPlaylist.id}"]`);
    if (newPlaylistItem) {
        newPlaylistItem.classList.add('added');
        setTimeout(() => newPlaylistItem.classList.remove('added'), 300);
    }
}

function handleDeletePlaylist(id) {
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) return;

    // Confirm deletion with the user
    const confirmDelete = confirm(`Are you sure you want to delete the playlist "${escapeHTML(playlist.name)}"?`);
    if (!confirmDelete) return;

    const playlistIndex = playlists.findIndex(p => p.id === id);
    if (playlistIndex === -1) return;

    // Remove the playlist from the array
    const newPlaylists = [...playlists.slice(0, playlistIndex), ...playlists.slice(playlistIndex + 1)];
    playlists = newPlaylists;
    savePlaylists();

    // If the deleted playlist was the currently selected one, reset the selection
    if (currentPlaylistId === id) {
        currentPlaylistId = null;
        saveLastSelectedPlaylist(null);
        updateUIForNoSelection();
    }

    // Re-render the playlists and videos
    renderPlaylists();
    renderVideos();

    showToast(`Playlist "${escapeHTML(playlist.name)}" deleted.`, 'info');
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
        showToast(`Renamed from "${escapeHTML(oldName)}" to "${escapeHTML(playlist.name)}".`, 'info');
    }
}

function selectPlaylist(id) {
    // Clear active state from all playlist items
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });

    // Apply active state to the selected playlist
    const selectedPlaylist = document.querySelector(`.playlist-item[data-id="${id}"]`);
    if (selectedPlaylist) {
        selectedPlaylist.classList.add('active');
    }

    // Update the current playlist ID and save it
    currentPlaylistId = id;
    saveLastSelectedPlaylist(id);

    // Reset search input if it's not empty
    if (playlistSearchInput.value !== '') {
        playlistSearchInput.value = '';
    }

    // Update the UI
    const currentPlaylist = playlists.find(p => p.id === id);
    if (currentPlaylist) {
        currentPlaylistTitleEl.textContent = escapeHTML(currentPlaylist.name);
    }

    // Show/hide relevant UI elements
    videoFormEl.classList.remove('hidden');
    playlistActionsEl.classList.remove('hidden');
    addVideoBtn.disabled = videoUrlInput.value.trim() === '';
    videoPlaceholderEl.classList.add('hidden');

    // Reset player and video highlights
    playerWrapperEl.classList.add('hidden');
    stopVideo();
    updatePlayingVideoHighlight(null);

    // Re-render playlists and videos
    renderPlaylists();
    renderVideos();
}

function handleClearPlaylist() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;
    if (currentPlaylist.videos.length === 0) {
        showToast('Playlist is already empty.', 'info');
        return;
    }

    if (!confirm(`Remove all videos from "${escapeHTML(currentPlaylist.name)}"?`)) return;

    currentPlaylist.videos = [];
    savePlaylists();

    stopVideo();
    playerWrapperEl.classList.add('hidden');
    handleClosePlayer();

    renderVideos();
    renderPlaylists();
    showToast(`All videos removed from "${escapeHTML(currentPlaylist.name)}".`, 'info');
}

function handlePlaylistSearch() {
    renderPlaylists();
}

function handleShufflePlaylist() {
    if (!currentPlaylistId) { showToast('Select a playlist to shuffle.', 'info'); return; }
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;
    if (currentPlaylist.videos.length < 2) {
        showToast('Playlist needs at least two videos to shuffle.', 'info');
        return;
    }

    for (let i = currentPlaylist.videos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentPlaylist.videos[i], currentPlaylist.videos[j]] = [currentPlaylist.videos[j], currentPlaylist.videos[i]];
    }

    savePlaylists();
    currentPage = 1;
    renderVideos();
    showToast(`Playlist "${escapeHTML(currentPlaylist.name)}" shuffled!`, 'success');
}

// Video Management
function updatePlayingVideoHighlight(videoId) {
    videoGridEl.querySelectorAll('.video-card.playing').forEach(card => card.classList.remove('playing'));
    if (videoId) {
        const currentVideoCard = videoGridEl.querySelector(`.video-card[data-video-id="${videoId}"]`);
        if (currentVideoCard) currentVideoCard.classList.add('playing');
    }
}

async function handleAddVideo() {
    const url = videoUrlInput.value.trim();
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!url) { showToast('Please enter a YouTube video URL.', 'error'); return; }
    if (!currentPlaylist) {
        showToast('Please select a playlist first.', 'error');
        return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) { showToast('Invalid YouTube URL.', 'error'); videoUrlInput.focus(); return; }

    if (currentPlaylist.videos.some(v => v.id === videoId)) {
        showToast(`Video already in "${escapeHTML(currentPlaylist.name)}".`, 'info');
        return;
    }

    addVideoBtn.disabled = true;
    addVideoBtn.innerHTML = ICONS.loading + ' Adding...';
    videoUrlInput.disabled = true;

    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);

        if (!response.ok) {
            let errorMsg = `Failed to fetch video info (HTTP ${response.status}).`;
            try { const errData = await response.json(); errorMsg = errData.error || errorMsg; } catch (_) { }
            throw new Error(errorMsg);
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
        savePlaylists();

        // Append the new video card directly to the grid
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="video-card ${video.id === currentlyPlayingVideoId ? 'playing' : ''}" data-video-id="${video.id}" draggable="true">
                <div class="thumbnail-wrapper">
                    <img src="${escapeHTML(video.thumbnail)}" class="thumbnail" alt="" loading="lazy">
                </div>
                <div class="video-info">
                    <h4>${escapeHTML(video.title)}</h4>
                    <div class="video-controls">
                        <span class="drag-handle" title="Drag to reorder">${ICONS.drag}</span>
                        <button class="icon-button delete-video-btn" title="Remove from playlist">${ICONS.delete}</button>
                    </div>
                </div>
            </div>`;
        const videoCard = div.firstElementChild;
        videoGridEl.appendChild(videoCard);

        // Apply animation to the newly added video
        videoCard.classList.add('added');
        setTimeout(() => videoCard.classList.remove('added'), 300);

        videoUrlInput.value = '';
        showToast(`Video "${escapeHTML(video.title)}" added.`, 'success');
    } catch (error) {
        console.error('Add video error:', error);
        showToast(`Error adding video: ${error.message}`, 'error');
    } finally {
        addVideoBtn.disabled = videoUrlInput.value.trim() === '';
        addVideoBtn.innerHTML = ICONS.add + ' Add Video';
        videoUrlInput.disabled = false;
        addVideoBtn.focus();
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
    savePlaylists();

    // Remove the video card directly from the grid
    const videoCard = videoGridEl.querySelector(`.video-card[data-video-id="${videoId}"]`);
    if (videoCard) {
        videoCard.remove();
    }

    showToast(`Removed "${escapeHTML(videoTitle)}".`, 'info');

    if (videoId === currentlyPlayingVideoId) currentlyPlayingVideoId = null;
}

function handleReorderVideo(videoIdToMove, targetVideoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;

    const videoToMoveIndex = currentPlaylist.videos.findIndex(v => v.id === videoIdToMove);
    if (videoToMoveIndex === -1) return;

    const [movedVideo] = currentPlaylist.videos.splice(videoToMoveIndex, 1);

    const targetIndex = currentPlaylist.videos.findIndex(v => v.id === targetVideoId);

    if (targetIndex !== -1) {
        currentPlaylist.videos.splice(targetIndex, 0, movedVideo);
    } else {
        currentPlaylist.videos.push(movedVideo);
    }

    savePlaylists();
    renderVideos();
}

function playVideo(videoId) {
    if (currentlyPlayingVideoId === videoId && ytPlayer && isPlayerReady) {
        return; // Avoid redundant calls
    }

    playerWrapperEl.classList.remove('hidden');
    currentlyPlayingVideoId = videoId;
    updatePlayingVideoHighlight(videoId);

    if (ytPlayer && isPlayerReady) {
        try {
            ytPlayer.loadVideoById(videoId);
            setTimeout(() => {
                if (playerWrapperEl.offsetParent !== null) {
                    playerWrapperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
        } catch (error) {
            console.error("Error calling loadVideoById:", error);
            showToast("Failed to load video.", "error");
            stopVideo();
            playerWrapperEl.classList.add('hidden');
            videoIdToPlayOnReady = null;
        }
    } else {
        videoIdToPlayOnReady = videoId;
        if (!ytPlayer) {
            onYouTubeIframeAPIReady(); // Reinitialize if player is destroyed
        }
    }

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (currentPlaylist) {
        const videoData = currentPlaylist.videos.find(v => v.id === videoId);
        updateMediaSessionMetadata(videoData || null);
    } else {
        updateMediaSessionMetadata(null);
    }
    updateAudioOnlyDisplay();
}

function stopVideo() {
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        ytPlayer.stopVideo();
    }
    currentlyPlayingVideoId = null;
    updatePlayingVideoHighlight(null);
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
    }
}

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Rendering
function renderPlaylists() {
    const searchTerm = playlistSearchInput.value.toLowerCase();
    const filteredPlaylists = playlists.filter(p => p.name.toLowerCase().includes(searchTerm));
    const fragment = document.createDocumentFragment();

    if (filteredPlaylists.length === 0) {
        noPlaylistsMessageEl.classList.remove('hidden');
        noPlaylistsMessageEl.textContent = searchTerm ? 'No playlists match your search.' : 'No playlists created yet.';
    } else {
        noPlaylistsMessageEl.classList.add('hidden');
        filteredPlaylists.forEach(playlist => {
            const li = document.createElement('li');
            li.className = `playlist-item ${playlist.id === currentPlaylistId ? 'active' : ''}`;
            li.dataset.id = playlist.id;
            li.draggable = window.innerWidth >= 768;
            li.innerHTML = `
                <span class="playlist-name">${escapeHTML(playlist.name)}</span>
                <span class="playlist-count">${playlist.videos.length}</span>
                <div class="controls">
                    <button class="icon-button rename-btn" title="Rename Playlist">${ICONS.rename}</button>
                    <button class="icon-button delete-btn" title="Delete Playlist">${ICONS.delete}</button>
                </div>`;
            fragment.appendChild(li);
        });
    }

    playlistListEl.innerHTML = '';
    playlistListEl.appendChild(fragment);
}

function renderVideos() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    videoGridEl.innerHTML = '';

    if (!currentPlaylist || currentPlaylist.videos.length === 0) {
        paginationControlsEl.classList.add('hidden');
        videoPlaceholderEl.textContent = currentPlaylist ? `Playlist "${escapeHTML(currentPlaylist.name)}" is empty.` : 'Select or create a playlist.';
        videoPlaceholderEl.classList.remove('hidden');
        return;
    }

    videoPlaceholderEl.classList.add('hidden');
    const totalVideos = currentPlaylist.videos.length;
    const totalPages = Math.ceil(totalVideos / videosPerPage);
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
    else if (currentPage < 1 && totalPages > 0) currentPage = 1;
    else if (totalPages === 0) currentPage = 1;

    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const videosToRender = currentPlaylist.videos.slice(startIndex, endIndex);

    const fragment = document.createDocumentFragment();

    videosToRender.forEach(video => {
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="video-card ${video.id === currentlyPlayingVideoId ? 'playing' : ''}" data-video-id="${video.id}" draggable="true">
                <div class="thumbnail-wrapper">
                    <img data-src="${escapeHTML(video.thumbnail)}" class="thumbnail" alt="" loading="lazy">
                </div>
                <div class="video-info">
                    <h4>${escapeHTML(video.title)}</h4>
                    <div class="video-controls">
                        <span class="drag-handle" title="Drag to reorder">${ICONS.drag}</span>
                        <button class="icon-button delete-video-btn" title="Remove from playlist">${ICONS.delete}</button>
                    </div>
                </div>
            </div>`;
        fragment.appendChild(div.firstElementChild);
    });

    videoGridEl.appendChild(fragment);
    renderPaginationControls(totalVideos, totalPages);

    // Lazy load images
    const lazyImages = videoGridEl.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => lazyImageObserver.observe(img));
    } else {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// UI Updates
function updateUIForNoSelection() {
    currentPlaylistId = null;
    saveLastSelectedPlaylist(null);
    currentPlaylistTitleEl.textContent = 'No playlist selected';
    videoFormEl.classList.add('hidden');
    playlistActionsEl.classList.add('hidden');
    videoGridEl.innerHTML = '';
    playerWrapperEl.classList.add('hidden');
    stopVideo();
    videoPlaceholderEl.textContent = 'Create or select a playlist to get started.';
    videoPlaceholderEl.classList.remove('hidden');
    paginationControlsEl.classList.add('hidden');
    renderPlaylists(); // Ensure the playlist list is updated
}

function handleAutoplayToggle() {
    isAutoplayEnabled = autoplayToggle.checked;
    saveAutoplaySetting();
    showToast(`Autoplay ${isAutoplayEnabled ? 'enabled' : 'disabled'}.`, 'info');
}

// Import / Export
function handleExportPlaylists() {
    if (playlists.length === 0) { showToast('No playlists to export.', 'info'); return; }
    try {
        const dataStr = JSON.stringify(playlists, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `playlists_backup_${new Date().toISOString().split('T')[0]}.json`;
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
            if (!Array.isArray(importedData) || (importedData.length > 0 && typeof importedData[0].id === 'undefined')) {
                throw new Error("Invalid file format.");
            }

            const existingIds = new Set(playlists.map(p => p.id));
            let addedCount = 0, skippedCount = 0;

            importedData.forEach(p => {
                if (p && typeof p.id !== 'undefined' && typeof p.name === 'string') {
                    if (!Array.isArray(p.videos)) p.videos = [];
                    p.videos = p.videos.filter(v => v && typeof v.id === 'string' && typeof v.title === 'string');

                    if (!existingIds.has(p.id)) {
                        playlists.push(p);
                        existingIds.add(p.id);
                        addedCount++;
                    } else {
                        skippedCount++;
                    }
                } else {
                    skippedCount++;
                }
            });

            savePlaylists();
            playlistSearchInput.value = '';
            renderPlaylists();
            showToast(`Imported ${addedCount} playlists. Skipped ${skippedCount}.`, 'success');

            if (!currentPlaylistId && playlists.length > 0) {
                selectPlaylist(playlists[0].id);
            } else if (currentPlaylistId && !playlists.find(p => p.id === currentPlaylistId)) {
                 if (playlists.length > 0) selectPlaylist(playlists[0].id);
                 else updateUIForNoSelection();
            }

        } catch (error) {
            console.error("Import error:", error);
            showToast(`Import failed: ${error.message}`, 'error');
        } finally {
            importFileEl.value = '';
        }
    };
    reader.onerror = () => { showToast('Error reading file.', 'error'); importFileEl.value = ''; };
    reader.readAsText(file);
}

function handleVisualSwitchClick(event) {
    if (event.target !== autoplayToggle) {
        autoplayToggle.click();
    }
}

// Audio Only Mode
function loadAudioOnlySetting() {
    try {
        isAudioOnlyMode = localStorage.getItem('audioOnlyEnabled') === 'true';
        audioOnlyToggle.checked = isAudioOnlyMode;
        applyAudioOnlyClass();
    } catch (e) {
        console.error("Error loading audio only setting:", e);
        isAudioOnlyMode = false;
        audioOnlyToggle.checked = false;
        applyAudioOnlyClass();
    }
}

function saveAudioOnlySetting() {
    try {
        localStorage.setItem('audioOnlyEnabled', isAudioOnlyMode);
    } catch (e) {
        console.error("Error saving audio only setting:", e);
    }
}

function handleAudioOnlyToggle() {
    isAudioOnlyMode = audioOnlyToggle.checked;
    saveAudioOnlySetting();
    applyAudioOnlyClass();
    if (currentlyPlayingVideoId) {
        updateAudioOnlyDisplay();
    }
    showToast(`Audio-only mode ${isAudioOnlyMode ? 'enabled' : 'disabled'}.`, 'info');
}

function applyAudioOnlyClass() {
    bodyEl.classList.toggle('audio-only-active', isAudioOnlyMode);
}

function updateAudioOnlyDisplay() {
    const existingInfo = playerWrapperEl.querySelector('.audio-only-info');
    if (existingInfo) existingInfo.remove();

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    const videoData = currentPlaylist ? currentPlaylist.videos.find(v => v.id === currentlyPlayingVideoId) : null;

    if (videoData && isAudioOnlyMode) {
        const audioOnlyInfo = document.createElement('div');
        audioOnlyInfo.className = 'audio-only-info';
        audioOnlyInfo.innerHTML = `<span class="audio-title">${escapeHTML(videoData.title)}</span>`;
        playerWrapperEl.appendChild(audioOnlyInfo);
    }
}

function handleVisualAudioOnlySwitchClick(event) {
    if (event.target !== audioOnlyToggle) {
        audioOnlyToggle.click();
    }
}

// Utility Functions
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${ICONS[type] || ICONS.info}<span>${escapeHTML(message)}</span>`;
    toastContainerEl.appendChild(toast);

    // Remove existing toasts if too many
    if (toastContainerEl.children.length > 3) {
        toastContainerEl.removeChild(toastContainerEl.children[0]);
    }

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

function handleClosePlayer() {
    stopVideo();
    playerWrapperEl.classList.add('hidden');
    destroyPlayer(); // Destroy player when closed
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
}

// Media Session API
function updateMediaSessionMetadata(video) {
    if (!('mediaSession' in navigator)) return;

    if (!video) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
        return;
    }

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);

    navigator.mediaSession.metadata = new MediaMetadata({
        title: video.title,
        artist: 'YouTube',
        album: currentPlaylist ? currentPlaylist.name : 'Playlist',
        artwork: [
            { src: video.thumbnail.replace('mqdefault', 'hqdefault'), sizes: '480x360', type: 'image/jpeg' },
            { src: video.thumbnail, sizes: '320x180', type: 'image/jpeg' },
        ]
    });

    setupMediaSessionActionHandlers();
}

function setupMediaSessionActionHandlers() {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', () => {
        if (ytPlayer?.playVideo) ytPlayer.playVideo();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
        if (ytPlayer?.pauseVideo) ytPlayer.pauseVideo();
    });
    navigator.mediaSession.setActionHandler('stop', () => handleClosePlayer());
    navigator.mediaSession.setActionHandler('previoustrack', () => playPreviousVideo());
    navigator.mediaSession.setActionHandler('nexttrack', () => playNextVideo());
}

function playPreviousVideo() {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1 || !currentlyPlayingVideoId) return;

    const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + currentPlaylist.videos.length) % currentPlaylist.videos.length;

    if (currentPlaylist.videos[prevIndex]) {
        playVideo(currentPlaylist.videos[prevIndex].id);
    }
}

// Touch Drag and Drop (Videos) - Delegation
function setupTouchDragAndDropListeners() {
    videoGridEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    videoGridEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    videoGridEl.addEventListener('touchend', handleTouchEnd);
    videoGridEl.addEventListener('touchcancel', handleTouchEnd);
}

function handleTouchStart(event) {
    const targetCard = event.target.closest('.video-card[draggable="true"]');
    const dragHandle = event.target.closest('.drag-handle');

    if (targetCard && dragHandle) {
        isTouchDragging = true;
        draggedVideoId = targetCard.dataset.videoId;
        touchDraggedElement = targetCard;
        touchDraggedElement.classList.add('dragging');
        if (navigator.vibrate) navigator.vibrate(50);
        event.preventDefault();
    } else {
        isTouchDragging = false;
        draggedVideoId = null;
        touchDraggedElement = null;
    }
}

function handleTouchMove(event) {
    if (!isTouchDragging || !touchDraggedElement) return;

    event.preventDefault();

    const touch = event.touches[0];
    touchDraggedElement.style.visibility = 'hidden';
    const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    touchDraggedElement.style.visibility = '';

    const targetCard = elementUnderTouch ? elementUnderTouch.closest('.video-card') : null;

    clearDragOverStyles();

    if (targetCard && targetCard !== touchDraggedElement) {
        targetCard.classList.add('drag-over');
        dragTargetElement = targetCard;
    } else {
        dragTargetElement = null;
    }
}

function handleTouchEnd() {
    if (!isTouchDragging || !touchDraggedElement) {
        clearDragOverStyles();
        if (touchDraggedElement) touchDraggedElement.classList.remove('dragging');
        isTouchDragging = false; draggedVideoId = null; touchDraggedElement = null; dragTargetElement = null;
        return;
    }

    touchDraggedElement.classList.remove('dragging');
    clearDragOverStyles();

    const dropTargetId = dragTargetElement ? dragTargetElement.dataset.videoId : null;

    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
        handleReorderVideo(draggedVideoId, dropTargetId);
        if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
    }

    isTouchDragging = false;
    draggedVideoId = null;
    touchDraggedElement = null;
    dragTargetElement = null;
}

function handleWindowResize() {
    renderPlaylists();
    renderVideos();
    loadSidebarWidth();
}

// Start App
document.addEventListener('DOMContentLoaded', init);

function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isInStandaloneMode() {
    return ('standalone' in window.navigator) && window.navigator.standalone;
}
