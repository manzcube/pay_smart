import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { collection, addDoc } from "firebase/firestore";
import Notification from "../components/Notification";

// DB
import { db } from "../db/firebase";
import {
  NotificationInitialState,
  SourceFormData,
  TNotification,
} from "../constants/interfaces";

import { sourceInitialState } from "../constants/state";

const AddSource: React.FC = () => {
  const [formData, setFormData] = useState<SourceFormData>(sourceInitialState);
  const navigate = useNavigate();
  const [notification, setNotification] = useState<TNotification>(
    NotificationInitialState
  );
  const { name, balance } = formData;

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const throwAnError = (message: string) => {
    setNotification({
      message: message,
      type: "error",
      active: true,
    });
    setTimeout(() => {
      setNotification(NotificationInitialState);
      return;
    }, 5000);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "sources"), {
        name,
        balance,
      })
        .then(() => navigate("/"))
        .catch((err) => {
          throw new Error(err.message);
        });
    } catch (err) {
      throwAnError(`${err}`);
    }

    return;
  };

  return (
    <div className="add-source">
      <Notification
        active={notification.active}
        message={notification.message}
        type={notification.type}
      />

      <h5>Add Source</h5>
      <form onSubmit={onSubmit}>
        <div className="input-block">
          <label htmlFor="name">Name</label>
          <input type="text" value={name} id="name" onChange={onChange} />
        </div>
        <div className="input-block">
          <label htmlFor="balance">Balance</label>
          <input
            type="number"
            value={balance}
            id="balance"
            onChange={onChange}
          />
        </div>
        <button className="button submit-button">submit</button>
      </form>
      <button className="button cancel-button" onClick={() => navigate("/")}>
        cancel
      </button>
    </div>
  );
};

export default AddSource;
