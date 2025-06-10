import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <ApperIcon name="Search" className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        
        <div className="space-y-3">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Go to Tasks
          </Button>
          
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;