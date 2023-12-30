import {
    Box,
    Button,
    FormControl,
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
  import UserListItem from "../UserAvatar/UserListItem";
  import axios from "axios";
  import UserBadgeItem from "../UserAvatar/UserBadgeItem";
  
  const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [search, setSearch] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUser, setSelectedUser] = useState([]);
  
    const toast = useToast();
  
    const { chats, setChats, user } = ChatState();
  
    const handleSelectedUsers = (userToAdd) => {
      if (selectedUser.find((user) => user.id === userToAdd.id)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        return;
      }
      setSelectedUser([...selectedUser, userToAdd]);
    };
  
    const handleDelete = (userToDelete) => {
      setSelectedUser(
        selectedUser.filter((user) => user._id !== userToDelete._id)
      );
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
          position: "top-left",
          isClosable: true,
        });
        setLoading(false);
      }
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUser) {
        toast({
          title: "Please enter the group name & users",
          status: "warning",
          duration: 3000,
          position: "top-left",
          isClosable: true,
        });
        return;
      }
  
      try {
        setSubmitLoading(true);
  
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const { data } = await axios.post("/api/chats/group", {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u.id)),
        },config);
  
        setChats([data, ...chats]);
        setSubmitLoading(false);
        toast({
          title: "New group chat created",
          status: "success",
          duration: 3000,
          position: "top-left",
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error occurred",
          description: "failed to create group",
          status: "error",
          duration: 3000,
          position: "top-left",
          isClosable: true,
        });
        setSubmitLoading(false);
      }
    };
  
    return (
      <div>
        <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize={"xl"}
              display={"flex"}
              justifyContent={"center"}
            >
              Create new Group
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <FormControl>
                <Input
                  placeholder="Enter chat name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add users"
                  mb={3}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box
                display={"flex"}
                width={"100%"}
                justifyContent={"flex-start"}
                flexWrap={"wrap"}
                gap={1}
              >
                {selectedUser?.map((user) => (
                  <UserBadgeItem
                    key={user.id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}
              </Box>
  
              {loading ? (
                <Spinner />
              ) : (
                searchResults
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                      handleFunction={() => handleSelectedUsers(user)}
                    />
                  ))
              )}
            </ModalBody>
  
            <ModalFooter>
              <Button
                colorScheme="green"
                onClick={handleSubmit}
                isLoading={submitLoading}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  };
  
  export default GroupChatModel;
  