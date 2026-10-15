import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    question: "What is AgriQura?",
    answer: "AgriQura is an AI-powered farmer query support and advisory system that provides farmers with quick, understandable, and personalized agricultural guidance."
  },
  {
    question: "Who developed and owns AgriQura?",
    answer: "AgriQura was designed, engineered, and is owned by GVignesh as an AI agricultural intelligence system for Smart India Hackathon (SIH). GitHub: https://github.com/GVignesh777."
  },
  {
    question: "How does AgriQura help farmers?",
    answer: "It helps farmers with crop-related queries, disease identification, weather information, market prices, farming practices, and other agricultural decisions."
  },
  {
    question: "Can I ask questions in my local language?",
    answer: "Yes. AgriQura is designed to support regional languages so farmers can communicate naturally without needing English."
  },
  {
    question: "Can I ask AgriQura questions using my voice? 🎙️",
    answer: "Yes. Farmers can use voice-based interaction instead of typing, making the system easier for users with limited digital literacy."
  },
  {
    question: "Can AgriQura identify crop diseases? 🌱",
    answer: "Yes. Farmers can provide crop/leaf information or images, and the AI can assist in identifying possible diseases and suggest appropriate next steps."
  },
  {
    question: "Does AgriQura provide weather information? 🌦️",
    answer: "Yes. It can provide weather-related information that helps farmers plan irrigation, spraying, harvesting, and other activities."
  },
  {
    question: "Can AgriQura provide current market prices? 💰",
    answer: "Yes. AgriQura can provide agricultural market-price information to help farmers make better selling decisions."
  },
  {
    question: "Is AgriQura available 24/7?",
    answer: "Yes. As an AI-powered digital assistant, AgriQura can provide support whenever the farmer needs it."
  },
  {
    question: "Is AgriQura useful for small and marginal farmers?",
    answer: "Yes. The system is designed to make agricultural information more accessible and understandable for farmers of different technical backgrounds."
  },
  {
    question: "How is AgriQura different from ChatGPT or Google? ⭐",
    answer: "AgriQura is specifically designed for agriculture and farmers, combining agricultural advisory, regional-language interaction, voice support, weather, crop-related assistance, and market information in one focused platform."
  },
  {
    question: "Does AgriQura replace agricultural experts?",
    answer: "No. AgriQura is an AI-assisted advisory system, not a replacement for agricultural officers, agronomists, or experts. For critical cases, farmers should consult qualified professionals."
  },
  {
    question: "How does AgriQura protect farmer data? 🔐",
    answer: "Farmer information should be handled securely, with appropriate authentication, data protection, and controlled access mechanisms."
  },
  {
    question: "Can AgriQura work for different types of crops?",
    answer: "Yes. The system can be designed to support multiple crops and expand its agricultural knowledge base over time."
  },
  {
    question: "Can AgriQura provide personalized recommendations?",
    answer: "Yes. Recommendations can consider factors such as crop, location, weather, soil conditions, and the farmer's query."
  },
  {
    question: "What happens if AgriQura doesn't know the answer?",
    answer: "It should clearly communicate uncertainty instead of providing misleading information and guide the farmer toward an appropriate expert or reliable agricultural source."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-agri-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-agri-500/20 to-emerald-500/20 rounded-2xl border border-agri-500/30 backdrop-blur-xl shadow-lg shadow-agri-900/40">
              <HelpCircle className="w-10 h-10 text-agri-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-agri-400 to-emerald-300 mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about AgriQura's AI-powered farming assistance. Can't find the answer you're looking for? Feel free to contact our support.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-agri-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent backdrop-blur-xl transition-all shadow-lg"
              placeholder="Search for questions or keywords..."
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`transition-all duration-300 rounded-2xl border backdrop-blur-sm overflow-hidden ${
                  openIndex === index 
                    ? 'bg-slate-800/80 border-agri-500/50 shadow-lg shadow-agri-900/20' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className={`text-base font-semibold pr-4 ${openIndex === index ? 'text-white' : 'text-slate-300'}`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 ${openIndex === index ? 'bg-agri-500/20 text-agri-400 rotate-180' : 'bg-slate-800 text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100 pb-5 px-5' : 'max-h-0 opacity-0 px-5'
                  }`}
                >
                  <p className="text-sm text-slate-400 leading-relaxed border-t border-slate-700/50 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-1">No results found</h3>
              <p className="text-slate-500 text-sm">We couldn't find any questions matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Contact Support CTA */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <p className="text-slate-400 text-sm mb-4">Still have questions?</p>
          <Link to="/help-desk" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-agri-600 to-emerald-600 hover:from-agri-500 hover:to-emerald-500 shadow-lg shadow-agri-900/30 transition-all duration-200 transform hover:scale-[1.02]">
            Contact Help Desk
          </Link>
        </div>

      </div>
    </div>
  );
}
