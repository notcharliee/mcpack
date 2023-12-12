import Image from "next/image"
import React from "react"

import music_discs from "@/utils/music_discs"
import removeStateIndex from "@/utils/events/removeStateIndex"

import { AudioVisualizer } from "react-audio-visualize"

const MusicDiscs = ({
  musicDiscs,
  setMusicDiscs,
}: {
  musicDiscs: {
    name?: string | undefined
    audio?: File | undefined
  }[]
  setMusicDiscs: React.Dispatch<
    React.SetStateAction<
      {
        name?: string | undefined
        audio?: File | undefined
      }[]
    >
  >
}) => {
  const [audioStatus, setAudioStatus] = React.useState<boolean[]>(
    musicDiscs.map((e) => false),
  )

  const audioRefs = React.useRef<
    (HTMLAudioElement | React.RefObject<unknown>)[]
  >([])
  audioRefs.current = musicDiscs.map(
    (_, i) => audioRefs.current[i] ?? React.createRef(),
  )

  React.useEffect(() => {
    for (const key in musicDiscs) {
      const audioRef = audioRefs.current[key]

      if (audioRef && "current" in audioRef) {
        const audio = audioRef.current as HTMLAudioElement
        if (audio) {
          audioStatus[key] ? audio.play() : audio.pause()
        }
      }
    }
  }, [audioStatus])

  return musicDiscs.map((disc, key) => {
    return (
      <div className="relative flex gap-4" key={key}>
        {/* Music Disc Icon */}
        <div className="flex max-h-12 gap-2 bg-dark-700 p-3">
          <Image
            src={music_discs[disc.name as keyof typeof music_discs]}
            width={24}
            height={24}
            alt=""
            className=" brightness-125 saturate-150"
            title={disc.name}
          ></Image>
        </div>
        {/* Player & Waveform */}
        <div className="flex grow gap-4 truncate bg-dark-700 p-3">
          {disc.audio && (
            <>
              <button
                onClick={() => {
                  setAudioStatus((prevStatus) => {
                    const newStatus = [...prevStatus]
                    newStatus[key] = !newStatus[key]
                    return newStatus
                  })
                }}
              >
                {audioStatus[key] ? pauseSVG : playSVG}
              </button>
              <audio
                src={URL.createObjectURL(disc.audio!)}
                ref={
                  audioRefs.current[key] as
                    | React.LegacyRef<HTMLAudioElement>
                    | undefined
                }
              ></audio>
              <AudioVisualizer
                blob={disc.audio}
                barColor="rgb(216, 216, 216)"
                width={200}
                height={24}
              ></AudioVisualizer>
            </>
          )}
        </div>
        {/* Remove Music Disc */}
        <button
          className="absolute right-0 top-0 h-5 w-5 -translate-y-1/4 translate-x-1/4 rounded-md bg-light-700 text-xs font-black leading-none text-dark-700"
          onClick={() => removeStateIndex(setMusicDiscs, key)}
        >
          X
        </button>
      </div>
    )
  })
}

export default MusicDiscs

const playSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16"
    width="12"
    viewBox="0 0 384 512"
    className="fill-light-400 duration-200 hover:fill-light-700"
  >
    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
  </svg>
)

const pauseSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16"
    width="12"
    viewBox="0 0 320 512"
    className="fill-light-400 duration-200 hover:fill-light-700"
  >
    <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
  </svg>
)
