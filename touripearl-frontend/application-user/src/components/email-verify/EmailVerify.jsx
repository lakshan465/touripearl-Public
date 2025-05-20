import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/Card/Card';
import { Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosFetch from '@utils/axiosFetch';
import {UserNotFound} from "../not-found/NotFound.jsx";

const EmailVerify = () => {
  const [tokens, setTokens] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { Emailverified } = location.state || { Emailverified: false };
  const navigate =useNavigate();

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Combine tokens into a single string
  const getTokenString = () => tokens.join('');

  const handleChange = (index, value) => {
    const upperValue = value.toUpperCase();
    if (!/^[A-Z0-9]*$/.test(upperValue)) return;

    const newTokens = [...tokens];
    newTokens[index] = upperValue;
    setTokens(newTokens);

    if (value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }

    setIsComplete(newTokens.every(token => token !== ''));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !tokens[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().slice(0, 6);
    if (!/^[A-Z0-9]+$/.test(pastedData)) return;

    const newTokens = [...tokens];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newTokens[index] = char;
    });
    setTokens(newTokens);
    setIsComplete(true);
    
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs[focusIndex].current.focus();
  };

  const handleSubmit = async () => {
    if (!isComplete) return;
    
    const tokenString = getTokenString();
    
    toast.promise(
      async () => {
        setIsLoading(true);
        try {
          const response = await axiosFetch.get(`/api/v1/users/verify-email/${tokenString}`);
          navigate('/login');
        } finally {
          setIsLoading(false);
        }
      },
      {
        success: 'Code verified successfully',
        loading: 'Verifying code...',
        error: (error) => `${error?.response?.data?.message|| error}`
      }
    );
  };

  if(!Emailverified){
    return(
      <UserNotFound/>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Enter Verification Code For Email Verify</CardTitle>
        <p className="text-sm text-gray-500">
          Enter the 6-character code we sent to your email.
          Numbers and capital letters only.
        </p>
      </CardHeader>
      <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex gap-2">
              {tokens.map((token, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={token}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-2xl font-mono uppercase border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoCapitalize="characters"
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isComplete || isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>
          </div>
        
      </CardContent>
    </Card>
    </div>
  );
};

export default EmailVerify;