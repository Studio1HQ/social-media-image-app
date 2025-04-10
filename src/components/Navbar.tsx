
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  Home, 
  LogIn, 
  Menu, 
  Search, 
  Upload, 
  User, 
  X, 
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <div className="navbar p-3 md:px-6">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center cursor-pointer"
        >
          <span className="text-2xl font-bold text-primary">Pixel</span>
          <span className="text-2xl font-bold">Palace</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {searchOpen ? (
            <div className="relative animate-fade-in">
              <Input
                type="text"
                placeholder="Search images, users..."
                className="w-72 pl-10"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Home className="h-5 w-5" />
          </Button>
          
          {isAuthenticated && !isLoading ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => navigate('/upload')}>
                <Upload className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')}>
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar 
                className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => navigate('/profile')}
              >
                {user?.profile_image_url ? (
                  <AvatarImage src={user.profile_image_url} alt={user.username || 'User'} />
                ) : null}
                <AvatarFallback>
                  {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </>
          ) : !isLoading ? (
            <Button variant="default" onClick={() => navigate('/login')}>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          ) : null}
          
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="h-5 w-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 pt-6">
                <Button variant="ghost" className="justify-start" onClick={() => navigate('/')}>
                  <Home className="mr-2 h-5 w-5" /> Home
                </Button>
                
                {isAuthenticated && !isLoading ? (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/upload')}>
                      <Upload className="mr-2 h-5 w-5" /> Upload
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/notifications')}>
                      <Bell className="mr-2 h-5 w-5" /> Notifications
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-5 w-5" /> Profile
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => logout()}>
                      <LogOut className="mr-2 h-5 w-5" /> Logout
                    </Button>
                  </>
                ) : !isLoading ? (
                  <Button variant="default" className="justify-start" onClick={() => navigate('/login')}>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Button>
                ) : null}
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Mobile Search */}
      {searchOpen && (
        <div className="md:hidden container mt-2 animate-fade-in">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search images, users..."
              className="w-full pl-10"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
