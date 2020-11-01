import React from "react"
import "./styles.css"


interface Props{
video : string;
answer?:string;
}

const VideoComponent = (props:Props) =>{
const {video,answer} = props
    return (
    <div  className="videoComponentContainer">
        <video  className="videoContent"  src={video} controls>
    Votre navigateur ne gère pas l'élément <code>video</code>.
  </video>  
  {answer && ( <span className="spanVideoComponent"></span>)
  }
 
</div>
    ) 
}

export default VideoComponent