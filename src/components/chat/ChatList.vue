<template>
    <div @contextmenu.native="handlecontextmenu">
        <section class="chatlist chatlist-bottom">
            <mt-loadmore :top-method="loadTop" top-pull-text="加载更多" top-drop-text="释放加载" @top-status-change="handleTopChange" ref="loadmore">
                <ul>
                    <template v-for="item in records">
                        <li style="list-style:none;" class="chat-mine" v-if="item.type===1">
                            <div class="chat-user"><img src="../../assets/img/user.png"></div>
                            <div class="time"><cite><i>{{item.time}}</i>{{item.name}}</cite></div>
                            <div class="chat-text" v-html="item.content"></div>
                        </li>
                        <li style="list-style:none;" v-if="item.type===2">
                            <div class="chat-user"><img src="../../assets/img/default.png"></div>
                            <div class="time"><cite>{{item.name}}<i>{{item.time}}</i></cite></div>
                            <div class="chat-text" v-html="item.content"></div>
                        </li>
                    </template>
                </ul>
            </mt-loadmore>
        </section>


        <section class="foot">
          <mt-button style="width: 100%" type="primary" @touchstart.native="speechVoice" @touchend.native="stopVoice" @contextmenu.native="handlecontextmenu">按住说话({{sampleRate}}kHz)</mt-button>
        </section>


    </div>
</template>

<script>
import util from '../../utils/helper'
import Recorder from 'recorder-js'
import { WaveFileLoader, exportWAV16k } from '../../utils/WaveFileLoader'
import { Toast } from 'mint-ui';

const audioContext =  new (window.AudioContext || window.webkitAudioContext)({sampleRate:16000});
console.log(audioContext)
const recorder = new Recorder(audioContext, {
  // An array of 255 Numbers
  // You can use this to visualize the audio stream
  // If you use react, check out react-wave-stream
  // onAnalysed: data => console.log(data),
});

navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => recorder.init(stream))
  .catch(err => console.log('Uh oh... unable to get stream...', err));


