import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text
} from "@chakra-ui/react";

const text = `React (also known as React.js or ReactJS) is a free and open-source front-end JavaScript library for building user interfaces based on components by Facebook Inc. It is maintained by Meta (formerly Facebook) and a community of individual developers and companies.

React can be used to develop single-page, mobile, or server-rendered applications with frameworks like Next.js. Because React is only concerned with the user interface and rendering components to the DOM, React applications often rely on libraries for routing and other client-side functionality. A key advantage of React is that it only rerenders those parts of the page that have changed, avoiding unnecessary rerendering of unchanged DOM elements. It was first launched on 29 May 2013.

Notable features
Declarative
React adheres to the declarative programming paradigm. Developers design views for each state of an application, and React updates and renders components when data changes. This is in contrast with imperative programming.

Components
React code is made of entities called components. These components are modular and reusable. React applications typically consist of many layers of components. The components are rendered to a root element in the DOM using the React DOM library. When rendering a component, values are passed between components through props (short for "properties"). Values internal to a component are called its state.

The two primary ways of declaring components in React are through function components and class components.

Function components
Function components are declared with a function (using JavaScript function syntax or an arrow function expression) that accepts a single "props" argument and returns JSX. From React v16.8 onwards, function components can use state with the useState Hook.

React Hooks
On February 16, 2019, React 16.8 was released to the public, introducing React Hooks. Hooks are functions that let developers "hook into" React state and lifecycle features from function components. Notably, Hooks do not work inside classes — they let developers use more features of React without classes.

React provides several built-in hooks such as useState, useContext, useReducer, useMemo, and useEffect. Others are documented in the Hooks API Reference. useState and useEffect, which are the most commonly used, are for controlling state and side effects, respectively.

Rules of hooks
There are two rules of hooks which describe the characteristic code patterns that hooks rely on:

1.⁠ ⁠"Only call hooks at the top level" — don't call hooks from inside loops, conditions, or nested statements so that the hooks are called in the same order each render.
2.⁠ ⁠"Only call hooks from React functions" — don't call hooks from plain JavaScript functions so that stateful logic stays with the component.

Server components
React server components or "RSC"s are function components that run exclusively on the server. Though a similar concept to Server Side Rendering, RSCs do not send corresponding JavaScript to the client as no hydration occurs. As a result, they have no access to hooks. However, they may be asynchronous functions, allowing them to directly perform asynchronous operations.`;

const PlagiarismChecker = () => {
  const [file, setFile] = useState(null);
  const [dupliLinks, setDupliLinks] = useState([]);
  const [dupliStatus, setDupliStatus] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = () => {
    if (!file) {
      return toast({
        title: "No file selected.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    toast({
      title: "Document Uploaded.",
      description: "You can now check for plagiarism.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCheckPlagiarism = async () => {
    if (!file || isRateLimited) return;

    try {
      const response = await axios.post(
        "https://plagiarism-source-checker-with-links.p.rapidapi.com/data",
        { text },
        {
          headers: {
            "x-rapidapi-key": "0350b0f7afmshb7a4d943445f8abp167c28jsna99ba897b14b",
            "x-rapidapi-host": "plagiarism-source-checker-with-links.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Plagiarism Check Complete.",
        description: "Results have been retrieved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const links = response.data.duplicate_content_found_on_links || [];
      console.log(links);
      setDupliLinks(links);
      setDupliStatus(response.data.status);
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true);
        toast({
          title: "Rate Limited.",
          description: "Try again in a minute.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => setIsRateLimited(false), 60000);
      } else {
        toast({
          title: "Error checking plagiarism.",
          description: "Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box mx="auto" mt={10} p={5} border="1px" borderRadius="md" boxShadow="lg" className="w-[70%]">
      <Text fontSize="5xl" mb={6} textAlign="center" fontWeight="bold">
        Plagiarism Checker
      </Text>

      <Flex direction="column" align="center" justify="center" mb={4}>
        <Input
          type="file"
          accept=".txt,.doc,.pdf"
          onChange={handleFileChange}
          mb={4}
          w="full"
        />
        <Button
          onClick={handleUpload}
          colorScheme="purple"
          size="lg"
          w="full"
          mb={4}
          _hover={{ bg: "purple.300" }}
        >
          Upload Document
        </Button>
        <Button
          onClick={handleCheckPlagiarism}
          colorScheme="purple"
          size="lg"
          w="full"
          isDisabled={!file || isRateLimited}
          _hover={{ bg: "purple.300" }}
        >
          Check Plagiarism
        </Button>
      </Flex>

      {dupliLinks.length > 0 && (
        <Box mt={6} overflowX="auto">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Plagiarism Results:
          </Text>
          <Table variant="striped" colorScheme="purple" size="sm" className="w-full">
            <Thead>
              <Tr>
                <Th fontSize="sm">Status</Th>
                <Th fontSize="sm">Link</Th>
                <Th fontSize="sm">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dupliLinks.map((link, index) => (
                <Tr key={index}>
                  <Td fontSize="sm">{dupliStatus}</Td>
                  <Td fontSize="sm" isTruncated maxWidth="30%">{link}</Td>
                  <Td>
                    <Button
                      as="a"
                      href={link}
                      target="_blank"
                      colorScheme="purple"
                      size="sm"
                      _hover={{ bg: "purple.300" }}
                    >
                      Visit
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default PlagiarismChecker;
