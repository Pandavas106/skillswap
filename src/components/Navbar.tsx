import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Home, ShoppingBag, Users, Calendar, LogIn, UserPlus, TestTube, LogOut, User } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold transition-transform group-hover:scale-110">S</span>
            <span className="font-playfair text-lg font-semibold group-hover:text-primary transition-colors">SkillSwap</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingBag className="h-4 w-4" />
              <span>Marketplace</span>
            </Link>
            <Link to="/matches" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Users className="h-4 w-4" />
              <span>Matches</span>
            </Link>
            <Link to="/schedule" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </Link>
            <Link to="/test" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <TestTube className="h-4 w-4" />
              <span>Take Test</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full transition-transform hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1.5 hover:bg-accent/40 transition-all duration-300">
                    <User className="h-4 w-4" />
                    {user.email?.split('@')[0] || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="flex items-center gap-1.5 hover:bg-accent/40 transition-all duration-300">
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="flex items-center gap-1.5 group transition-all duration-300 hover:scale-105">
                    <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-16 z-50 bg-background px-6 py-8 transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-6">
          <Link 
            to="/marketplace" 
            className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingBag className="h-5 w-5" />
            Marketplace
          </Link>
          <Link 
            to="/matches" 
            className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Users className="h-5 w-5" />
            Matches
          </Link>
          <Link 
            to="/schedule" 
            className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Calendar className="h-5 w-5" />
            Schedule
          </Link>
          <Link 
            to="/test" 
            className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <TestTube className="h-5 w-5" />
            Take Test
          </Link>
          
          <div className="flex flex-col gap-2 mt-4">
            {user ? (
              <>
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  Signed in as <span className="font-medium">{user.email}</span>
                </div>
                <Button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }} 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full flex items-center justify-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
