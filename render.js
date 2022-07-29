const fs = require("fs");
const os  = require("os");
const path = require("path");
const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia } = require("@remotion/renderer");

const redditData = require("./redditData.json")
 
const start = async (compositionId, outputName) => {
 
  // Create a webpack bundle of the video.
  // You only have to do this, you can reuse the bundle.
  const onProgressUpdate = (progress) => {
    console.log(`Webpack bundling progress: ${progress}%`);
  };
  const bundleLocation = await bundle(require.resolve("./src/index.tsx"), onProgressUpdate);
 
  // Parametrize the video by passing arbitrary props to your component.
  const inputProps = {
    custom: "data",
  };
 
  // Extract all the compositions you have defined in your project
  // from the webpack bundle.
  const comps = await getCompositions(bundleLocation, {
    // You can pass custom input props that you can retrieve using getInputProps()
    // in the composition list. Use this if you want to dynamically set the duration or
    // dimensions of the video.
    inputProps,
  });
 
  // Select the composition you want to render.
  const composition = comps.find((c) => c.id === compositionId);
 
  // Ensure the composition exists
  if (!composition) {
    throw new Error(`No composition with the ID ${compositionId} found`);
  }

  const onProgress = ({
    renderedFrames,
    encodedFrames,
    encodedDoneIn,
    renderedDoneIn,
    stitchStage,
  }) => {
    if (stitchStage === "encoding") {
      // First pass, parallel rendering of frames and encoding into video
      console.log("Encoding...");
    } else if (stitchStage === "muxing") {
      // Second pass, adding audio to the video
      console.log("Muxing audio...");
    }
    // Amount of frames rendered into images
    console.log(`${renderedFrames} rendered`);
    // Amount of frame encoded into a video
    console.log(`${encodedFrames} encoded`);
    // Time to create images of all frames
    if (renderedDoneIn !== null) {
      console.log(`Rendered in ${renderedDoneIn}ms`);
    }
    // Time to encode video from images
    if (encodedDoneIn !== null) {
      console.log(`Encoded in ${encodedDoneIn}ms`);
    }
  };

   
const onStart = ({ frameCount }) => {
  console.log(`Beginning to render ${frameCount}.`);
};
 
  await renderMedia({
    composition,
    ffmpegExecutable: "D:/ffmpeg/bin/ffmpeg.exe",
    parallelism: 8,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: `out/${outputName}`,
    inputProps,
    onStart,
    onProgress
  });
};

const render = async function() {
  for (const [index, data] of redditData.entries()){
    // console.log(index)
    if(index < 3) {
     await start(`questionN${index+1}`, `output${index}.mp4`);
    }
  
  }
}

render()


