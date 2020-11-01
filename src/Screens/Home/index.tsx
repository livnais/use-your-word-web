import React, { useState, useEffect } from "react"
import TopbarErrorMessage from "../../Components/TopbarError"
import io from "socket.io-client"
import LoaderScreen from "../../Components/Loading"
import "./styles.css"
import GameScreen from "../Game"

const ENDPOINT = "http://127.0.0.1:4001"
const HomeScreen = () => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messageLoading, setMessageLoading] = useState("")
  const [messageError, setMessageError] = useState("")
  const [randomColor, setRandomColor] = useState("#6de387")
  const [connected, setConnected] = useState(false)
  const [users, setUsers] = useState([] as any)
  const [myUser, setMyUser] = useState<any>()
  const [socketIO, setSocketIO] = useState<SocketIOClient.Socket>()

  let socket: any

  useEffect(() => {
    setRandomColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
  }, [])

  const connexion = () => {
    //@ts-ignore
    const name = document.getElementById("nameOfPlayer").value
    if (name.trim() === "") {
      //@ts-ignore
      document.getElementById("nameOfPlayer").value = ""
      setMessageError("Veuiller saisir un pseudo !")
      setError(true)
    } else {
      setError(false)
      setLoading(true)
      setMessageLoading("CHARGEMENT...")
      var user = myUser || {
        id: "",
        messageType: "",
        userId: "",
        name: name,
        duplicateName: "",
        team: "",
        answer: "",
        vote: "",
        ready: false,
        point: 0,
      }
      socket = io.connect(ENDPOINT, { query: `user=${JSON.stringify(user)}` })
      setSocketIO(socket)
      socketMethod()
    }
  }

  const socketMethod = () => {
    socket.on("connect_error", (data: string) => {
      setMessageLoading("CONNEXION EN COURS...")
      setMyUser(undefined)
      setLoading(true)
      setConnected(false)
    })

    socket.on("getUsers", (data: any) => {
      const { players } = data

      const index = players.findIndex((p: any) => p.id === socket.id)
      if (index > -1) {
        setMyUser(players[index])
        console.log("socketMethod")
      }

      console.log("getUsers", players)
      setUsers(players)
      setLoading(false)
      setConnected(true)
    })
  }

  const callBackError = (value: boolean) => {
    setError(value)
  }

  const setMyUserInfo = (attribute: string, value: any) => {
    const user = myUser
    user["messageType"] = attribute
    if (attribute !== "ready") {
      user["ready"] = true
    }
    user[attribute] = value
    setMyUser(user)
    if (socketIO) {
      socketIO.emit("updateUser", JSON.stringify(user))
      socketIO.io.opts.query = `user=${JSON.stringify(user)}`
    }
  }

  return connected && myUser ? (
    <GameScreen
      socket={socketIO}
      setMyUserInfo={setMyUserInfo}
      myUser={myUser}
      users={users}
    />
  ) : (
    <div style={{ backgroundColor: randomColor }} className="containerHome">
      <LoaderScreen
        isVisible={loading}
        message={messageLoading}
        color={randomColor}
      />
      {error && (
        <TopbarErrorMessage message={messageError} setError={callBackError} />
      )}
      <div className="contentHome">
        <h1 className="game_name">USE YOUR WORDS</h1>
        <input
          className="input_name"
          type="text"
          placeholder="Entrer votre pseudo..."
          id="nameOfPlayer"
        />

        <button onClick={() => connexion()} className="button_connexion">
          CONNEXION
        </button>
      </div>
    </div>
  )
}

export default HomeScreen
