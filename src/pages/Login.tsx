
import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { Github, Twitter, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

interface SignupFormValues {
  fullName: string;
  username: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, forgotPassword, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
  
  const loginForm = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });
  
  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      agreeToTerms: false
    }
  });
  
  // If already authenticated, redirect to home page
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" />;
  }
  
  const handleLogin = async (data: LoginFormValues) => {
    await login(data.email, data.password);
  };
  
  const handleSignup = async (data: SignupFormValues) => {
    if (!data.agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Agreement required",
        description: "You must agree to the Terms of Service to create an account."
      });
      return;
    }
    await signup(data.email, data.password, data.username, data.fullName);
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address."
      });
      return;
    }
    
    setIsSubmittingForgot(true);
    try {
      await forgotPassword(forgotPasswordEmail);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password."
      });
      setIsForgotPasswordMode(false);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    } finally {
      setIsSubmittingForgot(false);
    }
  };
  
  if (isForgotPasswordMode) {
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
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email" 
                  placeholder="m@example.com" 
                  autoComplete="email"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit"
                className="w-full"
                disabled={isSubmittingForgot || !forgotPasswordEmail}
              >
                {isSubmittingForgot ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              
              <Button 
                type="button"
                variant="link" 
                onClick={() => setIsForgotPasswordMode(false)}
              >
                Back to Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }
  
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
          <CardTitle className="text-2xl">Welcome to PixelPalace</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email" 
                    placeholder="m@example.com" 
                    autoComplete="email"
                    {...loginForm.register('email', { required: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="password" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Password
                    </label>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm font-medium text-primary"
                      type="button"
                      onClick={() => setIsForgotPasswordMode(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    autoComplete="current-password"
                    {...loginForm.register('password', { required: true })}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    {...loginForm.register('remember')}
                  />
                  <label 
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                
                <div className="relative my-4 w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button variant="outline" type="button">
                    <Github className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button variant="outline" type="button">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          
          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <form onSubmit={signupForm.handleSubmit(handleSignup)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label 
                    htmlFor="fullname" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Full Name
                  </label>
                  <Input
                    id="fullname"
                    placeholder="John Doe" 
                    autoComplete="name"
                    {...signupForm.register('fullName', { required: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label 
                    htmlFor="username" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    placeholder="johndoe" 
                    autoComplete="username"
                    {...signupForm.register('username', { required: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label 
                    htmlFor="signup-email" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email" 
                    placeholder="m@example.com" 
                    autoComplete="email"
                    {...signupForm.register('email', { required: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label 
                    htmlFor="signup-password" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password" 
                    placeholder="••••••••" 
                    autoComplete="new-password"
                    {...signupForm.register('password', { required: true })}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={signupForm.watch('agreeToTerms')}
                    onCheckedChange={(checked) => {
                      signupForm.setValue('agreeToTerms', checked === true);
                    }}
                  />
                  <label 
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    onClick={() => signupForm.setValue('agreeToTerms', !signupForm.watch('agreeToTerms'))}
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !signupForm.watch('agreeToTerms')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                
                <div className="relative my-4 w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button variant="outline" type="button">
                    <Github className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button variant="outline" type="button">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
