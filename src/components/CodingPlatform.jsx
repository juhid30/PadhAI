import React from "react";
import CodeEditor from "./CodeEditor/CodeEditor";
import { Box } from "@chakra-ui/react";

const CodingPlatform = () => {
  return (
    <>
      <div className="h-[100vh]">
        {/* <Navbar /> */}
        <div className="flex h-[90%]">
          <div className="w-[7.5%] flex flex-col ">{/* <Sidebar /> */}</div>
          <div className="bg-[#cceede] w-[92.5%] p-5">
            {/* <Box
              minH="100%"
              minW="100%"
              bg="white"
              color="gray.500"
              // theme="vs-light"
              px={6}
              py={8}
            > */}
            <CodeEditor />
            {/* </Box> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodingPlatform;
