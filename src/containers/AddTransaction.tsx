import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

import {
  TNotification,
  NotificationInitialState,
  Source,
  INotification,
} from "../constants/interfaces";

import Notification from "../components/Notification";

// DB
import { getDocs } from "firebase/firestore";
import { db } from "../db/firebase";
import { Transaction } from "../constants/interfaces";
import { selectedSourceInitialState } from "../constants/state";

let createNewDate = new Date();

const initialState = {
  title: "",
  date: `${createNewDate.getFullYear()}-${String(
    createNewDate.getMonth() + 1
  ).padStart(2, "0")}-${String(createNewDate.getDate()).padStart(2, "0")}`,
  amount: 0,
  selectedSource: "",
};

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Transaction>(initialState);
  const [notification, setNotification] = useState<TNotification>(
    NotificationInitialState
  );
  const [allSources, setAllSources] = useState<Source[]>([]);
  const [selectedSource, setSelectedSource] = useState<Source>(
    selectedSourceInitialState
  );

  let transactionType =
    window.location.pathname.split("/")[1] === "income" ? true : false;

  const { title, amount, date } = formData;

  const throwAnError = (message: string) => {
    setNotification({
      message: message,
      active: true,
      type: "error",
    });
    setTimeout(() => {
      setNotification(NotificationInitialState);
      return;
    }, 5000);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    // Fetch all documents from Firestore
    const fetchSources = async () => {
      try {
        const sourcesSnapshot = await getDocs(collection(db, "sources"));

        const sourcesData: Source[] = [];

        sourcesSnapshot.forEach((doc) => {
          const { name, balance } = doc.data();
          sourcesData.push({
            id: doc.id,
            name,
            balance,
          });
        });

        setAllSources(sourcesData);
      } catch (err) {
        console.error("Error trying to fetch firestore data", err);
      }
    };
    fetchSources();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (selectedSource.id) {
        await addDoc(collection(db, "expenses"), {
          date,
          title,
          selectedSource: selectedSource.id,
          amount: Number(parseFloat(`${amount}`)),
          type: transactionType,
        })
          .then(() => {
            setFormData(initialState);
            setSelectedSource(selectedSourceInitialState);
          })
          .then(async () => {
            // Now update the spurce with the new income or expense
            const sourceRef = doc(db, "sources", selectedSource.id);

            await updateDoc(sourceRef, {
              balance: transactionType
                ? Number(selectedSource.balance) + Number(amount)
                : Number(selectedSource.balance) - Number(amount),
            });

            navigate("/");
          })
          .catch((err) => {
            throw new Error(err.message);
          });
      } else throwAnError("Select a Source");
    } catch (err) {
      throwAnError(`${err}`);
    }

    return;
  };

  return (
    <div className="transaction-page">
      <Notification
        message={notification.message}
        active={notification.active}
        type={notification.type}
      />
      <h5>Add {transactionType ? "Income" : "Expense"}</h5>
      <div className="select-sources">
        {allSources.map((source) => (
          <button
            onClick={() => setSelectedSource(source)}
            className={`source ${
              selectedSource
                ? selectedSource.id === source.id
                  ? "selected"
                  : "not-selected"
                : ""
            }`}
            key={source.id}
          >
            <h6>{source.name}</h6>
            <p>{source.balance}</p>
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <div className="input-block">
          <label htmlFor="title">Title</label>
          <input type="text" value={title} id="title" onChange={onChange} />
        </div>
        <div className="input-block">
          <label htmlFor="date">Date</label>
          <input type="date" value={date} id="date" onChange={onChange} />
        </div>
        <div className="input-block">
          <label htmlFor="amount">Amount</label>
          <input type="number" value={amount} id="amount" onChange={onChange} />
        </div>
        <button className="button submit-button">submit</button>
      </form>
      <button onClick={() => navigate("/")} className="button cancel-button">
        cancel
      </button>
    </div>
  );
};

export default AddTransaction;
