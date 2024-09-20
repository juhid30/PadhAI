import { useState } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "./api";
import { ref, update } from "firebase/database";
import { realtimeDb } from "../../../firebase"; // Import your Firebase config
import { dsaQuestions } from "./dsaQuestions";

const Output = ({ editorRef, language, isDSAMode, isDebugMode }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = dsaQuestions;

  const currentQuestion = questions[currentQuestionIndex];

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      const outputLines = result.output.split("\n");
      setOutput(outputLines);
      const userOutput = outputLines[0].trim();

      // DSA Mode: Check if the user's output matches the expected output
      if (isDSAMode) {
        if (userOutput === currentQuestion.expectedOutput) {
          toast({
            title: "Success!",
            description: "Your code produced the correct output.",
            status: "success",
            duration: 6000,
          });
          // Move to the next question if available
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            toast({
              title: "All questions completed!",
              status: "info",
              duration: 6000,
            });
          }
        } else {
          toast({
            title: "Incorrect Output.",
            description: `Expected: ${currentQuestion.expectedOutput}, but got: ${userOutput}`,
            status: "error",
            duration: 6000,
          });
          setIsError(true);
        }
      }

      // Debug mode: Log success to Firebase Realtime Database
      if (isDebugMode && !result.output.includes("Error")) {
        const specificRef = ref(realtimeDb, "debug_runs/-O7DvYO6LaeU_3BZyzVm"); // Define the reference

        // Update the existing entry
        await update(specificRef, {
          code: sourceCode,
          language: language,
          timestamp: new Date().toISOString(),
          success: true,
        });

        toast({
          title: "Success!",
          description: "Code ran successfully in Debug Mode and updated the existing entry.",
          status: "success",
          duration: 6000,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="100%" className="cursor-default">
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Button
        variant="outline"
        mb={4}
        bg="#0dab95"
        isLoading={isLoading}
        onClick={runCode}
      >
        Run Code
      </Button>

      {/* Conditionally render either the DSA mode questions or a debug message */}
      {isDSAMode && currentQuestion && (
        <Box bg="gray.100" p={4} borderRadius="md" mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            Question:
          </Text>
          <Text>{currentQuestion.question}</Text>
          <Text fontSize="lg" fontWeight="bold" mt={4}>
            Sample Input:
          </Text>
          <Text>{currentQuestion.sampleInput}</Text>
        </Box>
      )}

      {/* Show debug message if in Debug Mode */}
      {isDebugMode && (
        <Box bg="gray.100" p={4} borderRadius="md" mb={4}>
          <Text fontSize="lg" fontWeight="bold" color="blue.500">
            Debug Mode:
          </Text>
          <Text>Debug the given code and make it run without errors.</Text>
        </Box>
      )}

      <Box
        height="50vh"
        p={2}
        bg="white"
        color={isError ? "red.400" : "gray"}
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

export default Output;
