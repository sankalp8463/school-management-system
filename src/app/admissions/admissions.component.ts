import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type AdmissionStage = 'Enquiry' | 'Counselling' | 'Documents' | 'Approved' | 'Rejected';

interface AdmissionApplication {
  id: number;
  applicant: string;
  className: string;
  parent: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Walk-in' | 'Campaign';
  stage: AdmissionStage;
  owner: string;
  score: number;
}

const SOURCES = ['Website', 'Referral', 'Walk-in', 'Campaign'] as const;
const STAGES: AdmissionStage[] = ['Enquiry', 'Counselling', 'Documents', 'Approved', 'Rejected'];

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admissions.component.html',
  styleUrl: './admissions.component.css'
})
export class AdmissionsComponent {
  searchQuery = signal('');
  stageFilter = signal('');
  sourceFilter = signal('');
  showNewModal = signal(false);
  showImportModal = signal(false);
  openMenuId = signal<number | null>(null);
  toast = signal('');
  form = signal<Partial<AdmissionApplication>>({ source: 'Website', stage: 'Enquiry', className: 'Class 1' });

  readonly stages = STAGES;
  readonly sources = SOURCES;
  readonly classes = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];

  applications = signal<AdmissionApplication[]>([
    { id: 1, applicant: 'Riya Shah', className: 'Class 6', parent: 'Neha Shah', phone: '9812345670', source: 'Website', stage: 'Counselling', owner: 'Reception', score: 72 },
    { id: 2, applicant: 'Kabir Rao', className: 'Class 9', parent: 'Meera Rao', phone: '9898765432', source: 'Referral', stage: 'Documents', owner: 'Office Staff', score: 84 },
    { id: 3, applicant: 'Aanya Desai', className: 'Class 1', parent: 'Vikram Desai', phone: '9765432109', source: 'Walk-in', stage: 'Approved', owner: 'Principal', score: 92 },
    { id: 4, applicant: 'Vivaan Joshi', className: 'Class 4', parent: 'Anjali Joshi', phone: '9822011220', source: 'Campaign', stage: 'Enquiry', owner: 'Reception', score: 58 },
    { id: 5, applicant: 'Sara Khan', className: 'Class 11', parent: 'Aamir Khan', phone: '9888011220', source: 'Website', stage: 'Documents', owner: 'Office Staff', score: 79 }
  ]);

  filtered = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const stage = this.stageFilter();
    const source = this.sourceFilter();
    return this.applications().filter(app => {
      const matchesQ = !q || app.applicant.toLowerCase().includes(q) || app.parent.toLowerCase().includes(q) || app.phone.includes(q);
      const matchesStage = !stage || app.stage === stage;
      const matchesSource = !source || app.source === source;
      return matchesQ && matchesStage && matchesSource;
    });
  });

  stats = computed(() => {
    const all = this.applications();
    const approved = all.filter(app => app.stage === 'Approved').length;
    return {
      enquiries: all.length,
      applications: all.filter(app => app.stage !== 'Enquiry').length,
      approved,
      conversion: all.length ? Math.round((approved / all.length) * 100) : 0
    };
  });

  onSearch(value: string) { this.searchQuery.set(value); }
  onStageFilter(value: string) { this.stageFilter.set(value); }
  onSourceFilter(value: string) { this.sourceFilter.set(value); }

  openNew() {
    this.form.set({ source: 'Website', stage: 'Enquiry', className: 'Class 1' });
    this.showNewModal.set(true);
  }

  closeNew() { this.showNewModal.set(false); }
  openImport() { this.showImportModal.set(true); }
  closeImport() { this.showImportModal.set(false); }

  saveApplication() {
    const f = this.form();
    if (!f.applicant?.trim() || !f.parent?.trim()) return;
    const app: AdmissionApplication = {
      id: Date.now(),
      applicant: f.applicant,
      className: f.className || 'Class 1',
      parent: f.parent,
      phone: f.phone || '',
      source: f.source as AdmissionApplication['source'] || 'Website',
      stage: f.stage as AdmissionStage || 'Enquiry',
      owner: f.owner || 'Reception',
      score: Number(f.score) || 60
    };
    this.applications.update(list => [app, ...list]);
    this.closeNew();
    this.flash('New admission enquiry added');
  }

  importSample() {
    this.applications.update(list => [
      { id: Date.now(), applicant: 'Imported Lead', className: 'Class 3', parent: 'Parent Name', phone: '9800000000', source: 'Campaign', stage: 'Enquiry', owner: 'Reception', score: 50 },
      ...list
    ]);
    this.closeImport();
    this.flash('Sample lead imported');
  }

  advance(app: AdmissionApplication) {
    const index = STAGES.indexOf(app.stage);
    const nextStage = STAGES[Math.min(index + 1, STAGES.length - 1)];
    this.updateStage(app.id, nextStage);
  }

  updateStage(id: number, stage: AdmissionStage) {
    this.applications.update(list => list.map(app => app.id === id ? { ...app, stage } : app));
    this.openMenuId.set(null);
    this.flash(`Stage updated to ${stage}`);
  }

  deleteApplication(id: number) {
    this.applications.update(list => list.filter(app => app.id !== id));
    this.openMenuId.set(null);
    this.flash('Admission record removed');
  }

  toggleMenu(id: number, event: Event) {
    event.stopPropagation();
    this.openMenuId.update(current => current === id ? null : id);
  }

  closeMenus() { this.openMenuId.set(null); }

  updateForm(field: keyof AdmissionApplication, value: string) {
    this.form.update(form => ({ ...form, [field]: value }));
  }

  getStageClass(stage: AdmissionStage) {
    if (stage === 'Approved') return 'badge--success';
    if (stage === 'Rejected') return 'badge--danger';
    if (stage === 'Documents') return 'badge--warning';
    if (stage === 'Counselling') return 'badge--info';
    return 'badge--neutral';
  }

  private flash(message: string) {
    this.toast.set(message);
    setTimeout(() => this.toast.set(''), 2200);
  }
}
