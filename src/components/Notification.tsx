import React from "react";
import "../style/components.scss";

import { INotification, TNotification } from "../constants/interfaces";

const Notification: React.FC<INotification> = ({ type, active, message }) => {
  return (
    <div
      className={`notification ${
        active ? "notification-show" : "notification-hide"
      } ${type === "success" ? "notification-success" : "notification-error"}`}
    >
      {message}
    </div>
  );
};

export default Notification;
