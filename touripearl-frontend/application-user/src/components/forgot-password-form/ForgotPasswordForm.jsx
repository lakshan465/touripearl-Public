import React, { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/card/Card';
import axiosFetch from '../../utils/axiosFetch';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.promise(
        async()=>{
          try{
          setIsLoading(true);
            await axiosFetch.post('api/v1/users/password-reset-request', {email:email});
            navigate('/forgot-password/verify', { state: { Emailverified:true } });    
          }
          finally{
            setIsLoading(false);
          }
        }
        ,{   
          success: 'Check your email for password reset instructions.',
          loading: 'Sending...',
          error: (error) =>error.response.data.message,      
        }
    );
    
  
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Forgot Password
        </CardTitle>
        <CardHeader>
          Enter your email address and we'll send you a link to reset your password.
        </CardHeader>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
