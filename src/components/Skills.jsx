import React, { useState } from "react";
import { motion } from "framer-motion";
import { topics } from "../assets/quizData";

const Skill = ({ name, x, y, onClick, isClicked }) => {
  return (
    <motion.div
      className={`flex items-center justify-center rounded-full font-semibold py-3 px-6 shadow-dark cursor-pointer absolute
        lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3 xs:bg-transparent xs:text-dark xs:font-bold
        ${isClicked ? "bg-green-500 text-light" : "bg-red-500 text-light"}`}
      whileHover={{ scale: 1.05 }}
      initial={{ x: 0, y: 0 }}
      whileInView={{ x: x, y: y }}
      transition={{ duration: 1.5 }}
      viewport={{ once: true }}
      onClick={onClick}
    >
      {name}
    </motion.div>
  );
};

const Skills = () => {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedSkills, setClickedSkills] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentTopic = topics[currentTopicIndex];

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
    setQuizIndex(0); // Start quiz from the first question
    setQuizCompleted(false);
    setSelectedOption(null); // Reset option selection
  };

  const handleQuizAnswer = (option) => {
    setSelectedOption(option); // Set the selected option
    if (selectedSkill.quiz[quizIndex].answer === option) {
      setIsCorrect(true); // Mark as correct
    } else {
      setIsCorrect(false); // Mark as incorrect
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < selectedSkill.quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null); // Reset the selected option for the next question
      setIsCorrect(false); // Reset correctness
    } else {
      setQuizCompleted(true); // Mark the quiz as completed
      setClickedSkills([...clickedSkills, selectedSkill.name]); // Mark skill as completed
      setIsModalOpen(false); // Close modal when quiz finishes
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNextTopic = () => {
    setCurrentTopicIndex((prevIndex) => (prevIndex + 1) % topics.length);
  };

  const handlePreviousTopic = () => {
    setCurrentTopicIndex(
      (prevIndex) => (prevIndex - 1 + topics.length) % topics.length
    );
  };

  return (
    <>
      <div className="w-[100%] flex items-center justify-center">
        <div className="w-[70%] h-[100%] ">
          <h2 className="font-bold text-8xl w-full text-center md:text-6xl md:mt-2">
            {currentTopic.name}
          </h2>
          <div
            className="w-full h-[80%] relative flex items-center justify-center rounded-full bg-circularLight lg:bg-circularLightLg lg:h-[80vh] sm:h-[60vh] xs:h-[50vh]
          md:bg-circularLightMd 
          sm:bg-circularLightSm"
          >
            <motion.div
              className="flex items-center justify-center rounded-full font-semibold bg-dark text-light p-8 shadow-dark cursor-pointer lg:p-6 md:p-4 xs:text-xs xs:p-2"
              whileHover={{ scale: 1.05 }}
            >
              {currentTopic.name}
            </motion.div>

            {currentTopic.subtopics.map((subtopic, index) => (
              <Skill
                key={index}
                name={subtopic.name}
                x={subtopic.x}
                y={subtopic.y}
                onClick={() => handleSkillClick(subtopic)}
                isClicked={clickedSkills.includes(subtopic.name)}
              />
            ))}

            {/* Modal */}
            {isModalOpen && selectedSkill && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex justify-center items-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full relative">
                  {/* Quiz Title */}
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    {selectedSkill.name} Quiz
                  </h2>

                  {quizCompleted ? (
                    <p className="text-green-600 font-bold text-center">
                      Quiz completed! This skill is now marked as completed.
                    </p>
                  ) : (
                    <>
                      {/* Question */}
                      <p className="font-medium text-lg mb-4">
                        {quizIndex + 1}.{" "}
                        {selectedSkill.quiz[quizIndex].question}
                      </p>

                      {/* Options */}
                      <div className="mt-4">
                        {selectedSkill.quiz[quizIndex].options.map(
                          (option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(option)}
                              className={`block py-2 px-4 mb-2 w-full rounded-lg text-left font-semibold 
                              ${
                                selectedOption === option &&
                                option === selectedSkill.quiz[quizIndex].answer
                                  ? "bg-green-500 text-white" // Correct answer
                                  : selectedOption === option
                                  ? "bg-red-500 text-white" // Wrong answer
                                  : "bg-gray-200 text-gray-900"
                              } // Default state
                                transition duration-300`}
                            >
                              {option}
                            </button>
                          )
                        )}
                      </div>
                    </>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-between items-center mt-8">
                    <button
                      className="py-2 px-6 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                      onClick={handleCloseModal}
                    >
                      Close
                    </button>
                    {!quizCompleted && (
                      <button
                        className={`py-2 px-6 rounded-lg font-semibold transition duration-300
                      ${
                        selectedOption === null
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }
                        `}
                        onClick={handleNextQuestion}
                        disabled={selectedOption === null} // Disable Next button if no option selected
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8">
            <button
              className="mx-4 py-2 px-6 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
              onClick={handlePreviousTopic}
            >
              Previous
            </button>
            <button
              className="mx-4 py-2 px-9 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
              onClick={handleNextTopic}
            >
              Next
            </button>
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default Skills;
