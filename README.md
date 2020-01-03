# speaker

> A Vue.js project

时不时更新中

[示例](https://ai.aknifezndx.top/)

## Screenshots

![](https://github.com/Aknifejackzhmolong/Live2D-SpeechRecognize/blob/master/screenshots/display.png?raw=true")

## 功能
- [x] recorder-js录音
- [x] 录音文件转换成16kHz单声道( [src/utils/WaveFileLoader.js](https://github.com/Aknifejackzhmolong/Live2D-SpeechRecognize/blob/master/src/utils/WaveFileLoader.js) 中, 仅供学习, 此工具没有工业级性能, 只是应付语音接口需要16kHz音频用的)
- [x] 语音识别([百度语音识别API](https://cloud.baidu.com/product/speech))
- [x] 聊天机器人([图灵机器人官网API](http://www.turingapi.com/))
- [x] live2D(static/live2d.min.js不提供)
- [x] ...

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## Back End
```bash
pip install -r requirements.txt
python speech.py
```

## License
[MIT](http://opensource.org/licenses/MIT)

Copyrights © 2019 Aknife. All Rights Reserved.
