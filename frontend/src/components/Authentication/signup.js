import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [mobileNumber, setMobileNumber] = useState();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !mobileNumber) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, password, email, mobileNumber },
        config
      );

      toast({
        title: "Registered user successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      localStorage.setItem("userInfo", JSON.stringify(data.data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      console.log(error);

      toast({
        title: "Error occurred",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };

  return (
    <VStack>
      <FormControl color={"black"} id="name" isRequired>
        <FormLabel fontWeight={"700"}>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl color={"black"} id="email" isRequired>
        <FormLabel fontWeight={"700"}>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl color={"black"} id="mobile_number" isRequired>
        <FormLabel fontWeight={"700"}>Mobile number</FormLabel>
        <Input
          type="tel"
          placeholder="Enter your Mobile number"
          onChange={(e) => setMobileNumber(e.target.value)}
        />
      </FormControl>
      <FormControl color={"black"} id="password" isRequired>
        <FormLabel fontWeight={"700"}>Password</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        style={{ backgroundColor: "rgb(55,80,250)" }}
        color={"white"}
        fontSize={"xl"}
        w={"100%"}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;
