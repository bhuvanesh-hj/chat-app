import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      width={"100%"}
      bg={"#E8E8E8"}
      _hover={{
        background: "#4299E1",
        color: "white",
      }}
      cursor={"pointer"}
      color={"black"}
      display={"flex"}
      alignItems={"center"}
      px={3}
      py={2}
      mb={2}
      borderRadius={"lg"}
      onClick={handleFunction}
    >
      <Avatar mr={2} src={user.pic} name={user.name} />
      <Box>
        <Text fontSize={"xl"} fontWeight={900}>
          {user.name}
        </Text>
        <Text fontSize={"s"}>
          <b>Email: </b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
