import React from 'react';
import { Sparkles } from 'lucide-react';

const Loading = ({ message = 'Loading...', submessage = 'Please wait' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-pulse mb-6">
        <Sparkles className="w-16 h-16 text-primary mx-auto animate-spin" />
      </div>
      <h2 className="text-3xl font-bold text-primary mb-2">{message}</h2>
      <p className="text-gray-600 text-lg">{submessage}</p>
    </div>
  );
};

export default Loading;
