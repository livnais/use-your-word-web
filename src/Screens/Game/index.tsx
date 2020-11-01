import React, { useEffect, useState } from "react"
import "./styles.css"
import "antd/dist/antd.css"
import Modal from "antd/lib/modal/Modal"
import TopbarErrorMessage from "../../Components/TopbarError"
import ImageComponent from "../../Components/ComponentImage"
import VideoComponent from "../../Components/ComponentVideo"
import TextComponent from "../../Components/ComponentText"
import Carousel from "react-bootstrap/Carousel"
import "bootstrap/dist/css/bootstrap.min.css"

interface Props {
  myUser: any
  users: any
  socket: any
  setMyUserInfo: (attribute: string, value: any) => void
}

const GameScreen = (props: Props) => {
  const { myUser, users, socket, setMyUserInfo } = props
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [time, setTimer] = useState<string>("0")
  const [isReady, setIsReady] = useState<boolean>(myUser.ready)
  const [state, setState] = useState<string>(
    "Le jeu commence quand tous les joueurs sont prêts  ✅"
  )
  const [dataJeu, setDataJeu] = useState<any>(null)
  const [messageError, setMessageError] = useState<string>("")
  const [displayAnswer, setDisplayAnswer] = useState<boolean>(false)

  useEffect(() => {
    socket.on("data-jeu", (data: any) => {
      const result = JSON.parse(data)
      setDataJeu(result)
      setState(result.rule)
      setDisplayAnswer(false)
      setMyUserInfo("anwser", "")
    })

    socket.on("displayAnswer", (data: boolean) => {
      console.log("displayAnswer", data)
      setDisplayAnswer(data)
    })

    socket.on("timer", (data: string) => {
      setTimer(data)
      if (parseInt(data) === 0) {
        setIsReady(false)
      }
      if (isReady && myUser.ready) {
        setMyUserInfo("answer", "")
        setMyUserInfo("ready", false)
      }
    })
  }, [])

  useEffect(() => {
    console.log("myUser", myUser)
  }, [myUser])

  const getTeamName = (team: string) => {
    if (team) {
      return ` - ${team}`
    }
    return ""
  }

  const getReady = (ready: boolean) => {
    if (ready) {
      return " ✅"
    }
    return ""
  }

  const setTeamName = () => {
    //@ts-ignore
    const name = document.getElementById("inputTeam").value
    if (name.trim() === "") {
      setError(true)
      setMessageError("Veuillez saisir un nom d'équipe")
    } else {
      setError(false)
      setMyUserInfo("team", name)
      setIsVisible(false)
    }
  }

  const answer = () => {
    //@ts-ignore
    const response = document.getElementById("answer").value
    if (response.trim() === "") {
      setError(true)
      setMessageError("Veuillez saisir une reponse")
    } else {
      setError(false)
      setMyUserInfo("answer", response)
    }
  }

  return (
    <div className="containerGame">
      {error && (
        <TopbarErrorMessage message={messageError} setError={setError} />
      )}
      <Modal
        visible={isVisible}
        cancelText="Non"
        okText="Valider"
        onCancel={() => {
          setIsVisible(false)
          setError(false)
        }}
        onOk={() => setTeamName()}
      >
        <h1>Voulez-vous être dans une équipe?</h1>
        <input
          className="inputTeam"
          placeholder="Entrer un nom d'équipe"
          type="text"
          id="inputTeam"
        />
      </Modal>
      <div className="contentPlayers">
        <span className="title">LISTE DES JOUEURS</span>
        {users.map((player: any) => (
          <div key={"index" + player.id} className="item">
            {player.name}
            {player.id === myUser.id ? " (Moi) " : ""}
            {player.duplicateName}
            {getTeamName(player.team)}
            {getReady(player.ready)}
          </div>
        ))}
      </div>
      <div className="contentGame">
        <div className="headerGame">
          <div className="headerGamePoint">
            <span className="timerSpanTitle">Point(s)</span>
            <span className="timerSpan">{myUser.point}</span>
          </div>
          <div className="headerGameState">
            <span className="timerSpanTitle">{state}</span>
          </div>
          <div className="headerGameTime">
            <span className="timerSpanTitle">Timer</span>
            <span className="timerSpan">{time}</span>
          </div>
        </div>
        <div className="bodyGame">
          {dataJeu && dataJeu.type === 1 && !displayAnswer && (
            <ImageComponent image={dataJeu.path} />
          )}
          {dataJeu && dataJeu.type === 2 && !displayAnswer && (
            <VideoComponent video={dataJeu.path} />
          )}
          {dataJeu && dataJeu.type === 3 && !displayAnswer && (
            <TextComponent text1={dataJeu.text1} text2={dataJeu.text2} />
          )}
          {displayAnswer && (
            <Carousel>
              {users.map((user: any) => (
                <Carousel.Item key={"index" + user.userId}>
                  {dataJeu.type === 1 && (
                    <ImageComponent image={dataJeu.path}></ImageComponent>
                  )}
                  {dataJeu.type === 2 && (
                    <VideoComponent video={dataJeu.path} />
                  )}
                  {dataJeu.type === 3 && (
                    <TextComponent
                      text1={dataJeu.text1}
                      answer={user.answer}
                      text2={dataJeu.text2}
                    />
                  )}
                  <Carousel.Caption>
                    {dataJeu.type !== 3 && (
                      <div className="contentAnswerVote">
                        <span className="spanAnswer">{user.answer}</span>
                      </div>
                    )}
                    {myUser.userId !== user.userId && (
                      <button
                        onClick={() => setMyUserInfo("vote", user.userId)}
                        className="buttonAnswerVote"
                      >
                        Voter pour cette réponse
                      </button>
                    )}
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>
        <div className="footerGame">
          {!isReady && (
            <button
              onClick={() => {
                setMyUserInfo("ready", true)
                setIsReady(true)
              }}
              className="buttonReady"
            >
              Je suis prêt
            </button>
          )}
          {dataJeu && isReady && !myUser.answer && !displayAnswer && (
            <div className="contentAnswer">
              <input type="text" id="answer" className="inputAnswer" />
              <button onClick={() => answer()} className="buttonReady">
                Valider
              </button>
            </div>
          )}
          {myUser.answer && displayAnswer && (
            <span className="textAnswer">{myUser.answer}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameScreen
