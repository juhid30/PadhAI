from flask import Flask, request, jsonify
import fitz  # PyMuPDF
import requests
from PIL import Image
import base64
import io
import google.generativeai as genai
import json
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

genai.configure(api_key="AIzaSyCVOV_MuOdKNFYVTQOzjtjpSDqL73FspW8")

COPYLEAKS_EMAIL = 'test.juhid30@example.com'  # Replace with your Copyleaks account email
COPYLEAKS_API_KEY = 'a67ab3ee-6d33-4824-9b02-b0376edd5a43'          # Replace with your Copyleaks API key
COPYLEAKS_API_URL = 'https://api.copyleaks.com/v3/'

def input_pdf_setup(file_content):
    pdf_document = fitz.open(stream=file_content, filetype="pdf")
    
    first_page = pdf_document[0]

    pix = first_page.get_pixmap()

    img_byte_arr = io.BytesIO()
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    img.save(img_byte_arr, format='JPEG')

    img_byte_arr = img_byte_arr.getvalue()

    pdf_parts = [
        {
            "mime_type": "image/jpeg",
            "data": base64.b64encode(img_byte_arr).decode()  # Convert to base64 string
        }
    ]

    # Return the encoded image data
    return pdf_parts

def clean_json_string(response):
    # Remove the backticks and 'json' tag
    cleaned_response = response.replace("```json", "").replace("```", "")

    cleaned_response = cleaned_response.strip()

    try:
        json_data = json.loads(cleaned_response)
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        return None
    
    return json_data


def get_gemini_response(input_text, pdf_content, prompt):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([input_text, pdf_content[0], prompt])
    return response.text


input_prompt1 = """
 You are an experienced Technical Human Resource Manager, your task is to review the provided resume against the job description.
 Please share your professional evaluation on whether the candidate's profile aligns with the role.
 Summarize the candidate’s key qualifications and experience relevant to the job description.
 Highlight the skills, experience, and attributes that make the candidate a good fit for the role, based on both the resume and the candidate's response.
 Also, point out any potential gaps or areas that may require further exploration during the interview process.
 Give a rating to this resume against the job description. I want the response in the given JSON format:
 Example:
 {
  "resume_evaluation": {
    "summary": "A brief summary of the candidate's overall qualifications and experience.",
    "key_qualifications_and_experience": {
      "technical_skills": [
        "Skill 1",
        "Skill 2",
        "Skill 3"
      ],
      "relevant_expertise": "A description of the candidate's expertise related to the job description.",
      "project_experience": [
        "Project 1",
        "Project 2",
        "Project 3"
      ],
      "leadership_and_teamwork": "Details of the candidate's leadership and teamwork experience."
    },
    "strengths": {
      "technical_foundation": "Explanation of the candidate's technical strengths and adaptability.",
      "project_oriented": "Details about how the candidate has demonstrated practical experience through projects.",
      "leadership_and_communication": "A summary of the candidate's leadership and communication skills."
    },
    "potential_gaps_or_areas_for_exploration": {
      "specific_responsibilities": "Possible areas where more information is needed regarding the candidate’s responsibilities or contributions.",
      "quantifiable_metrics": "Suggestions for including metrics or achievements that can be used to quantify the candidate's impact."
    },
    "rating": {
      "overall_alignment": "A summary of how well the candidate's qualifications match the job description.",
      "score": "Numerical rating of the candidate's fit for the role.",
      "max_score": "Maximum possible rating."
    }
  }
}
"""

def get_gemini_response_for_text(input,text,prompt):
    model=genai.GenerativeModel('gemini-pro')
    response=model.generate_content([input,text,prompt])
    return response.text

input_prompt2 = "I am giving you a text field. With respect to the job description given, I had asked the candidate why does he consider himself as a good fit for the role. The content of the text I am going to give is an answer to my question. I want you to rate the answer out of 5 with a reason for the same. Give it in json format."

