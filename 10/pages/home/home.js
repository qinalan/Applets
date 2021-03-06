import {urlType, sheet, region} from '../../common/url-type';
import AudioStorage from "../../model/StorageSong";
import Audio from '../../lib/Audio.js';
let app = getApp();
const audioStorage = new AudioStorage('audio_storage');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: '',
        page: 1,
        row: 20,
        songs: [],
        banner: [],
        requestUrl: {},
        stock: false,
        songs_list: {},
        playType: 'player',
        isFirst: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.audio = wx.getBackgroundAudioManager();
        this.getBanner().then(data => {
            this.setData({
                banner: data
            });
        });
        this.setData({assort: region});
        this.getSheet().then(this.setSheets.bind(this));
        let all = audioStorage.all();
        if (all === undefined) return false;
        // 本地数据获取
        {
            all.forEach(item => {
                const data = item.data;
                if (Array.isArray(data)) {
                    this.setData({
                        songs_item: data,
                        songs: data
                    });
                } else if (/object/i.test(typeof data)) {
                    this.setData({
                        songs_list: data
                    });
                };
            })
        }
    },
    playerSong(event) {
        // audio.paused === undefined true表示没有开始播放 false表示已经开始播放了
        const dataset = event.currentTarget.dataset;
        Audio.setSong(dataset.song, dataset.songs);
        this.setData({
            playType: 'pause',
            songs_list: dataset.song
        })
    },
    onPlay(event){
        const dataset = event.currentTarget.dataset;
        if (this.audio.paused === undefined) {// 从未点击过播放
            Audio.setSong(dataset.song, this.data.songs);
            this.setData({
                playType: 'pause'
            })
        } else if (this.audio.paused === false) {// 表示已经开始播放了
            this.audio.pause();
            this.setData({
                playType: 'player',
            })
        } else {// 表示已经暂停了要继续播放
            this.audio.play();
            this.setData({
                playType: 'pause',
            })
        }
    },
    requestData() {
        if (this.data.stock) {
            wx.showToast({
                icon: 'none',
                title: '没有更多了'
            })
        };
        let url = '';
        if (/^\d{3,}/.test(this.data.requestUrl.id) || !this.data.requestUrl.id) {
            url = urlType.query + this.data.requestUrl.name;
        } else {
            url = urlType.topid + this.data.requestUrl.id + '/p/' + this.data.page + '/r/' + this.data.row;
        }
        this.setData({
            url
        });
        wx.showLoading({
            title: 'loading'
        })
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.data.url,
                success: resolve,
                fail: reject
            })
        })
    },
    codeData({data}) {
        if (data.count_page <= data.curr_page) {
            this.setData({
                stock: true
            })
        };
        this.data.songs.push(...data.songs);
        this.setData({
            songs: this.data.songs
        });
        wx.hideLoading();
    },
    morePage() {
        this.data.page++;
        this.requestData().then(this.codeData.bind(this));
    },
    actionsBanner(event) {
        const action = event.currentTarget.dataset.action;
        if (action.atype === 0) {
            wx.navigateTo({
                url: '/pages/list/list?id=' + action.data.id + '&name=' + action.data.name
            });
        }
    },
    getBanner() {
        const data = [];
        // banner图的类型有多种,有的是跳转专题,有的单曲推荐
        data.push({
            src: "//y.gtimg.cn/music/common/upload/MUSIC_FOCUS/595982.jpg?max_age=2592000",
            atype: 0,//专题
            data: {
                id: 108,
                name: "美国公告牌榜"
            }
        });
        data.push({
            src: 'http://p1.music.126.net/eutlOcSlh-dtpWq328R6bQ==/109951163615791721.jpg',
            action: 1 // 这里是专题, 跳转方式, 现在我还不知道怎么用
        });
        data.push({
            src: 'http://p1.music.126.net/fklp8j8RXOys1RyEbC00iA==/109951163621954602.jpg',
            action: 1 // 这里是专题, 跳转方式, 现在我还不知道怎么用
        });
        return new Promise((resolve, reject) => {
            resolve(data);
        })
    },
    // 获取歌单
    getSheet() {
        const sheetPromise = [];
        sheet.forEach(item => {
            const p = new Promise((resolve, reject) => {
                wx.request({
                    url: urlType.topid + item.id,
                    success: resolve,
                    fail: reject
                })
            });
            sheetPromise.push(p);
        });
        return Promise.all(sheetPromise);
    },
    setSheets(argument) {
        const sheetData = [];
        argument.forEach((data, index) => {
            sheetData.push(Object.assign({
                songs: data.data.songs
            }, sheet[index]));
        })
        this.setData({
            song: sheetData
        })
        // console.log(this.data.song);
    },
    detailsPlay(event){
        const dataset = event.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/item/song?song_mid=' + dataset.song['song_mid']
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})