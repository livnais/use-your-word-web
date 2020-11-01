import React from 'react'
import "./styles.css"


interface Props{
    image?:string;
}

const ImageComponent = (props:Props)=>{
const {image} = props

    return (
        <div className="imageComponentContainer">
           <img className="imageComponentContent" src={image}/>
        </div>
    )
}
export default ImageComponent