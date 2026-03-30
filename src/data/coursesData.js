export const COURSES_DATA = [
  // Python & Data
  { title: "100 Days of Code: The Complete Python Pro Bootcamp", provider: "Udemy", skill: "Python", duration: "60 hours", difficulty: "Beginner", rating: 4.8, description: "Master Python by building 100 projects in 100 days. Excellent for core mechanics." },
  { title: "Python for Everybody Specialization", provider: "Coursera", skill: "Python", duration: "8 months", difficulty: "Beginner", rating: 4.8, description: "University of Michigan's foundational programming course focusing on data structures." },
  { title: "Complete Data Science Bootcamp", provider: "Udemy", skill: "Data Analysis", duration: "32 hours", difficulty: "Beginner", rating: 4.6, description: "Learn mathematics, statistics, and machine learning models for data analysts." },
  { title: "Data Visualization with Tableau", provider: "Coursera", skill: "Tableau", duration: "3 weeks", difficulty: "Intermediate", rating: 4.7, description: "Create interactive dashboards and connect business intelligence." },
  { title: "Exploratory Data Analysis (EDA) Fundamentals", provider: "Udemy", skill: "Exploratory Data Analysis (EDA)", duration: "10 hours", difficulty: "Intermediate", rating: 4.6, description: "Deep dive into statistical visualization and real-world data cleaning." },

  // JavaScript / Frontend
  { title: "The Complete JavaScript Course 2024", provider: "Udemy", skill: "JavaScript", duration: "68 hours", difficulty: "Beginner", rating: 4.8, description: "Zero to expert JavaScript encompassing modern ES6+ fundamentals." },
  { title: "React - The Complete Guide", provider: "Udemy", skill: "React", duration: "50 hours", difficulty: "Intermediate", rating: 4.7, description: "Dive into Hooks, React Router, Redux, and Next.js." },
  { title: "Understanding TypeScript", provider: "Udemy", skill: "TypeScript", duration: "15 hours", difficulty: "Intermediate", rating: 4.7, description: "Boost your code quality with strict typing for scalable frontend applications." },

  // Backend & Systems
  { title: "Node.js, Express, MongoDB & More", provider: "Udemy", skill: "Node.js", duration: "42 hours", difficulty: "Intermediate", rating: 4.7, description: "Build fast, highly scalable backend APIs and authentication services." },
  { title: "Grokking the System Design Interview", provider: "Educative", skill: "System Design", duration: "20 hours", difficulty: "Advanced", rating: 4.8, description: "Architect distributed systems to prepare for high-level engineering roles." },
  { title: "Microservices Architecture", provider: "Coursera", skill: "Microservices", duration: "4 weeks", difficulty: "Advanced", rating: 4.7, description: "Design resilient microservices using Docker and container orchestration." },

  // Database (SQL, NoSQL)
  { title: "The Ultimate MySQL Bootcamp", provider: "Udemy", skill: "SQL", duration: "20 hours", difficulty: "Beginner", rating: 4.7, description: "Go from SQL beginner to querying complex real-world data infrastructures." },

  // Cloud, DevOps, & Tools
  { title: "AWS Certified Solutions Architect", provider: "Udemy", skill: "AWS", duration: "27 hours", difficulty: "Intermediate", rating: 4.8, description: "Master cloud infrastructure and pass the industry standard AWS Associate exam." },
  { title: "Docker Mastery: with Kubernetes", provider: "Udemy", skill: "Docker", duration: "21 hours", difficulty: "Beginner", rating: 4.8, description: "Dockerize apps and build highly scalable swarms." },
  { title: "Version Control with Git", provider: "Infosys Springboard", skill: "Git", duration: "10 hours", difficulty: "Beginner", rating: 4.5, description: "Understand industry-standard version control and collaborative branching." },
  { title: "DevOps Culture and Practice", provider: "Coursera", skill: "CI/CD", duration: "4 weeks", difficulty: "Intermediate", rating: 4.8, description: "Build automated deployment pipelines using Jenkins and modern principles." },

  // AI & Machine Learning
  { title: "Deep Learning Specialization", provider: "Coursera", skill: "Deep Learning", duration: "5 months", difficulty: "Advanced", rating: 4.9, description: "Build and train neural network architectures, led by Andrew Ng." },
  { title: "Natural Language Processing Specialization", provider: "Coursera", skill: "NLP", duration: "4 months", difficulty: "Advanced", rating: 4.7, description: "Design complex linguistic AI models and transformers." },

  // Product, UX, & Management
  { title: "Google UX Design Professional Certificate", provider: "Coursera", skill: "UX Research", duration: "6 months", difficulty: "Beginner", rating: 4.8, description: "Learn foundational UX frameworks, wireframing, and user empathy." },
  { title: "Complete Figma Megacourse", provider: "Udemy", skill: "Figma", duration: "18 hours", difficulty: "Intermediate", rating: 4.7, description: "Design stunning UI/UX layouts, interactive prototypes, and atomic design systems." },
  { title: "Become a Product Manager", provider: "Udemy", skill: "Product Strategy", duration: "13 hours", difficulty: "Beginner", rating: 4.6, description: "Learn to manage product lifecycles, user journeys, and cross-functional teams." },
  { title: "Agile Project Management", provider: "Coursera", skill: "Agile", duration: "4 weeks", difficulty: "Intermediate", rating: 4.7, description: "Run sprints, write user stories, and become a certified Scrum practitioner." },

  // Civil & Mechanical Engineering
  { title: "AutoCAD 2024 Masterclass", provider: "Udemy", skill: "AutoCAD", duration: "16 hours", difficulty: "Beginner", rating: 4.7, description: "Master 2D and 3D drafting for architectural and site engineering." },
  { title: "Construction Project Management", provider: "Coursera", skill: "Construction Management", duration: "5 months", difficulty: "Intermediate", rating: 4.8, description: "Learn estimation, scheduling, and risk management with Primavera P6 and MS Project." }
];

