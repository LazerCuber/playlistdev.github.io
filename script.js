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
const audioOnlyToggle = document.getElementById('audioOnlyToggle'); // Added
// Pagination Elements
const paginationControlsEl = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfoEl = document.getElementById('pageInfo');
const audioOnlyInfoEl = document.getElementById('audioOnlyInfo');
const audioOnlyTitleEl = audioOnlyInfoEl.querySelector('.audio-title'); // Target the specific span

// --- State ---
let playlists = [];
let currentPlaylistId = null;
let ytPlayer = null;
let isPlayerReady = false; // New state variable
let videoIdToPlayOnReady = null; // New state variable
let isAutoplayEnabled = false;
let isAudioOnlyMode = false; // Added state for audio-only
let currentlyPlayingVideoId = null;
let draggedVideoId = null; // ID of the video being dragged
let dragTargetElement = null; // Element we are dragging over
let currentTheme = 'light';
let isResizing = false;
let lastSidebarWidth = null;
// Touch drag state
let isTouchDragging = false;
let touchDragStartY = 0;
let touchDraggedElement = null;
// State for differentiating touch scroll/drag from tap-to-play
let potentialPlayVideoId = null;
let potentialPlayCard = null;
// Pagination State
const videosPerPage = 20; // Number of videos to show per page
let currentPage = 1;
let isYTApiReady = false; // New state variable to track API readiness

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
    loadAudioOnlySetting();
    loadSidebarWidth();
    renderPlaylists();

    // NOTE: Player is no longer created here, only when needed.
    // onYouTubeIframeAPIReady will just set isYTApiReady = true;

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
    audioOnlyToggle.addEventListener('change', handleAudioOnlyToggle); // Listener for the checkbox change

    // Attach the visual click handler to the parent .switch element for both toggles
    autoplaySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    // Ensure we target the correct parent switch for audio-only as well
    const audioOnlySwitchDiv = audioOnlyToggle.closest('.switch');
    if (audioOnlySwitchDiv) {
        audioOnlySwitchDiv.addEventListener('click', handleVisualSwitchClick);
    }

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
        } else if (!event.target.closest('.controls')) {
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

    // Playlist Drag & Drop Listeners (New)
    playlistListEl.addEventListener('dragstart', handlePlaylistDragStart);
    playlistListEl.addEventListener('dragend', handlePlaylistDragEnd);
    playlistListEl.addEventListener('dragover', handlePlaylistDragOver);
    playlistListEl.addEventListener('dragleave', handlePlaylistDragLeave);
    playlistListEl.addEventListener('drop', handlePlaylistDrop);
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
    // Ensure dragging class is removed
    const draggingElement = videoGridEl.querySelector('.video-card.dragging');
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
    }
    // Ensure highlight styles are cleared definitively
    clearDragOverStyles();
    // Reset state variables
    draggedVideoId = null;
    dragTargetElement = null;
}

function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow drop
    if (!draggedVideoId) return;
    event.dataTransfer.dropEffect = 'move'; // Assume move is possible

    const targetCard = event.target.closest('.video-card');

    // Determine the current valid target card
    let currentTarget = null;
    if (targetCard && targetCard.dataset.videoId !== draggedVideoId) {
        currentTarget = targetCard;
    }

    // If the target is different from the currently highlighted one
    if (currentTarget !== dragTargetElement) {
        // Remove highlight from the previous target (if any)
        if (dragTargetElement) {
            dragTargetElement.classList.remove('drag-over');
        }
        // Add highlight to the new target (if any)
        if (currentTarget) {
            currentTarget.classList.add('drag-over');
        }
        // Update the tracked target element
        dragTargetElement = currentTarget;
    }

    // If not over a valid target card, ensure no highlight (handled by the logic above)
    if (!currentTarget) {
         event.dataTransfer.dropEffect = 'none'; // Indicate not droppable here
    }
}

function handleDragLeave(event) {
    // Only clear styles if the mouse leaves the bounds of the entire video grid container.
    // This prevents flicker when moving between cards.
    if (!event.relatedTarget || !videoGridEl.contains(event.relatedTarget)) {
        if (dragTargetElement) {
            dragTargetElement.classList.remove('drag-over');
        }
        dragTargetElement = null;
         // console.log("Left grid boundary"); // Optional debug log
    }
     // Note: dragover handles clearing when moving between cards within the grid.
}

