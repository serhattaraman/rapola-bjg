
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, PlusCircle, BarChart, Menu, X } from 'lucide-react';

/*
.NET MVC için Navbar örneği:

@model NavbarViewModel

<nav class="main-navbar @(Model.IsScrolled ? "scrolled" : "")">
  <div class="navbar-container">
    <div class="navbar-inner">
      <div class="navbar-logo">
        <a href="@Url.Action("Index", "Home")" class="brand-name">Rapola</a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="desktop-nav">
        @foreach (var item in Model.NavItems)
        {
          <a href="@Url.Action(item.Action, item.Controller)" 
             class="nav-item @item.CssClass @(ViewBag.ActiveMenu == item.Controller ? "active" : "")">
            <i class="@item.IconClass"></i>
            <span class="nav-text">@item.Name</span>
          </a>
        }
      </div>
      
      <!-- Mobile menu button -->
      <div class="mobile-menu-button">
        <button
          onclick="toggleMobileMenu()"
          class="mobile-toggle-button"
          aria-expanded="@(Model.IsMobileMenuOpen ? "true" : "false")">
          <span class="sr-only">Open main menu</span>
          @if (Model.IsMobileMenuOpen)
          {
            <i class="icon-x"></i>
          }
          else
          {
            <i class="icon-menu"></i>
          }
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Navigation -->
  <div class="mobile-nav-container @(Model.IsMobileMenuOpen ? "block" : "hidden")">
    <div class="mobile-nav-inner">
      @foreach (var item in Model.NavItems)
      {
        <a href="@Url.Action(item.Action, item.Controller)" 
           class="nav-item-mobile @item.CssClass @(ViewBag.ActiveMenu == item.Controller ? "active" : "")">
          <i class="@item.IconClass"></i>
          <span class="nav-text">@item.Name</span>
        </a>
      }
    </div>
  </div>
</nav>

<script>
function toggleMobileMenu() {
  var mobileNav = document.querySelector('.mobile-nav-container');
  mobileNav.classList.toggle('hidden');
  
  var menuButton = document.querySelector('.mobile-toggle-button');
  var isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', !isExpanded);
  
  var menuIcon = menuButton.querySelector('i');
  if (isExpanded) {
    menuIcon.classList.remove('icon-x');
    menuIcon.classList.add('icon-menu');
  } else {
    menuIcon.classList.remove('icon-menu');
    menuIcon.classList.add('icon-x');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var handleScroll = function() {
    var navbar = document.querySelector('.main-navbar');
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
});
</script>

@* ViewModel örneği: *@
public class NavbarViewModel
{
    public bool IsScrolled { get; set; }
    public bool IsMobileMenuOpen { get; set; }
    public List<NavItemViewModel> NavItems { get; set; }
}

public class NavItemViewModel
{
    public string Name { get; set; }
    public string Controller { get; set; }
    public string Action { get; set; }
    public string IconClass { get; set; }
    public string CssClass { get; set; }
}
*/

// .NET MVC uyumlu sınıf adları ve yapı
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Bu nesne .NET MVC'de C# model sınıfına dönüştürülebilir
  const navItems = [
    { name: 'Genel Bakış', path: '/', icon: <Home className="w-5 h-5" />, cssClass: 'nav-home', controller: 'Home', action: 'Index' },
    { name: 'Adaylar', path: '/candidates', icon: <Users className="w-5 h-5" />, cssClass: 'nav-candidates', controller: 'Candidate', action: 'Index' },
    { name: 'Aday Ekle', path: '/add-candidate', icon: <PlusCircle className="w-5 h-5" />, cssClass: 'nav-add', controller: 'Candidate', action: 'Create' },
    { name: 'Raporlar', path: '/reports', icon: <BarChart className="w-5 h-5" />, cssClass: 'nav-reports', controller: 'Report', action: 'Index' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 main-navbar ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm scrolled' : 'bg-white/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-container">
        <div className="flex justify-between h-16 navbar-inner">
          <div className="flex-shrink-0 flex items-center navbar-logo">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-primary brand-name">Rapola</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 nav-item ${item.cssClass} ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10 active'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.icon}
                <span className="ml-2 nav-text">{item.name}</span>
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center mobile-menu-button">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white mobile-nav-container`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 mobile-nav-inner">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium nav-item-mobile ${item.cssClass} ${
                location.pathname === item.path
                  ? 'text-primary bg-primary/10 active'
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {item.icon}
              <span className="ml-2 nav-text">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
