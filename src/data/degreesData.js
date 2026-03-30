export const DEGREES_DATA = [
  {
    degree: 'B.Tech / B.E',
    type: 'technical',
    specializations: ['Computer Science', 'Information Technology', 'Artificial Intelligence', 'Data Science', 'Electronics', 'Mechanical', 'Civil']
  },
  {
    degree: 'BCA',
    type: 'technical',
    specializations: ['Computer Applications', 'Web Development', 'Software Engineering']
  },
  {
    degree: 'M.Tech',
    type: 'technical',
    specializations: ['Computer Science', 'Data Science', 'AI & Machine Learning', 'VLSI Design']
  },
  {
    degree: 'MCA',
    type: 'technical',
    specializations: ['Computer Applications', 'Cloud Computing', 'Data Analytics']
  },
  {
    degree: 'B.Sc',
    type: 'balanced', // Changing to balanced or specialized
    specializations: ['Computer Science', 'Information Technology', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Biotechnology']
  },
  {
    degree: 'BBA',
    type: 'non-technical',
    specializations: ['Business Administration', 'Marketing', 'Human Resources', 'Finance']
  },
  {
    degree: 'MBA',
    type: 'non-technical',
    specializations: ['Marketing', 'Finance', 'Human Resources', 'Operations', 'International Business']
  },
  {
    degree: 'B.Com',
    type: 'non-technical',
    specializations: ['Accounting', 'Finance', 'Taxation']
  },
  {
    degree: 'BA',
    type: 'non-technical',
    specializations: ['Economics', 'English', 'Psychology', 'History']
  },
  {
    degree: 'Diploma',
    type: 'technical',
    specializations: ['Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering']
  },
  {
    degree: 'PhD',
    type: 'technical',
    specializations: ['Computer Science', 'Data Science', 'AI', 'Others']
  }
];

export const getDegreeType = (degreeName) => {
  const found = DEGREES_DATA.find(d => d.degree === degreeName);
  return found ? found.type : 'technical';
};

export const getSpecializations = (degreeName) => {
  const found = DEGREES_DATA.find(d => d.degree === degreeName);
  return found ? found.specializations : [];
};
