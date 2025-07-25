import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const openChatbot = () => {
    // Open your AI Mental Health Companion project in a new tab
    // window.open('http://localhost:3001', '_blank');
    
    // OR if you prefer to navigate in the same tab, use this instead:
    window.location.href = 'http://localhost:3001';
  };

  const features = [
    {
      title: "📝 Journal Your Thoughts",
      description: "Express yourself freely in a safe, private space designed for reflection.",
      link: "/journal",
      align: "left"
    },
    {
      title: "🌟 Track Your Mood",
      description: "Monitor your daily emotions and discover patterns in your mental wellness journey.",
      link: "/mood",
      align: "left"
    },
    {
      title: "📈 Emotional Trends",
      description: "Analyze how your emotions change over time.",
      link: "/trends",
      align: "right"
    },
    {
      title: "🤖 Aura-Your Companion",
      description: "Talk to a compassionate AI companion trained in mental health support and active listening.",
      action: openChatbot, // Use action instead of link
      align: "left"
    },
    {
      title: "🧘‍♀️ Guided Meditations",
      description: "Find peace with our collection of calming guided meditation sessions.",
      link: "/meditation",
      align: "right"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#F8F4E9] text-[#3A3A3A] font-[Montserrat] overflow-hidden py-12">
        
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
          {/* Floating Circles */}
          <div className="absolute w-24 h-24 bg-[#DDE1C5] rounded-full top-10 left-10 animate-pulse opacity-30" />
          <div className="absolute w-36 h-36 bg-[#DDE1C5] rounded-full bottom-10 right-10 animate-ping opacity-20" />
          <div className="absolute w-20 h-20 bg-[#EDEAD6] rounded-full top-1/2 left-1/2 animate-bounce opacity-10" />
          
          {/* Medium Circles with Delays */}
          <div className="absolute w-16 h-16 bg-[#6A752D] rounded-full top-1/4 right-1/4 opacity-10 animate-pulse" style={{animationDelay: '1s', animationDuration: '4s'}} />
          <div className="absolute w-12 h-12 bg-[#EDEAD6] rounded-full bottom-1/3 left-1/4 opacity-15 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}} />
          <div className="absolute w-28 h-28 bg-[#DDE1C5] rounded-full top-2/3 right-1/3 opacity-8 animate-ping" style={{animationDelay: '0.5s', animationDuration: '6s'}} />
          
          {/* Nature Elements */}
          <div className="absolute top-20 right-20 text-4xl opacity-20 animate-bounce" style={{animationDelay: '3s', animationDuration: '7s'}}>🍃</div>
          <div className="absolute bottom-32 left-16 text-3xl opacity-15 animate-pulse" style={{animationDelay: '1.5s', animationDuration: '5s'}}>🌱</div>
          <div className="absolute top-1/3 left-1/3 text-2xl opacity-10 animate-bounce" style={{animationDelay: '4s', animationDuration: '8s'}}>🌿</div>
          <div className="absolute bottom-1/4 right-1/5 text-3xl opacity-12 animate-pulse" style={{animationDelay: '2.5s', animationDuration: '6s'}}>🍀</div>
          
          {/* Gentle Gradient Waves */}
          <div className="absolute w-full h-32 bg-gradient-to-r from-[#DDE1C5] via-transparent to-[#EDEAD6] opacity-10 top-1/4 animate-pulse" style={{animationDuration: '8s'}} />
          <div className="absolute w-full h-24 bg-gradient-to-l from-[#6A752D] via-transparent to-[#DDE1C5] opacity-5 bottom-1/3 animate-ping" style={{animationDuration: '10s'}} />
          
          {/* Subtle Moving Lines */}
          <div className="absolute h-px w-32 bg-[#6A752D] opacity-20 top-1/5 left-1/4 rotate-45 animate-pulse" style={{animationDuration: '6s'}} />
          <div className="absolute h-px w-24 bg-[#DDE1C5] opacity-15 bottom-1/5 right-1/3 -rotate-45 animate-bounce" style={{animationDuration: '7s'}} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-[Playfair_Display] text-[#6A752D] text-center mb-16"
          >
            🌿 Your MindGarden Journey
          </motion.h1>

          {/* Hero Feature - Journal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-[#DDE1C5] to-[#EDEAD6] text-[#3A3A3A] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-[#6A752D]/20">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4 text-[#6A752D]">📝 Journal Your Thoughts</h2>
                  <p className="text-lg mb-6 text-[#5A5A5A]">Express yourself freely in a safe, private space designed for reflection and personal growth.</p>
                  <Link
                    to="/journal"
                    className="inline-block px-6 py-3 bg-[#6A752D] text-white rounded-lg hover:bg-[#5A6425] transition font-semibold shadow-md hover:shadow-lg no-underline"
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Start Writing
                  </Link>
                </div>
                <div className="text-6xl opacity-30 text-[#6A752D]">📝</div>
              </div>
            </div>
          </motion.div>

          {/* Grid of 4 Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.slice(1).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl">{feature.title.split(' ')[0]}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#3A3A3A] mb-2 group-hover:text-[#6A752D] transition-colors">
                        {feature.title.substring(2)}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                  
                  {/* Conditional rendering for chatbot vs regular links */}
                  {feature.action ? (
                    <button
                      onClick={feature.action}
                      className="inline-flex items-center px-4 py-2 rounded-lg hover:bg-[#5A6425] hover:text-white transition-all duration-300 font-medium group-hover:shadow-md border-none cursor-pointer no-underline"
                      style={{ 
                        backgroundColor: '#6A752D',
                        color: 'white', 
                        textDecoration: 'none',
                        border: 'none'
                      }}
                    >
                      Explore
                      <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  ) : (
                    <Link
                      to={feature.link}
                      className="inline-flex items-center px-4 py-2 bg-[#6A752D] text-white rounded-lg hover:bg-[#5A6425] hover:text-white transition-all duration-300 font-medium group-hover:shadow-md no-underline"
                      style={{ color: 'white', textDecoration: 'none' }}
                    >
                      Explore
                      <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
