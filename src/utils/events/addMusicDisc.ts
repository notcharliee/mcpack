const addMusicDisc = ({
  state,
  setState,
  name,
  audio,
}: {
  state: {
    name?: string | undefined
    audio?: File | undefined
  }[]
  setState: React.Dispatch<
    React.SetStateAction<
      {
        name?: string | undefined
        audio?: File | undefined
      }[]
    >
  >
  name?: string
  audio?: File
}) => {
  // Get the last disc added to the array
  const lastIndex = state.length - 1
  const lastDisc = state[lastIndex]
  const lastDiscComplete = !!lastDisc && !!lastDisc?.name && !!lastDisc?.audio

  // Get the elements
  const musicDiscSelect = document.getElementById(
    "music-disc-select",
  ) as HTMLSelectElement
  const musicDiscUpload = document.getElementById(
    "music-disc-upload",
  ) as HTMLInputElement

  console.log(name, audio, lastDisc, lastDiscComplete)

  // Get the new data from the parameters
  const newDiscName = name ?? (lastDiscComplete ? undefined : lastDisc?.name)
  const newDiscAudio = audio ?? (lastDiscComplete ? undefined : lastDisc?.audio)

  // Create a new disc object with the updated stuff
  const newDiscObject = {
    name: newDiscName,
    audio: newDiscAudio,
  }

  if (!lastDisc) {
    // If the last disc doesn't exist, just add the new object
    setState([newDiscObject])
  } else if (lastDiscComplete) {
    // But if the last disc is a complete object, add a new object after it
    setState((prevDiscs) => [...prevDiscs, newDiscObject])
  } else {
    // Otherwise, swap out the last disc's object for the updated one
    setState((prevTextures) => [
      ...prevTextures.slice(0, lastIndex),
      newDiscObject,
    ])
  }

  musicDiscSelect.value = ""
  musicDiscUpload.files = null
}

export default addMusicDisc
