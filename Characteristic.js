
var util = require('util');
var bleno = require('bleno');
var characteristicUuid = '12ab';
var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0');
var flag = false;
/*Arduinoからの応答を受け取るdataイベントを登録*/
port.on('data',function(data){
    /*Arduinoを初期化する時、そのシリアルポートが準備されているか確認*/
    if(data.readInt8(0) == -1){
        flag = true;
        console.log("ready");
    }
    /*不正な値を検出して停止*/
    else if(data.readInt8(0) == -2){
        flag = false;
        console.log("abnormal stop");
    }
});
//Characteristicコンストラクタをオーバーライド
var Characteristic = function(){
    Characteristic.super_.call(this,{
        uuid : characteristicUuid,
        properties : ['write']
    });
};

util.inherits(Characteristic,bleno.Characteristic);

/*iPhoneからの書き込み命令があった時に呼び出される*/
Characteristic.prototype.onWriteRequest = function(data,offset,withoutResponse,callback){
    if(flag){
        port.write(data);
        console.log("sliderData:"+data.readInt8(0));
        console.log("angleData:"+data.readInt8(1));
        callback(this.RESULT_SUCCESS);
    }
};

module.exports = Characteristic;