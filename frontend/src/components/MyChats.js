import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../config/ChatLogic";
import GroupChatModel from "./miscellaneous/GroupChatModel";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chats", config);

      setChats(data);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "failed to load the chats",
        status: "error",
        duration: 3000,
        position: "top-left",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  console.log(chats);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      overflow={"hidden"}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        display={"flex"}
        // position={"relative"}
        alignItems={"center"}
        justifyContent={"space-between"}
        pb={3}
        px={3}
        fontFamily={"sans-serif"}
        width={"100%"}
        fontSize={{ base: "28px", md: "30px" }}
      >
        My Chats
        <GroupChatModel>
          <Button display={"flex"} justifyContent={"space-around"} gap={2}>
            <i class="fas fa-users" style={{ fontSize: "25px" }}></i> New Group
          </Button>
        </GroupChatModel>
      </Box>
      <hr style={{ margin: "5px 0 5px 0" }} />
      <Box
        display={"flex"}
        flexDirection={"column"}
        p={3}
        bg={"#F8F8F8"}
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                key={chat.id}
                px={3}
                py={2}
                borderRadius={"lg"}
                display={"flex"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                gap={3}
              >
                <Avatar
                  name={
                    chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat.users)
                  }
                />

                <Box width={"100%"}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Text fontSize={"larger"} fontWeight={900}>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    <Text fontSize={"smaller"}>
                      {chat.updatedAt
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}
                    </Text>
                  </Box>
                  <Box display={"flex"} justifyContent={"space-between"}>
                    <Text display={"flex"}>
                      <Text fontWeight={700}>
                        {chat.latestMessage
                          ? chat.latestMessage.sender.id === user.id
                            ? "you :"
                            : chat.latestMessage.sender.name + " :"
                          : ""}
                      </Text>
                      <Text overflowWrap={"anywhere"}>
                        {chat?.latestMessage?.content}
                      </Text>
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
