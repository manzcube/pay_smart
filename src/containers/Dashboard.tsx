import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

import { db } from "../db/firebase.js";
import { auth } from "../db/firebase.js";

import { TSource, Doc } from "../constants/interfaces.js";
import { signOut } from "firebase/auth";
import Source from "../components/Source";

const Dashboard: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Doc[]>([]);
  const navigate = useNavigate();
  const [allSources, setAllSources] = useState<TSource[]>([]);
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
        const sourcesData: TSource[] = [];

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
        {allSources.map((source: TSource) => (
          <Source id={source.id} name={source.name} balance={source.balance} />
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
