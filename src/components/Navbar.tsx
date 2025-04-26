import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const isAdminOrManager = isAdmin || user?.role === "manager";

  return (
    <nav className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center font-semibold">
            Rapola
          </Link>
          
          <NavigationMenuList>
            {user && (
              <>
                <NavigationMenuItem>
                  <Link to="/" className="nav-link">
                    Ana Sayfa
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/candidates" className="nav-link">
                    Adaylar
                  </Link>
                </NavigationMenuItem>

                {isAdminOrManager && (
                  <>
                    <NavigationMenuItem>
                      <Link to="/add-candidate" className="nav-link">
                        Aday Ekle
                      </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Raporlar</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[200px]">
                          <NavigationMenuLink asChild>
                            <Link to="/reports" className="nav-link block">
                              Genel Raporlar
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link to="/advertising-reports" className="nav-link block">
                              Reklam Raporları
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                )}

                {isAdmin && (
                  <NavigationMenuItem>
                    <Link to="/users" className="nav-link">
                      Kullanıcılar
                    </Link>
                  </NavigationMenuItem>
                )}
              </>
            )}
          </NavigationMenuList>

          <div className="flex items-center space-x-2">
            <DarkModeToggle />
            {user ? (
              <Button variant="destructive" size="sm" onClick={logout}>
                Çıkış Yap
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm">Giriş Yap</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
