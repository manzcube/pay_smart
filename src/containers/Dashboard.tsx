import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

import { db } from "../db/firebase.js";
import { auth } from "../db/firebase.js";

import { Source, Doc } from "../constants/interfaces.js";
import { signOut } from "firebase/auth";

const Dashboard: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Doc[]>([]);
  const navigate = useNavigate();
  const [allSources, setAllSources] = useState<Source[]>([]);
  let netWorthAmount = allSources.reduce((accumulator, currentValue) => {
    return Number(accumulator) + Number(currentValue.balance);
  }, 0);

  const sorted = allTransactions.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Descending order
  });

  const deleteSource = async (id: string) => {
    await deleteDoc(doc(db, "sources", id));
    const newArray = allSources.filter((source) => source.id !== id);
    setAllSources(newArray);
  };

  useEffect(() => {
    // Fetch all documents from Firestore
    const fetchExpenses = async () => {
      try {
        const expensesSnapshot = await getDocs(collection(db, "expenses"));
        const sourcesSnapshot = await getDocs(collection(db, "sources"));

        const newData: Doc[] = [];
        const sourcesData: Source[] = [];

        expensesSnapshot.forEach((doc) => {
          const { type, date, amount, title, selectedSource } = doc.data();
          newData.push({
            docId: doc.id,
            type,
            selectedSource,
            date,
            amount,
            title,
          });
        });

        sourcesSnapshot.forEach((doc) => {
          const { name, balance } = doc.data();
          sourcesData.push({
            id: doc.id,
            name,
            balance,
          });
        });

        setAllTransactions(newData);
        setAllSources(sourcesData);
      } catch (err) {
        console.error("Error trying to fetch firestore data", err);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="Dashboard">
      <div className="buttons-header">
        <button className="income" onClick={() => navigate("/add-income")}>
          Add Income
        </button>
        <button id="sign-out-button" onClick={() => signOut(auth)}>
          Sign Out
        </button>
        <button onClick={() => navigate("/add-expense")} className="expense">
          Add Expense
        </button>
      </div>
      <div className="net-worth">
        <p>net worth</p>
        <div className="net-worth-amount">
          <div>
            <span>{netWorthAmount.toFixed(2)}</span>
            <span>AUD</span>
          </div>
          <div>
            <span>{(netWorthAmount / 1.66).toFixed(2)}</span>
            <span>EUR</span>
          </div>
        </div>
      </div>
      <p className="section-title">Sources</p>
      <div className="sources">
        {allSources.map((source) => (
          <div className="source" key={source.id}>
            <button onClick={() => deleteSource(source.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="x-delete-button"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h6>{source.name}</h6>
            <p>{(source.balance / 1).toFixed(2)}</p>
          </div>
        ))}
        <Link to="/add-source" id="plus-icon">
          Add
        </Link>
      </div>
      <p className="section-title">Transactions</p>
      <div className="balance-list">
        {sorted.length
          ? allTransactions.map((item) => (
              <div className="transaction-item" key={item.docId}>
                <div>
                  <span className="date">{item.date}</span>
                  <span className="title">{item.title}</span>
                </div>

                <span className={`${item.type ? "income" : "expense"}`}>
                  {item.amount}
                </span>
              </div>
            ))
          : "No Transactions Yet"}
      </div>
    </div>
  );
};

export default Dashboard;
