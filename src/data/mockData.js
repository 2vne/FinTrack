// Mock data for the finance tracker app

export const expenseCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Utilities',
  'Rent',
  'Insurance',
  'Other'
];

export const billCategories = [
  'Electricity',
  'Rent',
  'Water',
  'Internet',
  'Gas',
  'Phone',
  'Insurance',
  'Subscription',
  'Other'
];

export const sampleTransactions = [
  { id: 1, type: 'expense', amount: 450, category: 'Food & Dining', date: '2026-04-15', description: 'Grocery shopping' },
  { id: 2, type: 'expense', amount: 1200, category: 'Transportation', date: '2026-04-14', description: 'Monthly metro pass' },
  { id: 3, type: 'bill', amount: 2500, category: 'Electricity', date: '2026-04-12', description: 'April electricity bill' },
  { id: 4, type: 'expense', amount: 800, category: 'Entertainment', date: '2026-04-10', description: 'Movie tickets' },
  { id: 5, type: 'bill', amount: 15000, category: 'Rent', date: '2026-04-01', description: 'April rent' },
  { id: 6, type: 'expense', amount: 350, category: 'Healthcare', date: '2026-04-08', description: 'Medicines' },
  { id: 7, type: 'expense', amount: 2000, category: 'Shopping', date: '2026-04-05', description: 'New headphones' },
  { id: 8, type: 'bill', amount: 999, category: 'Internet', date: '2026-04-03', description: 'Broadband bill' },
];

export const sampleBudgets = [
  { id: 1, category: 'Food & Dining', limit: 5000 },
  { id: 2, category: 'Transportation', limit: 3000 },
  { id: 3, category: 'Entertainment', limit: 2000 },
  { id: 4, category: 'Shopping', limit: 4000 },
];

export const sampleGoals = [
  { id: 1, name: 'Emergency Fund', targetAmount: 100000, targetDate: '31/12/2026' },
  { id: 2, name: 'New Laptop', targetAmount: 60000, targetDate: '30/06/2026' },
];

export const monthlyData = [
  { month: 'Nov', income: 50000, expense: 32000 },
  { month: 'Dec', income: 55000, expense: 38000 },
  { month: 'Jan', income: 50000, expense: 29000 },
  { month: 'Feb', income: 52000, expense: 35000 },
  { month: 'Mar', income: 50000, expense: 31000 },
  { month: 'Apr', income: 53000, expense: 34000 },
];

export const faqData = [
  {
    question: 'Is my data safe?',
    answer: 'Yes! All your data is stored locally in your browser using localStorage. It never leaves your device and is not sent to any server.'
  },
  {
    question: 'Can I connect my bank?',
    answer: 'Currently, this app works with manual entries only. Bank integration is planned for a future release.'
  },
  {
    question: 'Is this financial advice?',
    answer: 'No. This app is a personal finance tracker to help you organize and visualize your spending. It does not provide financial advice.'
  },
  {
    question: 'How are budgets calculated?',
    answer: 'Budgets compare your set monthly limit with your actual spending in each category. The progress bar shows what percentage of your budget has been used.'
  }
];

