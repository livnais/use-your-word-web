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
var _ = require("lodash")
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
  const [answerData, setAnswerData] = useState<string>("")
  const [displayAnswer, setDisplayAnswer] = useState<boolean>(false)
  const [finishGame, setFinishGame] = useState<boolean>(false)
  const [start, setStart] = useState<boolean>(false)

  useEffect(() => {
    socket.on("data-jeu", (data: any) => {
      const result = JSON.parse(data)
      setDataJeu(result)
      setState(result.ele_statement)
      setDisplayAnswer(false)
      setAnswerData("")
      setStart(true)
      console.log("data-jeu", result)
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
    socket.on("finish", (data: boolean) => {
      setFinishGame(data)
      console.log("finish")
    })
  }, [])

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
      setAnswerData(response)
    }
  }

  useEffect(() => {
    console.log({ myUser })
  }, [myUser])

  const getPoint = (u: [any]) => {
    const index = u.findIndex((p) => p.userId === myUser.userId)
    if (index > -1) {
      return `${u[index].point}`
    }
    return "0"
  }

  const getWinner = () => {
    const win = _.maxBy(users, (o: any) => o.point)
    return win ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>
          le gagnant est {win.name}
          {win.duplicateName}
        </h1>
        <h3>Avec {win.point} point(s)</h3>
      </div>
    ) : null
  }

  return (
    <div className="containerGame">
      {error && (
        <TopbarErrorMessage message={messageError} setError={setError} />
      )}

      <Modal
        onCancel={() => setFinishGame(false)}
        onOk={() => setFinishGame(false)}
        visible={finishGame}
      >
        {getWinner()}
      </Modal>
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
            <span className="timerSpan">{getPoint(users)}</span>
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
          {dataJeu && dataJeu.ele_type === "0" && !displayAnswer && (
            <ImageComponent image={dataJeu.ele_url} />
          )}
          {dataJeu && dataJeu.ele_type === "1" && !displayAnswer && (
            <VideoComponent video={dataJeu.ele_url} />
          )}
          {dataJeu && dataJeu.ele_type === "2" && !displayAnswer && (
            <TextComponent
              text1={dataJeu.ele_text1}
              text2={dataJeu.ele_text2}
            />
          )}
          {displayAnswer && (
            <Carousel>
              {users.map((user: any) => (
                <Carousel.Item
                  key={"index" + user.userId}
                  style={{ height: dataJeu.ele_type === "2" ? 300 : "auto" }}
                >
                  {dataJeu.ele_type === "0" && (
                    <ImageComponent image={dataJeu.ele_url}></ImageComponent>
                  )}
                  {dataJeu.ele_type === "1" && (
                    <VideoComponent video={dataJeu.ele_url} />
                  )}
                  {dataJeu.ele_type === "2" && (
                    <TextComponent
                      text1={dataJeu.ele_text1}
                      answer={user.answer}
                      text2={dataJeu.ele_text2}
                    />
                  )}
                  <Carousel.Caption>
                    {dataJeu.ele_type !== "2" && (
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
          {!isReady && !start && (
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
          {dataJeu && isReady && !answerData && !displayAnswer && (
            <div className="contentAnswer">
              <input
                type="text"
                id="answer"
                placeholder="Saisez votre réponse"
                className="inputAnswer"
              />
              <button onClick={() => answer()} className="buttonReady">
                Valider
              </button>
            </div>
          )}
          {answerData && displayAnswer && (
            <span className="textAnswer">{myUser.answer}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameScreen
