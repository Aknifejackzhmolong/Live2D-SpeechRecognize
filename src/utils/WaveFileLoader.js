/**
 * @Author Aknife
 * @Date 2019/6/30
 */
function WaveFileLoader(buffer) {
    this.header = null;
    this.data = null;
    this.load(buffer)
}
Object.assign( WaveFileLoader.prototype , {
    constructor: WaveFileLoader,
    load: function (buffer) {
        // WAV文件由一个44字节的文件头和音频数据单元组成
        let headerBuffer = buffer.slice(0,44)
        let headerDataView = new DataView(headerBuffer)
        console.log(buffer)
        let riff = this.parseString(headerBuffer.slice(0,4))
        let fileSize = headerDataView.getInt32(4, true)
        let type  = this.parseString(headerBuffer.slice(8,12))
        let dataInfoMark = this.parseString(headerBuffer.slice(12,16))
        let dataInfoSize = headerDataView.getInt32(16, true)
        let encodeType = headerDataView.getInt16(20, true)
        let channelCount = headerDataView.getInt16(22, true)
        let sampleRate = headerDataView.getInt32(24, true)
        let tuplefrequency = headerDataView.getInt32(28, true)
        let tupleSize = headerDataView.getInt16(32, true)
        let bitsPerSample = headerDataView.getInt16(34, true)
        let dataChunkBeginMark = this.parseString(headerBuffer.slice(36,40))
        let dataChunkSize = headerDataView.getInt32(40, true)
        this.header = {
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
        console.log(this.toString())
        this.data = this.extractData(buffer.slice(44))
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
    toString: function () {
      return '(1 - 4)块标识符:'+this.header.riff+'\t\t\t\t\t\t[以下说明文件基本信息]\n'+
        '(5 - 8)文件大小:'+this.header.fileSize+'byte\t\t\t\t[音频数据块大小+36]\n'+
        '(9 -12)文件格式:'+this.header.type+'\n'+
        '(13-16)音频数据信息标识:'+this.header.dataInfoMark+'\t\t\t\t[以下说明音频数据基本信息]\n'+
        '(17-20)音频数据信息区大小:'+this.header.dataInfoSize+'byte\n'+
        '(21-22)音频数据编码方式:'+this.header.encodeType+'\t\t\t\t[1为PCM]\n'+
        '(23-24)声道数量(numChannels):'+this.header.channelCount+'\n'+
        '(25-28)采样频率(Sample Rate):'+this.header.sampleRate+'Hz\n'+
        '(29-32)位元率/比特率(Bit rate):'+this.header.tuplefrequency+'bps\t[(Sample Rate * BitsPerSample * numChannels) / 8]\n'+
        '(33-34)位元大小:'+this.header.tupleSize+'byte\t\t\t\t\t[(BitsPerSample * numChannels) / 8]\n'+
        '(35-36)单个个采样数据的大小(BitsPerSample):'+this.header.bitsPerSample+'bit\n'+
        '(37-40)音频数据起始标识:'+this.header.dataChunkBeginMark+'\t\t\t\t[以下为音频数据]\n'+
        '(41-44)音频数据大小:'+this.header.dataChunkSize+'byte\n'+
        `(45-${this.header.dataChunkSize+44})数据区...`
    },
    parseString: function(buffer) {
      let str = '';
      buffer = new Uint8Array(buffer);
      for (let i = 0; i < buffer.length; i++) str += String.fromCharCode(buffer[i])
      return str.replace(/\0/g,'')
    },
    extractData: function (data/*ArrayBuffer*/, BitsPerSample/*int*/, numChannels/*int*/, tupleSize/*int*/) {
      if (BitsPerSample === undefined) BitsPerSample = this.header.bitsPerSample
      if (BitsPerSample !== 16) throw 'support 16bitFloat only, the BitsPerSample is '+BitsPerSample;
      if (numChannels === undefined) numChannels = this.header.channelCount
      if (tupleSize === undefined) tupleSize = BitsPerSample * numChannels / 8
      const dataView = new DataView(data)
      let buffer = []
      let offset = 0
      for (let i = 0; i < numChannels; i++){
        buffer.push(new Float32Array(new ArrayBuffer(dataView.byteLength / numChannels * 2)))
      }
      while(offset < dataView.byteLength){
        for (let i = 0; i < numChannels; i++){
          buffer[i][offset/tupleSize] = dataView.getInt16(offset+i*2, true) < 0 ? dataView.getInt16(offset+i*2, true) / 0x8000 : dataView.getInt16(offset+i*2, true) / 0x7FFF
        }
        offset += tupleSize
      }
      return buffer
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
    /*
    javascript 不支持16bit Float, 所以强制转换为16bit Integer保存
     */
    if (i*3+1<data.length) s = Math.max(-1, Math.min(1, data[3*i+1]));
    else s = 0
    file.setInt16(44+i*2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer
}

export { WaveFileLoader, exportWAV16k };
