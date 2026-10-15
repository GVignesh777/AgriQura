/**
 * AgriQura Official Contact Configuration
 * All contact details, response SLAs, and official links are centralized here.
 * Never hardcode unverified details in JSX.
 */

export const contactConfig = {
  // Official Support Email
  supportEmail: 'agriqura@gmail.com',

  // Project Identity & Hackathon
  projectName: 'AgriQura AI',
  initiative: 'Smart India Hackathon (SIH)',

  // Developer & Owner Information
  developer: 'GVignesh',
  owner: 'GVignesh',
  developerRole: 'Lead Architect, Full-Stack Developer & Project Owner',
  developerGithub: 'https://github.com/GVignesh777',

  // Response Expectation
  responseSLA: 'Most inquiries are reviewed as soon as possible by our agricultural support team.',

  // Support Hours (Honest fallback if not specifically scheduled)
  supportHours: {
    weekdays: 'Monday – Friday: 9:00 AM – 6:00 PM IST',
    saturday: 'Saturday: 9:00 AM – 1:00 PM IST',
    sunday: 'Sunday: Emergency / Automated AI Support Only'
  },

  // Official Channels (Only include active platforms)
  socialLinks: {
    email: 'mailto:agriqura@gmail.com',
    github: 'https://github.com/GVignesh777',
  },

  // Subject Categories
  subjects: [
    'General Inquiry',
    'Farmer Support',
    'Technical Issue',
    'Feedback & Suggestions',
    'Partnership / Institutional',
    'Government Scheme Query',
    'Mandi / Market Price Issue',
    'AI Response Advisory Issue',
    'Feature Request',
    'Other'
  ],

  // User Types
  userTypes: [
    'Farmer',
    'Student',
    'Agricultural Professional',
    'Government / Institution',
    'Partner / Organization',
    'General User',
    'Other'
  ]
};

export default contactConfig;