def compare_jobs(job1, job2, prompt):
  # get_gemini_response()
  print("HELLO")
  resume_analysis = """
  {
  "response": {
    "resume_evaluation": {
        "key_qualifications_and_experience": {
            "leadership_and_teamwork": "Jash has a strong history of leadership and teamwork, evident in his roles as Web Team member, Junior Committee member, and President of student organizations. He also volunteered for the Faculty Development Program on 'Training Teachers for Artificial Intelligence in Schools.'",
            "project_experience": [
                "Vidyarthi - Student Experience Platform",
                "Tarakki - Campus Placement Scheduler",
                "Forge Finance - Financial Literacy for Beginners",
                "INNOVS 2.0",
                "Newbiethon",
                "Technotion",
                "Best Performer, Competitive Coding",
                "Adrubotics"
            ],
            "relevant_expertise": "Jash has proven experience in building and maintaining web applications using modern frontend frameworks and backend technologies. He has a good understanding of database management and is comfortable working in agile development environments.",
            "technical_skills": [
                "ReactJS",
                "NodeJS",
                "MongoDB",
                "HTML",
                "CSS",
                "TailwindCSS",
                "VanillaJS",
                "Three.JS",
                "Java",
                "Python",
                "C",
                "OOP",
                "Illustrator",
                "Figma",
                "SEO",
                "Digital Marketing",
                "MS Office"
            ]
        },
        "potential_gaps_or_areas_for_exploration": {
            "quantifiable_metrics": "Encouraging Jash to quantify his accomplishments with metrics whenever possible will strengthen his resume. For instance, providing statistics about user engagement, project completion time, or impact on specific business goals.",
            "specific_responsibilities": "During the interview, it would be beneficial to delve deeper into Jash's specific responsibilities and contributions within each project. For example, asking questions about his role in the development process, his contributions to specific features, or any challenges he faced during these projects."
        },
        "rating": {
            "max_score": "10",
            "overall_alignment": "Jash's skills and experience strongly align with the requirements of the job description. His proven ability to develop and maintain web applications using modern technologies, coupled with his leadership and teamwork skills, make him a promising candidate.",
            "score": "8.5"
        },
        "strengths": {
            "leadership_and_communication": "Jash has demonstrated strong leadership and communication skills through his involvement in various organizations and his ability to coordinate and collaborate with team members. His volunteer work suggests he has a desire to contribute to a larger purpose and effectively communicate his ideas to others.",
            "project_oriented": "Jash has a track record of successfully completing projects with clear deliverables. His experience in managing complex projects, such as Vidyarthi, showcases his ability to work independently and deliver results under tight deadlines.",
            "technical_foundation": "Jash demonstrates a strong grasp of frontend technologies and has experience working with backend systems, making him well-equipped to handle a variety of web development tasks."
        },
        "summary": "Jash Rashne presents a strong candidate profile with demonstrated experience in web development and technical project management. He has a solid foundation in frontend technologies and has worked on several projects involving ReactJS, NodeJS, and MongoDB. His leadership and teamwork skills are evident through his involvement in various organizations and roles."
  }
  }
  }"""

  model = genai.GenerativeModel('gemini-pro')
  response = model.generate_content([resume_analysis, job1, job2, compare_prompt])
  return response.text

compare_prompt = """You are an experienced Technical Human Resource Manager. Your task is to review the provided resume
    against two different job descriptions. Based on the alignment of the resume with each job description,
    provide a comparative analysis of which job is better suited for the candidate's profile.
    
    For each job description, provide:
    - A summary of how well the resume matches the job description.
    - Key qualifications and experience that align with the job requirements.
    - Any potential gaps or areas where the resume might not meet the job expectations.

    Compare the two job descriptions and provide:
    - An overall recommendation on which job description is a better fit for the resume.
    - A detailed reason for your recommendation.

    Format the response as a JSON object with the following structure:
    {
      "job_comparison": {
        "job1": {
          "summary": "Summary of how well the resume matches Job Description 1.",
          "key_qualifications_and_experience": "Key qualifications and experience for Job 1.",
          "potential_gaps_or_areas_for_exploration": "Potential gaps for Job 1."
        },
        "job2": {
          "summary": "Summary of how well the resume matches Job Description 2.",
          "key_qualifications_and_experience": "Key qualifications and experience for Job 2.",
          "potential_gaps_or_areas_for_exploration": "Potential gaps for Job 2."
        },
        "recommendation": {
          "better_fit": "Job 1 or Job 2",
          "reason": "Detailed reason why this job is a better fit."
        }
      }
    }
    """

