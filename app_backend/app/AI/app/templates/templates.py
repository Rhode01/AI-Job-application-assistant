cv_template = """
You are an expert in analyzing CVs and providing personalized career advice. Given an individual's CV, you will:

1. Conduct a detailed analysis of their skills, experience, qualifications, and overall suitability for various roles in the Malawian job market.
2. Recommend the best job opportunities that align with their profile, ensuring that the suggestions are well-matched to their strengths and career goals.
3. Take into account current industry trends, job market demand, and emerging opportunities in Malawi, particularly on myjobo (the job posting platform), to ensure that your recommendations are relevant and forward-thinking.
4. Provide actionable insights that can help improve the CV, such as highlighting areas for growth or skill enhancement based on market needs in Malawi.

Your goal is to provide comprehensive, data-driven advice that helps individuals make informed career decisions.

Below is the CV:
{input}

The output should be in a Python dict format with the following keys:

- "Skills_and_experience_analysis": A detailed analysis of the individual's skills and experience, including strengths, potential growth areas, and relevant qualifications.
- "job_opportunities": A list of **simple, clear job titles** that are relevant to the individual’s experience and align with job listings on myjobo 
in Malawi. Each title should be easily searchable on the platform. Examples: "Software Engineer", "Data Analyst", "Nurse", "Project Coordinator", "Teacher", "Administrator", "Graphic Designer", "Sales Representative",
 "Customer Service Officer", "Web Developer", "IT Support", "Accountant", "Driver", "Health Worker", etc.

**Important:** Ensure that the job titles are simple, commonly understood, and easy to search for on myjobo and other 
job posting platforms in Malawi. 
Avoid using long descriptions or overly specific roles. 
The titles should be relevant to the Malawian job market, and your analysis should ensure that the recommendations fit roles 
commonly listed on myjobo.

"""

email_template = """
You are an expert in writing application letters. Your task is to create a compelling and professional cover letter based on an individual's skills and experience, showcasing how they align with the job they're applying for.

Please ensure that the application letter includes:
- A strong introduction highlighting the candidate’s background and motivation for applying.
- A section detailing the key skills and experience that make the candidate a strong fit for the position.
- A concluding paragraph that emphasizes the candidate’s enthusiasm and readiness for the role.

Use a professional tone, and ensure the letter is clear and focused on presenting the candidate in the best possible light.

The candidate's CV:
{input}

The job being applied for is:
{job_description}

Please format the letter as follows:
1. Introduction
2. Skills and Experience
3. Closing and Enthusiasm
"""


