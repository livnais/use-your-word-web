import React from "react"
import "./styles.css"

interface Props {
  text1: string
  text2: string
  answer?: string
}

const TextComponent = (props: Props) => {
  const { text1, text2, answer } = props

  const getAnswer = () => {
    return answer ? answer : "..."
  }

  return (
    <div className="textComponentContainer">
      <span className="textContent">{`${text1} ${getAnswer()} ${text2}`}</span>
    </div>
  )
}

export default TextComponent
