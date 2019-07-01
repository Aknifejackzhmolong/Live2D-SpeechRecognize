/* eslint-disable */
const pako = require('pako')

function WaveFileLoader(buffer) {
    this.header = null;
    this.data = null;
    this.load(buffer)
}
Object.assign( WaveFileLoader.prototype , {
    constructor: WaveFileLoader,
    load: function (buffer) {
        // MAT文件由一个128字节的文件头和若干个数据单元组成
        // 文件头header里有124字节的文本描述区域和4个字节的flag。flag中的前2个字节说明version，后两个字节是endian indicator的I和M。
        let headerBuffer = buffer.slice(0,44)
        console.log(buffer)
        let riff = this.parseString(headerBuffer.slice(0,4))
        let fileSize = new Int32Array(headerBuffer.slice(4,8))[0]
        let type  = this.parseString(headerBuffer.slice(8,12))
        let dataInfoMark = this.parseString(headerBuffer.slice(12,16))
        // console.log(new Uint8Array(headerBuffer.slice(12,16)))
        let dataInfoSize = new Int32Array(headerBuffer.slice(16,20))[0]
        let encodeType = new Int16Array(headerBuffer.slice(20,22))[0]
        let channelCount = new Int16Array(headerBuffer.slice(22,24))[0]
        let sampleRate = new Int32Array(headerBuffer.slice(24,28))[0]
        let tuplefrequency = new Int32Array(headerBuffer.slice(28,32))[0]
        let tupleSize = new Int16Array(headerBuffer.slice(32,34))[0]
        let bitsPerSample = new Int16Array(headerBuffer.slice(34,36))[0]
        let dataChunkBeginMark = this.parseString(headerBuffer.slice(36,40))
        let dataChunkSize = new Int32Array(headerBuffer.slice(40,44))[0]
        let header = {
          riff,
          fileSize,
          type,
          dataInfoMark,
          dataInfoSize,
          encodeType,
          channelCount,
          sampleRate,
          tuplefrequency,
          tupleSize,
          bitsPerSample,
          dataChunkBeginMark,
          dataChunkSize
        };
        this.header = header
        this.data = new Float32Array(buffer.slice(44))
        console.log(this.toJSON())
    },
    exportWAV16k(data/*Float32Array*/){
      const buffer = new ArrayBuffer(44+data.byteLength)
      let file = new DataView(buffer)
      let riffMark = 'RIFF', waveMark = 'WAVE', fmtMark = 'fmt ', dataMark = 'data';
      console.log(buffer,data.byteLength)
      file.setUint8(0,riffMark.charCodeAt(0))
      file.setUint8(1,riffMark.charCodeAt(1))
      file.setUint8(2,riffMark.charCodeAt(2))
      file.setUint8(3,riffMark.charCodeAt(3))
      file.setInt32(4,data.byteLength+36,true)// 低字节序存储
      file.setUint8(8,waveMark.charCodeAt(0))
      file.setUint8(9,waveMark.charCodeAt(1))
      file.setUint8(10,waveMark.charCodeAt(2))
      file.setUint8(11,waveMark.charCodeAt(3))
      file.setUint8(12,fmtMark.charCodeAt(0))
      file.setUint8(13,fmtMark.charCodeAt(1))
      file.setUint8(14,fmtMark.charCodeAt(2))
      file.setUint8(15,fmtMark.charCodeAt(3))
      file.setFloat32(16,16,true)
      file.setInt16(20,1,true)
      file.setInt16(22,1,true)
      file.setInt32(24,16000,true)
      file.setInt32(28,32000,true)
      file.setInt16(32,2,true)
      file.setInt16(34,16,true)
      file.setUint8(36,dataMark.charCodeAt(0))
      file.setUint8(37,dataMark.charCodeAt(1))
      file.setUint8(38,dataMark.charCodeAt(2))
      file.setUint8(39,dataMark.charCodeAt(3))
      file.setInt32(40,data.byteLength,true)
      for (let i = 0;i < data.length;i++) file.setFloat32(44+i*4,data[i],true)
      return buffer
    },
    toJSON: function () {
      return '(1 - 4)块标识符:'+this.header.riff+'(以下说明文件基本信息)\n'+
        '(5 - 8)文件大小:'+this.header.fileSize+'byte(音频数据块大小+36)\n'+
        '(9 -12)文件格式:'+this.header.type+'\n'+
        '(13-16)音频数据信息标识:'+this.header.dataInfoMark+'(以下说明音频数据基本信息)\n'+
        '(17-20)音频数据信息区大小:'+this.header.dataInfoSize+'byte\n'+
        '(21-22)音频数据编码方式:'+this.header.encodeType+'(1为PCM)\n'+
        '(23-24)声道数量(numChannels):'+this.header.channelCount+'\n'+
        '(25-28)采样频率(Sample Rate):'+this.header.sampleRate+'Hz\n'+
        '(29-32)位元(组)率(Bit rate):'+this.header.tuplefrequency+'((Sample Rate * BitsPerSample * numChannels) / 8)\n'+
        '(33-34)位元大小:'+this.header.tupleSize+'\n'+
        '(35-36)单个个采样数据的大小(BitsPerSample):'+this.header.bitsPerSample+'bit\n'+
        '(37-40)音频数据起始标识:'+this.header.dataChunkBeginMark+'(以下为音频数据)\n'+
        '(41-44)音频数据大小:'+this.header.dataChunkSize+'byte\n'+
        `(45-${this.header.dataChunkSize+44})数据区...`
    },
    parseString: function(buffer) {
      let str = '';
      buffer = new Uint8Array(buffer);
      for (let i = 0; i < buffer.length; i++) str += String.fromCharCode(buffer[i])
      return str.replace(/\0/g,'')
    }
} );

