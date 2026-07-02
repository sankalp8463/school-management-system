import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Student {
  id: number;
  name: string;
  rollNo: string;
  class: string;
  section: string;
  gender: 'Male' | 'Female';
  dob: string;
  phone: string;
  parentName: string;
  address: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  attendancePct: number;
  admissionDate: string;
  avatarColor: string;
  bloodGroup: string;
  email: string;
}

const AVATAR_COLORS = [
  '#2463E9','#7C3AED','#1ABE17','#F97316','#EC4899','#F7AF27','#4F8EF7','#FF6550'
];

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {

  // ── State ──
  loading       = signal(true);
  searchQuery   = signal('');
  classFilter   = signal('');
  genderFilter  = signal('');
  feeFilter     = signal('');
  currentPage   = signal(1);
  pageSize      = 10;
  showAddModal  = signal(false);
  showDrawer    = signal(false);
  showDeleteConfirm = signal(false);
  selectedStudent   = signal<Student | null>(null);
  openMenuId        = signal<number | null>(null);
  bulkSelected      = signal<Set<number>>(new Set());
  readonly emptySet  = new Set<number>();

  // ── Form model ──
  form = signal<Partial<Student>>({});

  // ── Data ──
  private allStudents: Student[] = [];
  students = signal<Student[]>([]);

  readonly classes  = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];
  readonly sections = ['A','B','C','D'];
  readonly bloodGroups = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

  // ── Computed ──
  filtered = computed(() => {
    const q   = this.searchQuery().toLowerCase();
    const cls = this.classFilter();
    const gen = this.genderFilter();
    const fee = this.feeFilter();
    return this.students().filter(s => {
      const matchQ   = !q   || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q);
      const matchCls = !cls || s.class === cls;
      const matchGen = !gen || s.gender === gen;
      const matchFee = !fee || s.feeStatus === fee;
      return matchQ && matchCls && matchGen && matchFee;
    });
  });

  totalPages = computed(() => Math.ceil(this.filtered().length / this.pageSize));

  paginated = computed(() => {
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
    const all = this.students();
    return {
      total:    all.length,
      present:  all.filter(s => s.attendancePct >= 75).length,
      pending:  all.filter(s => s.feeStatus === 'Pending' || s.feeStatus === 'Overdue').length,
      newAdmissions: all.filter(s => {
        const d = new Date(s.admissionDate);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length
    };
  });

  allChecked = computed(() => {
    const ids = this.paginated().map(s => s.id);
    return ids.length > 0 && ids.every(id => this.bulkSelected().has(id));
  });

  ngOnInit() {
    this.allStudents = this.generateStudents(47);
    this.students.set(this.allStudents);
    setTimeout(() => this.loading.set(false), 800);
  }

  // ── Actions ──
  onSearch(val: string)      { this.searchQuery.set(val);  this.currentPage.set(1); }
  onClassFilter(val: string) { this.classFilter.set(val);  this.currentPage.set(1); }
  onGenderFilter(val: string){ this.genderFilter.set(val); this.currentPage.set(1); }
  onFeeFilter(val: string)   { this.feeFilter.set(val);    this.currentPage.set(1); }
  goToPage(p: number | '...') { if (typeof p === 'number') this.currentPage.set(p); }
  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  openAdd() {
    this.form.set({ gender: 'Male', class: 'Class 1', section: 'A', bloodGroup: 'O+' });
    this.showAddModal.set(true);
  }
  closeAdd()  { this.showAddModal.set(false); }

  openDrawer(s: Student) {
    this.selectedStudent.set(s);
    this.showDrawer.set(true);
    this.openMenuId.set(null);
  }
  closeDrawer() { this.showDrawer.set(false); }

  confirmDelete(s: Student) {
    this.selectedStudent.set(s);
    this.showDeleteConfirm.set(true);
    this.openMenuId.set(null);
  }
  deleteStudent() {
    const id = this.selectedStudent()?.id;
    if (id) this.students.update(list => list.filter(s => s.id !== id));
    this.showDeleteConfirm.set(false);
    this.selectedStudent.set(null);
  }

  saveStudent() {
    const f = this.form();
    if (!f.name?.trim()) return;
    const newStudent: Student = {
      id: Date.now(),
      name: f.name!,
      rollNo: `STU${String(this.students().length + 1).padStart(4,'0')}`,
      class: f.class || 'Class 1',
      section: f.section || 'A',
      gender: f.gender as 'Male' | 'Female' || 'Male',
      dob: f.dob || '2010-01-01',
      phone: f.phone || '',
      parentName: f.parentName || '',
      address: f.address || '',
      feeStatus: 'Pending',
      attendancePct: 100,
      admissionDate: new Date().toISOString().split('T')[0],
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      bloodGroup: f.bloodGroup || 'O+',
      email: f.email || '',
    };
    this.students.update(list => [newStudent, ...list]);
    this.showAddModal.set(false);
  }

  toggleMenu(id: number, e: Event) {
    e.stopPropagation();
    this.openMenuId.update(cur => cur === id ? null : id);
  }

  toggleBulk(id: number) {
    this.bulkSelected.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  toggleAllBulk() {
    const ids = this.paginated().map(s => s.id);
    this.bulkSelected.update(set => {
      const next = new Set(set);
      if (this.allChecked()) { ids.forEach(id => next.delete(id)); }
      else                   { ids.forEach(id => next.add(id)); }
      return next;
    });
  }

  closeMenus() { this.openMenuId.set(null); }

  getInitials(name: string) { return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(); }

  getAttendanceColor(pct: number) {
    if (pct >= 90) return 'var(--color-success)';
    if (pct >= 75) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }

  updateForm(field: keyof Student, value: string) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  // ── Mock data generator ──
  private generateStudents(count: number): Student[] {
    const names = ['Aarav Mehta','Sneha Reddy','Rohan Gupta','Ananya Singh','Vivek Sharma','Priya Nair','Kiran Desai','Meena Joshi','Arjun Patel','Riya Sharma','Suresh Kumar','Divya Rao','Rahul Verma','Pooja Iyer','Amit Tiwari','Kavya Pillai','Nikhil Jain','Shreya Mishra','Aditya Nair','Tanvi Kulkarni','Siddharth Roy','Ishaan Kapoor','Nisha Pandey','Varun Malhotra','Deepa Shetty','Rajesh Yadav','Sunita Bose','Manish Dubey','Rekha Nambiar','Gaurav Saxena','Lakshmi Menon','Vijay Patil','Usha Krishnan','Harish Garg','Swati Agarwal','Pankaj Bhatt','Geeta Choudhary','Ramesh Pillai','Anjali Tiwari','Sunil Mehta','Nandini Rao','Kartik Sharma','Bhavna Joshi','Dinesh Patel','Leela Nair','Mohan Gupta','Chitra Reddy'];
    const parents = ['Rajesh Mehta','Suresh Reddy','Anil Gupta','Pradeep Singh','Mahesh Sharma','Ravi Nair','Sunil Desai','Ramesh Joshi','Vijay Patel','Ashok Sharma'];
    const feeStatuses: Student['feeStatus'][] = ['Paid','Paid','Paid','Pending','Overdue'];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      rollNo: `STU${String(i + 1).padStart(4,'0')}`,
      class: this.classes[i % this.classes.length],
      section: this.sections[i % this.sections.length],
      gender: i % 3 === 0 ? 'Female' : 'Male',
      dob: `${2008 + (i % 8)}-${String((i % 12) + 1).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
      phone: `98${String(10000000 + i * 1234567).slice(0,8)}`,
      parentName: parents[i % parents.length],
      address: `${i + 1}, Main Street, Pune`,
      feeStatus: feeStatuses[i % feeStatuses.length],
      attendancePct: 65 + (i % 36),
      admissionDate: `2024-${String((i % 12) + 1).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      bloodGroup: this.bloodGroups[i % this.bloodGroups.length],
      email: `${names[i % names.length].split(' ')[0].toLowerCase()}${i}@school.edu`,
    }));
  }
}
