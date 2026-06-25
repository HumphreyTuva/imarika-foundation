import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);

  // Load saved preference and handle audio
  useEffect(() => {
    const savedPreference = localStorage.getItem('imarika-audio-enabled');
    const shouldPlay = savedPreference !== 'false';
    setIsAudioPlaying(shouldPlay);

    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      if (shouldPlay) {
        audioRef.current.play().catch(() => {
          setIsAudioPlaying(false);
          localStorage.setItem('imarika-audio-enabled', 'false');
        });
      }
    }

    // Auto-redirect after 6 seconds
    const redirectTimeout = setTimeout(() => {
      navigate('/');
    }, 8000);

    return () => clearTimeout(redirectTimeout);
  }, [navigate]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
      localStorage.setItem('imarika-audio-enabled', 'false');
    } else {
      audioRef.current.play().catch(() => {});
      localStorage.setItem('imarika-audio-enabled', 'true');
    }

    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-orange-100 px-4 py-12 flex items-center justify-center relative overflow-hidden">
    <audio ref={audioRef} src="/audio/welcome.mp3" />

      {/* Background Floating Shapes */}
      <motion.div
        className="absolute w-32 h-32 bg-blue-200 rounded-full top-10 left-10 opacity-30"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-24 h-24 bg-orange-300 rounded-full bottom-20 right-16 opacity-30"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-20 h-20 bg-yellow-200 rounded-full top-2/3 left-1/4 opacity-20"
        animate={{ x: [0, 15, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
      >
        {isAudioPlaying ? (
          <Volume2 className="text-blue-700 w-6 h-6" />
        ) : (
          <VolumeX className="text-gray-500 w-6 h-6" />
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl w-full"
      >
        <motion.img
          src="/images/imarikaf.png"
          alt="Imarika Foundation Logo"
          className="w-44 h-44 md:w-52 md:h-52 mx-auto rounded-full border-4 border-white shadow-xl bg-white p-2 object-contain"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        />

        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-black">Imarika</span>{' '}
          <span className="text-orange-500">Foundation</span>
        </motion.h1>

        <motion.p
          className="mt-4 text-gray-700 text-lg md:text-xl px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Secure, empowered, resilient, and transformed communities.
        </motion.p>

        <motion.button
          onClick={() => navigate('/')}
          className="mt-8 px-8 py-3 bg-blue-700 text-white text-lg font-semibold rounded-full shadow-md hover:shadow-xl hover:bg-blue-800 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter Site
        </motion.button>
      </motion.div>
    </div>
  );
}