function exportWAV16k(data/*Float32Array*/){
  let deflateDataLength = parseInt(data.length/3)
  let deflateDataByteLength = deflateDataLength * 2
  const buffer = new ArrayBuffer(44+deflateDataByteLength)
  let file = new DataView(buffer)
  let riffMark = 'RIFF', waveMark = 'WAVE', fmtMark = 'fmt ', dataMark = 'data';
  file.setUint8(0,riffMark.charCodeAt(0))
  file.setUint8(1,riffMark.charCodeAt(1))
  file.setUint8(2,riffMark.charCodeAt(2))
  file.setUint8(3,riffMark.charCodeAt(3))
  file.setInt32(4,deflateDataByteLength+36,true)// 低字节序存储
  file.setUint8(8,waveMark.charCodeAt(0))
  file.setUint8(9,waveMark.charCodeAt(1))
  file.setUint8(10,waveMark.charCodeAt(2))
  file.setUint8(11,waveMark.charCodeAt(3))
  file.setUint8(12,fmtMark.charCodeAt(0))
  file.setUint8(13,fmtMark.charCodeAt(1))
  file.setUint8(14,fmtMark.charCodeAt(2))
  file.setUint8(15,fmtMark.charCodeAt(3))
  file.setInt32(16,16,true)
  file.setInt16(20,1,true)
  file.setInt16(22,1,true)
  file.setInt32(24,16000,true)
  file.setInt32(28,32000,true)
  file.setInt16(32,2,true)
  file.setInt16(34,16,true)
  file.setUint8(36,dataMark.charCodeAt(0))
  file.setUint8(37,dataMark.charCodeAt(1))
  file.setUint8(38,dataMark.charCodeAt(2))
  file.setUint8(39,dataMark.charCodeAt(3))
  file.setInt32(40,deflateDataByteLength,true)
  let s
  for (let i = 0;i < deflateDataLength;i++) {
    // if (i*3+2<data.length) file.setFloat32(44+i*4,(data[3*i]+data[3*i+1]+data[3*i+2])/3,true)
    // else if (i*3+1<data.length) file.setFloat32(44+i*4,(data[3*i]+data[3*i+1])/3,true)
    // else if (i*3<data.length) file.setFloat32(44+i*4,data[3*i]/3,true)
    // else file.setFloat32(44+i*4,0,true)
    if (i*3+1<data.length) s = Math.max(-1, Math.min(1, data[3*i+1]));
    else s = 0
    file.setInt16(44+i*2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer
}

export { WaveFileLoader, exportWAV16k };
