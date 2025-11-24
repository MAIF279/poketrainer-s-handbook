import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, Users, Package, Search } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">PokeAgenda</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive("/profile") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/profile">
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Perfil</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive("/team") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/team">
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Time</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive("/box") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/box">
                <Package className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Box</span>
              </Link>
            </Button>
            
            <Button
              variant={isActive("/search") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/search">
                <Search className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Buscar</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
