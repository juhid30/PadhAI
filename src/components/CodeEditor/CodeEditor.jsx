import { useRef, useState, useEffect } from "react";
import { Box, Stack, useBreakpointValue, Button, Text } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, WRONG_CODE_SNIPPETS } from "./constants";
import Output from "./Output";
import { ref, onValue, update } from "firebase/database"; // Firebase Realtime Database imports
import { realtimeDb } from "../../../firebase"; // Your Firebase config

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isDSAMode, setIsDSAMode] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [currentDebugIndex, setCurrentDebugIndex] = useState(0); // Track the current wrong code snippet
  const [showNextButton, setShowNextButton] = useState(false); // Track whether to show the "Next" button
  const [isSuccess, setIsSuccess] = useState(false); // Track success from the database

  const debugRunRefPath = "debug_runs/-O7DvYO6LaeU_3BZyzVm"; // Firebase reference to monitor

  // Determine if the layout should be horizontal (HStack) or vertical (VStack)
  const isVerticalLayout = useBreakpointValue({ base: true, md: false });

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    if (isDSAMode) {
      setValue(CODE_SNIPPETS[language]); // Set value if in DSA mode
    } else if (isDebugMode) {
      setValue(WRONG_CODE_SNIPPETS[language][currentDebugIndex]); // Load the wrong code in Debug mode
    } else {
      setValue(""); // Clear value if not in DSA or Debug mode
    }
  };

  const handleModeClick = (mode) => {
    if (mode === "DSA") {
      setIsDSAMode(true);
      setIsDebugMode(false);
      setValue(CODE_SNIPPETS[language]); // Set default value when switching to DSA mode
    } else if (mode === "Debug") {
      setIsDebugMode(true);
      setIsDSAMode(false);
      setValue(WRONG_CODE_SNIPPETS[language][currentDebugIndex]); // Load the first wrong code snippet
      setShowNextButton(false); // Hide the "Next" button when starting a new debug session
      // Fetch initial success state from Firebase
      checkFirebaseSuccess();
    }
  };

  // Fetch the success state from Firebase Realtime Database
  const checkFirebaseSuccess = () => {
    const successRef = ref(realtimeDb, debugRunRefPath);
    onValue(successRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.success) {
        setIsSuccess(true);
        setShowNextButton(true); // Show "Next" button if success is true
      } else {
        setIsSuccess(false);
        setShowNextButton(false);
      }
    });
  };

  const handleRunCode = () => {
    // Simulate running the code and checking if it works
    const sourceCode = editorRef.current.getValue();
    const isCorrect = runCodeAndCheckIfCorrect(sourceCode); // Simulated function

    if (isCorrect) {
      // If code is correct, update Firebase with success = true
      const successRef = ref(realtimeDb, debugRunRefPath);
      update(successRef, { success: true });
    } else {
      alert("The code is incorrect. Please fix the errors.");
    }
  };

  const handleNextClick = () => {
    // Update Firebase with success = false before moving to next
    const successRef = ref(realtimeDb, debugRunRefPath);
    update(successRef, { success: false });

    // Move to the next wrong code snippet
    const nextIndex = (currentDebugIndex + 1) % WRONG_CODE_SNIPPETS[language].length;
    setCurrentDebugIndex(nextIndex); // Move to the next wrong code snippet
    setValue(WRONG_CODE_SNIPPETS[language][nextIndex]); // Load the new wrong code snippet
    setShowNextButton(false); // Hide the "Next" button until the new code is fixed
  };

  useEffect(() => {
    if (isDebugMode) {
      checkFirebaseSuccess();
    }
  }, [isDebugMode]);

  return (
    <Box theme="vs-light" w="100%" p={4}>
      <Stack
        direction={isVerticalLayout ? "column" : "row"}
        spacing={4}
        w="100%"
      >
        <Box w={isVerticalLayout ? "100%" : "50%"}>
          <Stack direction="row" spacing={2} mb={4}>
            <Button colorScheme="teal" onClick={() => handleModeClick("DSA")}>
              DSA
            </Button>
            <Button colorScheme="orange" onClick={() => handleModeClick("Debug")}>
              Debug
            </Button>
            <LanguageSelector language={language} onSelect={onSelect} />
          </Stack>
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="70vh"
            theme="vs-light"
            language={language}
            defaultValue={isDSAMode ? CODE_SNIPPETS[language] : ""}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Box w={isVerticalLayout ? "100%" : "50%"}>
          <Output
            editorRef={editorRef}
            language={language}
            isDSAMode={isDSAMode}
            isDebugMode={isDebugMode}
          />
          {/* Show "Next" button only if success is true */}
          {isDebugMode && showNextButton && (
            <Button onClick={handleNextClick} mt={4} colorScheme="green">
              Next
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

// Simulate running the code and checking if it is correct
const runCodeAndCheckIfCorrect = (sourceCode) => {
  // You can add logic here to run the code in a sandboxed environment or use APIs to validate the code
  // For simplicity, we'll simulate that the code is always correct
  return true;
};

export default CodeEditor;
