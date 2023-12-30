import { ViewIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          title="Profile"
          background={"transparent"}
          icon={<Avatar size={"md"} name={user.name}></Avatar>}
          onClick={onOpen}
        />
      )}

      <Modal size={"sm"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent height={"410px"} bg={"#55696C"} rounded={"2xl"}>
          <ModalHeader
            fontSize={"40px"}
            display={"flex"}
            justifyContent={"center"}
            fontFamily={"cursive"}
          >
            <Avatar
              border={"4px"}
              borderColor={"wheat"}
              borderRadius={"full"}
              boxSize={"175px"}
              name={user.name}
              //   rounded={"25px"}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={6}
          >
            <Box
              width={"90%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              border={"1px"}
              rounded={"xl"}
              color={"white"}
              borderColor={"white"}
            >
              <Text fontSize={"5xl"} >{user.name}</Text>
            </Box>

            <Text display={{ base: "28px", md: "30px" }} fontFamily={"cursive"} color={"whitesmoke"}>
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
