/*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;

window.onload = function() {

    // grab our canvas
    //canvasContext = document.getElementById( "meter" ).getContext("2d");
    
    // monkeypatch Web Audio
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
    // grab an audio context
    audioContext = new AudioContext();

    // Attempt to get audio input
    try {
        // monkeypatch getUserMedia
        navigator.getUserMedia = 
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        // ask for an audio input
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "true",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}

function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    drawLoop();
}
var rectSize;
function drawLoop( time ) {
    var amplitude = Math.round(meter.volume*100);
	var bodyStyles = window.getComputedStyle(document.body);
	var speedStr = bodyStyles.getPropertyValue('--speed');
	var speed = parseInt(speedStr.split('m')[0]);
	if(amplitude>7){
		if(speed<500) {
			speed=500;
		} else {
			speed-=80;
		}
	} else {
		if(speed>9950){
			speed=10000;
		} else {
			speed+=30;	
		}
	}
	newSpeedStr = speed.toString() + "ms";
	console.log(newSpeedStr);
	document.body.style.setProperty('--speed', newSpeedStr);
    rZafID = window.requestAnimationFrame( drawLoop );
}

var v = countDownTimer();
function countDownTimer () {
	var currDate = new Date();
	var eventDate = new Date("Feb 3 2017 20:00:00");
	var timeDiff = eventDate - currDate;
	var seconds = Math.floor((timeDiff / 1000) % 60);
	var mins = Math.floor((timeDiff / (1000 * 60)) % 60);
	var hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
	var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	document.getElementById("days_number").innerHTML= days;
	document.getElementById("hours_number").innerHTML= hours;
	document.getElementById("minutes_number").innerHTML= mins;
	document.getElementById("seconds_number").innerHTML= seconds;
}
var interval = setInterval(countDownTimer,1000);
