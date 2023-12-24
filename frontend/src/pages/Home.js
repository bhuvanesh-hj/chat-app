import React from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import Signup from "../components/Authentication/signup";
import Login from "../components/Authentication/login";

const Home = () => {
  return (
    <Container
      maxW="xl"
      centerContent
      d="flex"
      alignItems={"center"}
      justifyContent={"center"}
      mt={"20px"}
    >
      <Box id="box" bg={"whitesmoke"} w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em" >
            <Tab fontSize={'large'}>Login</Tab>
            <Tab fontSize={'large'}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;