import React from "react";
import "../style/components.scss";

type Notification = {
  message: string;
};

const Notification: React.FC<Notification> = ({ message }) => {
  return (
    <div
      className={`${
        message ? "notification notification-show" : "notification-hide"
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;
