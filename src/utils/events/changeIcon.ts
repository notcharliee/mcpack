import createURIFromFile from "@/utils/functions/createURIFromFile"

const changeIcon = ({
  state,
  setState,
  event,
}: {
  state: string
  setState: React.Dispatch<React.SetStateAction<string>>
  event: React.ChangeEvent<HTMLInputElement>
}) => {
  const input = event.target

  if (!input.files) return
  const file = input.files[0]
  if (!file) return

  createURIFromFile(file).then((dataURI) => setState(dataURI))
}

export default changeIcon