function handleDrop(event) {
    event.preventDefault();
    const dropTargetId = dragTargetElement ? dragTargetElement.dataset.videoId : null;

    // Clear styles regardless of drop validity
    clearDragOverStyles();

    if (draggedVideoId && dropTargetId && dropTargetId !== draggedVideoId) {
        // Call the reorder function
        handleReorderVideo(draggedVideoId, dropTargetId);
    } else {
        console.log("Drop occurred on invalid target or self.");
    }

    // Resetting state happens in handleDragEnd, which is called after drop
}

function clearDragOverStyles() {
    // Remove the original drag-over class from any card that might have it
    const highlightedCard = videoGridEl.querySelector('.video-card.drag-over');
    if(highlightedCard) {
        highlightedCard.classList.remove('drag-over');
    }
    // It's also safe to clear from dragTargetElement if it exists
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

// --- Font Management --- // Removed entire section
// function loadFont() { ... }
// function applyFont(fontName) { ... }
// function setFont(fontName) { ... }

// --- YouTube Player API ---

// This function MUST be global for the API to find it
function onYouTubeIframeAPIReady() {
    console.log("YT API Ready. Player will be initialized on first play.");
    isYTApiReady = true; // Mark API as ready

    // If a video was queued *before* the API was ready,
    // the playVideo call will now handle initialization.
    if (videoIdToPlayOnReady) {
        playVideo(videoIdToPlayOnReady);
    }
}

function createPlayer(videoId) {
    console.log("Creating new YT Player instance.");
    return new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoId, // Load the video immediately on creation
        playerVars: {
            'playsinline': 1,
            'rel': 0,
            'enablejsapi': 1,
            // 'autoplay': 1 // REMOVED this line
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log("Player Ready");
    isPlayerReady = true;

    const videoData = event.target.getVideoData();
    const readyVideoId = videoData ? videoData.video_id : null;

    if (readyVideoId) {
         console.log("Player ready for video:", readyVideoId, "- Attempting play with slight delay.");
         // Ensure highlight and media session are correct for the video that just loaded
         currentlyPlayingVideoId = readyVideoId;
         updatePlayingVideoHighlight(readyVideoId);
         const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
         if (currentPlaylist) {
             const video = currentPlaylist.videos.find(v => v.id === readyVideoId);
             if (video) {
                 updateMediaSessionMetadata(video);
             }
         }
         // Add a small delay before calling playVideo
         setTimeout(() => {
            // Check if the player still exists and is ready, as state might change during the delay
            if (ytPlayer && isPlayerReady && typeof ytPlayer.playVideo === 'function') {
                 try {
                    console.log("Executing delayed playVideo() for:", readyVideoId);
                    event.target.playVideo();
                 } catch (e) {
                     console.error("Error during delayed playVideo():", e);
                     // Maybe handle error differently here if needed
                 }
            } else {
                console.log("Player state changed or player destroyed during delay, aborting playVideo().");
            }
         }, 100); // Delay of 100 milliseconds

    } else {
         console.warn("Player ready but couldn't get video ID.");
    }

    // Clear any potentially stale queued ID
    videoIdToPlayOnReady = null;
}

function onPlayerStateChange(event) {
    // Add null check for ytPlayer
    if (!ytPlayer) return;

    if (event.data === YT.PlayerState.PLAYING) {
        // Use event.target which refers to the player instance
        const videoData = event.target.getVideoData();
        currentlyPlayingVideoId = videoData ? videoData.video_id : null;
        updatePlayingVideoHighlight(currentlyPlayingVideoId);

        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        if (currentPlaylist && currentlyPlayingVideoId) {
            const video = currentPlaylist.videos.find(v => v.id === currentlyPlayingVideoId);
            if (video) {
                updateMediaSessionMetadata(video);
                updateAudioOnlyDisplay(video.title); // <-- Update audio display
            } else {
                 updateAudioOnlyDisplay(null); // Clear if video not found
            }
        } else {
             updateAudioOnlyDisplay(null); // Clear if no playlist or video ID
        }
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
    }
    if (event.data === YT.PlayerState.PAUSED) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "paused";
        }
         // Keep audio title visible when paused
    }
    if (event.data === YT.PlayerState.ENDED) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "none";
        }
        // Check autoplay setting before playing next
        if (isAutoplayEnabled) {
             playNextVideo();
        } else {
            // If autoplay is off, maybe just highlight the next video? Or do nothing.
            updatePlayingVideoHighlight(null); // Clear highlight as playback stopped
            updateAudioOnlyDisplay(null); // <-- Clear audio display
        }
    }
}

