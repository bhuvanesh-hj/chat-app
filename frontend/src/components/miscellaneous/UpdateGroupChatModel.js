import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const toast = useToast();

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin.id !== user.id) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/group_remove",
        {
          chatId: selectedChat.id,
          userId: userToRemove.id,
        },
        config
      );
      userToRemove.id === user.id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chats/group_rename",
        {
          chatId: selectedChat.id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
      toast({
        title: "Group renamed",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    setSearch(query);

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "failed to search users",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleAddUsers = async (userToAdd) => {
    if (selectedChat.users.find((user) => user.id === userToAdd.id)) {
      toast({
        title: "User already exist",
        status: "warning",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/group_add",
        {
          chatId: selectedChat.id,
          userId: userToAdd.id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "failed to add users",
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (userToRemove) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/group_remove",
        {
          chatId: selectedChat.id,
          userId: userToRemove.id,
        },
        config
      );
      userToRemove.id === user.id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={
          <AvatarGroup size="sm" max={2}>
            {selectedChat.users.map((user) => (
              <Avatar name={user.name} key={user.id} />
            ))}
          </AvatarGroup>
        }
        bg={"transparent"}
      />

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            fontSize={"35px"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={3}
          >
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user.id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display={"flex"} gap={2}>
              <Input
                placeholder="Chat name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                varient={"solid"}
                colorScheme="green"
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            {selectedChat.groupAdmin.id === user.id && (
              <FormControl>
                <Input
                  placeholder="Add User to group"
                  type="search"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
            )}
            {loading ? (
              <Spinner />
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    handleFunction={() => handleAddUsers(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleLeaveGroup(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
