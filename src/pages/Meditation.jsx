// src/pages/Meditation.jsx
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const Meditation = () => {
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timers, setTimers] = useState({});
  const [intervals, setIntervals] = useState({});
  const audioRef = useRef(null);

  const meditations = [
    {
      id: 1,
      title: "🌅 Morning Calm",
      description: "Start your day with intention and mindfulness.",
      // You can replace these with actual audio file paths
      audioSrc: "/morning.mp3" // Example audio
    },
    {
      id: 2,
      title: "🌙 Night Wind-Down",
      description: "Unwind and let go of your stress before sleeping.",
      audioSrc: "/night.mp3" // Example audio
    },
    {
      id: 3,
      title: "🎵 Ambient Forest",
      description: "Nature-inspired sounds to help you stay focused or meditate.",
      audioSrc: "/forest.mp3" // Example audio
    },
    {
      id: 4,
      title: "💨 Breathing Exercise",
      description: "Follow this simple breathing pattern to calm your mind.",
      audioSrc: "/breathe.mp3" // Example audio
    }
  ];

  const handlePlayPause = (meditation) => {
    console.log('Attempting to play:', meditation.audioSrc);
    if (currentPlaying === meditation.id && isPlaying) {
      // Pause current audio
      audioRef.current?.pause();
      setIsPlaying(false);
      console.log('Audio paused');
    } else {
      // Play new audio
      if (audioRef.current) {
        audioRef.current.src = meditation.audioSrc;
        console.log('Audio src set to:', meditation.audioSrc);
        audioRef.current.play().then(() => {
          console.log('Audio playing successfully');
          setCurrentPlaying(meditation.id);
          setIsPlaying(true);
        }).catch(error => {
          console.error('Audio playback failed:', error);
          alert('Could not play audio. Error: ' + error.message);
        });
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentPlaying(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerToggle = (meditationId) => {
    if (intervals[meditationId]) {
      // Stop timer
      clearInterval(intervals[meditationId]);
      setIntervals(prev => {
        const newIntervals = { ...prev };
        delete newIntervals[meditationId];
        return newIntervals;
      });
    } else {
      // Start timer
      const intervalId = setInterval(() => {
        setTimers(prev => ({
          ...prev,
          [meditationId]: (prev[meditationId] || 0) + 1
        }));
      }, 1000);
      
      setIntervals(prev => ({
        ...prev,
        [meditationId]: intervalId
      }));
    }
  };

  const resetTimer = (meditationId) => {
    // Clear interval if running
    if (intervals[meditationId]) {
      clearInterval(intervals[meditationId]);
      setIntervals(prev => {
        const newIntervals = { ...prev };
        delete newIntervals[meditationId];
        return newIntervals;
      });
    }
    
    // Reset timer
    setTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[meditationId];
      return newTimers;
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleAudioEnd);
      return () => audio.removeEventListener('ended', handleAudioEnd);
    }
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervals).forEach(intervalId => {
        clearInterval(intervalId);
      });
    };
  }, [intervals]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8F4E9] px-6 py-10 text-[#3A3A3A] font-[Montserrat]">
      <h1 className="text-3xl font-[Playfair_Display] mb-6 text-center text-[#6A752D]">
        🧘‍♀️ Guided Meditations
      </h1>
      <p className="text-center mb-8 text-[#555] max-w-xl mx-auto">
        Take a deep breath. These guided meditations help you relax, focus, and restore your inner peace.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {meditations.map((meditation) => (
          <div key={meditation.id} className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{meditation.title}</h2>
            <p className="text-sm text-[#555] mb-4">{meditation.description}</p>
            
            {/* Timer Display */}
            <div className="mb-4 p-3 bg-[#F5F5DC] rounded-lg text-center">
              <div className="text-2xl font-bold text-[#6A752D] mb-1">
                {formatTime(timers[meditation.id] || 0)}
              </div>
              <div className="text-xs text-[#999]">
                {intervals[meditation.id] ? 'Meditation in progress...' : 'Ready to meditate'}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 justify-between">
              <button 
                onClick={() => handlePlayPause(meditation)}
                className="flex-1 px-3 py-2 bg-[#6A752D] text-white rounded hover:bg-[#5A6425] transition flex items-center justify-center gap-2 text-sm"
              >
                {currentPlaying === meditation.id && isPlaying ? (
                  <>
                    <span>⏸️</span> Pause
                  </>
                ) : (
                  <>
                    <span>▶️</span> Play
                  </>
                )}
              </button>
              
              <button 
                onClick={() => handleTimerToggle(meditation.id)}
                className={`flex-1 px-3 py-2 rounded transition flex items-center justify-center gap-2 text-sm ${
                  intervals[meditation.id] 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-[#8B9A46] hover:bg-[#7A8A3D] text-white'
                }`}
              >
                {intervals[meditation.id] ? (
                  <>
                    <span>⏹️</span> Stop
                  </>
                ) : (
                  <>
                    <span>⏱️</span> Timer
                  </>
                )}
              </button>
              
              <button 
                onClick={() => resetTimer(meditation.id)}
                className="flex-1 px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition flex items-center justify-center gap-2 text-sm"
              >
                <span>🔄</span> Reset
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
    </>
  );
};

export default Meditation;
