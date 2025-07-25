export default {
  content: [
   "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: '0.1' },
          '25%': { transform: 'translateY(-15px) translateX(10px) rotate(2deg)', opacity: '0.2' },
          '50%': { transform: 'translateY(-30px) translateX(0) rotate(5deg)', opacity: '0.15' },
          '75%': { transform: 'translateY(-15px) translateX(-10px) rotate(3deg)', opacity: '0.25' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(20px) translateY(-10px)' },
          '50%': { transform: 'translateX(-10px) translateY(-20px)' },
          '75%': { transform: 'translateX(-20px) translateY(-5px)' },
        },
        gentleWave: {
          '0%, 100%': { transform: 'scaleX(1) scaleY(1)', opacity: '0.05' },
          '50%': { transform: 'scaleX(1.1) scaleY(0.9)', opacity: '0.1' },
        },
        expandFromCenter: {
          '0%': { 
            transform: 'scaleX(0) scaleY(0.8)', 
            opacity: '0',
            transformOrigin: 'center'
          },
          '50%': { 
            transform: 'scaleX(1.05) scaleY(0.95)', 
            opacity: '0.8',
            transformOrigin: 'center'
          },
          '100%': { 
            transform: 'scaleX(1) scaleY(1)', 
            opacity: '1',
            transformOrigin: 'center'
          },
        },
        slideExpandLeft: {
          '0%': { 
            transform: 'translateX(-100px) scaleX(0)', 
            opacity: '0',
            transformOrigin: 'center'
          },
          '100%': { 
            transform: 'translateX(0) scaleX(1)', 
            opacity: '1',
            transformOrigin: 'center'
          },
        },
        slideExpandRight: {
          '0%': { 
            transform: 'translateX(100px) scaleX(0)', 
            opacity: '0',
            transformOrigin: 'center'
          },
          '100%': { 
            transform: 'translateX(0) scaleX(1)', 
            opacity: '1',
            transformOrigin: 'center'
          },
        },
      },
      animation: {
        pulse: "pulse 3s infinite",
        ping: "ping 4s infinite",
        bounce: "bounce 6s infinite",
        'expand-center': 'expandFromCenter 0.8s ease-out forwards',
        'slide-expand-left': 'slideExpandLeft 0.8s ease-out forwards',
        'slide-expand-right': 'slideExpandRight 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 12s ease-in-out infinite',
        'drift': 'drift 15s ease-in-out infinite',
        'gentle-wave': 'gentleWave 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
