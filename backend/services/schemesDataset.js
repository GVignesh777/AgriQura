/**
 * Verified Pan-India Government Agricultural Schemes Dataset
 * Sourced from official portals: myScheme.gov.in, agricoop.nic.in, pmkisan.gov.in, pmfby.gov.in
 */

const verifiedSchemesDataset = [
  // ──────────────────────────────────────────────
  // CENTRAL GOVERNMENT SCHEMES
  // ──────────────────────────────────────────────
  {
    schemeId: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    shortDescription: 'Direct income support of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 to eligible landholder farmer families.',
    description: 'PM-KISAN is a central sector scheme with 100% funding from Government of India. It aims to supplement financial needs of farmers for procuring agricultural inputs and domestic needs.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Department of Agriculture and Farmers Welfare (DA&FW)',
    category: 'Financial Assistance',
    targetNeeds: ['Financial Assistance', 'Seeds', 'Fertilizers', 'Input Cost'],
    crops: ['All Crops', 'Rice', 'Wheat', 'Cotton', 'Maize', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'All Farmers'],
    benefits: {
      summary: '₹6,000 per annum paid in 3 equal installments of ₹2,000 directly to Aadhaar-linked bank accounts.',
      amountText: '₹6,000 / year',
      details: [
        'Direct Benefit Transfer (DBT) via PFMS into Aadhaar-seeded bank account.',
        'Zero commission and zero middleman fee.',
        'Installments released every 4 months (April-July, August-November, December-March).'
      ]
    },
    eligibility: {
      summary: 'All landholding farmer families who have cultivable landholding in their names.',
      criteria: [
        'Farmer family must own cultivable land with valid land records (Pahani / Khasra / Khatauni).',
        'Valid Aadhaar card linked with active bank account and mobile number.',
        'Exclusions: Institutional landholders, constitutional post holders, serving/retired government employees, pensioners receiving > ₹10,000/month, income tax payers of last assessment year.'
      ],
      minLandAcres: 0,
      maxLandAcres: null,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding documents (Pattadar Passbook / ROR / Khasra)',
      'Active Bank Account Passbook with IFSC',
      'Mobile number linked with Aadhaar for OTP e-KYC'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Self Registration on Portal', description: 'Visit pmkisan.gov.in and click on "Farmers Corner" -> "New Farmer Registration".' },
      { stepNumber: 2, title: 'Aadhaar Verification', description: 'Enter Aadhaar number, state, and mobile number. Complete OTP authentication.' },
      { stepNumber: 3, title: 'Enter Land & Bank Details', description: 'Fill state, district, sub-district, village, land Khata/Khasra numbers, and bank account IFSC.' },
      { stepNumber: 4, title: 'State Verification', description: 'State Nodal Officers verify land records against state land registry.' },
      { stepNumber: 5, title: 'Benefit Disbursement', description: 'Once approved, ₹2,000 installments are transferred directly via DBT.' }
    ],
    applicationUrl: 'https://pmkisan.gov.in',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    sourcePortal: 'pmkisan.gov.in',
    lastUpdated: '2026-01-10',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2019, applicationDeadline: 'Open Throughout the Year' }
  },

  {
    schemeId: 'pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    shortDescription: 'Comprehensive risk insurance coverage against crop loss due to non-preventable natural calamities, pests, and post-harvest losses.',
    description: 'PMFBY provides financial support to farmers suffering crop loss/damage arising out of unforeseen events, stabilizing farmer income and encouraging adoption of innovative agricultural practices.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Credit and Insurance Division',
    category: 'Crop Insurance',
    targetNeeds: ['Crop Insurance', 'Risk Protection', 'Financial Assistance'],
    crops: ['Rice', 'Wheat', 'Cotton', 'Maize', 'Pulses', 'Oilseeds', 'Sugarcane', 'Horticulture Crops', 'Commercial Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'Tenant Farmer', 'Sharecropper'],
    benefits: {
      summary: 'Lowest farmer premium share with full sum insured coverage for yield loss and prevented sowing.',
      amountText: '1.5% - 5% Premium Rate',
      details: [
        'Kharif Food & Oilseed crops: Maximum 2.0% premium payable by farmer.',
        'Rabi Food & Oilseed crops: Maximum 1.5% premium payable by farmer.',
        'Annual Commercial & Horticultural crops: Maximum 5.0% premium.',
        'Balance premium subsidized equally (50:50) by Central & State governments.'
      ]
    },
    eligibility: {
      summary: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
      criteria: [
        'Farmer growing notified crops in notified insurance unit (village / mandal / block).',
        'Non-loanee farmers need valid land tenancy / sowing certificate.',
        'Loanee farmers with active KCC loans enrolled through their lending banks.'
      ],
      minLandAcres: 0,
      maxLandAcres: null,
      applicableStates: ['All Participating States']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Land Record Document (Pattadar / ROR / Tenancy Agreement)',
      'Sowing Certificate / Certificate of Cropping from Village Agriculture Assistant',
      'Bank Account Passbook with IFSC'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Access Portal or CSC', description: 'Visit pmfby.gov.in or nearest Common Service Center (CSC) / Bank branch.' },
      { stepNumber: 2, title: 'Farmer Registration', description: 'Register with Aadhaar and mobile number.' },
      { stepNumber: 3, title: 'Crop & Area Declaration', description: 'Select Season (Kharif/Rabi), Year, State, District, and specific Crop plot.' },
      { stepNumber: 4, title: 'Premium Payment', description: 'Pay the subsidized farmer share (1.5% to 5%) online or at CSC.' },
      { stepNumber: 5, title: 'Policy Generation', description: 'Download the Crop Insurance Certificate with Policy Number.' }
    ],
    applicationUrl: 'https://pmfby.gov.in',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    sourcePortal: 'pmfby.gov.in',
    lastUpdated: '2026-01-18',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2016, applicationDeadline: 'Seasonal (Kharif: 31st July, Rabi: 31st December)' }
  },

  {
    schemeId: 'pmksy',
    name: 'PMKSY - Per Drop More Crop (Pradhan Mantri Krishi Sinchayee Yojana)',
    shortDescription: 'Subsidies up to 55% for Small/Marginal farmers and 45% for other farmers for installing Drip and Sprinkler micro-irrigation systems.',
    description: 'PMKSY focuses on enhancing water use efficiency at farm level through micro-irrigation technologies (Drip & Sprinkler), increasing crop productivity and conserving water resources.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Department of Agriculture & Farmers Welfare',
    category: 'Irrigation',
    targetNeeds: ['Irrigation', 'Water Management', 'Equipment', 'Financial Assistance'],
    crops: ['Cotton', 'Vegetables', 'Fruits', 'Horticulture', 'Sugarcane', 'Maize', 'Pulses', 'All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'All Farmers'],
    benefits: {
      summary: '55% subsidy for Small & Marginal farmers; 45% subsidy for other category farmers for micro-irrigation systems.',
      amountText: 'Up to 55% Subsidy',
      details: [
        'Substantial cost reduction in installing Drip, Micro-Sprinkler, Mini-Sprinkler, and Portable Sprinkler systems.',
        'Reduces water usage by up to 40-50% while boosting yield by 20-30%.',
        'Direct subsidy credited to beneficiary or empanelled system manufacturer.'
      ]
    },
    eligibility: {
      summary: 'Farmers possessing cultivable land with an assured water source (borewell, open well, canal).',
      criteria: [
        'Farmer must own cultivable land and have an assured irrigation water source.',
        'Electricity connection / solar pump connection for operating irrigation pumps.',
        'Priority given to Small & Marginal farmers and women farmers.'
      ],
      minLandAcres: 0.5,
      maxLandAcres: 12.5,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding ownership document (Pattadar / ROR / Pahani)',
      'Water source certificate / electricity bill',
      'Soil & Water test report (where applicable)',
      'Bank Account Passbook'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'State Micro-Irrigation Portal Registration', description: 'Apply via state horticulture/agriculture portal (e.g., TSMIP for Telangana, MIP for AP).' },
      { stepNumber: 2, title: 'Quotation by Empanelled Agency', description: 'Authorized micro-irrigation manufacturer surveys the farm plot and submits layout & quotation.' },
      { stepNumber: 3, title: 'Officer Field Verification', description: 'Assistant Director of Horticulture (ADH) or Agriculture Officer inspects field feasibility.' },
      { stepNumber: 4, title: 'Installation & Geo-tagging', description: 'System is installed, geo-tagged, and verified.' },
      { stepNumber: 5, title: 'Subsidy Release', description: 'Government subsidy released directly upon physical verification.' }
    ],
    applicationUrl: 'https://pmksy.gov.in',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    sourcePortal: 'pmksy.gov.in',
    lastUpdated: '2026-01-22',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2015, applicationDeadline: 'Open Throughout the Year' }
  },

  {
    schemeId: 'pm-kusum',
    name: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)',
    shortDescription: 'Up to 60% subsidy for setting up standalone Solar Agricultural Pumps and solarization of existing grid-connected agriculture pumps.',
    description: 'PM-KUSUM enables farmers to install solar water pumps and grid-connected solar power plants on barren/cultivable lands, providing day-time reliable power and earning income by selling surplus power.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of New and Renewable Energy (MNRE)',
    department: 'Renewable Energy Division',
    category: 'Solar & Renewable Energy',
    targetNeeds: ['Solar & Renewable Energy', 'Irrigation', 'Equipment', 'Financial Assistance'],
    crops: ['All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'Farmer Producer Organization'],
    benefits: {
      summary: '60% government subsidy (30% Central + 30% State); farmer pays only 10% upfront (balance 30% available via bank loan).',
      amountText: 'Up to 60% Subsidy',
      details: [
        'Standalone Solar Off-Grid Pumps from 3 HP to 10 HP.',
        'Day-time continuous irrigation without grid dependency or diesel fuel cost.',
        'Opportunity to generate additional income by selling surplus solar energy to DISCOMs.'
      ]
    },
    eligibility: {
      summary: 'Individual farmers, groups of farmers, FPOs, and Water User Associations having agricultural land.',
      criteria: [
        'Must possess agricultural land with groundwater or surface water source.',
        'Applicants without electric pump connection prioritized for standalone off-grid solar pumps.',
        'Valid land ownership documents in farmer name.'
      ],
      minLandAcres: 0.5,
      maxLandAcres: null,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Land revenue records (Khasra/Khatauni/Pattadar)',
      'Bank Account Passbook with IFSC',
      'Passport size photographs',
      'Affidavit of no existing agricultural electricity connection (for standalone off-grid)'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Registration on State Renewable Energy Portal', description: 'Apply online through state nodal agency (e.g., TSREDCO, NREDCAP, MEDA, CREST).' },
      { stepNumber: 2, title: 'Document & Site Feasibility', description: 'Upload land documents and specify pump capacity requirement (3HP, 5HP, 7.5HP).' },
      { stepNumber: 3, title: 'Farmer Share Deposit', description: 'Deposit 10% farmer contribution into designated escrow bank account.' },
      { stepNumber: 4, title: 'Solar Pump Installation', description: 'Authorized vendor installs solar panels, controller, and pump set within 45-60 days.' },
      { stepNumber: 5, title: 'Commissioning & Handover', description: 'Joint inspection and official commissioning certificate issued.' }
    ],
    applicationUrl: 'https://pmkusum.mnre.gov.in',
    officialSource: 'Ministry of New & Renewable Energy, Govt of India',
    sourcePortal: 'pmkusum.mnre.gov.in',
    lastUpdated: '2026-02-01',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2019, applicationDeadline: 'Open Batch-Wise per State Targets' }
  },

  {
    schemeId: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    shortDescription: 'Concessional institutional short-term credit at an effective interest rate of 4% per annum for crop cultivation, inputs, and post-harvest expenses.',
    description: 'KCC scheme provides adequate and timely credit support from the banking system to farmers for their cultivation and other needs including purchase of seeds, fertilizers, pesticides, and livestock maintenance.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Finance & Ministry of Agriculture',
    department: 'Department of Financial Services (DFS)',
    category: 'Credit & Loans',
    targetNeeds: ['Credit & Loans', 'Financial Assistance', 'Seeds', 'Fertilizers', 'Equipment'],
    crops: ['All Crops', 'Rice', 'Cotton', 'Wheat', 'Sugarcane', 'Maize', 'Horticulture'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'Tenant Farmer', 'Sharecropper'],
    benefits: {
      summary: 'Collateral-free loan up to ₹1.60 Lakh (up to ₹3 Lakh with land hypothecation) at 4% effective interest rate with prompt repayment incentive.',
      amountText: '4% Interest Credit (up to ₹3 Lakh)',
      details: [
        'Normal interest rate: 7% per annum; Central Government provides 3% prompt repayment incentive (PRI), making net rate 4%.',
        'Flexible revolving cash credit account valid for 5 years.',
        'ATM-enabled RuPay Kisan Card for easy ATM cash withdrawals and PoS seed/fertilizer purchases.',
        'Covers personal accident insurance up to ₹50,000.'
      ]
    },
    eligibility: {
      summary: 'All farmers, individual/joint borrowers, tenant farmers, oral lessees, sharecroppers, and SHGs/JLGs.',
      criteria: [
        'Owner cultivators with land title or tenant farmers with formal/informal lease.',
        'Age between 18 and 75 years (co-borrower required if age > 60).',
        'Animal husbandry and fisheries farmers also eligible for working capital up to ₹2 Lakh.'
      ],
      minLandAcres: 0,
      maxLandAcres: null,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar Card & PAN Card / Voter ID',
      'Land revenue records / lease agreement',
      'Crop cultivation declaration',
      'Two passport size photographs'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Download KCC Application Form', description: 'Download 1-page simplified KCC form from pmkisan.gov.in or bank portal.' },
      { stepNumber: 2, title: 'Submit to Bank Branch', description: 'Submit filled form with land record copy to nearest Commercial, Cooperative, or Regional Rural Bank (RRB).' },
      { stepNumber: 3, title: 'Credit Limit Sanction', description: 'Bank assesses scale of finance per acre and sanctions limit within 14 days.' },
      { stepNumber: 4, title: 'RuPay Card Issuance', description: 'Receive RuPay KCC card with PIN for instant ATM/PoS usage.' }
    ],
    applicationUrl: 'https://myscheme.gov.in/schemes/kcc',
    officialSource: 'Reserve Bank of India & Ministry of Agriculture',
    sourcePortal: 'myscheme.gov.in',
    lastUpdated: '2026-01-25',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 1998, applicationDeadline: 'Open Throughout the Year' }
  },

  {
    schemeId: 'soil-health-card',
    name: 'Soil Health Card (SHC) Scheme',
    shortDescription: 'Free comprehensive soil nutrient testing across 12 parameters and customized fertilizer & organic manure recommendations every 3 years.',
    description: 'Soil Health Card scheme provides farmers with soil nutrient status cards containing recommendations on appropriate dosage of nutrients and soil amendments for improving soil fertility and crop yield.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Integrated Nutrient Management Division',
    category: 'Soil Health & Fertilizer',
    targetNeeds: ['Soil Health', 'Fertilizers', 'Farmer Training', 'Input Cost'],
    crops: ['All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'All Farmers'],
    benefits: {
      summary: '100% Free laboratory testing of 12 chemical and physical soil parameters with customized crop-wise fertilizer dosage.',
      amountText: '100% Free Soil Test',
      details: [
        'Tests Primary nutrients (N, P, K), Secondary nutrient (S), Micronutrients (Zn, Fe, Cu, Mn, Bo), and Physical parameters (pH, EC, Organic Carbon).',
        'Prevents over-application of Urea and chemical fertilizers, reducing input cost by 15-20%.',
        'Issued periodically every 3 years for each agricultural holding.'
      ]
    },
    eligibility: {
      summary: 'All farmers possessing agricultural land in any State or Union Territory of India.',
      criteria: ['All landowning and cultivating farmers in surveyed grid villages.'],
      minLandAcres: 0,
      maxLandAcres: null,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Plot / Survey number details',
      'Mobile number'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Soil Sample Collection', description: 'Village Agriculture Extension Officer (AEO) collects GPS-tagged soil sample from your field grid.' },
      { stepNumber: 2, title: 'Laboratory Testing', description: 'Sample is analyzed at District Soil Testing Laboratory (STLs).' },
      { stepNumber: 3, title: 'Card Generation', description: 'Results entered into National Soil Health Portal (soilhealth.dac.gov.in).' },
      { stepNumber: 4, title: 'Distribution to Farmer', description: 'Printed Soil Health Card delivered to farmer or downloaded online via portal.' }
    ],
    applicationUrl: 'https://soilhealth.dac.gov.in',
    officialSource: 'Department of Agriculture & Farmers Welfare, Govt of India',
    sourcePortal: 'soilhealth.dac.gov.in',
    lastUpdated: '2026-01-05',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2015, applicationDeadline: 'Continuous Cycle' }
  },

  {
    schemeId: 'pkvy',
    name: 'PKVY (Paramparagat Krishi Vikas Yojana)',
    shortDescription: 'Financial assistance of ₹50,000 per hectare over 3 years for organic farming cluster adoption, PGS certification, and bio-input production.',
    description: 'PKVY is an elaborated component of Soil Health Management under NMSA. It promotes organic farming through a cluster approach and Participatory Guarantee System (PGS) certification.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Organic Farming Cell',
    category: 'Horticulture & Seeds',
    targetNeeds: ['Farmer Training', 'Fertilizers', 'Seeds', 'Financial Assistance'],
    crops: ['Pulses', 'Oilseeds', 'Millets', 'Spices', 'Vegetables', 'Fruits', 'All Organic Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Farmer Producer Organization', 'All Farmers'],
    benefits: {
      summary: '₹50,000 per hectare assistance for organic inputs, PGS-India certification, packaging, and branding.',
      amountText: '₹50,000 / hectare (3 Years)',
      details: [
        '₹31,000/ha provided directly to farmers for organic inputs (bio-fertilizers, vermicompost, botanical extracts).',
        'Free PGS-India organic certification without third-party audit expenses.',
        '₹8,800/ha for post-harvest handling, value addition, and local organic haats.'
      ]
    },
    eligibility: {
      summary: 'Farmers willing to form clusters of 20 or more farmers with a minimum of 20 hectares total landholding.',
      criteria: [
        'Willingness to transition from conventional to certified organic farming.',
        'Participation in Farmer Interest Groups (FIGs) / PGS-India cluster.'
      ],
      minLandAcres: 0.5,
      maxLandAcres: 5.0,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding documents',
      'Bank Account Passbook',
      'PGS-India Group Registration Form'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Cluster Formation', description: 'Form a group of 20+ farmers (20-50 hectares) with assistance from Regional Councils.' },
      { stepNumber: 2, title: 'PGS-India Portal Registration', description: 'Register cluster on Jaivik Kheti portal (jaivikkheti.in).' },
      { stepNumber: 3, title: 'Direct Benefit Release', description: 'Receive yearly organic input funds directly in bank account.' },
      { stepNumber: 4, title: 'Peer Appraisal & Certification', description: 'Complete annual peer inspection and receive Green/Organic logo certificate.' }
    ],
    applicationUrl: 'https://pgsindia-ncof.gov.in',
    officialSource: 'National Centre of Organic Farming, Govt of India',
    sourcePortal: 'jaivikkheti.in',
    lastUpdated: '2026-01-12',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2015, applicationDeadline: 'Open Throughout the Year' }
  },

  {
    schemeId: 'aif',
    name: 'Agriculture Infrastructure Fund (AIF)',
    shortDescription: 'Medium-long term debt financing with 3% per annum interest subvention and CGTMSE credit guarantee for post-harvest management infrastructure.',
    description: 'AIF is a pan-India central sector scheme providing ₹1 Lakh Crore loan financing facility for developing post-harvest management infrastructure and community farming assets.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Marketing and Infrastructure Division',
    category: 'Storage & Infrastructure',
    targetNeeds: ['Storage', 'Market Support', 'Equipment', 'Credit & Loans'],
    crops: ['All Crops', 'Vegetables', 'Fruits', 'Grains', 'Pulses'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'Farmer Producer Organization', 'Self Help Group'],
    benefits: {
      summary: '3% interest subvention for loans up to ₹2 Crore for up to 7 years with credit guarantee coverage.',
      amountText: '3% Interest Subvention (up to ₹2 Cr)',
      details: [
        'Loans for Warehouses, Silos, Cold Storage, Sorting & Grading units, Ripening chambers, and Solar dryers.',
        'Credit guarantee fee covered under CGTMSE for loans up to ₹2 Crore.',
        'Can be combined with capital subsidies from state government schemes.'
      ]
    },
    eligibility: {
      summary: 'Primary Agricultural Credit Societies (PACS), FPOs, Agri-entrepreneurs, and individual farmers.',
      criteria: [
        'Individual farmers, Agri-startups, or registered FPOs setting up post-harvest agricultural infrastructure.',
        'Viable Detailed Project Report (DPR).'
      ],
      minLandAcres: 0,
      maxLandAcres: null,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar & PAN Card',
      'Detailed Project Report (DPR)',
      'Land ownership or lease deed for infrastructure site',
      'Bank statement for last 6 months'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Portal Registration', description: 'Register on AgriInfra portal (agriinfra.dac.gov.in).' },
      { stepNumber: 2, title: 'Submit Project Details', description: 'Upload Project Report (DPR) and choose preferred lending bank.' },
      { stepNumber: 3, title: 'Ministry Scrutiny', description: 'Project appraised and approved by National Steering Committee within 7 days.' },
      { stepNumber: 4, title: 'Bank Loan Sanction', description: 'Bank sanctions loan and disburses with automatic 3% interest subvention.' }
    ],
    applicationUrl: 'https://agriinfra.dac.gov.in',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    sourcePortal: 'agriinfra.dac.gov.in',
    lastUpdated: '2026-02-02',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2020, applicationDeadline: 'Operational until 2032-33' }
  },

  {
    schemeId: 'smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    shortDescription: '40% to 50% capital subsidy for purchasing agricultural machinery (Tractors, Power Tillers, Harvesters) and 80% for Custom Hiring Centers.',
    description: 'SMAM aims to increase the reach of farm mechanization to small and marginal farmers and to regions where availability of farm power is low, promoting Custom Hiring Centers.',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Mechanization & Technology Division',
    category: 'Farm Machinery & Equipment',
    targetNeeds: ['Equipment', 'Financial Assistance', 'Farmer Training'],
    crops: ['All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'Farmer Producer Organization'],
    benefits: {
      summary: '40% - 50% subsidy for individual farmer machinery purchase; 80% subsidy (up to ₹10 Lakh) for Custom Hiring Centers (CHCs).',
      amountText: '40% - 50% Machine Subsidy',
      details: [
        'Subsidies on Tractors, Rotavators, Power Weeders, Laser Land Levellers, Combine Harvesters, and Drone Sprayers.',
        'Women and SC/ST farmers get 50% subsidy (up to predefined ceilings).',
        'Special 75% subsidy on Agricultural Drones for FPOs.'
      ]
    },
    eligibility: {
      summary: 'All Indian farmers with valid land records; special allocation for Small, Marginal, and Women farmers.',
      criteria: [
        'Must not have received subsidy on the same machine category in the last 5 years.',
        'Valid driving license / registration for tractor-driven implements.'
      ],
      minLandAcres: 0.5,
      maxLandAcres: null,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Landholding Passbook / ROR',
      'Bank Account Passbook',
      'Caste Certificate (for SC/ST quota)',
      'Quotation from registered machinery dealer'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Farmer Registration', description: 'Register on Direct Benefit Transfer in Agriculture Mechanization portal (agrimachinery.nic.in).' },
      { stepNumber: 2, title: 'Select Equipment & Dealer', description: 'Choose machine category and empanelled equipment manufacturer.' },
      { stepNumber: 3, title: 'Administrative Sanction', description: 'District Agriculture Officer approves application based on seniority and quota.' },
      { stepNumber: 4, title: 'Purchase & Physical Verification', description: 'Purchase machine from dealer; department inspects machine chassis/engine number.' },
      { stepNumber: 5, title: 'Subsidy Disbursement', description: 'Subsidy amount credited directly to farmer bank account via DBT.' }
    ],
    applicationUrl: 'https://agrimachinery.nic.in',
    officialSource: 'Department of Agriculture & Farmers Welfare, Govt of India',
    sourcePortal: 'agrimachinery.nic.in',
    lastUpdated: '2026-01-28',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2014, applicationDeadline: 'Open per State Target Cycles' }
  },

  {
    schemeId: 'pm-kmy',
    name: 'PM-KMY (Pradhan Mantri Kisan Maan-Dhan Yojana)',
    shortDescription: 'Old-age social security pension of ₹3,000 per month for Small and Marginal farmers upon attaining 60 years of age.',
    description: 'PM-KMY is an assured pension scheme for small and marginal landholding farmers. The Central Government matches 100% of the farmer monthly contribution (₹55 to ₹200 based on entry age).',
    governmentLevel: 'Central',
    state: 'All',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    department: 'Life Insurance Corporation of India (LIC) & DA&FW',
    category: 'Financial Assistance',
    targetNeeds: ['Financial Assistance', 'Social Security'],
    crops: ['All Crops'],
    farmerTypes: ['Small', 'Marginal'],
    benefits: {
      summary: 'Assured monthly pension of ₹3,000 directly deposited into bank account from age 60 until lifetime.',
      amountText: '₹3,000 / month Pension',
      details: [
        'Monthly contribution ranges from ₹55 to ₹200 (Central Govt contributes equal matching amount).',
        'Spouse entitled to receive 50% family pension (₹1,500/month) in case of beneficiary demise.',
        'Option to allow automatic monthly contribution deduction from PM-KISAN benefit.'
      ]
    },
    eligibility: {
      summary: 'Small and Marginal Farmers between 18 to 40 years of age holding cultivable land up to 2 hectares (5 acres).',
      criteria: [
        'Entry age: 18 to 40 years.',
        'Cultivable landholding up to 2 hectares (5 acres) in state land records.',
        'Must not be covered under NPS, EPFO, ESIC, or PM-SYM.'
      ],
      minLandAcres: 0,
      maxLandAcres: 5.0,
      applicableStates: ['All States & UTs']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account Passbook / PM-KISAN Account details',
      'Landholding document (Khasra/Khatauni)'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Visit CSC or Self Register', description: 'Visit nearest Common Service Center (CSC) or visit maandhan.in portal.' },
      { stepNumber: 2, title: 'Biometric Authentication', description: 'Provide Aadhaar and complete biometric e-KYC.' },
      { stepNumber: 3, title: 'Auto-Debit Authorization', description: 'Sign bank mandate for monthly auto-debit of subscription amount.' },
      { stepNumber: 4, title: 'Kisan Pension Card', description: 'Receive unique Kisan Pension Account Number (KPAN) and Pension Card.' }
    ],
    applicationUrl: 'https://maandhan.in',
    officialSource: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    sourcePortal: 'maandhan.in',
    lastUpdated: '2026-01-08',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2019, applicationDeadline: 'Open Throughout the Year' }
  },

  // ──────────────────────────────────────────────
  // STATE GOVERNMENT SPECIFIC SCHEMES
  // ──────────────────────────────────────────────
  {
    schemeId: 'rythu-bandhu',
    name: 'Rythu Bandhu (Telangana Agriculture Investment Support)',
    shortDescription: 'Investment support of ₹10,000 per acre per year (₹5,000 per crop season) to all landowning farmers in Telangana.',
    description: 'Rythu Bandhu scheme is a flagship farmer welfare program by the Government of Telangana to meet initial crop investment expenses (seeds, fertilizers, pesticides, labor) for Kharif and Rabi seasons.',
    governmentLevel: 'State',
    state: 'Telangana',
    ministry: 'Department of Agriculture, Govt of Telangana',
    department: 'Commissioner of Agriculture, Telangana',
    category: 'Financial Assistance',
    targetNeeds: ['Financial Assistance', 'Seeds', 'Fertilizers', 'Input Cost'],
    crops: ['Cotton', 'Rice', 'Maize', 'Red Gram', 'Chilli', 'Turmeric', 'Soybean', 'All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'All Farmers'],
    benefits: {
      summary: '₹5,000 per acre per season (₹10,000/acre/year) credited directly into Pattadar bank account.',
      amountText: '₹10,000 / acre / year',
      details: [
        'Direct cash transfer without repayment obligations.',
        'Covers both Yasangi (Rabi) and Vanakalam (Kharif) cultivation seasons.',
        'Automatic disbursement based on Dharani land record portal verification.'
      ]
    },
    eligibility: {
      summary: 'All resident landowning farmers in Telangana having Pattadar Passbook with Dharani land registry entry.',
      criteria: [
        'Must possess agricultural land in Telangana recorded in Dharani Portal.',
        'Valid Pattadar Passbook linked with Aadhaar and IFSC-coded bank account.'
      ],
      minLandAcres: 0.01,
      maxLandAcres: null,
      applicableStates: ['Telangana']
    },
    requiredDocuments: [
      'Pattadar Passbook (Dharani Portal copy)',
      'Aadhaar Card',
      'Bank Account Passbook (IFSC linked)'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Dharani Land Record Sync', description: 'Land records automatically synchronized through Dharani registry.' },
      { stepNumber: 2, title: 'AEO Verification', description: 'Village Agriculture Extension Officer (AEO) verifies bank linkage if newly purchased.' },
      { stepNumber: 3, title: 'Direct Credit', description: 'Treasury releases funds directly to bank accounts per acre owned.' }
    ],
    applicationUrl: 'https://rythubandhu.telangana.gov.in',
    officialSource: 'Government of Telangana',
    sourcePortal: 'rythubandhu.telangana.gov.in',
    lastUpdated: '2026-01-30',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2018, applicationDeadline: 'Seasonal (June & December cycles)' }
  },

  {
    schemeId: 'rythu-bima',
    name: 'Rythu Bima (Telangana Farmers Group Life Insurance)',
    shortDescription: '100% Government-paid ₹5.00 Lakh life insurance coverage for registered farmers in Telangana aged 18 to 59 years.',
    description: 'Rythu Bima provides financial security to the bereaved family members in the unfortunate event of death of the farmer. The entire premium is paid by the Government of Telangana to LIC of India.',
    governmentLevel: 'State',
    state: 'Telangana',
    ministry: 'Department of Agriculture, Govt of Telangana',
    department: 'Agriculture Department & LIC of India',
    category: 'Crop Insurance',
    targetNeeds: ['Social Security', 'Risk Protection'],
    crops: ['All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'All Farmers'],
    benefits: {
      summary: '₹5,00,000 life insurance claim settled within 10 days of farmer demise to nominated family member.',
      amountText: '₹5.00 Lakh Life Cover',
      details: [
        '100% premium paid by Telangana State Government (zero cost to farmer).',
        'Covers natural death, accidental death, and all unforeseen causes.',
        'Fast-track claim settlement deposited directly into nominee bank account.'
      ]
    },
    eligibility: {
      summary: 'Pattadar landowning farmers of Telangana aged between 18 and 59 years.',
      criteria: [
        'Landowner in Dharani registry.',
        'Age between 18 and 59 years as on enrollment date.',
        'Resident of Telangana.'
      ],
      minLandAcres: 0.01,
      maxLandAcres: null,
      applicableStates: ['Telangana']
    },
    requiredDocuments: [
      'Pattadar Passbook / Dharani Title deed',
      'Aadhaar Card of Farmer',
      'Aadhaar & Bank Passbook of Nominee'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Annual Enrollment Drive', description: 'AEO collects nominee nomination form during August enrollment drive.' },
      { stepNumber: 2, title: 'Master Policy Issuance', description: 'Government enrolls master policy with LIC of India.' },
      { stepNumber: 3, title: 'Claim Settlement', description: 'In case of death, nominee submits death certificate to AEO for instant ₹5 Lakh credit.' }
    ],
    applicationUrl: 'https://rythubima.telangana.gov.in',
    officialSource: 'Government of Telangana',
    sourcePortal: 'rythubima.telangana.gov.in',
    lastUpdated: '2026-01-20',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2018, applicationDeadline: 'Annual Renewal in August' }
  },

  {
    schemeId: 'ysr-rythu-bharosa',
    name: 'YSR Rythu Bharosa - PM KISAN (Andhra Pradesh)',
    shortDescription: 'Financial assistance of ₹13,500 per year to farmer families in Andhra Pradesh, including landless SC/ST/BC/Minority tenant farmers.',
    description: 'YSR Rythu Bharosa combines Central PM-KISAN (₹6,000) with Andhra Pradesh State assistance (₹7,500) totaling ₹13,500 per annum, paid in 3 seasonal installments.',
    governmentLevel: 'State',
    state: 'Andhra Pradesh',
    ministry: 'Department of Agriculture, Govt of Andhra Pradesh',
    department: 'Commissioner of Agriculture, AP',
    category: 'Financial Assistance',
    targetNeeds: ['Financial Assistance', 'Seeds', 'Fertilizers', 'Input Cost'],
    crops: ['Rice', 'Cotton', 'Chilli', 'Groundnut', 'Maize', 'Sugarcane', 'All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Tenant Farmer', 'Sharecropper'],
    benefits: {
      summary: '₹13,500 per year (₹7,500 in May for Kharif sowing, ₹4,000 in October for harvesting, ₹2,000 in January for Sankranti).',
      amountText: '₹13,500 / year',
      details: [
        'Landless tenant farmers belonging to SC, ST, BC, and Minority categories receive full ₹13,500 from state budget.',
        'Disbursed through Village/Ward Secretariats (Gram Sachivalayam).'
      ]
    },
    eligibility: {
      summary: 'Farmer families owning cultivable land or landless tenant farmers holding CCRC cards in Andhra Pradesh.',
      criteria: [
        'Resident of Andhra Pradesh with land records on Meebhoomi portal.',
        'Tenant farmers must possess Crop Cultivator Rights Card (CCRC).'
      ],
      minLandAcres: 0,
      maxLandAcres: null,
      applicableStates: ['Andhra Pradesh']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Meebhoomi 1B / Pattadar Passbook / CCRC Card',
      'Bank Account linked with NPCI / Aadhaar'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Gram Sachivalayam Verification', description: 'Village Agriculture Assistant (VAA) verifies beneficiary list published on social audit boards.' },
      { stepNumber: 2, title: 'CCRC Card for Tenants', description: 'Tenant farmers obtain CCRC agreement signed with land owner.' },
      { stepNumber: 3, title: 'Direct Benefit Transfer', description: 'Chief Minister DBT release credits ₹13,500 in 3 seasonal installments.' }
    ],
    applicationUrl: 'https://ysrrythubharosa.ap.gov.in',
    officialSource: 'Government of Andhra Pradesh',
    sourcePortal: 'ysrrythubharosa.ap.gov.in',
    lastUpdated: '2026-01-15',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2019, applicationDeadline: 'Seasonal (May, October, January)' }
  },

  {
    schemeId: 'ysr-free-crop-insurance',
    name: 'YSR Free Crop Insurance Scheme (Andhra Pradesh)',
    shortDescription: '100% State Government-paid crop insurance premium covering all farmers registered on e-Crop portal across Andhra Pradesh.',
    description: 'Under YSR Free Crop Insurance, farmers pay a token ₹1 registration, and the Government of Andhra Pradesh pays the entire farmer premium share for notified crops.',
    governmentLevel: 'State',
    state: 'Andhra Pradesh',
    ministry: 'Department of Agriculture, Govt of Andhra Pradesh',
    department: 'Andhra Pradesh General Insurance Corporation',
    category: 'Crop Insurance',
    targetNeeds: ['Crop Insurance', 'Risk Protection'],
    crops: ['Rice', 'Cotton', 'Chilli', 'Groundnut', 'Bengal Gram', 'All Notified Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'Tenant Farmer'],
    benefits: {
      summary: 'Universal free crop insurance protection against drought, cyclone, flood, and pest damage.',
      amountText: '100% Free Insurance',
      details: [
        'Automatic enrollment through e-Crop booking without filling separate insurance forms.',
        'Zero premium burden on farmers.',
        'Claim amount paid directly before onset of the next cultivation season.'
      ]
    },
    eligibility: {
      summary: 'All cultivating farmers whose crop is physically booked and geo-tagged in e-Crop system in Andhra Pradesh.',
      criteria: ['e-Crop booking and VAA physical field verification completed.'],
      minLandAcres: 0,
      maxLandAcres: null,
      applicableStates: ['Andhra Pradesh']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'e-Crop Booking Acknowledgement',
      'Aadhaar-seeded Bank Account'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'e-Crop Booking', description: 'VAA visits field, takes geo-tagged photo of standing crop, and registers plot on e-Crop portal.' },
      { stepNumber: 2, title: 'Social Audit Verification', description: 'Beneficiary lists displayed at Rythu Bharosa Kendras (RBKs) for public social audit.' },
      { stepNumber: 3, title: 'Automatic Insurance Settlement', description: 'Compensation directly credited in event of crop loss.' }
    ],
    applicationUrl: 'https://karshak.ap.gov.in',
    officialSource: 'Government of Andhra Pradesh',
    sourcePortal: 'karshak.ap.gov.in',
    lastUpdated: '2026-01-25',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2019, applicationDeadline: 'e-Crop Enrollment Deadlines' }
  },

  {
    schemeId: 'namo-shetkari',
    name: 'Namo Shetkari Mahasanman Nidhi Yojana (Maharashtra)',
    shortDescription: 'Financial assistance of ₹6,000 per year by Maharashtra Government, complementing PM-KISAN to deliver total ₹12,000 annually.',
    description: 'Namo Shetkari Mahasanman Nidhi Yojana is an initiative by Government of Maharashtra to provide additional financial assistance of ₹6,000 per year to farmers registered under PM-KISAN.',
    governmentLevel: 'State',
    state: 'Maharashtra',
    ministry: 'Department of Agriculture, Govt of Maharashtra',
    department: 'Commissioner of Agriculture, Pune',
    category: 'Financial Assistance',
    targetNeeds: ['Financial Assistance', 'Seeds', 'Fertilizers', 'Input Cost'],
    crops: ['Cotton', 'Soybean', 'Sugarcane', 'Paddy', 'Pulses', 'Onion', 'All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'All Farmers'],
    benefits: {
      summary: '₹6,000/year from Maharashtra Govt + ₹6,000/year from PM-KISAN = Total ₹12,000 per year for farmer families.',
      amountText: '₹6,000 / year (Total ₹12k)',
      details: [
        '₹2,000 credited every 4 months alongside PM-KISAN installment.',
        'Automatic DBT directly into Aadhaar-linked bank accounts.',
        'Benefits over 85 lakh farmer families across Maharashtra.'
      ]
    },
    eligibility: {
      summary: 'All farmers of Maharashtra who are active approved beneficiaries under Central PM-KISAN scheme.',
      criteria: [
        'Resident of Maharashtra.',
        'Active and approved status on PM-KISAN portal with completed e-KYC.'
      ],
      minLandAcres: 0,
      maxLandAcres: null,
      applicableStates: ['Maharashtra']
    },
    requiredDocuments: [
      'Aadhaar Card',
      '7/12 & 8A Land Extract (Satbara Utara)',
      'Aadhaar-linked Bank Account Passbook'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'PM-KISAN Approval', description: 'Beneficiary data automatically mapped from PM-KISAN approved database.' },
      { stepNumber: 2, title: 'State Treasury Release', description: 'Maharashtra state budget disburses matching ₹2,000 per installment via DBT.' }
    ],
    applicationUrl: 'https://krishi.maharashtra.gov.in',
    officialSource: 'Government of Maharashtra',
    sourcePortal: 'krishi.maharashtra.gov.in',
    lastUpdated: '2026-02-05',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2023, applicationDeadline: 'Open Throughout the Year' }
  },

  {
    schemeId: 'raitha-siri',
    name: 'Raitha Siri Scheme (Karnataka Millet Promotion)',
    shortDescription: 'Incentive of ₹10,000 per hectare for farmers cultivating minor millets (Ragi, Jowar, Foxtail, Little, Kodo, Proso, Barnyard millet) in Karnataka.',
    description: 'Raitha Siri scheme promotes climate-resilient and nutrition-rich minor millet cultivation in dryland regions of Karnataka by providing direct financial incentives.',
    governmentLevel: 'State',
    state: 'Karnataka',
    ministry: 'Department of Agriculture, Govt of Karnataka',
    department: 'Karnataka State Agriculture Department (KSAD)',
    category: 'Financial Assistance',
    targetNeeds: ['Financial Assistance', 'Seeds', 'Horticulture & Seeds'],
    crops: ['Millets', 'Ragi', 'Jowar', 'Bajra', 'Small Millets'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'All Farmers'],
    benefits: {
      summary: '₹10,000 per hectare direct incentive credited to bank account for growing certified minor millets.',
      amountText: '₹10,000 / hectare',
      details: [
        'Direct cash benefit credited upon crop verification.',
        'Free distribution of improved seed varieties and bio-fertilizers.',
        'Market linkage through Karnataka Food & Civil Supplies Corporation at MSP.'
      ]
    },
    eligibility: {
      summary: 'Farmers growing notified minor millets on agricultural land in Karnataka registered on FRUITS portal.',
      criteria: [
        'Resident of Karnataka with valid FID (FRUITS ID).',
        'Crop verification through Karnataka Crop Survey Mobile App.'
      ],
      minLandAcres: 0.5,
      maxLandAcres: 5.0,
      applicableStates: ['Karnataka']
    },
    requiredDocuments: [
      'FRUITS ID (Farmer Registration and Unified Beneficiary Information System)',
      'Aadhaar Card',
      'Pahani / RTC Record'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'FRUITS Portal Registration', description: 'Register on fruits.karnataka.gov.in with land RTC and Aadhaar.' },
      { stepNumber: 2, title: 'Crop Survey Geo-tagging', description: 'Crop survey enumerator records millet cultivation via mobile app.' },
      { stepNumber: 3, title: 'DBT Incentive Disbursement', description: 'Department credits ₹10,000/ha directly to bank account.' }
    ],
    applicationUrl: 'https://fruits.karnataka.gov.in',
    officialSource: 'Government of Karnataka',
    sourcePortal: 'fruits.karnataka.gov.in',
    lastUpdated: '2026-01-20',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2019, applicationDeadline: 'Kharif Crop Survey Period' }
  },

  {
    schemeId: 'krishak-bandhu',
    name: 'Krishak Bandhu Scheme (West Bengal)',
    shortDescription: 'Direct financial assistance up to ₹10,000 per year (minimum ₹4,000) and ₹2 Lakh death benefit for farmers and sharecroppers in West Bengal.',
    description: 'Krishak Bandhu is a flagship welfare scheme of Government of West Bengal providing assured annual crop investment assistance and life insurance for farmers and recorded bhagchasis (sharecroppers).',
    governmentLevel: 'State',
    state: 'West Bengal',
    ministry: 'Department of Agriculture, Govt of West Bengal',
    department: 'Directorate of Agriculture, West Bengal',
    category: 'Financial Assistance',
    targetNeeds: ['Financial Assistance', 'Social Security', 'Risk Protection'],
    crops: ['Paddy', 'Jute', 'Potato', 'Vegetables', 'Mustard', 'All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'Sharecropper', 'Tenant Farmer'],
    benefits: {
      summary: '₹10,000/year for 1 acre or more land (₹4,000 minimum for <1 acre) + ₹2,00,000 life insurance in case of death between 18-60 years.',
      amountText: '₹10,000/yr + ₹2 Lakh Insurance',
      details: [
        'Assistance paid in 2 equal installments during Kharif and Rabi seasons.',
        '₹2 Lakh death insurance coverage without any premium payment by farmer.',
        'Recorded Bhagchasis (sharecroppers) and Patta holders fully covered.'
      ]
    },
    eligibility: {
      summary: 'All landowning farmers and recorded sharecroppers with valid RoR in West Bengal.',
      criteria: [
        'Resident of West Bengal.',
        'ROR / Land Record (Khatian / Parcha) in applicant name.',
        'Age between 18 and 60 for death benefit.'
      ],
      minLandAcres: 0.01,
      maxLandAcres: null,
      applicableStates: ['West Bengal']
    },
    requiredDocuments: [
      'Aadhaar Card / Voter ID Card',
      'RoR Copy (Khatian / Parcha / Patta document)',
      'Bank Account Passbook with IFSC'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Submit Form at Duare Sarkar or ADA Office', description: 'Submit physical application at Duare Sarkar camp or Block Assistant Director of Agriculture (ADA) office.' },
      { stepNumber: 2, title: 'Verification by Block Agriculture Officer', description: 'Land and bank details verified against Banglarbhumi land database.' },
      { stepNumber: 3, title: 'Krishak Bandhu Card & DBT Release', description: 'Receive Krishak Bandhu digital ID and bi-annual bank transfers.' }
    ],
    applicationUrl: 'https://krishakbandhu.wb.gov.in',
    officialSource: 'Government of West Bengal',
    sourcePortal: 'krishakbandhu.wb.gov.in',
    lastUpdated: '2026-01-22',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2019, applicationDeadline: 'Duare Sarkar Camps & Year-Round' }
  },

  {
    schemeId: 'kalia',
    name: 'KALIA Scheme (Krushak Assistance for Livelihood and Income Augmentation - Odisha)',
    shortDescription: 'Financial assistance of ₹10,000 per family for cultivators, ₹12,500 for landless agricultural households, and interest-free crop loans up to ₹1 Lakh.',
    description: 'KALIA is an inclusive welfare initiative of the Government of Odisha aimed at accelerating agricultural prosperity and eliminating poverty among small/marginal farmers and landless agricultural laborers.',
    governmentLevel: 'State',
    state: 'Odisha',
    ministry: 'Department of Agriculture and Farmers Empowerment, Govt of Odisha',
    department: 'Directorate of Agriculture & Food Production, Odisha',
    category: 'Financial Assistance',
    targetNeeds: ['Financial Assistance', 'Seeds', 'Fertilizers', 'Livestock', 'Credit & Loans'],
    crops: ['Paddy', 'Pulses', 'Oilseeds', 'Vegetables', 'All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Tenant Farmer', 'Sharecropper'],
    benefits: {
      summary: '₹10,000 per year per farm family for input assistance; ₹12,500 for landless agri households for goat/poultry/duckery units.',
      amountText: '₹10,000 - ₹12,500 / year',
      details: [
        'Direct cash transfer in 2 installments (₹5,000 for Kharif and ₹5,000 for Rabi).',
        '0% interest on crop loans up to ₹1,00,000.',
        'Life insurance of ₹2 Lakh and accidental cover of ₹2 Lakh for age 18-50.'
      ]
    },
    eligibility: {
      summary: 'Small & Marginal farmers, sharecroppers, and landless agricultural households in Odisha.',
      criteria: [
        'Resident of Odisha.',
        'Small/Marginal landholder or registered landless agricultural laborer.'
      ],
      minLandAcres: 0,
      maxLandAcres: 5.0,
      applicableStates: ['Odisha']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card / BPL Card',
      'Bank Account Passbook with IFSC',
      'Land Record (RoR) for cultivators'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Online Registration', description: 'Apply via kalia.odisha.gov.in portal or through Mo Seva Kendra.' },
      { stepNumber: 2, title: 'Gram Panchayat Scrutiny', description: 'GP-level committee validates beneficiary list.' },
      { stepNumber: 3, title: 'DBT Cash Transfer', description: 'Funds released directly to bank account via DBT.' }
    ],
    applicationUrl: 'https://kalia.odisha.gov.in',
    officialSource: 'Government of Odisha',
    sourcePortal: 'kalia.odisha.gov.in',
    lastUpdated: '2026-01-18',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2019, applicationDeadline: 'Seasonal (Akshaya Tritiya & Nuakhai)' }
  },

  {
    schemeId: 'cm-solar-pump-tn',
    name: 'Chief Minister Solar Powered Pump Scheme (Tamil Nadu)',
    shortDescription: '70% subsidy (40% State + 30% Centre under PM-KUSUM) for standalone solar water pumping systems up to 10 HP in Tamil Nadu.',
    description: 'Tamil Nadu Agricultural Engineering Department provides 70% capital subsidy for installing standalone AC/DC solar pumpsets to harness solar energy for agricultural irrigation.',
    governmentLevel: 'State',
    state: 'Tamil Nadu',
    ministry: 'Department of Agriculture and Farmers Welfare, Govt of Tamil Nadu',
    department: 'Agricultural Engineering Department (AED), Tamil Nadu',
    category: 'Solar & Renewable Energy',
    targetNeeds: ['Solar & Renewable Energy', 'Irrigation', 'Equipment', 'Financial Assistance'],
    crops: ['Paddy', 'Sugarcane', 'Cotton', 'Banana', 'Vegetables', 'Coconut', 'All Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'All Farmers'],
    benefits: {
      summary: '70% capital subsidy on 5 HP, 7.5 HP, and 10 HP solar pumpsets; farmer pays only 30% contribution.',
      amountText: '70% Solar Pump Subsidy',
      details: [
        'Eliminates electricity bills and enables uninterrupted day-time irrigation.',
        '5 years comprehensive warranty with free maintenance from manufacturer.',
        'Priority for tail-end canal farmers and dryland zones.'
      ]
    },
    eligibility: {
      summary: 'Farmers in Tamil Nadu with an open well, borewell, or farm pond with adequate water yield.',
      criteria: [
        'Resident of Tamil Nadu with cultivable land and water source.',
        'No existing free agricultural electricity service connection on the same water source.'
      ],
      minLandAcres: 1.0,
      maxLandAcres: null,
      applicableStates: ['Tamil Nadu']
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Patta / Chitta copy',
      'FMB Sketch',
      'Groundwater clearance certificate',
      'Bank Account Passbook'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Apply on Uzhavan App / AED Portal', description: 'Submit application through Uzhavan App or contact Assistant Executive Engineer (AED).' },
      { stepNumber: 2, title: 'Field Inspection & Water Yield Test', description: 'AED engineers inspect borewell depth and solar exposure.' },
      { stepNumber: 3, title: 'Deposit 30% Farmer Share', description: 'Pay farmer contribution to AED demand draft / online account.' },
      { stepNumber: 4, title: 'Installation & Commissioning', description: 'Empanelled solar company installs system within 30 days.' }
    ],
    applicationUrl: 'https://aed.tn.gov.in',
    officialSource: 'Government of Tamil Nadu',
    sourcePortal: 'uzhavan.tn.gov.in',
    lastUpdated: '2026-01-26',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2018, applicationDeadline: 'Continuous per District Targets' }
  },

  {
    schemeId: 'kisan-sahay-gujarat',
    name: 'Mukhyamantri Kisan Sahay Yojana (Gujarat)',
    shortDescription: '100% state-funded crop compensation of up to ₹25,000 per hectare for crop loss due to drought, excess rain, or unseasonal rainfall in Gujarat.',
    description: 'Mukhyamantri Kisan Sahay Yojana replaces conventional insurance premiums in Gujarat, offering simplified, zero-premium government financial compensation for natural crop damage exceeding 33%.',
    governmentLevel: 'State',
    state: 'Gujarat',
    ministry: 'Department of Agriculture, Farmers Welfare & Co-operation, Govt of Gujarat',
    department: 'Directorate of Agriculture, Gujarat',
    category: 'Crop Insurance',
    targetNeeds: ['Crop Insurance', 'Risk Protection', 'Financial Assistance'],
    crops: ['Cotton', 'Groundnut', 'Paddy', 'Castor', 'Bajra', 'Sesame', 'All Kharif Crops'],
    farmerTypes: ['Small', 'Marginal', 'Medium', 'Large', 'All Farmers'],
    benefits: {
      summary: '₹20,000/ha for 33% to 60% crop loss; ₹25,000/ha for >60% crop loss (up to maximum 4 hectares).',
      amountText: 'Up to ₹25,000 / hectare',
      details: [
        'Zero premium payable by farmers (100% state-covered).',
        'Covers Drought (less than 10 inches rainfall), Heavy rainfall (over 25 inches in 48 hours), and Unseasonal rain (Mavthu).',
        'Direct cash transfer via DBT into farmer bank accounts.'
      ]
    },
    eligibility: {
      summary: 'All landowning farmers of Gujarat recorded in 8-A and 7/12 land records.',
      criteria: [
        'Landowner in Gujarat with Kharif crop sowing recorded on AnyRoR portal.',
        'Crop damage exceeding 33% verified by district survey team.'
      ],
      minLandAcres: 0.1,
      maxLandAcres: null,
      applicableStates: ['Gujarat']
    },
    requiredDocuments: [
      'Aadhaar Card',
      '8-A Land Record & 7/12 extract from AnyRoR',
      'Bank Account Passbook with IFSC',
      'Crop Sowing Certificate (Talati / VCE)'
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Portal Application during Calamity', description: 'Apply via e-Gram center (Digital Gujarat portal) following notified calamity.' },
      { stepNumber: 2, title: 'Taluka Team Damage Assessment', description: 'Taluka Agriculture Officer conducts field survey.' },
      { stepNumber: 3, title: 'Direct Compensation Transfer', description: 'Relief amount credited directly via DBT.' }
    ],
    applicationUrl: 'https://ikhedut.gujarat.gov.in',
    officialSource: 'Government of Gujarat',
    sourcePortal: 'ikhedut.gujarat.gov.in',
    lastUpdated: '2026-01-14',
    syncedAt: new Date('2026-02-14'),
    status: 'Active',
    importantDates: { launchYear: 2020, applicationDeadline: 'Triggered upon Calamity Declaration' }
  }
];

module.exports = verifiedSchemesDataset;
