"use client"

import Link from "next/link"
import Image from "next/image"
import React from "react"

import pack_icon from "@/utils/pack_icon"
import music_discs from "@/utils/music_discs"
import block_textures from "@/utils/block_textures"

import addBlockTexture from "@/utils/events/addBlockTexture"
import changeIcon from "@/utils/events/changeIcon"
import downloadPack from "@/utils/events/downloadPack"
import removeStateIndex from "@/utils/events/removeStateIndex"
import addMusicDisc from "@/utils/events/addMusicDisc"

import MusicDiscs from "@/utils/components/MusicDiscs"

export default function HomePage() {
  // Basic Info
  const [name, setName] = React.useState("Name")
  const [author, setAuthor] = React.useState("Unknown")
  const [description, setDescription] = React.useState("Description")
  const [icon, setIcon] = React.useState(pack_icon)

  // Block Textures
  const [blockTextures, setBlockTextures] = React.useState<
    {
      name?: string
      oldTexture?: string
      newTexture?: string
    }[]
  >([])

  // Music Discs
  const [musicDiscs, setMusicDiscs] = React.useState<
    {
      name?: string
      audio?: File
    }[]
  >([])

  // Page JSX
  return (
    <main className="flex min-h-screen flex-col items-center gap-20 bg-dark-950 px-8 py-32 tracking-tight text-light-700 children:w-full children:max-w-xs sm:children:max-w-2xl">
      {/* Title Section */}
      <section>
        <h1 className="text-center text-6xl font-black">MCPACK BUILDER</h1>
        <h2 className="mt-2 text-center text-2xl text-light-100">
          Made by{" "}
          <Link
            href={"https://github.com/notcharliee"}
            className="font-semibold text-light-400 duration-200 hover:text-light-700"
          >
            notcharliee
          </Link>{" "}
          <span className="hidden sm:inline">on GitHub</span>
        </h2>
      </section>
      {/* Basic Pack Info Section */}
      <section>
        <h3 className="text-xl font-semibold">Resource Pack Info</h3>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full bg-dark-700 p-3 placeholder-light-400"
              maxLength={32}
              onChange={(e) => {
                setName(e.target.value.length ? e.target.value : "Name")
              }}
            />
            <input
              type="text"
              placeholder="Enter Author"
              className="w-full bg-dark-700 p-3 placeholder-light-400"
              maxLength={32}
              onChange={(e) => {
                setAuthor(e.target.value.length ? e.target.value : "Author")
              }}
            />
          </div>
          <div className="flex gap-4">
            <textarea
              placeholder="Enter Description"
              className="w-full resize-none bg-dark-700 p-3 placeholder-light-400"
              maxLength={150}
              onChange={(e) => {
                setDescription(
                  e.target.value.length ? e.target.value : "Description",
                )
              }}
            />
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/svg+xml"
              id="change-icon"
              hidden
              onChange={(event) => {
                changeIcon({
                  state: icon,
                  setState: setIcon,
                  event,
                })
              }}
            />
            <div className="flex flex-col gap-4 duration-200">
              <div className="bg-dark-700 p-3">
                <Image
                  src={icon}
                  width={96}
                  height={96}
                  alt=""
                  id="preview-change-icon"
                  className="fill max-h-[6rem] max-w-[6rem]"
                ></Image>
              </div>
              <label
                htmlFor="change-icon"
                className="w-full min-w-[3rem] cursor-pointer border border-light-700 bg-light-700 p-3 text-center text-dark-700 duration-200 hover:bg-transparent hover:text-light-700"
              >
                Change Icon
              </label>
            </div>
          </div>
        </div>
      </section>
      {/* Block Texture Replacer Section */}
      <section>
        <div>
          <h3 className="text-xl font-semibold">Block Texture Replacer</h3>
          <p className="text-md mt-1 text-light-400">
            This builder supports all commonly used image formats, however
            images max out at 256x256 pixels to avoid performance issues.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {blockTextures.map((texture, key) => (
            <div className="relative flex gap-4" key={key}>
              <div className="flex max-h-12 gap-2 bg-dark-700 p-3">
                <Image
                  src={texture.oldTexture ?? ""}
                  width={24}
                  height={24}
                  alt=""
                ></Image>
                <span className="font-black"> → </span>
                <Image
                  src={texture.newTexture ?? ""}
                  width={24}
                  height={24}
                  alt=""
                ></Image>
              </div>
              <div className="max-w-[calc(100%-119.62px)] grow truncate bg-dark-700 p-3">
                {texture.name ? `${texture.name}.png` : ""}
              </div>
              <button
                className="absolute right-0 top-0 h-5 w-5 -translate-y-1/4 translate-x-1/4 rounded-md bg-light-700 text-xs font-black leading-none text-dark-700"
                onClick={() => removeStateIndex(setBlockTextures, key)}
              >
                X
              </button>
            </div>
          ))}
          <div className="flex flex-col gap-4 sm:flex-row">
            <select
              id="block-texture-select"
              className="w-full cursor-text appearance-none bg-dark-700 p-3"
              defaultValue={blockTextures[-1]?.name ?? ""}
              onChange={(event) =>
                addBlockTexture({
                  state: blockTextures,
                  setState: setBlockTextures,
                  name: event.target.value,
                })
              }
            >
              <option value="" className="hidden">
                Enter Texture Name
              </option>
              {Object.keys(block_textures).map((block, key) => (
                <option value={block} key={key}>
                  {block}.png
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/svg+xml"
              id="block-texture-upload"
              hidden
              onChange={(event) => {
                if (!event.target.files) return
                const file = event.target.files[0]
                if (!file) return

                addBlockTexture({
                  state: blockTextures,
                  setState: setBlockTextures,
                  texture: file,
                })
              }}
            />
            <label
              htmlFor="block-texture-upload"
              className="w-full cursor-pointer border border-light-700 bg-light-700 p-3 text-center text-dark-700 duration-200 hover:bg-transparent hover:text-light-700"
            >
              Upload New Texture
            </label>
          </div>
        </div>
      </section>
      {/* Music Disc Replacer Section */}
      <section>
        <div>
          <h3 className="text-xl font-semibold">Music Disc Replacer</h3>
          <p className="text-md mt-1 text-light-400">
            Minecraft only supports the{" "}
            <code className=" mx-1 rounded border border-dark-200 bg-dark-600 px-1.5 py-0.5 leading-none">
              .ogg
            </code>{" "}
            audio format. If your music is not currently in this format, you can
            use{" "}
            <Link
              target="_blank"
              className="text-light-700 underline"
              href={"https://audio.online-convert.com/convert-to-ogg"}
            >
              this converter.
            </Link>
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <MusicDiscs
            musicDiscs={musicDiscs}
            setMusicDiscs={setMusicDiscs}
          ></MusicDiscs>
          <div className="flex flex-col gap-4 sm:flex-row">
            <select
              id="music-disc-select"
              className="w-full cursor-text appearance-none bg-dark-700 p-3"
              defaultValue={blockTextures[-1]?.name ?? ""}
              onChange={(event) =>
                addMusicDisc({
                  state: musicDiscs,
                  setState: setMusicDiscs,
                  name: event.target.value,
                })
              }
            >
              <option value="" className="hidden">
                Enter Disc Name
              </option>
              {Object.keys(music_discs).map((disc, key) => (
                <option value={disc} key={key}>
                  {disc}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="audio/ogg"
              id="music-disc-upload"
              hidden
              onChange={(event) => {
                if (!event.target.files) return
                const file = event.target.files[0]
                if (!file) return

                addMusicDisc({
                  state: musicDiscs,
                  setState: setMusicDiscs,
                  audio: file,
                })
              }}
            />
            <label
              htmlFor="music-disc-upload"
              className="w-full cursor-pointer border border-light-700 bg-light-700 p-3 text-center text-dark-700 duration-200 hover:bg-transparent hover:text-light-700"
            >
              Upload New Audio
            </label>
          </div>
        </div>
      </section>
      {/* Preview & Export Section */}
      <section>
        <h3 className="text-xl font-semibold">Preview & Export</h3>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="bg-dark-700 p-3">
              <Image
                src={icon}
                width={256}
                height={256}
                alt=""
                className="fill h-full w-full sm:h-32 sm:w-32"
              ></Image>
            </div>
            <div className="flex min-h-full w-full flex-col break-words bg-dark-700 p-3 sm:max-w-[calc(100%-152px-16px)]">
              <span className="font-semibold" children={name} />
              <p className="text-light-100" children={description} />
              <span className="mt-auto" children={`By ${author}`} />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => {
                downloadPack({
                  name,
                  description,
                  author,
                  icon,
                  type: "zip",
                  blockTextures,
                  musicDiscs,
                })
              }}
              className="w-full border border-light-700 bg-light-700 p-3 leading-none text-dark-700 duration-200 hover:bg-transparent hover:text-light-700"
            >
              Export as Zip
            </button>
            <button
              onClick={() => {
                downloadPack({
                  name,
                  description,
                  author,
                  icon,
                  type: "mcpack",
                  blockTextures,
                  musicDiscs,
                })
              }}
              className="w-full border border-light-700 bg-light-700 p-3 leading-none text-dark-700 duration-200 hover:bg-transparent hover:text-light-700"
            >
              Export as MCPack
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
