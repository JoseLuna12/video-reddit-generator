import redditImage from "../img/reddit.png"
import { Audio, useCurrentFrame, useVideoConfig } from "remotion"
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import * as Audios from "../audios/files"
import { RedditPostProps } from "../types/types"

export const RedditPost: React.FC<RedditPostProps> = ({ user, upVotes, text, isQuestion, id }) => {

  const showAnim1 = true;


  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const textStyle = {
    fontSize: isQuestion ? "25px" : "20px",
    fontWeight: isQuestion ? "bold" : "normal"
  }

  const value = Object.values(Audios)[0]
  const audioId = id as string
  const audioFile = value[audioId as keyof typeof value] as unknown as string

  const audioData = useAudioData(audioFile);

  let visualization: any[] = []

  if (audioData) {
    visualization = visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: 16,
    });
  }


  return (
    <div style={{ width: "75%", height: "auto", zIndex: "100", backgroundColor: "white", borderRadius: "10px", overflow: "hidden" }}>
      {
        audioFile ?
          <Audio
            src={audioFile}
            volume={0.3}
          />
          : <></>
      }
      <div style={{ display: "flex", flex: 1, width: "100%", height: "100%" }}>
        <div style={{ height: "full", width: "50px", backgroundColor: "#ccc", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {upVotes}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: 10 }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "100%", backgroundImage: `url("${redditImage}")` }}></div>
            <div>{user}</div>
          </div>
          <div style={{ width: "full", height: "full", background: "white", padding: 10, ...textStyle }}>{text}</div>
        </div>
      </div>
      {
        showAnim1 ?
        <div >
        {visualization.map((v) => {
          return (
            <>
              <div
                style={{ position: "absolute", bottom: 0, left: 0, width: 10, height: 1000 * v, backgroundColor: "#28950B" }}
              />
              <div
                style={{ position: "absolute", bottom: 0, left: 0, width: 1000 * v, height: 10, backgroundColor: "#28950B" }}
              />
              <div
                style={{ position: "absolute", top: 0, right: 0, width: 10, height: 1000 * v, backgroundColor: "#28950B" }}
              />
              <div
                style={{ position: "absolute", top: 0, right: 0, width: 1000 * v, height: 10, backgroundColor: "#28950B" }}
              />
            </>

          );
        })}
      </div>
      :<></>
      }
      <div>

      </div>
      
    </div>
  )
}
