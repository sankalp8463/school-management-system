import { Component, signal, computed, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { routes } from '../app.routes';

type AppLanguage = 'en' | 'hi' | 'mr';

interface AppCopy {
  schoolManagement: string;
  overview: string;
  dashboard: string;
  admissions: string;
  people: string;
  students: string;
  employees: string;
  parents: string;
  academics: string;
  classes: string;
  subjects: string;
  attendance: string;
  assignments: string;
  exams: string;
  results: string;
  financeOps: string;
  fees: string;
  transport: string;
  system: string;
  settings: string;
  logout: string;
  searchPlaceholder: string;
  academicYear: string;
  admin: string;
  superAdmin: string;
  notifications: string;
  noUnread: string;
  profile: string;
  password: string;
  language: string;
  theme: string;
  lightMode: string;
  darkMode: string;
}

const COPY: Record<AppLanguage, AppCopy> = {
  en: {
    schoolManagement: 'School Management',
    overview: 'Overview',
    dashboard: 'Dashboard',
    admissions: 'Admissions',
    people: 'People',
    students: 'Students',
    employees: 'Employees',
    parents: 'Parents',
    academics: 'Academics',
    classes: 'Classes',
    subjects: 'Subjects',
    attendance: 'Attendance',
    assignments: 'Assignments',
    exams: 'Exams',
    results: 'Results',
    financeOps: 'Finance & Ops',
    fees: 'Fees',
    transport: 'Transport',
    system: 'System',
    settings: 'Settings',
    logout: 'Logout',
    searchPlaceholder: 'Search students, employees, fees...',
    academicYear: 'AY 2026-27',
    admin: 'Admin',
    superAdmin: 'Super Admin',
    notifications: 'Notifications',
    noUnread: 'All caught up',
    profile: 'Profile',
    password: 'Password',
    language: 'Language',
    theme: 'Theme',
    lightMode: 'Light mode',
    darkMode: 'Dark mode'
  },
  hi: {
    schoolManagement: 'स्कूल प्रबंधन',
    overview: 'अवलोकन',
    dashboard: 'डैशबोर्ड',
    admissions: 'प्रवेश',
    people: 'लोग',
    students: 'विद्यार्थी',
    employees: 'कर्मचारी',
    parents: 'अभिभावक',
    academics: 'शैक्षणिक',
    classes: 'कक्षाएं',
    subjects: 'विषय',
    attendance: 'उपस्थिति',
    assignments: 'असाइनमेंट',
    exams: 'परीक्षा',
    results: 'परिणाम',
    financeOps: 'वित्त व संचालन',
    fees: 'शुल्क',
    transport: 'परिवहन',
    system: 'सिस्टम',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    searchPlaceholder: 'विद्यार्थी, कर्मचारी, शुल्क खोजें...',
    academicYear: 'शैक्षणिक वर्ष 2026-27',
    admin: 'प्रशासक',
    superAdmin: 'मुख्य प्रशासक',
    notifications: 'सूचनाएं',
    noUnread: 'कोई नई सूचना नहीं',
    profile: 'प्रोफाइल',
    password: 'पासवर्ड',
    language: 'भाषा',
    theme: 'थीम',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड'
  },
  mr: {
    schoolManagement: 'शाळा व्यवस्थापन',
    overview: 'आढावा',
    dashboard: 'डॅशबोर्ड',
    admissions: 'प्रवेश',
    people: 'व्यक्ती',
    students: 'विद्यार्थी',
    employees: 'कर्मचारी',
    parents: 'पालक',
    academics: 'शैक्षणिक',
    classes: 'वर्ग',
    subjects: 'विषय',
    attendance: 'हजेरी',
    assignments: 'असाइनमेंट',
    exams: 'परीक्षा',
    results: 'निकाल',
    financeOps: 'वित्त व संचालन',
    fees: 'फी',
    transport: 'वाहतूक',
    system: 'सिस्टम',
    settings: 'सेटिंग्ज',
    logout: 'बाहेर पडा',
    searchPlaceholder: 'विद्यार्थी, कर्मचारी, फी शोधा...',
    academicYear: 'शैक्षणिक वर्ष 2026-27',
    admin: 'प्रशासक',
    superAdmin: 'मुख्य प्रशासक',
    notifications: 'सूचना',
    noUnread: 'नवीन सूचना नाहीत',
    profile: 'प्रोफाइल',
    password: 'पासवर्ड',
    language: 'भाषा',
    theme: 'थीम',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड'
  }
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 collapsed   = signal(false);
  mobileOpen  = signal(false);
  darkMode    = signal(false);
  profileOpen = signal(false);
  notificationOpen = signal(false);
  notificationsRead = signal(false);
  searchOpen = signal(false);
  searchQuery = signal('');
  language = signal<AppLanguage>('en');
  copy = computed<AppCopy>(() => COPY[this.language()]);
  private router = inject(Router);

  notifications = [
    { title: 'New admission enquiry', detail: 'Riya Shah applied for Class 6', tone: 'info' },
    { title: 'Leave approval pending', detail: '3 employee requests need review', tone: 'warning' },
    { title: 'Fee collection update', detail: 'Term 1 collection crossed 84%', tone: 'success' }
  ];

  toggleSidebar()  { this.collapsed.update(v => !v); }
  toggleMobile()   { this.mobileOpen.update(v => !v); }
  toggleDarkMode() { this.darkMode.update(v => !v); }
  closeMobile()    { this.mobileOpen.set(false); }
  toggleNotifications() {
    this.notificationOpen.update(v => !v);
    this.profileOpen.set(false);
    this.notificationsRead.set(true);
  }
  toggleProfile() {
    this.profileOpen.update(v => !v);
    this.notificationOpen.set(false);
  }
  setLanguage(value: string) {
    if (value === 'en' || value === 'hi' || value === 'mr') this.language.set(value);
  }
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  openSearch() { this.searchOpen.set(true); }
  closeSearch() { this.searchOpen.set(false); this.searchQuery.set(''); }
  closeShellMenus() {
    this.notificationOpen.set(false);
    this.profileOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.mobileOpen.set(false);
    this.profileOpen.set(false);
    this.notificationOpen.set(false);
    this.closeSearch();
  }

  @HostListener('document:keydown.meta.k')
  @HostListener('document:keydown.control.k')
  onShortcutSearch() {
    this.openSearch();
    return false;
  }
}
