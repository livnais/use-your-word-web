import React, { useEffect } from "react"
import "./styles.css"

interface Props {
  message: string
  setError: any
}
const TopbarErrorMessage = (props: Props) => {
  const { message, setError } = props
  useEffect(() => {
    const timer = setTimeout(() => {
      setError(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="content-error">
      <h3 className="text-error">{message}</h3>
    </div>
  )
}
export default TopbarErrorMessage
