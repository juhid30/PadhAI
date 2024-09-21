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

const text = `Your sample text goes here...`; // Keep your text or file content here
const tempLinks = JSON.parse(localStorage.getItem("dupliLinks")) || [];

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
            "x-rapidapi-key": "YOUR_API_KEY",
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
    <Box maxW="full" mx="auto" mt={10} p={5} border="1px" borderRadius="md" boxShadow="lg">
      <Text fontSize="2xl" mb={6} textAlign="center" fontWeight="bold">
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
          colorScheme="teal"
          size="lg"
          w="full"
          mb={4}
          _hover={{ bg: "teal.500" }}
        >
          Upload Document
        </Button>
        <Button
          onClick={handleCheckPlagiarism}
          colorScheme="blue"
          size="lg"
          w="full"
          isDisabled={!file || isRateLimited}
        >
          Check Plagiarism
        </Button>
      </Flex>

      {tempLinks.length > 0 && (
        <Box mt={6}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Plagiarism Results:
          </Text>
          <Table variant="striped" colorScheme="gray" size="md">
            <Thead>
              <Tr>
                <Th>Status</Th>
                <Th>Link</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
                {tempLinks.map((link, index) => (
                  <Tr key={index}>
                    <Td>{dupliStatus}</Td>
                    <Td isTruncated maxWidth="30%">{link}</Td>
                    <Td>
                      <Button
                        as="a"
                        href={link}
                        target="_blank"
                        colorScheme="green"
                        size="sm"
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