function onPlayerError(event) {
    // Add null check for ytPlayer
    if (!ytPlayer) return;

    console.error('YouTube Player Error:', event.data);
    let errorMsg = 'An unknown player error occurred.';
    // Use event.target to get video data if possible
    const videoData = event.target.getVideoData ? event.target.getVideoData() : null;
    const videoId = videoData ? videoData.video_id : currentlyPlayingVideoId; // Fallback to tracked ID
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

    // Attempt to skip ONLY if autoplay is enabled
    if (isAutoplayEnabled && shouldSkip) {
        showToast(`${errorMsg} Skipping to next video.`, 'info', 4000);
        setTimeout(playNextVideo, 500);
    } else {
        // If autoplay is off, or we shouldn't skip, stop and hide the player
        handleClosePlayer();
    }
}

function getCurrentPlayingVideoIdFromApi() {
    // Add null check for ytPlayer
    if (ytPlayer && isPlayerReady && typeof ytPlayer.getVideoData === 'function') {
        try {
            const videoData = ytPlayer.getVideoData();
            return videoData ? videoData.video_id : null;
        } catch (e) {
            console.error("Error getting video data from player:", e);
            return null; // Return null if API call fails
        }
    }
    return null;
}

function playNextVideo() {
    // Add null check for ytPlayer
    if (!ytPlayer || !currentPlaylistId) return;

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1) return;

    if (!currentlyPlayingVideoId && currentPlaylist.videos.length > 0) {
        console.log("playNextVideo called but no video was playing. Starting from first video.");
        playVideo(currentPlaylist.videos[0].id);
        return;
    }
    if (!currentlyPlayingVideoId || currentPlaylist.videos.length < 2) {
        // If only one video, or no current video, stop? Or replay? For now, stop.
        handleClosePlayer(); // Close player if we can't advance
        return;
    }

    const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
    if (currentIndex === -1) {
        console.warn("Currently playing video not found in playlist during playNext. Playing first video.");
        if (currentPlaylist.videos.length > 0) {
            playVideo(currentPlaylist.videos[0].id);
        } else {
             handleClosePlayer(); // Close if playlist became empty
        }
        return;
    }

    const nextIndex = (currentIndex + 1) % currentPlaylist.videos.length;
    const nextVideo = currentPlaylist.videos[nextIndex];
    if (nextVideo) {
        console.log(`Autoplaying next video: ${nextVideo.title} (Index: ${nextIndex})`);
        playVideo(nextVideo.id);
    } else {
        console.error(`Could not find next video at index ${nextIndex}`);
        handleClosePlayer(); // Close if next video isn't found
    }
}

