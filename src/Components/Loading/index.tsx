import React from "react";
import "./styles.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

interface Props {
  isVisible: boolean;
  message: string;
  color: string;
}

const LoaderScreen = (props: Props) => {
  const { isVisible, message, color } = props;

  return isVisible ? (
    <div className="container-loader">
      <h2 className="text-loading ">{message}</h2>
      <Loader type="ThreeDots" color={color} height={100} width={100} />
    </div>
  ) : null;
};

export default LoaderScreen;