def get_suggestions_and_resources(input, prompt):
  model = genai.GenerativeModel("gemini-pro")
  response = model.generate_content([input, prompt])
  return response.text
  
prompt_for_resource = """You are an interviewer who has just finished conducting an interview with a candidate. Based on their performance, you want to provide some constructive feedback and suggestions to help them improve their skills for future opportunities. 

Please generate a set of personalized suggestions for the candidate. Each suggestion should be:
1. Specific and actionable
2. Presented in a positive and encouraging tone
3. Accompanied by a curated list of valuable learning resources

For each suggestion, provide:
- A clear, motivating piece of advice that inspires the candidate to enhance their skills
- 5 high-quality learning resources (such as online courses, expert blog posts, insightful videos, or books) that will help the candidate improve in that specific area

Format the response as a JSON object with the following structure:

{
  "suggestions": [
    {
      "advice": "Your encouraging suggestion here",
      "resources": [
        {
          "title": "Title of the first resource",
          "link": "URL to a highly relevant and valuable resource"
        },
        {
          "title": "Title of the second resource",
          "link": "URL to another highly relevant and valuable resource"
        },
        {
          "title": "Title of the third resource",
          "link": "URL to a third highly relevant and valuable resource"
        },
        {
          "title": "Title of the fourth resource",
          "link": "URL to a fourth highly relevant and valuable resource"
        },
        {
          "title": "Title of the fifth resource",
          "link": "URL to a fifth highly relevant and valuable resource"
        }
      ]
    }
  ]
}

Ensure that the advice sounds natural and personable, as if coming from a supportive interviewer who genuinely wants to help the candidate succeed in their career journey.
"""

def get_user_details( pdf_content, prompt):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([ pdf_content[0], prompt])
    return response.text

prompt_for_details = """
 Extract the following details from the resume text:
    - Name
    - LinkedIn link
    - Contact number

    Return the details in the following JSON format:
    {
        "profile": {
            "name": "Name extracted from resume",
            "linkedin_link": "LinkedIn link extracted from resume",
            "contact_no": "Contact number extracted from resume"
        }
    }

"""


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    # Read the uploaded file content as bytes
    file_content = file.read()
    
    # Process the PDF to get the first page as a base64-encoded image
    pdf_parts = input_pdf_setup(file_content)

    # Get the generative AI response
    response = get_gemini_response(input_prompt1, pdf_parts, "Web development")
    details = get_user_details(pdf_parts, prompt_for_details )
    # Return the response from the AI
    return jsonify({"response": clean_json_string(response), "details":clean_json_string(details)})


@app.route('/upload_text', methods=['POST'])
def upload_text():
    # Extract text from the request
    input_text = request.form.get('input_text')
    
    if not input_text:
        return jsonify({"error": "No text input provided"})

    # Generate AI response based on the text input
    response = get_gemini_response_for_text(input_text, input_prompt2,"Web development")

    # Return the cleaned and parsed response from the AI
    return jsonify({"response": clean_json_string(response)})

@app.route('/upload_sugg', methods=['POST'])
def upload_sugg():
    # Extract text from the request
    suggestion = request.form.get('suggestion')
    
    if not suggestion:
        return jsonify({"error": "No text input provided"})

    # Generate AI response based on the text input
    response = get_suggestions_and_resources(suggestion, prompt_for_resource)

    # Return the cleaned and parsed response from the AI
    return jsonify({"response": clean_json_string(response)})

@app.route('/compare_jobs', methods=['POST'])
def compare():
    # Extract text from the request
    job1 = request.form.get('job1')
    job2 = request.form.get('job2')
    
    if not job1 or not job2:
        return jsonify({"error": "No text input provided"})

    # Generate AI response based on the text input
    response = compare_jobs(job1, job2, compare_prompt)

    # Return the cleaned and parsed response from the AI
    return jsonify({"response": clean_json_string(response)})



if __name__ == '__main__':
    app.run(debug=True)
