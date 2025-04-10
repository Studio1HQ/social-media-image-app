
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<ResetPasswordFormValues>({
    defaultValues: { 
      password: '',
      confirmPassword: ''
    }
  });
  
  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (data.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      await resetPassword(data.password);
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Link to="/" className="mb-8 flex items-center">
        <span className="text-3xl font-bold text-primary">Pixel</span>
        <span className="text-3xl font-bold">Palace</span>
      </Link>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "Your password has been reset successfully" 
              : "Enter your new password below"
            }
          </CardDescription>
        </CardHeader>
        
        {!isSubmitted ? (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label 
                  htmlFor="password" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  New Password
                </label>
                <Input
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  autoComplete="new-password"
                  required
                  {...form.register('password', { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <label 
                  htmlFor="confirmPassword" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  autoComplete="new-password"
                  required
                  {...form.register('confirmPassword', { required: true })}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit"
                className="w-full"
                disabled={isSubmitting || !form.watch('password') || !form.watch('confirmPassword')}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
              
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-6">
            <div className="bg-primary/10 text-primary p-4 rounded-md flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <p>
                Your password has been reset successfully.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                type="button"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
