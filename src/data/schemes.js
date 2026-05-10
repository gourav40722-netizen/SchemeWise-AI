export const defaultProfile = {
  age: 24,
  income: 180000,
  state: 'Karnataka',
  occupation: 'Student',
  gender: 'Female',
  education: 'Undergraduate'
};

export const schemes = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Income Support',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    states: ['All India'],
    genders: ['Any'],
    occupations: ['Farmer', 'Self-employed'],
    education: ['Any'],
    minAge: 18,
    maxIncome: 600000,
    benefit: 'Direct income support of Rs. 6,000 per year to eligible farmer families.',
    deadline: 'Open all year',
    documents: ['Aadhaar', 'Land records', 'Bank account', 'Mobile number'],
    applyUrl: 'https://pmkisan.gov.in/',
    tags: ['DBT', 'Rural', 'Agriculture'],
    description:
      'A central sector scheme that supports small and marginal farmer households through direct benefit transfers.'
  },
  {
    id: 'nsp-merit',
    title: 'National Scholarship Portal Merit Aid',
    ministry: 'Ministry of Education',
    category: 'Education',
    states: ['All India'],
    genders: ['Any'],
    occupations: ['Student'],
    education: ['High School', 'Undergraduate', 'Postgraduate'],
    minAge: 15,
    maxIncome: 800000,
    benefit: 'Scholarships and tuition assistance for eligible students.',
    deadline: 'Seasonal window',
    documents: ['Aadhaar', 'Marksheets', 'Income certificate', 'Bank account'],
    applyUrl: 'https://scholarships.gov.in/',
    tags: ['Scholarship', 'Students', 'Digital'],
    description:
      'A unified digital platform that helps students discover and apply for central and state scholarship programs.'
  },
  {
    id: 'standup-india',
    title: 'Stand-Up India Loan Scheme',
    ministry: 'Department of Financial Services',
    category: 'Entrepreneurship',
    states: ['All India'],
    genders: ['Female', 'Any'],
    occupations: ['Entrepreneur', 'Self-employed', 'Unemployed'],
    education: ['Any'],
    minAge: 18,
    maxIncome: 1200000,
    benefit: 'Bank loans from Rs. 10 lakh to Rs. 1 crore for greenfield enterprises.',
    deadline: 'Open all year',
    documents: ['Identity proof', 'Business plan', 'Caste certificate if applicable', 'Bank details'],
    applyUrl: 'https://www.standupmitra.in/',
    tags: ['Startup', 'Women', 'Credit'],
    description:
      'Supports women and SC/ST entrepreneurs in setting up new manufacturing, trading, service, or agriculture-allied businesses.'
  },
  {
    id: 'pmay-urban',
    title: 'Pradhan Mantri Awas Yojana - Urban',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'Housing',
    states: ['All India'],
    genders: ['Any'],
    occupations: ['Salaried', 'Self-employed', 'Unemployed'],
    education: ['Any'],
    minAge: 21,
    maxIncome: 1800000,
    benefit: 'Housing assistance and credit-linked subsidy for eligible urban households.',
    deadline: 'As notified',
    documents: ['Aadhaar', 'Income proof', 'Property documents', 'Bank account'],
    applyUrl: 'https://pmaymis.gov.in/',
    tags: ['Urban', 'Housing', 'Subsidy'],
    description:
      'A flagship housing mission focused on affordable homes for eligible urban families and first-time homeowners.'
  },
  {
    id: 'skill-india',
    title: 'Skill India Training Pathway',
    ministry: 'Ministry of Skill Development and Entrepreneurship',
    category: 'Employment',
    states: ['All India'],
    genders: ['Any'],
    occupations: ['Student', 'Unemployed', 'Worker'],
    education: ['High School', 'Undergraduate', 'Postgraduate', 'Any'],
    minAge: 15,
    maxIncome: 900000,
    benefit: 'Short-term training, certification, and employment-linked skilling support.',
    deadline: 'Batch based',
    documents: ['Aadhaar', 'Education proof', 'Photograph', 'Mobile number'],
    applyUrl: 'https://www.skillindia.gov.in/',
    tags: ['Jobs', 'Training', 'Youth'],
    description:
      'Connects citizens to training providers, certification programs, and employability pathways across sectors.'
  },
  {
    id: 'ladli-lakshmi',
    title: 'Ladli Lakshmi Girl Child Support',
    ministry: 'State Women and Child Development Departments',
    category: 'Women & Child',
    states: ['Madhya Pradesh', 'Delhi', 'Karnataka'],
    genders: ['Female'],
    occupations: ['Student', 'Unemployed'],
    education: ['High School', 'Undergraduate', 'Any'],
    minAge: 0,
    maxIncome: 500000,
    benefit: 'Financial assistance milestones for eligible girl children and students.',
    deadline: 'State window',
    documents: ['Birth certificate', 'Aadhaar', 'Residence proof', 'Bank account'],
    applyUrl: 'https://www.myscheme.gov.in/',
    tags: ['Girl Child', 'State', 'Education'],
    description:
      'State-led support programs that encourage education, financial security, and welfare for eligible girls.'
  }
];

export function scoreScheme(scheme, profile) {
  let score = 0;
  const reasons = [];
  const stateMatch = scheme.states.includes('All India') || scheme.states.includes(profile.state);
  const occupationMatch = scheme.occupations.includes(profile.occupation) || scheme.occupations.includes('Any');
  const genderMatch = scheme.genders.includes('Any') || scheme.genders.includes(profile.gender);
  const educationMatch = scheme.education.includes('Any') || scheme.education.includes(profile.education);
  const ageMatch = Number(profile.age) >= scheme.minAge;
  const incomeMatch = Number(profile.income) <= scheme.maxIncome;

  if (stateMatch) {
    score += 20;
    reasons.push('available in your state');
  }
  if (occupationMatch) {
    score += 20;
    reasons.push('matches your occupation');
  }
  if (genderMatch) {
    score += 15;
    reasons.push('gender eligibility aligns');
  }
  if (educationMatch) {
    score += 15;
    reasons.push('fits your education level');
  }
  if (ageMatch) {
    score += 15;
    reasons.push('age criteria met');
  }
  if (incomeMatch) {
    score += 15;
    reasons.push('income criteria met');
  }

  return { ...scheme, score, reasons };
}

export function getRecommendedSchemes(profile) {
  return schemes
    .map((scheme) => scoreScheme(scheme, profile))
    .filter((scheme) => scheme.score >= 45)
    .sort((a, b) => b.score - a.score);
}
