import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdmissionService } from '../services/admission.service';

type AdmissionStage = 'Enquiry' | 'Counselling' | 'Documents' | 'Approved' | 'Rejected';

interface AdmissionApplication {
  id: string;
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
  imports: [CommonModule, FormsModule],
  templateUrl: './admissions.component.html',
  styleUrl: './admissions.component.css'
})
export class AdmissionsComponent implements OnInit {
  private admissionService = inject(AdmissionService);
  searchQuery = signal('');
  stageFilter = signal('');
  sourceFilter = signal('');
  showNewModal = signal(false);
  showImportModal = signal(false);
  openMenuId = signal<string | null>(null);
  toast = signal('');
form: Partial<AdmissionApplication> = {
  applicant: '',
  className: 'Class 1',
  parent: '',
  phone: '',
  source: 'Website',
  stage: 'Enquiry',
  owner: 'Reception',
  score: 60
};
  readonly stages = STAGES;
  readonly sources = SOURCES;
  readonly classes = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];

  applications = signal<AdmissionApplication[]>([

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
  ngOnInit() {
  this.loadAdmissions();

  }
  loadAdmissions() {

  this.admissionService.getAll().subscribe({

    next: (res) => {

      this.applications.set(res.data);

    },

    error: console.error

  });

}
  onSearch(value: string) { this.searchQuery.set(value); }
  onStageFilter(value: string) { this.stageFilter.set(value); }
  onSourceFilter(value: string) { this.sourceFilter.set(value); }

  openNew() {

  this.form = {
    applicant: '',
    className: 'Class 1',
    parent: '',
    phone: '',
    source: 'Website',
    stage: 'Enquiry',
    owner: 'Reception',
    score: 60
  };

  this.showNewModal.set(true);

}

  closeNew() { this.showNewModal.set(false); }
  openImport() { this.showImportModal.set(true); }
  closeImport() { this.showImportModal.set(false); }

  saveApplication() {
    console.log(this.form);

  const f = this.form;

  if (!f.applicant || !f.parent) {
    return;
  }

  this.admissionService.create(f as any).subscribe({

    next: (res) => {


      this.loadAdmissions();
      this.closeNew();

      this.flash('Admission created successfully');

    },

    error: (err) => {

      console.error(err);

      alert(err.error?.message);

    }

  });
  }

  importSample() {
    this.applications.update(list => [
      { id: Date.now().toString(), applicant: 'Imported Lead', className: 'Class 3', parent: 'Parent Name', phone: '9800000000', source: 'Campaign', stage: 'Enquiry', owner: 'Reception', score: 50 },
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

  updateStage(id: string, stage: AdmissionStage) {
    this.openMenuId.set(null);
    this.flash(`Stage updated to ${stage}`);
  }

  deleteApplication(id: string) {

  this.admissionService.delete(id).subscribe({

    next: () => {

      this.loadAdmissions();
     

      this.flash('Deleted Successfully');

    },

    error: console.error

  });

  }

  toggleMenu(id: string, event: Event) {
    event.stopPropagation();
    this.openMenuId.update(current => current === id ? null : id);
  }

  closeMenus() { this.openMenuId.set(null); }



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
