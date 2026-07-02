import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Employee {
  id: number;
  name: string;
  empId: string;
  email: string;
  phone: string;
  role: string;
  subject: string;
  department: string;
  qualification: string;
  experience: number;       // years
  gender: 'Male' | 'Female';
  dob: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive' | 'Pending';
  staffType: 'Teaching' | 'Non Teaching';
  attendance: number;
  pendingApprovals: number;
  birthdayToday: boolean;
  avatarColor: string;
  address: string;
  classesAssigned: string[];
  salary: number;
}

const AVATAR_COLORS = [
  '#2463E9','#7C3AED','#1ABE17','#F97316','#EC4899','#F7AF27','#4F8EF7','#FF6550'
];

const SUBJECTS = [
  'Mathematics','Physics','Chemistry','Biology','English','Hindi','History',
  'Geography','Computer Science','Physical Education','Economics','Accountancy',
  'Political Science','Sanskrit','Art & Craft'
];

const DEPARTMENTS = ['Science','Commerce','Arts','Languages','Physical Education','Technology'];
const ROLES = [
  'Teacher','Principal','Vice Principal','Office Staff','Clerk','Accountant',
  'Receptionist','Transport Coordinator','Librarian','Lab Assistant','Support Staff','Driver'
];

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {

  // ── State ──
  loading           = signal(true);
  searchQuery       = signal('');
  deptFilter        = signal('');
  statusFilter      = signal('');
  currentPage       = signal(1);
  pageSize          = 10;
  showAddModal      = signal(false);
  showImportModal   = signal(false);
  showDrawer        = signal(false);
  showDeleteConfirm = signal(false);
  selectedTeacher   = signal<Employee | null>(null);
  openMenuId        = signal<number | null>(null);
  activeTab         = signal<'overview' | 'details'>('overview');
  roleFilter        = signal('');
  bulkSelected      = signal<Set<number>>(new Set());
  editingId         = signal<number | null>(null);
  toast             = signal('');

  readonly emptySet = new Set<number>();

  // ── Form ──
  form = signal<Partial<Employee>>({});

  // ── Data ──
  teachers = signal<Employee[]>([]);

  readonly subjects    = SUBJECTS;
  readonly departments = DEPARTMENTS;
  readonly roles       = ROLES;
  readonly statuses: Employee['status'][] = ['Active', 'On Leave', 'Inactive', 'Pending'];
  readonly qualifications = ['B.Ed','M.Ed','B.Sc + B.Ed','M.Sc + B.Ed','Ph.D','MBA','MCA','B.Tech'];
  readonly classes = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];

  // ── Computed ──
  filtered = computed(() => {
    const q    = this.searchQuery().toLowerCase();
    const dept = this.deptFilter();
    const stat = this.statusFilter();
    const role = this.roleFilter();
    return this.teachers().filter(t => {
      const matchQ    = !q    || t.name.toLowerCase().includes(q) || t.empId.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.role.toLowerCase().includes(q);
      const matchDept = !dept || t.department === dept;
      const matchStat = !stat || t.status === stat;
      const matchRole = !role || t.role === role;
      return matchQ && matchDept && matchStat && matchRole;
    });
  });

  totalPages  = computed(() => Math.ceil(this.filtered().length / this.pageSize));

  paginated   = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const cur   = this.currentPage();
    const pages: (number | '...')[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3) pages.push('...');
      for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
      if (cur < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  stats = computed(() => {
    const all = this.teachers();
    const deptMap: Record<string, number> = {};
    all.forEach(t => { deptMap[t.department] = (deptMap[t.department] || 0) + 1; });
    return {
      total:    all.length,
      teachers: all.filter(t => t.staffType === 'Teaching').length,
      nonTeaching: all.filter(t => t.staffType === 'Non Teaching').length,
      present:  all.filter(t => t.attendance >= 90 && t.status === 'Active').length,
      onLeave:  all.filter(t => t.status === 'On Leave').length,
      newJoinings: all.filter(t => new Date(t.joinDate).getFullYear() >= 2026).length,
      pending: all.reduce((sum, t) => sum + t.pendingApprovals, 0),
      birthdays: all.filter(t => t.birthdayToday).length,
      avgExp:   all.length ? Math.round(all.reduce((s, t) => s + t.experience, 0) / all.length) : 0
    };
  });

  allChecked = computed(() => {
    const ids = this.paginated().map(t => t.id);
    return ids.length > 0 && ids.every(id => this.bulkSelected().has(id));
  });

  ngOnInit() {
    this.teachers.set(this.generateTeachers(40));
    setTimeout(() => this.loading.set(false), 700);
  }

  // ── Actions ──
  onSearch(v: string)      { this.searchQuery.set(v);  this.currentPage.set(1); }
  onDeptFilter(v: string)  { this.deptFilter.set(v);   this.currentPage.set(1); }
  onStatusFilter(v: string){ this.statusFilter.set(v); this.currentPage.set(1); }
  onRoleFilter(v: string)  { this.roleFilter.set(v);   this.currentPage.set(1); }
  goToPage(p: number | '...') { if (typeof p === 'number') this.currentPage.set(p); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  openAdd() {
    this.editingId.set(null);
    this.form.set({ gender: 'Male', status: 'Active', role: 'Teacher', subject: SUBJECTS[0], department: DEPARTMENTS[0], qualification: 'B.Ed', experience: 1, staffType: 'Teaching' });
    this.showAddModal.set(true);
  }
  closeAdd() { this.showAddModal.set(false); }
  openImport() { this.showImportModal.set(true); }
  closeImport() { this.showImportModal.set(false); }

  openDrawer(t: Employee) {
    this.selectedTeacher.set(t);
    this.activeTab.set('overview');
    this.showDrawer.set(true);
    this.openMenuId.set(null);
  }
  closeDrawer() { this.showDrawer.set(false); }

  confirmDelete(t: Employee) {
    this.selectedTeacher.set(t);
    this.showDeleteConfirm.set(true);
    this.openMenuId.set(null);
  }
  deleteTeacher() {
    const id = this.selectedTeacher()?.id;
    if (id) this.teachers.update(list => list.filter(t => t.id !== id));
    this.showDeleteConfirm.set(false);
    this.selectedTeacher.set(null);
    this.showDrawer.set(false);
  }

  saveTeacher() {
    const f = this.form();
    if (!f.name?.trim()) return;
    const role = f.role || 'Teacher';
    const editingId = this.editingId();
    if (editingId) {
      this.teachers.update(list => list.map(item => item.id === editingId ? {
        ...item,
        name: f.name!,
        email: f.email || item.email,
        phone: f.phone || item.phone,
        role,
        subject: f.subject || item.subject,
        department: f.department || item.department,
        qualification: f.qualification || item.qualification,
        experience: Number(f.experience) || item.experience,
        address: f.address || item.address,
        staffType: role === 'Teacher' || role === 'Principal' || role === 'Vice Principal' ? 'Teaching' : 'Non Teaching'
      } : item));
      this.showAddModal.set(false);
      this.editingId.set(null);
      this.flash('Employee details updated');
      return;
    }
    const t: Employee = {
      id:              Date.now(),
      name:            f.name!,
      empId:           `EMP${String(this.teachers().length + 1).padStart(4, '0')}`,
      email:           f.email || '',
      phone:           f.phone || '',
      role,
      subject:         f.subject || SUBJECTS[0],
      department:      f.department || DEPARTMENTS[0],
      qualification:   f.qualification || 'B.Ed',
      experience:      Number(f.experience) || 1,
      gender:          f.gender as 'Male' | 'Female' || 'Male',
      dob:             f.dob || '1990-01-01',
      joinDate:        new Date().toISOString().split('T')[0],
      status:          f.status as Employee['status'] || 'Active',
      staffType:       role === 'Teacher' || role === 'Principal' || role === 'Vice Principal' ? 'Teaching' : 'Non Teaching',
      attendance:      100,
      pendingApprovals: 0,
      birthdayToday:   false,
      avatarColor:     AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      address:         f.address || '',
      classesAssigned: [],
      salary:          Number(f.salary) || 0,
    };
    this.teachers.update(list => [t, ...list]);
    this.showAddModal.set(false);
    this.flash('Employee added');
  }

  editTeacher(t: Employee) {
    this.editingId.set(t.id);
    this.form.set({ ...t });
    this.showAddModal.set(true);
    this.openMenuId.set(null);
  }

  exportEmployees() {
    const rows = this.filtered();
    const header = ['Employee ID','Name','Role','Department','Qualification','Experience','Phone','Email','Status'];
    const csv = [header, ...rows.map(t => [t.empId, t.name, t.role, t.department, t.qualification, `${t.experience}`, t.phone, t.email, t.status])]
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sarvam-employees.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    this.flash('Employee CSV exported');
  }

  importSample() {
    this.teachers.update(list => [{
      id: Date.now(),
      name: 'Imported Employee',
      empId: `EMP${String(list.length + 1).padStart(4, '0')}`,
      email: 'imported.employee@school.edu',
      phone: '9800000000',
      role: 'Office Staff',
      subject: 'Administration',
      department: 'Technology',
      qualification: 'MBA',
      experience: 4,
      gender: 'Female',
      dob: '1994-01-01',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      staffType: 'Non Teaching',
      attendance: 100,
      pendingApprovals: 1,
      birthdayToday: false,
      avatarColor: AVATAR_COLORS[1],
      address: 'Imported from Excel lead file',
      classesAssigned: [],
      salary: 36000
    }, ...list]);
    this.showImportModal.set(false);
    this.flash('Sample employee imported');
  }

  applyBulkAction() {
    const selected = this.bulkSelected();
    if (!selected.size) {
      this.flash('Select employees first');
      return;
    }
    this.teachers.update(list => list.map(item => selected.has(item.id) ? { ...item, status: 'Active' } : item));
    this.bulkSelected.set(new Set());
    this.flash('Selected employees marked active');
  }

  toggleMenu(id: number, e: Event) {
    e.stopPropagation();
    this.openMenuId.update(cur => cur === id ? null : id);
  }
  closeMenus() { this.openMenuId.set(null); }

  toggleBulk(id: number) {
    this.bulkSelected.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  toggleAllBulk() {
    const ids = this.paginated().map(t => t.id);
    this.bulkSelected.update(set => {
      const next = new Set(set);
      if (this.allChecked()) ids.forEach(id => next.delete(id));
      else ids.forEach(id => next.add(id));
      return next;
    });
  }

  updateForm(field: keyof Employee, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  }

  getStatusClass(status: Employee['status']) {
    return status === 'Active' ? 'badge--success' : status === 'On Leave' ? 'badge--warning' : status === 'Pending' ? 'badge--info' : 'badge--neutral';
  }

  getAttendanceColor(pct: number) {
    if (pct >= 95) return 'var(--color-success)';
    if (pct >= 85) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }

  private flash(message: string) {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2200);
  }

  // ── Mock data ──
  private generateTeachers(count: number): Employee[] {
    const names = [
      'Rajesh Kumar','Sunita Sharma','Anil Verma','Priya Nair','Mahesh Gupta',
      'Kavita Reddy','Suresh Patel','Deepa Joshi','Ramesh Iyer','Anita Singh',
      'Vijay Mehta','Rekha Pillai','Dinesh Rao','Leela Desai','Mohan Tiwari',
      'Usha Bose','Harish Saxena','Swati Kulkarni','Pankaj Mishra','Geeta Nambiar',
      'Sanjay Dubey','Meena Choudhary','Arun Yadav','Pooja Bhatt','Nitin Garg',
      'Shobha Agarwal','Ravi Patil','Lata Krishnan','Girish Menon','Sudha Roy',
      'Prakash Kapoor','Nirmala Pandey','Ashok Malhotra','Vimala Shetty','Kiran Jain',
      'Santosh Nair','Radha Gupta','Bharat Sharma','Kamla Verma','Devendra Patel'
    ];
    const expBase = [2,5,8,12,15,3,7,10,1,20];
    const salaries = [35000,42000,48000,55000,62000,38000,45000,52000,30000,70000];
    return Array.from({ length: count }, (_, i) => {
      const role = ROLES[i % ROLES.length];
      const staffType = role === 'Teacher' || role === 'Principal' || role === 'Vice Principal' ? 'Teaching' : 'Non Teaching';
      return ({
      id:            i + 1,
      name:          names[i % names.length],
      empId:         `EMP${String(i + 1).padStart(4, '0')}`,
      email:         `${names[i % names.length].split(' ')[0].toLowerCase()}${i}@school.edu`,
      phone:         `97${String(10000000 + i * 9876543).slice(0, 8)}`,
      role,
      subject:       SUBJECTS[i % SUBJECTS.length],
      department:    DEPARTMENTS[i % DEPARTMENTS.length],
      qualification: ['B.Ed','M.Ed','M.Sc + B.Ed','Ph.D','B.Sc + B.Ed'][i % 5],
      experience:    expBase[i % expBase.length],
      gender:        i % 3 === 0 ? 'Female' : 'Male',
      dob:           `${1975 + (i % 20)}-${String((i % 12) + 1).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
      joinDate:      `${2015 + (i % 9)}-${String((i % 12) + 1).padStart(2,'0')}-01`,
      status:        (['Active','Active','Active','On Leave','Inactive','Pending'] as Employee['status'][])[i % 6],
      staffType,
      attendance:    80 + (i * 7) % 21,
      pendingApprovals: i % 7 === 0 ? 2 : i % 5 === 0 ? 1 : 0,
      birthdayToday: i % 17 === 0,
      avatarColor:   AVATAR_COLORS[i % AVATAR_COLORS.length],
      address:       `${i + 10}, Teachers Colony, Pune`,
      classesAssigned: [this.classes[i % 12], this.classes[(i + 1) % 12]],
      salary:        salaries[i % salaries.length],
    });
    });
  }
}