function playPreviousVideo() {
    // Add null check for ytPlayer and ensure a playlist is selected
    if (!ytPlayer || !currentPlaylistId) return;

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist || currentPlaylist.videos.length < 1) return;

    // If nothing is playing or only one video, maybe play the last or first?
    if (!currentlyPlayingVideoId && currentPlaylist.videos.length > 0) {
        console.log("playPreviousVideo called but no video was playing. Starting from last video.");
        playVideo(currentPlaylist.videos[currentPlaylist.videos.length - 1].id);
        return;
    }
     if (!currentlyPlayingVideoId || currentPlaylist.videos.length < 2) {
        // If only one video or no current video, maybe just replay it or close?
        // For consistency with playNext, close player if can't go back.
        handleClosePlayer();
        return;
    }

    const currentIndex = currentPlaylist.videos.findIndex(v => v.id === currentlyPlayingVideoId);
    if (currentIndex === -1) {
        console.warn("Currently playing video not found in playlist during playPrevious. Playing last video.");
        if (currentPlaylist.videos.length > 0) {
            playVideo(currentPlaylist.videos[currentPlaylist.videos.length - 1].id);
        } else {
             handleClosePlayer(); // Close if playlist became empty
        }
        return;
    }

    // Calculate previous index, wrapping around to the end if at the start
    const prevIndex = (currentIndex - 1 + currentPlaylist.videos.length) % currentPlaylist.videos.length;
    const prevVideo = currentPlaylist.videos[prevIndex];

    if (prevVideo) {
        console.log(`Playing previous video: ${prevVideo.title} (Index: ${prevIndex})`);
        playVideo(prevVideo.id);
    } else {
        console.error(`Could not find previous video at index ${prevIndex}`);
        handleClosePlayer(); // Close if previous video isn't found
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

// Added functions for audio-only state
function saveAudioOnlySetting() { localStorage.setItem('audioOnlyEnabled', isAudioOnlyMode); }
function loadAudioOnlySetting() {
    isAudioOnlyMode = localStorage.getItem('audioOnlyEnabled') === 'true';
    audioOnlyToggle.checked = isAudioOnlyMode;
    // Apply the class initially if needed
    applyAudioOnlyClass();
}

// Function to apply/remove the class based on state
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
        currentPage = 1; // Reset if playlist became empty
    }

    savePlaylists();
    renderVideos();
    renderPlaylists(); // Update count in sidebar
    showToast(`Removed "${escapeHTML(videoTitle)}".`, 'info');
}

// Modified to accept dropEffect ('before' or 'after')
function handleReorderVideo(videoIdToMove, targetVideoId) {
    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    if (!currentPlaylist) return;

    const videoToMoveIndex = currentPlaylist.videos.findIndex(v => v.id === videoIdToMove);
    if (videoToMoveIndex === -1) return;

    const [videoToMove] = currentPlaylist.videos.splice(videoToMoveIndex, 1); // Remove the video

    // Find the target's NEW index after the splice
    const targetIndex = currentPlaylist.videos.findIndex(v => v.id === targetVideoId);

    if (targetIndex !== -1) {
        // Original behavior: Always insert *before* the target video's new position
        currentPlaylist.videos.splice(targetIndex, 0, videoToMove);
    } else {
        // Target not found, append to end as fallback
        console.warn("Reorder target not found after splice, appending video to end.");
        currentPlaylist.videos.push(videoToMove);
    }

    savePlaylists();
    renderVideos(); // Re-render the grid with the new order
}

function playVideo(videoId) {
    if (!videoId) {
        console.error("playVideo called with no videoId");
        return;
    }

    const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
    let videoData = null;
    if (currentPlaylist) {
        videoData = currentPlaylist.videos.find(v => v.id === videoId);
    }

    // 1. Ensure API is ready
    if (!isYTApiReady) {
        console.log("YT API not ready yet. Queuing video:", videoId);
        videoIdToPlayOnReady = videoId; // Queue the video
        showToast("Player is loading...", "info", 1500); // Inform user
        // Preemptively show player wrapper
        playerWrapperEl.classList.remove('hidden');
        if (isAudioOnlyMode && videoData) {
             updateAudioOnlyDisplay(videoData.title); // Show title early if possible
        } else {
             updateAudioOnlyDisplay(null); // Hide if not audio-only or no data yet
        }
        return;
    }

    // 2. Show player UI
    playerWrapperEl.classList.remove('hidden'); // Ensure wrapper is visible always when playing
    currentlyPlayingVideoId = videoId; // Track immediately
    updatePlayingVideoHighlight(videoId);
    applyAudioOnlyClass(); // Applies .audio-only-active to body if needed
    updateAudioOnlyDisplay(videoData ? videoData.title : null); // Update display based on mode and data

    // --- Media Session Update (do this early) ---
    updateMediaSessionMetadata(videoData || null); // Update or clear
    // --- End Media Session Update ---

    // 3. Handle Player Instance
    if (ytPlayer) {
        // Player exists, check readiness
        if (isPlayerReady) {
            console.log("Player exists and is ready. Loading video:", videoId);
            // Scroll into view if needed (only if NOT in audio-only mode)
            if (!isAudioOnlyMode) {
               setTimeout(() => {
                   if (playerWrapperEl.offsetParent !== null) {
                        playerWrapperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                   }
               }, 100);
            }
            try {
                ytPlayer.loadVideoById(videoId); // Load the new video
                // Explicitly try to play it immediately after loading when player is ready.
                // This reinforces the intent to play after the user's click.
                ytPlayer.playVideo();
            } catch (error) {
                console.error("Error calling loadVideoById or playVideo:", error); // Updated error log
                showToast("Failed to load or play video.", "error"); // Updated toast message
                handleClosePlayer();
            }
        } else {
            // Player exists but is not ready
            console.log("Player exists but not ready. Queuing video:", videoId);
            videoIdToPlayOnReady = videoId; // Queue (onPlayerReady will handle)
             // updateAudioOnlyDisplay is already handled above based on videoData
        }
    } else {
        // Player does not exist, create it
        console.log("Player does not exist. Creating player for video:", videoId);
        isPlayerReady = false; // Explicitly set to false until onReady fires
        ytPlayer = createPlayer(videoId); // Create and load video
        // onPlayerReady will handle the rest
        // updateAudioOnlyDisplay is already handled above based on videoData
    }
}

