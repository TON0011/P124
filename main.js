let video;
let poseNet;
let poses = [];

function setup() {
  // Create a canvas and place it next to the webcam live view
  createCanvas(640, 480).position(10, 520);

  // Access the webcam
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.position(10, 10);

  // Initialize PoseNet
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  // Hide the extra components created by p5.js
  video.hide();
}

function modelLoaded() {
  console.log('PoseNet is initialized');
}

function gotPoses(results) {
  poses = results;
  if (poses.length > 0) {
    let leftWrist = poses[0].pose.leftWrist;
    let rightWrist = poses[0].pose.rightWrist;

    if (leftWrist.confidence > 0.2 && rightWrist.confidence > 0.2) {
      let distance = dist(leftWrist.x, leftWrist.y, rightWrist.x, rightWrist.y);
      let newSize = map(distance, 50, 300, 12, 72);
      select('#dynamic-font-size').style('font-size', `${newSize}px`);
    }
  }
}

function draw() {
  // Draw the video
  image(video, 0, 0);

  // Draw keypoints and skeleton
  drawKeypoints();
  drawSkeleton();
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
