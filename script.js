const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
var now_mood = "neutral"
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  var nowexpressions 
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    if(detections[0]==null){
        //no face
    }else{
        get_now_expressions(detections[0]);
    }
    
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
function get_now_expressions(detection_object){
    expression_list = detection_object['expressions']
    netural_score = expression_list['neutral']
    happy_score = expression_list['happy']
    sad_score = expression_list['sad']
    angry_score = expression_list['angry']
    fearful_score = expression_list['fearful']
    disgusted_score = expression_list['disgusted']
    surprised_score = expression_list['surprised']
    array = []
    array.push(netural_score,happy_score,sad_score,angry_score,fearful_score,disgusted_score,surprised_score)
    console.log(array)
    var indexOfMaxValue = array.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    console.log(indexOfMaxValue)
    switch(indexOfMaxValue){
        case 0:
            now_mood = "netural"
            break
        case 1:
            now_mood = "happy"
            break
        case 2:
            now_mood = "sad"
            break
        case 3:
            now_mood = "angry"
            break
        case 4:
            now_mood = "fearful"
            break
        case 5:
            now_mood = "disgusted"
            break
        case 6:
            now_mood = "surprised"
            break
        
    }
    console.log(now_mood)
}

