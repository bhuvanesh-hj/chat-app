import React, { useState } from "react";
import { Box } from "@chakra-ui/layout";
import {
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something to search.",
        status: "warning",
        duration: 3000,
        position: "top-left",
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occurred",
        description: "Failed to load the search results",
        status: "error",
        duration: 3000,
        position: "top-left",
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  };

  const accessChats = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chats", { userId }, config);

      if (!chats.find((c) => c.id === data.id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error while fetching the chats",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "top-left",
        isClosable: true,
      });
      setLoadingChat(false);
      return;
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"#CBD5E0"}
        borderColor={"#CBD5E0"}
        width={"100%"}
        padding={"5px 10px"}
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} display={"flex"} gap={"2"} onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} p={"5px"}>
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontFamily={"cursive"} fontSize={"xx-large"}>
          CHAT APP
        </Text>
        <Box display={"flex"} gap={2}>
          <Menu>
            <MenuButton as={Button} p={4}>
              <BellIcon fontSize={"2xl"} />
            </MenuButton>
            <MenuList>
              <MenuItem>new message</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} p={4} rightIcon={<ChevronDownIcon />}>
              <Avatar
                cursor={"pointer"}
                size={"sm"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"} textAlign={"center"}>
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box pb={"2px"} mb={"10px"} display={"flex"} gap={1}>
              <Input
                type="search"
                placeholder="Search by name or email"
                value={search}
                mr={2}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} isLoading={loading}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => {
                return (
                  <UserListItem
                    key={user.id}
                    user={user}
                    handleFunction={() => accessChats(user.id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
