import { Component, OnInit, AfterViewInit, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: string;
  gradient: string;
  iconBg: string;
  chartData: number[];
}

interface Activity {
  avatar: string;
  avatarBg: string;
  name: string;
  action: string;
  time: string;
}

interface Event {
  title: string;
  date: string;
  type: 'exam' | 'holiday' | 'event' | 'meeting';
  color: string;
}

interface FeeStudent {
  name: string;
  class: string;
  amount: number;
  dueDate: string;
  status: 'overdue' | 'due';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;

  @ViewChild('attendanceChart') attendanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart')    revenueChartRef!:    ElementRef<HTMLCanvasElement>;
  @ViewChild('admissionChart')  admissionChartRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('genderChart')     genderChartRef!:     ElementRef<HTMLCanvasElement>;
  @ViewChild('performanceChart') performanceChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  greeting = signal('Greeting');
  today = signal(new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' }));

  statCards: StatCard[] = [
    { label: 'Total Students', value: '2,847', change: 12.5, icon: 'graduation-cap', gradient: 'var(--grad-blue)',   iconBg: 'rgba(36,99,233,.12)',   chartData: [40,55,45,60,52,68,72] },
    { label: 'New Admissions', value: '143',   change: 8.2,  icon: 'user-plus',      gradient: 'var(--grad-green)',  iconBg: 'rgba(26,190,23,.12)',   chartData: [20,30,25,40,35,50,45] },
    { label: 'Teachers',       value: '89',    change: 3.1,  icon: 'users',          gradient: 'var(--grad-purple)', iconBg: 'rgba(124,58,237,.12)',  chartData: [80,82,85,83,87,88,89] },
    { label: 'Attendance',     value: '94.2%', change: 2.4,  icon: 'calendar-check', gradient: 'var(--grad-orange)', iconBg: 'rgba(249,115,22,.12)',  chartData: [88,90,92,89,93,94,94] },
    { label: 'Pending Fees',   value: '₹1.8L', change: -5.3, icon: 'alert-circle',   gradient: 'var(--grad-red)',    iconBg: 'rgba(255,101,80,.12)',  chartData: [60,55,70,65,58,52,48] },
    { label: 'Revenue',        value: '₹12.4L',change: 18.7, icon: 'indian-rupee',   gradient: 'var(--grad-pink)',   iconBg: 'rgba(236,72,153,.12)',  chartData: [50,60,55,70,75,80,90] },
  ];

  activities: Activity[] = [
    { avatar: 'R', avatarBg: '#2463E9', name: 'Riya Sharma',    action: 'New admission registered for Class 6',  time: '2 min ago' },
    { avatar: 'A', avatarBg: '#7C3AED', name: 'Arjun Patel',    action: 'Fee payment of ₹12,500 received',       time: '15 min ago' },
    { avatar: 'P', avatarBg: '#1ABE17', name: 'Priya Nair',     action: 'Attendance marked for Class 9-A',       time: '32 min ago' },
    { avatar: 'S', avatarBg: '#F97316', name: 'Suresh Kumar',   action: 'Result sheet uploaded for Term 2',      time: '1 hr ago' },
    { avatar: 'M', avatarBg: '#EC4899', name: 'Meena Joshi',    action: 'Transport route updated — Route 4',     time: '2 hr ago' },
    { avatar: 'K', avatarBg: '#F7AF27', name: 'Kiran Desai',    action: 'Assignment created for Class 10 Math',  time: '3 hr ago' },
  ];

  events: Event[] = [
    { title: 'Annual Sports Day',      date: 'Jan 15',  type: 'event',   color: 'var(--color-primary)' },
    { title: 'Term 2 Exams Begin',     date: 'Jan 20',  type: 'exam',    color: 'var(--color-danger)' },
    { title: 'Republic Day Holiday',   date: 'Jan 26',  type: 'holiday', color: 'var(--color-success)' },
    { title: 'Parent-Teacher Meeting', date: 'Feb 3',   type: 'meeting', color: 'var(--color-purple)' },
    { title: 'Science Exhibition',     date: 'Feb 10',  type: 'event',   color: 'var(--color-orange)' },
  ];

  feeStudents: FeeStudent[] = [
    { name: 'Aarav Mehta',   class: 'Class 8-B', amount: 15000, dueDate: 'Jan 10', status: 'overdue' },
    { name: 'Sneha Reddy',   class: 'Class 5-A', amount: 8500,  dueDate: 'Jan 12', status: 'overdue' },
    { name: 'Rohan Gupta',   class: 'Class 11-C',amount: 22000, dueDate: 'Jan 15', status: 'due' },
    { name: 'Ananya Singh',  class: 'Class 3-B', amount: 6000,  dueDate: 'Jan 18', status: 'due' },
    { name: 'Vivek Sharma',  class: 'Class 9-A', amount: 18500, dueDate: 'Jan 20', status: 'due' },
  ];

  quickActions = [
    { label: 'New Admission', icon: 'user-plus',      route: '/students',    gradient: 'var(--grad-blue)' },
    { label: 'Collect Fee',   icon: 'indian-rupee',   route: '/fees',        gradient: 'var(--grad-green)' },
    { label: 'Send Notice',   icon: 'send',           route: '/settings',    gradient: 'var(--grad-purple)' },
    { label: 'Gen. Report',   icon: 'file-bar-chart', route: '/results',     gradient: 'var(--grad-orange)' },
    { label: 'Homework',      icon: 'book-open',      route: '/assignments', gradient: 'var(--grad-pink)' },
    { label: 'Add Teacher',   icon: 'user-check',     route: '/employees',   gradient: 'var(--grad-red)' },
  ];

  todayAttendance = [
    { class: 'Class 10-A', present: 38, total: 40, pct: 95 },
    { class: 'Class 9-B',  present: 35, total: 38, pct: 92 },
    { class: 'Class 8-A',  present: 36, total: 40, pct: 90 },
    { class: 'Class 7-C',  present: 30, total: 35, pct: 86 },
    { class: 'Class 6-B',  present: 28, total: 36, pct: 78 },
  ];

  ngOnInit() {
    const h = new Date().getHours();
    this.greeting.set(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.buildAttendanceChart();
      this.buildRevenueChart();
      this.buildAdmissionChart();
      this.buildGenderChart();
      this.buildPerformanceChart();
    }, 100);
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  private buildAttendanceChart() {
    const ctx = this.attendanceChartRef?.nativeElement;
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Aug','Sep','Oct','Nov','Dec','Jan'],
        datasets: [{
          label: 'Attendance %',
          data: [88, 91, 89, 93, 90, 94],
          borderColor: '#2463E9',
          backgroundColor: 'rgba(36,99,233,.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.45,
          pointBackgroundColor: '#2463E9',
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { ...this.tooltipStyle() } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Manrope', size: 12 }, color: '#6B7280' } },
          y: { min: 80, max: 100, grid: { color: '#F0F4F8' }, ticks: { font: { family: 'Manrope', size: 12 }, color: '#6B7280', callback: v => v + '%' } }
        }
      }
    });
    this.charts.push(chart);
  }

  private buildRevenueChart() {
    const ctx = this.revenueChartRef?.nativeElement;
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Aug','Sep','Oct','Nov','Dec','Jan'],
        datasets: [
          {
            label: 'Collected',
            data: [8.2, 9.5, 7.8, 11.2, 10.5, 12.4],
            backgroundColor: 'rgba(36,99,233,.85)',
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Pending',
            data: [2.1, 1.8, 2.5, 1.5, 2.0, 1.8],
            backgroundColor: 'rgba(255,101,80,.7)',
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { family: 'Manrope', size: 12 }, color: '#6B7280', boxWidth: 12, boxHeight: 12, borderRadius: 4 } }, tooltip: { ...this.tooltipStyle() } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Manrope', size: 12 }, color: '#6B7280' } },
          y: { grid: { color: '#F0F4F8' }, ticks: { font: { family: 'Manrope', size: 12 }, color: '#6B7280', callback: v => '₹' + v + 'L' } }
        }
      }
    });
    this.charts.push(chart);
  }

  private buildAdmissionChart() {
    const ctx = this.admissionChartRef?.nativeElement;
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enquiry','Applied','Docs','Interview','Enrolled'],
        datasets: [{
          label: 'Students',
          data: [320, 240, 190, 160, 143],
          backgroundColor: [
            'rgba(36,99,233,.8)',
            'rgba(79,142,247,.8)',
            'rgba(124,58,237,.8)',
            'rgba(236,72,153,.8)',
            'rgba(26,190,23,.8)',
          ],
          borderRadius: 10,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { ...this.tooltipStyle() } },
        scales: {
          x: { grid: { color: '#F0F4F8' }, ticks: { font: { family: 'Manrope', size: 12 }, color: '#6B7280' } },
          y: { grid: { display: false }, ticks: { font: { family: 'Manrope', size: 12 }, color: '#6B7280' } }
        }
      }
    });
    this.charts.push(chart);
  }

  private buildGenderChart() {
    const ctx = this.genderChartRef?.nativeElement;
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Boys', 'Girls'],
        datasets: [{
          data: [1524, 1323],
          backgroundColor: ['rgba(36,99,233,.85)', 'rgba(236,72,153,.85)'],
          borderWidth: 0,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Manrope', size: 13 }, color: '#6B7280', padding: 20, boxWidth: 12, boxHeight: 12, borderRadius: 4 } },
          tooltip: { ...this.tooltipStyle() }
        }
      }
    });
    this.charts.push(chart);
  }

  private buildPerformanceChart() {
    const ctx = this.performanceChartRef?.nativeElement;
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'],
        datasets: [
          { label: 'Avg Score', data: [78, 82, 79, 85, 88, 84, 91], borderColor: '#2463E9', backgroundColor: 'rgba(36,99,233,.06)', borderWidth: 2.5, fill: true, tension: 0.4, pointBackgroundColor: '#2463E9', pointRadius: 4 },
          { label: 'Pass %',    data: [92, 95, 90, 96, 98, 93, 97], borderColor: '#1ABE17', backgroundColor: 'rgba(26,190,23,.06)',  borderWidth: 2.5, fill: true, tension: 0.4, pointBackgroundColor: '#1ABE17', pointRadius: 4 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { family: 'Manrope', size: 12 }, color: '#6B7280', boxWidth: 12, boxHeight: 12, borderRadius: 4 } }, tooltip: { ...this.tooltipStyle() } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Manrope', size: 12 }, color: '#6B7280' } },
          y: { min: 60, max: 100, grid: { color: '#F0F4F8' }, ticks: { font: { family: 'Manrope', size: 12 }, color: '#6B7280' } }
        }
      }
    });
    this.charts.push(chart);
  }

  private tooltipStyle() {
    return {
      backgroundColor: '#15141C',
      titleFont: { family: 'Manrope', size: 13, weight: 'bold' as const },
      bodyFont:  { family: 'Manrope', size: 12 },
      padding: 12,
      cornerRadius: 10,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
    };
  }

  getAttendanceColor(pct: number): string {
    if (pct >= 90) return 'var(--color-success)';
    if (pct >= 80) return 'var(--color-warning)';
    return 'var(--color-danger)';
  }

  getEventIcon(type: string): string {
    const map: Record<string, string> = { exam: '', holiday: '', event: '', meeting: '' };
    return map[type] || '';
  }
}
