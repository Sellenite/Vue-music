import * as types from './mutation-type'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function ({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list)
    // 如果是随机播放全部，那么需要先找到对应的index，然后再传入随机列表中
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAY_LIST, randomList)
        index = findIndex(randomList, list[index])
        console.log(index)
    } else {
        commit(types.SET_PLAY_LIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 这个是搜索功能时，点击歌曲播放用到
// 首先取得当前播放的歌曲，然后插入到下一首
// 插入后需要判断插入的歌曲在列表有没有，有的话要做去重处理
// 需要使用arr.slice()使用副本，不然会修改指针所指向的数组原值
export const insertSong = function ({ commit, state }, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let currentSong = playList[currentIndex]

    // 查找当前列表中是否由待插入的歌曲，并返回索引
    let fpIndex = findIndex(playList, song)
    // 因为是插入歌曲，索引+1
    currentIndex++
    // 插入这首歌到正常列表位置+1的地方
    playList.splice(currentIndex, 0, song)
    // 如果已经包含这首歌
    if (fpIndex > -1) {
        // 两种情况，当前插入的数大于或小于找到的数
        // [1, 2, 3, 4] 最后插入2：[1, 2, 3, 4, 2]，然后再删除找到的数
        // [1, 3, 4, 2] 1和3之间插入2：[1, 2, 3, 4, 2]，然后再删除找到的数的位置+1
        if (currentIndex > fpIndex) {
            playList.splice(fpIndex, 1)
            currentIndex--
        } else {
            playList.splice(fpIndex + 1, 1)
        }
    }

    // 插入到顺序列表，逻辑和上面的一样
    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)
    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }

    // 提交
    commit(types.SET_PLAY_LIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({ commit, state }, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let pIndex = findIndex(playList, song)
    playList.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--
    }

    commit(types.SET_PLAY_LIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    if (!playList.length) {
        commit(types.SET_PLAYING_STATE, false)
    } else {
        commit(types.SET_PLAYING_STATE, true)
    }
}

export const deleteSongList = function ({ commit }, song) {
    commit(types.SET_PLAY_LIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

export const saveSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const savePlayHistory = function ({ commit }, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function ({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}