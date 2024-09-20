import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Skill = ({ name, x, y, onClick, isClicked }) => {
  return (
    <motion.div
      className={`flex items-center justify-center rounded-full font-semibold py-3 px-6 shadow-dark cursor-pointer absolute
        lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3 xs:bg-transparent xs:text-dark xs:font-bold
        ${isClicked ? 'bg-green-500 text-light' : 'bg-red-500 text-light'}`}
      whileHover={{ scale: 1.05 }}
      initial={{ x: 0, y: 0 }}
      whileInView={{ x: x, y: y }}
      transition={{ duration: 1.5 }}
      viewport={{ once: true }}
      onClick={onClick}
    >
      {name}
    </motion.div>
  )
}

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clickedSkills, setClickedSkills] = useState([]) // Array to track clicked skills

  const handleSkillClick = (skillName) => {
    setSelectedSkill(skillName)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    if (!clickedSkills.includes(selectedSkill)) {
      setClickedSkills([...clickedSkills, selectedSkill])
    }
  }

  return (
    <>
      <h2 className='font-bold text-8xl mt-64 w-full text-center md:text-6xl md:mt-32'>Skills</h2>
      <div className='w-full h-screen relative flex items-center justify-center rounded-full bg-circularLight  lg:bg-circularLightLg  lg:h-[80vh] sm:h-[60vh] xs:h-[50vh]
        md:bg-circularLightMd 
        sm:bg-circularLightSm 
        '>
        <motion.div
          className='flex items-center justify-center rounded-full font-semibold bg-dark text-light p-8 shadow-dark cursor-pointer lg:p-6 md:p-4 xs:text-xs xs:p-2'
          whileHover={{ scale: 1.05 }}
        >
          Web
        </motion.div>

        <Skill name='CSS' x='-5vw' y='-10vw' onClick={() => handleSkillClick('CSS')} isClicked={clickedSkills.includes('CSS')} />
        <Skill name='HTML' x='-20vw' y='2vw' onClick={() => handleSkillClick('HTML')} isClicked={clickedSkills.includes('HTML')} />
        <Skill name='VanillaJS' x='20vw' y='6vw' onClick={() => handleSkillClick('VanillaJS')} isClicked={clickedSkills.includes('VanillaJS')} />
        <Skill name='ReactJS' x='0vw' y='12vw' onClick={() => handleSkillClick('ReactJS')} isClicked={clickedSkills.includes('ReactJS')} />
        <Skill name='NextJS' x='-20vw' y='-15vw' onClick={() => handleSkillClick('NextJS')} isClicked={clickedSkills.includes('NextJS')} />
        <Skill name='Firebase' x='15vw' y='-12vw' onClick={() => handleSkillClick('Firebase')} isClicked={clickedSkills.includes('Firebase')} />
        <Skill name='TailwindCSS' x='32vw' y='-5vw' onClick={() => handleSkillClick('TailwindCSS')} isClicked={clickedSkills.includes('TailwindCSS')} />
        <Skill name='NumPY' x='-32vw' y='-5vw' onClick={() => handleSkillClick('NumPY')} isClicked={clickedSkills.includes('NumPY')} />
        <Skill name='NodeJS' x='0vw' y='-20vw' onClick={() => handleSkillClick('NodeJS')} isClicked={clickedSkills.includes('NodeJS')} />
        <Skill name='ExpressJS' x='-25vw' y='18vw' onClick={() => handleSkillClick('ExpressJS')} isClicked={clickedSkills.includes('ExpressJS')} />
        <Skill name='AI/ML' x='18vw' y='18vw' onClick={() => handleSkillClick('AI/ML')} isClicked={clickedSkills.includes('AI/ML')} />

        {/* Modal */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-6 rounded-lg shadow-lg max-w-lg w-full'>
              <h2 className='text-2xl font-semibold mb-4'>{selectedSkill} Details</h2>
              <p>Details about {selectedSkill}...</p>
              <button
                className='mt-4 py-2 px-4 bg-red-500 text-white rounded-lg'
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Skills