function stopVideo() {
    // Add null check for ytPlayer
    if (ytPlayer && typeof ytPlayer.stopVideo === 'function') {
        try {
            ytPlayer.stopVideo();
        } catch (e) {
            console.warn("Error calling stopVideo (player might already be destroyed):", e);
        }
    }
    currentlyPlayingVideoId = null;
    updatePlayingVideoHighlight(null);
    updateAudioOnlyDisplay(null); // <-- Clear audio display
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
        // updateMediaSessionMetadata(null); // Don't clear metadata, closePlayer does
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
            li.draggable = true; // Make the playlist item draggable
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
    // Find the parent switch element that was clicked
    const switchElement = event.target.closest('.switch');
    if (!switchElement) return; // Exit if click wasn't within a switch

    // Find the actual checkbox input within this specific switch
    const checkbox = switchElement.querySelector('input[type="checkbox"]');
    if (!checkbox) return; // Exit if no checkbox found

    // We only want to react if the click wasn't directly on the hidden input itself.
    // This ensures clicking the visual parts (slider/background) triggers the toggle.
    if (event.target !== checkbox) {
        // Programmatically click the associated hidden checkbox.
        // This will toggle its 'checked' state AND trigger the 'change' event listener
        // (e.g., handleAutoplayToggle or handleAudioOnlyToggle).
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
    stopVideo(); // Stop playback first (this now calls updateAudioOnlyDisplay(null))

    // Destroy the player instance if it exists
    if (ytPlayer && typeof ytPlayer.destroy === 'function') {
        try {
            console.log("Destroying YT Player instance.");
            ytPlayer.destroy();
        } catch (e) {
            console.error("Error destroying player:", e);
        } finally {
             ytPlayer = null; // Set reference to null
             isPlayerReady = false; // Reset ready state
        }
    } else {
        ytPlayer = null; // Ensure it's null even if destroy wasn't called/needed
        isPlayerReady = false;
    }

    videoIdToPlayOnReady = null; // Clear any queued video
    // currentlyPlayingVideoId = null; // Already done in stopVideo
    playerWrapperEl.classList.add('hidden');
    // bodyEl.classList.remove('audio-only-active'); // Don't remove this, keep the toggle state
    updatePlayingVideoHighlight(null); // Ensure highlight is removed
    updateAudioOnlyDisplay(null); // Explicitly ensure display is hidden

    if ('mediaSession' in navigator) {
        updateMediaSessionMetadata(null); // Clear metadata on close
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
        artist: 'YouTube', // Replace with channel name if available
        album: playlistName,
        artwork: [
            { src: video.thumbnail.replace('mqdefault', 'hqdefault'), sizes: '480x360', type: 'image/jpeg' },
            { src: video.thumbnail, sizes: '320x180', type: 'image/jpeg' },
        ]
    });

    // Update playback state (usually done in onPlayerStateChange)
    // navigator.mediaSession.playbackState = "playing"; // Set this when playback actually starts

    setupMediaSessionActionHandlers(); // Ensure handlers are set up
}

