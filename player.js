/**
 * 音乐播放器类
 * 提供音乐播放、暂停、上一首、下一首、音量控制等功能
 */
class MusicPlayer {
    constructor() {
        // 播放器状态
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isPlayerVisible = true;
        
        // 创建音频实例
        this.audio = new Audio();
        
        // 歌曲列表
        this.songs = [
            { title: 'Black Suit', artist: 'Instrumental', src: 'music/Black Suit.ogg' },
            { title: 'Cotton Candy Island', artist: 'Instrumental', src: 'music/Cotton Candy Island.ogg' },
            { title: 'RE Aoharu', artist: 'Instrumental', src: 'music/RE Aoharu.ogg' },
            { title: 'REAoharu', artist: 'Instrumental', src: 'music/REAoharu.mp3' }
        ];
        
        // 缓存DOM元素引用，避免重复查询
        this.elements = {
            player: document.getElementById('music-player'),
            playBtn: document.querySelector('.play-btn'),
            prevBtn: document.querySelector('.prev-btn'),
            nextBtn: document.querySelector('.next-btn'),
            hidePlayerBtn: document.querySelector('.hide-player-btn'),
            progressBar: document.querySelector('.progress-bar'),
            volumeSlider: document.querySelector('.volume-slider'),
            volumeBtn: document.querySelector('.volume-btn'),
            songTitle: document.querySelector('.song-title'),
            songArtist: document.querySelector('.song-artist'),
            currentTime: document.querySelector('.current-time'),
            totalTime: document.querySelector('.total-time')
        };
        
        // 初始化
        this.initEvents();
        this.loadSong(this.currentSongIndex);
        
        // 设置初始音量
        this.audio.volume = this.elements.volumeSlider.value / 100;
    }
    
    /**
     * 初始化所有事件监听器
     */
    initEvents() {
        // 播放/暂停按钮
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        
        // 上一首按钮
        this.elements.prevBtn.addEventListener('click', () => this.prevSong());
        
        // 下一首按钮
        this.elements.nextBtn.addEventListener('click', () => this.nextSong());
        
        // 隐藏/显示播放栏按钮
        this.elements.hidePlayerBtn.addEventListener('click', () => this.togglePlayerVisibility());
        
        // 进度条拖动
        this.elements.progressBar.addEventListener('input', () => this.handleProgressChange());
        
        // 播放结束自动下一首
        this.audio.addEventListener('ended', () => this.nextSong());
        
        // 更新进度条
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // 音量控制
        this.elements.volumeSlider.addEventListener('input', () => this.handleVolumeChange());
        
        // 静音按钮
        this.elements.volumeBtn.addEventListener('click', () => this.toggleMute());
    }
    
    /**
     * 加载指定索引的歌曲
     * @param {number} index - 歌曲索引
     */
    loadSong(index) {
        const song = this.songs[index];
        
        // 更新歌曲信息显示
        this.elements.songTitle.textContent = song.title;
        this.elements.songArtist.textContent = song.artist;
        
        // 先暂停当前播放
        const wasPlaying = this.isPlaying;
        this.audio.pause();
        this.audio.src = song.src;
        
        // 如果之前正在播放，切换到新歌曲后继续播放
        if (wasPlaying) {
            this.audio.play().then(() => {
                this.elements.player.classList.add('playing');
            }).catch(err => {
                console.error('播放失败:', err);
                this.isPlaying = false;
                this.updatePlayButtonState();
            });
        }
    }
    
    /**
     * 切换播放/暂停状态
     */
    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.elements.player.classList.remove('playing');
        } else {
            this.audio.play().catch(err => {
                console.error('播放失败:', err);
            });
            this.elements.player.classList.add('playing');
        }
        
        this.isPlaying = !this.isPlaying;
        this.updatePlayButtonState();
    }
    
    /**
     * 更新播放按钮状态
     */
    updatePlayButtonState() {
        const icon = this.elements.playBtn.querySelector('i');
        if (this.isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }
    
    /**
     * 播放上一首歌曲
     */
    prevSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong(this.currentSongIndex);
    }
    
    /**
     * 播放下一首歌曲
     */
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(this.currentSongIndex);
    }
    
    /**
     * 切换播放器显示/隐藏状态
     */
    togglePlayerVisibility() {
        const icon = this.elements.hidePlayerBtn.querySelector('i');
        
        if (this.isPlayerVisible) {
            // 隐藏播放器
            this.elements.player.style.transform = 'translateY(100%)';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            // 显示播放器
            this.elements.player.style.transform = 'translateY(0)';
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
        
        this.isPlayerVisible = !this.isPlayerVisible;
    }
    
    /**
     * 处理进度条变化
     */
    handleProgressChange() {
        if (!isNaN(this.audio.duration)) {
            this.audio.currentTime = (this.elements.progressBar.value / 100) * this.audio.duration;
        }
    }
    
    /**
     * 更新进度条和时间显示
     */
    updateProgress() {
        if (!isNaN(this.audio.duration)) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.elements.progressBar.value = progress;
            
            // 更新时间显示
            this.elements.currentTime.textContent = this.formatTime(this.audio.currentTime);
            this.elements.totalTime.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    /**
     * 格式化时间（秒转分:秒）
     * @param {number} seconds - 秒数
     * @returns {string} 格式化后的时间字符串
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    /**
     * 处理音量变化
     */
    handleVolumeChange() {
        this.audio.volume = this.elements.volumeSlider.value / 100;
        this.updateVolumeIcon();
    }
    
    /**
     * 切换静音状态
     */
    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.updateVolumeIcon();
    }
    
    /**
     * 更新音量图标
     */
    updateVolumeIcon() {
        const icon = this.elements.volumeBtn.querySelector('i');
        
        // 移除所有可能的图标类
        icon.classList.remove('fa-volume-high', 'fa-volume-low', 'fa-volume-xmark');
        
        if (this.audio.muted) {
            icon.classList.add('fa-volume-xmark');
        } else {
            if (this.audio.volume > 0.5) {
                icon.classList.add('fa-volume-high');
            } else {
                icon.classList.add('fa-volume-low');
            }
        }
    }
}

/**
 * 页面加载完成后初始化播放器
 */
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保DOM完全加载
    setTimeout(() => {
        new MusicPlayer();
    }, 100);
});