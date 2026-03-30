export const SPECIALIZATION_MAPPING = {
  'Physics': {
    skills: ['Physics concepts', 'Mathematics', 'Data Analysis', 'MATLAB', 'Research Skills', 'Scientific Writing', 'Lab Techniques'],
    interests: ['Research Scientist', 'Lecturer', 'Lab Technician', 'Data Analyst', 'Astrophysicist', 'Nuclear Physicist']
  },
  'Chemistry': {
    skills: ['Organic Chemistry', 'Lab Techniques', 'Analytical Skills', 'Chemical Safety', 'Molecular Modeling', 'Inorganic Chemistry'],
    interests: ['Chemist', 'Quality Analyst', 'Research Associate', 'Pharmacologist', 'Chemical Engineer', 'Toxicologist']
  },
  'Mathematics': {
    skills: ['Advanced Calculus', 'Statistical Analysis', 'Linear Algebra', 'Data Modeling', 'LaTeX', 'Mathematical Logic'],
    interests: ['Statistician', 'Actuary', 'Data Scientist', 'Mathematics Professor', 'Cryptographer', 'Financial Analyst']
  },
  'Computer Science': {
    skills: ['Python', 'Java', 'Data Structures', 'Algorithms', 'Web Development', 'Database Management'],
    interests: ['Software Engineer', 'Systems Architect', 'Full Stack Developer', 'Cloud Architect', 'Cybersecurity Analyst']
  },
  'Information Technology': {
    skills: ['Network Administration', 'Cloud Computing', 'Cybersecurity', 'Database Management', 'System Administration'],
    interests: ['IT Manager', 'Network Engineer', 'Security Specialist', 'Cloud Consultant', 'Database Administrator']
  },
  'Biotechnology': {
    skills: ['Genetic Engineering', 'Bioinformatics', 'Cell Biology', 'Lab Techniques', 'Microbiology', 'Bioprocess Engineering'],
    interests: ['Biotechnologist', 'Biomedical Scientist', 'Geneticist', 'Clinical Research Associate', 'Bioinformatics Analyst']
  },
  'Statistics': {
    skills: ['Statistical Modeling', 'R Programming', 'Data Visualization', 'Probability Theory', 'Predictive Analytics'],
    interests: ['Statistician', 'Data Analyst', 'Market Researcher', 'Econometrician', 'Data Scientist']
  },
  'Business Administration': {
    skills: ['Strategic Planning', 'Leadership', 'Project Management', 'Business Analysis', 'Public Speaking'],
    interests: ['Business Consultant', 'Operations Manager', 'Project Manager', 'Entrepreneur', 'Management Trainee']
  },
  'Marketing': {
    skills: ['Digital Marketing', 'Consumer Behavior', 'Market Research', 'SEO', 'Brand Management', 'Content Strategy'],
    interests: ['Marketing Manager', 'Digital Marketer', 'Brand Specialist', 'Market Researcher', 'Social Media Manager']
  },
  'Finance': {
    skills: ['Financial Modeling', 'Accounting', 'Risk Management', 'Taxation', 'Investment Analysis'],
    interests: ['Financial Analyst', 'Investment Banker', 'Portfolio Manager', 'Auditor', 'Finance Manager']
  },
  'Human Resources': {
    skills: ['Recruitment', 'Employee Relations', 'Performance Management', 'HR Analytics', 'Organizational Development'],
    interests: ['HR Manager', 'Talent Acquisition Specialist', 'HR Consultant', 'Employee Relations Manager', 'Compensation Analyst']
  },
  'Economics': {
    skills: ['Macroeconomics', 'Microeconomics', 'Econometrics', 'Data Analysis', 'Policy Analysis'],
    interests: ['Economist', 'Financial Analyst', 'Policy Advisor', 'Investment Analyst', 'Data Analyst']
  },
  'Psychology': {
    skills: ['Behavioral Analysis', 'Counseling', 'Research Methods', 'Statistical Analysis', 'Mental Health Support'],
    interests: ['Psychologist', 'HR Specialist', 'Counselor', 'User Experience Researcher', 'Social Worker']
  }
};

export const getSkillsBySpecialization = (specialization) => {
  return SPECIALIZATION_MAPPING[specialization]?.skills || [];
};

export const getInterestsBySpecialization = (specialization) => {
  return SPECIALIZATION_MAPPING[specialization]?.interests || [];
};
