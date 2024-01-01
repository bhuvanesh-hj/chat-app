import React from "react";
import { useHistory } from "react-router-dom";

const { createContext, useContext, useState, useEffect } = require("react");

const chatContext = createContext();

const ContextProvider = ({ children }) => {
  let history = useHistory();
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    useContext ? setUser(userInfo) : history.push("/");
  }, [history]);

  return (
    <chatContext.Provider
      value={{ user, setUser, chats, setChats, setSelectedChat, selectedChat }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(chatContext);
};

export default ContextProvider;
