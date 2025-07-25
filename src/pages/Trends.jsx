// src/pages/Trends.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import Navbar from "../components/Navbar";

const Trends = () => {
  const [moodData, setMoodData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchMoodEntries = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "moods"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const moods = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
      }));
      
      setMoodData(moods);
      processWeeklyData(moods);
      processMonthlyData(moods);
    };

    fetchMoodEntries();
  }, []);

  const processWeeklyData = (moods) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyMoods = moods.filter(mood => mood.createdAt >= weekAgo);
    setWeeklyData(weeklyMoods);
  };

  const processMonthlyData = (moods) => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const monthlyMoods = moods.filter(mood => mood.createdAt >= monthAgo);
    setMonthlyData(monthlyMoods);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const moodColors = {
    "anxious": "#FF6347",
    "sad": "#ADD8E6", 
    "neutral": "#D3D3D3",
    "happy": "#FFA500",
    "excited": "#FFD700"
  };

  const getMoodStats = (data) => {
    const stats = data.reduce((acc, entry) => {
      const mood = entry.mood.toLowerCase();
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(stats).map(([mood, count]) => ({
      mood,
      count,
      percentage: ((count / data.length) * 100).toFixed(1)
    }));
  };

  const generateCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayMoods = moodData.filter(mood => {
        const moodDate = new Date(mood.createdAt);
        return moodDate.getDate() === day && 
               moodDate.getMonth() === month && 
               moodDate.getFullYear() === year;
      });
      
      calendarDays.push({
        day,
        date,
        moods: dayMoods
      });
    }
    
    return calendarDays;
  };

  const getMoodForDay = (dayData) => {
    if (!dayData || dayData.moods.length === 0) return null;
    
    // If multiple moods in a day, get the latest one
    const latestMood = dayData.moods.reduce((latest, current) => 
      current.createdAt > latest.createdAt ? current : latest
    );
    
    return latestMood;
  };

  const getDayOfWeek = (dayIndex) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8F4E9] p-6 font-[Montserrat]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-[Playfair_Display] text-[#6A752D] text-center mb-8">
            📈 Mood Trends & Insights
          </h2>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-[#6A752D] mb-2">Total Entries</h3>
              <p className="text-3xl font-bold text-[#6B6B4D]">{moodData.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-[#6A752D] mb-2">This Week</h3>
              <p className="text-3xl font-bold text-[#6B6B4D]">{weeklyData.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-[#6A752D] mb-2">This Month</h3>
              <p className="text-3xl font-bold text-[#6B6B4D]">{monthlyData.length}</p>
            </div>
          </div>

          {/* Weekly Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-[#6A752D] mb-4">Weekly Mood Analysis</h3>
            {weeklyData.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {getMoodStats(weeklyData).map(({ mood, count, percentage }) => (
                    <div key={mood} className="text-center p-4 rounded-lg" style={{ backgroundColor: moodColors[mood] + '20' }}>
                      <div className="text-2xl mb-2" style={{ color: moodColors[mood] }}>●</div>
                      <p className="font-semibold capitalize text-[#6B6B4D]">{mood}</p>
                      <p className="text-sm text-[#999]">{count} times ({percentage}%)</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-[#6A752D]">Recent Weekly Entries:</h4>
                  {weeklyData.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center p-3 bg-[#F5F5DC] rounded-lg">
                      <span className="capitalize font-medium text-[#6B6B4D]">{entry.mood}</span>
                      <span className="text-sm text-[#999]">{formatDate(entry.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[#6B6B4D] italic">No mood entries this week.</p>
            )}
          </div>

          {/* Monthly Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-[#6A752D] mb-4">Monthly Mood Analysis</h3>
            {monthlyData.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {getMoodStats(monthlyData).map(({ mood, count, percentage }) => (
                    <div key={mood} className="text-center p-4 rounded-lg" style={{ backgroundColor: moodColors[mood] + '20' }}>
                      <div className="text-2xl mb-2" style={{ color: moodColors[mood] }}>●</div>
                      <p className="font-semibold capitalize text-[#6B6B4D]">{mood}</p>
                      <p className="text-sm text-[#999]">{count} times ({percentage}%)</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[#6B6B4D] italic">No mood entries this month.</p>
            )}
          </div>

          {/* Recent Entries Calendar View */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-[#6A752D] mb-4">Recent Mood History</h3>
            {moodData.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-4">
                  {moodData.slice(0, 14).map((entry) => (
                    <div key={entry.id} className="p-3 rounded-lg text-center shadow-sm border" style={{ backgroundColor: moodColors[entry.mood.toLowerCase()] + '30' }}>
                      <div className="text-sm font-bold text-[#6B6B4D]">
                        {entry.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <div className="text-xs capitalize text-[#6B6B4D] mt-1">{entry.mood}</div>
                      <div className="text-xs text-[#999] mt-1">
                        {entry.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#999]">* Showing latest 14 entries</p>
              </div>
            ) : (
              <p className="text-[#6B6B4D] italic">No mood entries yet. Start tracking your mood to see trends!</p>
            )}
          </div>

          {/* Monthly Calendar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-[#6A752D] mb-4">
              {getMonthName(new Date().getMonth())} {new Date().getFullYear()} - Mood Calendar
            </h3>
            
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-[#6A752D] py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {generateCalendar().map((dayData, index) => {
                if (!dayData) {
                  return <div key={index} className="aspect-square"></div>;
                }
                
                const mood = getMoodForDay(dayData);
                const isToday = dayData.date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={dayData.day}
                    className={`aspect-square p-2 rounded-lg border-2 text-center relative ${
                      isToday ? 'border-[#6A752D] border-solid' : 'border-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: mood ? moodColors[mood.mood.toLowerCase()] + '30' : '#F9F9F9'
                    }}
                  >
                    <div className="text-sm font-bold text-[#6B6B4D]">
                      {dayData.day}
                    </div>
                    {mood && (
                      <div>
                        <div className="text-xs mt-1 capitalize text-[#6B6B4D]">
                          {mood.mood}
                        </div>
                        {dayData.moods.length > 1 && (
                          <div className="text-xs text-[#999] mt-1">
                            +{dayData.moods.length - 1} more
                          </div>
                        )}
                      </div>
                    )}
                    {isToday && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-[#6A752D] rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Calendar Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {Object.entries(moodColors).map(([mood, color]) => (
                <div key={mood} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-sm capitalize text-[#6B6B4D]">{mood}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-[#999]">
                * Today is highlighted with a green border and dot
              </p>
              <p className="text-xs text-[#999] mt-1">
                * Days with multiple moods show the latest entry
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trends;
