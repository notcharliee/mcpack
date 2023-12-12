const removeStateIndex = async (
  setState: React.Dispatch<React.SetStateAction<any[]>>,
  index: number,
) => {
  setState((state) => state.toSpliced(index, 1))
}

export default removeStateIndex
