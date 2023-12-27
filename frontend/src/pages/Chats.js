import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/layout";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"91vh"}
        p={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chats;
