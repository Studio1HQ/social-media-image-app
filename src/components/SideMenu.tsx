
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flame, Users, Compass, BookMarked, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

const SideMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Menu items
  const menuItems = [
    { label: 'Trending', icon: Flame, path: '/trending' },
    { label: 'Following', icon: Users, path: '/following' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'Collections', icon: BookMarked, path: '/collections' },
    { label: 'Community', icon: HeartHandshake, path: '/community' },
  ];

  return (
    <div 
      className={cn(
        "fixed left-0 top-16 bottom-0 bg-background border-r border-border z-30 transition-all duration-300 pt-4 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="px-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1",
                isCollapsed ? "px-3" : "px-3"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon 
                className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} 
              />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="m-2 self-end"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? 
          <ChevronRight className="h-4 w-4" /> : 
          <ChevronLeft className="h-4 w-4" />
        }
      </Button>
    </div>
  );
};

export default SideMenu;
