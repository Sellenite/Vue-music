import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playListMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        this.handlePlayList(this.playList)
    },
    activated() {
        this.handlePlayList(this.playList)
    },
    watch: {
        playList(newVal) {
            this.handlePlayList(newVal)
        }
    },
    methods: {
        handlePlayList() {
            throw new Error('Component need define handlePlayList method')
        }
    }
}

export const playerMixin = {
    computed: {
        ...mapGetters([
            'sequenceList',
            'playList',
            'currentSong',
            'mode',
            'favoriteList'
        ]),
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        }
    },
    methods: {
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAY_LIST'
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ]),
        changeMode() {
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this._resetCurrentIndex(list)
            this.setPlayList(list)
        },
        _resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        getFavoriteIcon(song) {
            if (this._isFavorite(song)) {
                return 'icon-favorite'
            }
            return 'icon-not-favorite'
        },
        toggleFavorite(song) {
            if (this._isFavorite(song)) {
                this.deleteFavoriteList(song)
            } else {
                this.saveFavoriteList(song)
            }
        },
        _isFavorite(song) {
            const index = this.favoriteList.findIndex((item) => {
                return item.id === song.id
            })
            return index > -1
        }
    }
}

export const searchMixin = {
    data() {
        return {
            query: '',
            refreshDelay: 100
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory'
        ]),
        blurInput() {
            this.$refs.searchBox.blur()
        },
        saveSearch() {
            this.$refs.topTip.show()
            this.saveSearchHistory(this.query)
        },
        onQueryChange(query) {
            this.query = query
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query)
        },
        deleteOne(item) {
            this.deleteSearchHistory(item)
        },
        deleteAll() {
            this.clearSearchHistory()
        }
    }
}