export const translations = {
  en: {
    dashboard: 'Dashboard', expenses: 'Expenses', budgets: 'Budgets',
    goals: 'Goals', settings: 'Settings', logout: 'Logout',
    welcome: 'Welcome back', income: 'Income', expense: 'Expense',
    savings: 'Savings', spendingTrends: 'Spending Trends',
    addExpense: 'Add Expense', addBill: 'Add Bill', addBudget: 'Add Budget',
    addGoal: 'Add Goal', amount: 'Amount', category: 'Category',
    date: 'Date', description: 'Description', name: 'Name',
    targetAmount: 'Target Amount', targetDate: 'Target Date',
    monthlyLimit: 'Monthly Limit', profile: 'Profile',
    preferences: 'Preferences', notifications: 'Notifications',
    faq: 'FAQ', transactions: 'Transactions', login: 'Login',
    signup: 'Sign Up', email: 'Email', password: 'Password',
  },
  hi: {
    dashboard: 'डैशबोर्ड', expenses: 'खर्चे', budgets: 'बजट',
    goals: 'लक्ष्य', settings: 'सेटिंग्स', logout: 'लॉग आउट',
    welcome: 'वापसी पर स्वागत', income: 'आय', expense: 'खर्च',
    savings: 'बचत', spendingTrends: 'खर्च रुझान',
    addExpense: 'खर्च जोड़ें', addBill: 'बिल जोड़ें', addBudget: 'बजट जोड़ें',
    addGoal: 'लक्ष्य जोड़ें', amount: 'राशि', category: 'श्रेणी',
    date: 'तारीख', description: 'विवरण', name: 'नाम',
    targetAmount: 'लक्ष्य राशि', targetDate: 'लक्ष्य तिथि',
    monthlyLimit: 'मासिक सीमा', profile: 'प्रोफ़ाइल',
    preferences: 'प्राथमिकताएं', notifications: 'सूचनाएं',
    faq: 'सामान्य प्रश्न', transactions: 'लेन-देन', login: 'लॉग इन',
    signup: 'साइन अप', email: 'ईमेल', password: 'पासवर्ड',
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్', expenses: 'ఖర్చులు', budgets: 'బడ్జెట్',
    goals: 'లక్ష్యాలు', settings: 'సెట్టింగ్స్', logout: 'లాగ్ అవుట్',
    welcome: 'తిరిగి స్వాగతం', income: 'ఆదాయం', expense: 'ఖర్చు',
    savings: 'పొదుపులు', spendingTrends: 'ఖర్చు ధోరణులు',
    addExpense: 'ఖర్చు జోడించు', addBill: 'బిల్ జోడించు', addBudget: 'బడ్జెట్ జోడించు',
    addGoal: 'లక్ష్యం జోడించు', amount: 'మొత్తం', category: 'వర్గం',
    date: 'తేదీ', description: 'వివరణ', name: 'పేరు',
    targetAmount: 'లక్ష్య మొత్తం', targetDate: 'లక్ష్య తేదీ',
    monthlyLimit: 'నెలవారీ పరిమితి', profile: 'ప్రొఫైల్',
    preferences: 'ప్రాధాన్యతలు', notifications: 'నోటిఫికేషన్లు',
    faq: 'తరచుగా అడిగే ప్రశ్నలు', transactions: 'లావాదేవీలు', login: 'లాగిన్',
    signup: 'సైన్ అప్', email: 'ఈమెయిల్', password: 'పాస్‌వర్డ్',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு', expenses: 'செலவுகள்', budgets: 'பட்ஜெட்',
    goals: 'இலக்குகள்', settings: 'அமைப்புகள்', logout: 'வெளியேறு',
    welcome: 'மீண்டும் வரவேற்கிறோம்', income: 'வருமானம்', expense: 'செலவு',
    savings: 'சேமிப்பு', spendingTrends: 'செலவு போக்குகள்',
    addExpense: 'செலவு சேர்', addBill: 'பில் சேர்', addBudget: 'பட்ஜெட் சேர்',
    addGoal: 'இலக்கு சேர்', amount: 'தொகை', category: 'வகை',
    date: 'தேதி', description: 'விளக்கம்', name: 'பெயர்',
    targetAmount: 'இலக்கு தொகை', targetDate: 'இலக்கு தேதி',
    monthlyLimit: 'மாத வரம்பு', profile: 'சுயவிவரம்',
    preferences: 'விருப்பத்தேர்வுகள்', notifications: 'அறிவிப்புகள்',
    faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்', transactions: 'பரிவர்த்தனைகள்', login: 'உள்நுழைய',
    signup: 'பதிவு செய்ய', email: 'மின்னஞ்சல்', password: 'கடவுச்சொல்',
  }
};