function download() {
  Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
}
export default {
    name: 'chatlist',
    data() {
        return {
            selFace: '表情',
            selOther: '其他功能',
            content:'',
            topStatus: '',
            //聊天记录
            records: this.$store.state.records,
            recorder: null,
            isRecording: false,
            sampleRate:null
        }
    },
    methods: {
        //滚动条滚动到底部
        scrollToBottom:function(){
            setTimeout(function(){
                var chatlist = document.getElementsByClassName('chatlist')[0];
                chatlist.scrollTop=chatlist.scrollHeight;
            },100);
        },
        handleTopChange(status) {
            this.topStatus = status;
        },
        loadTop(id) {
            var _this=this;
            setTimeout(() => {
                var chatlist = document.getElementsByClassName('chatlist')[0];
                var oldHeight=chatlist.scrollHeight;

                _this.records.unshift({
                    type: 1,
                    time: util.formatDate.format(new Date(),'yyyy-MM-dd hh:mm:ss'),
                    name: '游客',
                    content: '给我看看源码'
                }, {
                    type: 2,
                    time: util.formatDate.format(new Date(),'yyyy-MM-dd hh:mm:ss'),
                    name: '客户MM',
                    content: '这里是<a target="_blank" href="https://github.com/Aknifejackzhmolong/Live2D-SpeechRecognize">源码</a>'
                });

                setTimeout(function(){
                    var newHeight=chatlist.scrollHeight;
                    chatlist.scrollTop=newHeight-oldHeight;
                },100);

                this.$refs.loadmore.onTopLoaded(id);
            }, 1500);
        },
        speechVoice(){
          console.log('touchstart')
          recorder.start()
            .then(() => this.isRecording = true);
        },
        stopVoice(){
          console.log('touchend')
          // this.recorder.stop()
          recorder.stop()
            .then(({blob, buffer}) => {
              let param = new FormData()
              /**
               * 采样频率由硬件决定，不能在config里设置，故发动大招：改文件内容！！！
               */
              param.append('file',new Blob([exportWAV16k(buffer[0])]), 'test.wav')
              this.isRecording = false

              this.$axios.post('/speech',param, {timeout: 1000 * 60 * 2}).then(({data})=>{
                this.records.push({
                  type: 1,
                  time: util.formatDate.format(new Date(),'yyyy-MM-dd hh:mm:ss'),
                  name: '游客',
                  content: data === '' ? '[empty]' : data
                })
              })
              // buffer is an AudioBuffer(Float32Array ArrayBuffer)
            });
        },
        handlecontextmenu(e) {
          e.preventDefault()
        }
    },
    mounted:function(){
        this.sampleRate = audioContext.sampleRate/1000;
        this.scrollToBottom();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .chatlist {
        position: absolute;
        top: 60px;
        bottom: 48px;
        left: 0;
        right: 0;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0 10px 0 10px;
    }

    .chatlist ul {
        min-height: 300px;
        padding: 0;
    }

    .chatlist ul .chat-mine {
        text-align: right;
        padding-left: 0;
        padding-right: 60px;
    }

    .chatlist ul li {
        position: relative;
        /*font-size: 0;*/
        margin-bottom: 10px;
        padding-left: 60px;
        min-height: 68px;
        text-align: left;
    }

    .chat-mine .chat-user {
        left: auto;
        right: 3px;
    }

    .chat-user {
        position: absolute;
        left: 3px;
    }

    .chat-text,
    .chat-user {
        display: inline-block;
        vertical-align: top;
        /*font-size: 14px;*/
    }

    .chat-user img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
    }

    .time {
        width: 100%;
    }

    cite {
        left: auto;
        right: 60px;
        text-align: right;
    }

    cite {
        font-style: normal;
        line-height: 24px;
        font-size: 12px;
        white-space: nowrap;
        color: #999;
        text-align: left;
    }

    cite i {
        font-style: normal;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 12px;
    }

    .chat-mine .chat-text {
        margin-left: 0;
        text-align: left;
        background-color: #33DF83;
        color: #fff;
    }

    .chat-text {
        position: relative;
        line-height: 22px;
        /*margin-top: 25px;*/
        padding: 10px 15px;
        background-color: #eee;
        border-radius: 3px;
        color: #333;
        word-break: break-all;
        max-width: 462px\9;
    }

    .chat-text,
    .chat-user {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
    }

    .chat-text img {
        max-width: 100%;
        vertical-align: middle;
    }

    .chat-user {
        position: absolute;
        left: 3px;
    }

    .chat-text:after {
        content: '';
        position: absolute;
        left: -10px;
        top: 15px;
        width: 0;
        height: 0;
        border-style: solid dashed dashed;
        border-color: #eee transparent transparent;
        overflow: hidden;
        border-width: 10px;
    }

    .chat-mine .chat-text:after {
        left: auto;
        right: -10px;
        border-top-color: #33DF83;
    }

    .foot {
        width: 100%;
        min-height: 48px;
        position: fixed;
        bottom: 0px;
        left: 0px;
        background-color: #F8F8F8;
    }

    .foot .con {
        position: absolute;
        left: 66px;
        right: 40px;
    }

    .foot .btn-plus i {
        font-size: 2em;
        color: #ccc;
    }

    .foot .btn-face i {
        font-size: 2em;
        color: #d9d9d9;
    }

    .face-box li {
        width: 30px;
        float: left;
        padding: 6px 10px 0px 8px;
    }
    body {
      -webkit-touch-callout:none;/*系统默认菜单被禁用*/
      -webkit-user-select:none;/*webkit浏览器*/
      -khtml-user-select:none;/*早起浏览器*/
      -moz-user-select:none;/*火狐浏览器*/
      -ms-user-select:none;/*IE浏览器*/
      user-select:none;/*用户是否能够选中文本*/
    }
</style>