export const getRecommendedCourses = (missingSkills, role) => {
  if (!missingSkills || missingSkills.length === 0) {
    // Return diverse, high-value defaults for highly skilled candidates
    return COURSES_DATA.filter(c => c.difficulty === "Advanced" || c.difficulty === "Intermediate").slice(0, 3);
  }

  let matchedCourses = COURSES_DATA.filter(course => 
    missingSkills.some(skill => 
      course.skill.toLowerCase() === skill.toLowerCase() ||
      skill.toLowerCase().includes(course.skill.toLowerCase())
    )
  );

  matchedCourses.sort((a, b) => b.rating - a.rating);

  if (matchedCourses.length > 6) {
    matchedCourses = matchedCourses.slice(0, 6);
  }

  // Fallback to ensuring courses exist for the profile type
  if (matchedCourses.length === 0) {
    return COURSES_DATA.filter(c => c.difficulty === "Beginner").slice(0, 3);
  }

  return matchedCourses;
};

export const getCourseImage = (skill) => {
  const images = {
    'python': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    'data analysis': 'https://images.unsplash.com/photo-1551288049-bbbda536ad8a?auto=format&fit=crop&q=80&w=800',
    'tableau': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    'exploratory data analysis (eda)': 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800',
    'javascript': 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=800',
    'react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    'typescript': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800',
    'node.js': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800',
    'system design': 'https://images.unsplash.com/photo-1508921334172-b68ed301dc82?auto=format&fit=crop&q=80&w=800',
    'microservices': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    'sql': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
    'aws': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    'docker': 'https://images.unsplash.com/photo-1605745341112-85968b193ef5?auto=format&fit=crop&q=80&w=800',
    'git': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=800',
    'ci/cd': 'https://images.unsplash.com/photo-1618401471353-b98aadebc25a?auto=format&fit=crop&q=80&w=800',
    'deep learning': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    'nlp': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800',
    'ux research': 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=800',
    'figma': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    'product strategy': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800',
    'agile': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    'autocad': 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800',
    'construction management': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'
  };

  const normalizedSkill = skill?.toLowerCase() || '';
  for (const [key, value] of Object.entries(images)) {
    if (normalizedSkill.includes(key)) return value;
  }

  // Fallback
  return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800';
};