function setupMediaSessionActionHandlers() {
     if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', null);
    navigator.mediaSession.setActionHandler('pause', null);
    navigator.mediaSession.setActionHandler('stop', null);
    navigator.mediaSession.setActionHandler('previoustrack', null);
    navigator.mediaSession.setActionHandler('nexttrack', null);

    navigator.mediaSession.setActionHandler('play', () => {
        // Add null check for ytPlayer
        if (ytPlayer && isPlayerReady && typeof ytPlayer.playVideo === 'function') {
            ytPlayer.playVideo();
            // navigator.mediaSession.playbackState = "playing"; // State changes handled in onPlayerStateChange
        } else if (currentlyPlayingVideoId) {
            // If player doesn't exist but we know what *should* be playing, try to play it
            playVideo(currentlyPlayingVideoId);
        }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        // Add null check for ytPlayer
        if (ytPlayer && isPlayerReady && typeof ytPlayer.pauseVideo === 'function') {
            ytPlayer.pauseVideo();
             // navigator.mediaSession.playbackState = "paused"; // State changes handled in onPlayerStateChange
        }
    });

    navigator.mediaSession.setActionHandler('stop', () => {
        handleClosePlayer();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPreviousVideo();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
         // Ensure next track respects autoplay setting if triggered externally
         if(isAutoplayEnabled) {
            playNextVideo();
         } else {
             console.log("Media Session: Next track ignored (Autoplay off).");
             // Optionally provide feedback?
             showToast("Autoplay is disabled.", "info", 1500);
         }
    });
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
    event.preventDefault(); // Allow drop
    if (!draggedPlaylistId) return;
    event.dataTransfer.dropEffect = 'move';

    const targetItem = event.target.closest('.playlist-item');
    let currentTarget = null;

    if (targetItem && targetItem.draggable && parseInt(targetItem.dataset.id) !== draggedPlaylistId) {
         currentTarget = targetItem;
    }

    if (currentTarget !== dragTargetPlaylistElement) {
        clearPlaylistDragOverStyles(); // Clear previous target
        if (currentTarget) {
            currentTarget.classList.add('drag-over'); // Highlight new target
        }
        dragTargetPlaylistElement = currentTarget; // Track new target
    }

     if (!currentTarget) {
         event.dataTransfer.dropEffect = 'none'; // Cannot drop here
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
    const dropTargetId = dragTargetPlaylistElement ? parseInt(dragTargetPlaylistElement.dataset.id) : null;

    clearPlaylistDragOverStyles(); // Always clear styles

    if (draggedPlaylistId && dropTargetId && dropTargetId !== draggedPlaylistId) {
        handleReorderPlaylist(draggedPlaylistId, dropTargetId);
    }

    // Resetting state happens in handlePlaylistDragEnd
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
    // Ensure touch is on a valid, draggable card
    if (!videoCard || !videoCard.draggable) {
        isTouchDragging = false;
        touchDraggedElement = null;
        draggedVideoId = null;
        potentialPlayVideoId = null; // Reset potential play
        potentialPlayCard = null;
        return;
    }

    const videoId = videoCard.dataset.videoId;

    // Ignore touches on interactive elements within the card (buttons)
    if (event.target.closest('button') || event.target.closest('.delete-video-btn')) {
        // Let the 'click' event handler deal with buttons
        return;
    }

    // Check if the touch is specifically on the drag handle
    if (event.target.closest('.drag-handle')) {
        // --- Initiate Drag ---
        event.preventDefault(); // Prevent page scroll ONLY when starting a drag via the handle

        touchDraggedElement = videoCard;
        draggedVideoId = videoId;
        isTouchDragging = true;
        touchDragStartY = event.touches[0].clientY; // Store initial Y

        // Add dragging class slightly delayed for visual feedback
        setTimeout(() => {
            if (isTouchDragging && touchDraggedElement) {
                touchDraggedElement.classList.add('dragging');
            }
        }, 100);
        // console.log("Touch Start - Drag Init:", draggedVideoId);

        // Ensure potential play state is cleared if drag starts
        potentialPlayVideoId = null;
        potentialPlayCard = null;
        videoCard.classList.remove('touch-active'); // Remove active class if it was somehow set

    } else {
        // --- Potential Play Intent ---
        // Don't preventDefault here - allow scrolling initially.
        // Reset drag state just in case
        isTouchDragging = false;
        touchDraggedElement = null;
        draggedVideoId = null;

        // Store the target video but DO NOT play yet
        potentialPlayVideoId = videoId;
        potentialPlayCard = videoCard;
        videoCard.classList.add('touch-active'); // Add visual feedback for potential tap

        // console.log("Touch Start - Potential Play:", videoId);
    }
}

function handleTouchMove(event) {
    if (isTouchDragging) {
        // --- Handle Drag Movement ---
        if (!touchDraggedElement) return;

        // Prevent scrolling while dragging
        event.preventDefault();

        const touch = event.touches[0];
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetCard = elementUnderTouch ? elementUnderTouch.closest('.video-card') : null;

        let currentTarget = null;
        // Check if we are over a different draggable card
        if (targetCard && targetCard.draggable && targetCard !== touchDraggedElement) {
            currentTarget = targetCard;
        }

        // Update highlight based on the current target
        if (currentTarget !== dragTargetElement) {
            if (dragTargetElement) dragTargetElement.classList.remove('drag-over');
            if (currentTarget) currentTarget.classList.add('drag-over');
            dragTargetElement = currentTarget;
            // console.log("Touch Move - Drag Over:", dragTargetElement ? dragTargetElement.dataset.videoId : 'None');
        }
    } else if (potentialPlayVideoId) {
        // --- Handle Scroll During Potential Play ---
        // If touch moves significantly while a play was potential, cancel the play.
        // We can use a small threshold, but for simplicity now, any move cancels.
        // console.log("Touch Move - Canceling Potential Play:", potentialPlayVideoId);
        if (potentialPlayCard) {
            potentialPlayCard.classList.remove('touch-active');
        }
        potentialPlayVideoId = null;
        potentialPlayCard = null;
        // Do NOT preventDefault here, allow the scroll to happen.
    }
}


function handleTouchEnd(event) {
    // Check if a drag operation was active
    if (isTouchDragging) {
        // --- Handle Drop ---
        // console.log("Touch End - Drag Drop:", draggedVideoId, "Target:", dragTargetElement ? dragTargetElement.dataset.videoId : 'None');

        // Check if we ended on a valid drop target during a drag
        if (draggedVideoId && dragTargetElement && dragTargetElement.dataset.videoId !== draggedVideoId) {
            handleReorderVideo(draggedVideoId, dragTargetElement.dataset.videoId);
        }

        // Cleanup drag classes
        if (touchDraggedElement) {
             touchDraggedElement.classList.remove('dragging');
        }
        clearDragOverStyles(); // This clears .drag-over from dragTargetElement

        // Reset all touch drag state variables
        isTouchDragging = false;
        touchDraggedElement = null;
        draggedVideoId = null;
        dragTargetElement = null;
        touchDragStartY = 0;

    } else if (potentialPlayVideoId && potentialPlayCard) {
        // --- Handle Tap to Play ---
        // If drag wasn't active AND a potential play video is still set, trigger play.
        // This means touchstart and touchend happened without a significant touchmove in between.
        // console.log("Touch End - Executing Play:", potentialPlayVideoId);
        playVideo(potentialPlayVideoId);
        potentialPlayCard.classList.remove('touch-active'); // Remove feedback style
    } else {
        // --- Handle Other Touch Ends (e.g., after scroll) ---
        // console.log("Touch End - No action (likely scroll or tap outside play area)");
        // Just ensure any lingering active class is removed if needed
        if (potentialPlayCard) { // Check potentialPlayCard as it might have been cleared by move
           potentialPlayCard.classList.remove('touch-active');
        } else { // Or find any card with the class (less efficient but safer)
            const activeCard = videoGridEl.querySelector('.video-card.touch-active');
            if (activeCard) activeCard.classList.remove('touch-active');
        }
    }

    // Always reset potential play state at the end of any touch interaction
    potentialPlayVideoId = null;
    potentialPlayCard = null;
}

// --- Start the app ---
init();

// Function to update the audio-only info display
function updateAudioOnlyDisplay(videoTitle) {
    if (isAudioOnlyMode && videoTitle) {
        audioOnlyTitleEl.textContent = videoTitle;
        escapeElement.textContent = videoTitle; // Use escape element for safety
        audioOnlyTitleEl.innerHTML = escapeElement.innerHTML; // Set escaped HTML
        audioOnlyInfoEl.classList.remove('hidden');
    } else {
        audioOnlyTitleEl.textContent = '';
        audioOnlyInfoEl.classList.add('hidden');
    }
}