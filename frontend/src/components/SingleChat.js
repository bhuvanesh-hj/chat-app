import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonText,
  Spinner,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, ArrowLeftIcon, MinusIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import ScrollableChats from "./ScrollableChats";
import axios from "axios";
import "./style.css";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:4000"; //3.108.252.43
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnection, setSocketConnection] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios(`/api/message/${selectedChat.id}`, config);

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat.id);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "failed to load the messages",
        status: "error",
        duration: 3000,
        position: "top-left",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSend = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat.id,
            isImage: image,
          },
          config
        );

        setNewMessage("");
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
        {
          image && setImage(!image);
        }
      } catch (error) {
        toast({
          title: "Error occurred",
          description: "failed to load the messages",
          status: "error",
          duration: 3000,
          position: "top-left",
          isClosable: true,
        });
      }
    }
  };

  const postDetails = (pics) => {
    setImageLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat-App");
      data.append("cloud_name", "dtuyjsekb");
      fetch("https://api.cloudinary.com/v1_1/dtuyjsekb/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setNewMessage(data.url.toString());
          console.log(data.url.toString());
          setImageLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setImageLoading(false);
      return;
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnection(true));
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare.id !== newMessageReceived.chat.id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="sans-serif"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowLeftIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <Box
                display={"flex"}
                fontFamily={"sans-serif"}
                gap={3}
                alignItems={"center"}
              >
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                {getSender(user, selectedChat.users)}
              </Box>
            ) : (
              <Box
                display={"flex"}
                fontFamily={"sans-serif"}
                gap={3}
                alignItems={"center"}
              >
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  fetchMessages={fetchMessages}
                  setFetchAgain={setFetchAgain}
                />
                {selectedChat.chatName.toUpperCase()}
              </Box>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <SkeletonText
                mt="4"
                mb="4"
                noOfLines={10}
                spacing="4"
                skeletonHeight="6"
              />
            ) : (
              <div className="messages">
                <ScrollableChats messages={messages} />
              </div>
            )}
            <Box display={"flex"} alignItems={"center"} gap={2}>
              {/* <Switch
                onChange={() => setImage(!image)}
                display={"flex"}
                mx={2}
                mt={2}
                alignItems={"center"}
              /> */}
              <Menu>
                {({ isOpen }) => (
                  <>
                    <MenuButton
                      isActive={isOpen}
                      as={Button}
                      mb={-3}
                      bg={"#805AD5"}
                      color={"white"}
                      _hover={{ bg: "#E9D8FD", color: "black" }}
                    >
                      {isOpen ? <MinusIcon /> : <AddIcon />}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setImage(false)}>Text</MenuItem>
                      <MenuItem onClick={() => setImage(true)}>Image</MenuItem>
                      <MenuItem>Video</MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu>
              {image ? (
                <FormControl
                  width={"100%"}
                  onKeyDown={handleSend}
                  mt={3}
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    id="pic"
                    border={"1px"}
                    rounded={"lg"}
                    placeholder="Select an image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                  />
                  {imageLoading && <Spinner mx={2} />}
                </FormControl>
              ) : (
                <FormControl width={"100%"} onKeyDown={handleSend} mt={3}>
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    border={"1px"}
                    rounded={"lg"}
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </FormControl>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          width={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"100%"}
        >
          <Text fontSize={"3xl"} fontFamily={"sans-serif"}>
            Click on user to start chatting{" "}
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
