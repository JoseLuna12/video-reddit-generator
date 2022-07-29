import { useEffect, useState } from "react";
import { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig, Video, Series, Audio, Loop } from "remotion"
import { getAudioData } from "@remotion/media-utils";
import * as Audios from "../audios/files"
import { ContainerReddit } from "./ContainerReddit";
import { RedditPost } from "./ReditPost";
import { RedditData } from "../types/types";


const get_audio_data = async function (audio: string): Promise<number> {
  const data = await getAudioData(audio);
  return data.durationInSeconds
}


export const Reddit: React.FC<RedditData> = (props) => {

  const showTimeAnimation = false

  const [questionAudio, setQuestionAudio] = useState(120)
  const value = Object.values(Audios)[0]
  const audioId = props.id as string
  const audioFile = value[audioId as keyof typeof value] as unknown as string

  useEffect(() => {
    const load = async function () {
      const value = await get_audio_data(audioFile)
      setQuestionAudio(Math.floor(value * 30))
    }
    load()
  }, [questionAudio])

  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const questionDisplay = interpolate(frame, [questionAudio - 30, questionAudio], [1, 0])


  const {durationInFrames} = useVideoConfig();
  const durationby4 = durationInFrames/4;
  const top = interpolate(frame, [30, durationby4], [0, 100])
  const left = interpolate(frame, [durationby4, durationby4 *2], [0, 100])
  const bottom = interpolate(frame, [durationby4*2, durationby4 *3], [0, 100])
  const right = interpolate(frame, [durationby4*3, durationby4 *4], [0, 100])


  return (
    <AbsoluteFill style={{ opacity }} >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Loop durationInFrames={900}>
          <Video src={props.bg} volume={0.03} style={{ zIndex: "10", height: "100%" }} />
        </Loop>
        <div style={{ opacity: questionDisplay }}>
          <ContainerReddit>
            <RedditPost isQuestion={true} text={props.title} upVotes={props.votes} user={props.user} id={props.id} />
          </ContainerReddit>
        </div>
        <div>
          <Sequence from={questionAudio}>
            <Series >
              {
                props.comments.map((data, index) => {
                  const words = data.comment.split(" ").length;
                  const speed = Math.floor((words / 4) * 60)
                  const finalSpeed = speed < 60 ? 120 : speed

                  if (data.level == "1") {
                    return (
                      <Series.Sequence durationInFrames={finalSpeed}>
                        <ContainerReddit>
                          <RedditPost isQuestion={false} text={data.comment} upVotes={data.votes} user={data.user} id={data.id} />
                        </ContainerReddit>
                      </Series.Sequence>
                    )
                  }
                  return <></>
                })
              }
            </Series>
          </Sequence>
        </div>
      </div>
      {
        showTimeAnimation ?
      <div style={{ zIndex: "200" }}>
        <div id="test" style={{ position: "absolute", top: 0, left: 0, width: `${top}%`, height: "0%", border: "2px solid red" }} />
        <div id="test" style={{ position: "absolute", top: 0, right: 0, width: "0%", height: `${left}%`, border: "2px solid red" }} />
        <div id="test" style={{ position: "absolute", bottom: 0, right: 0, width: `${bottom}%`, height: "0%", border: "2px solid red" }} />
        <div id="test" style={{ position: "absolute", bottom: 0, left: 0, width: "0%", height: `${right}%`, border: "2px solid red" }} />
      </div>
  : <></>
      }
    </AbsoluteFill>
  )
}