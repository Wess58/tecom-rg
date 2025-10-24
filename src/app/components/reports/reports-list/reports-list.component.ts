import { Component, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from '../../../services/toast.service';
import { ReportsService } from '../../../services/reports.service';
import { GenerateReportService } from '../../../services/generate-report.service';


@Component({
  selector: 'app-reports-list',
  standalone: false,
  templateUrl: './reports-list.component.html',
  styleUrl: './reports-list.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(400, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ReportsListComponent implements OnInit {

  loadingReports = false;
  reports: any[] = [];
  report: any = {};
  reportImages: any[] = [];

  filters: any = {};

  errorMessage: string = '';
  reportActionFail: boolean = false;
  performingAction: boolean = false;
  action: string = '';


  page: number = 1;
  itemsPerPage = 20;
  totalLength: any;


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private reportsService: ReportsService,
    private generateReportService: GenerateReportService

  ) { }

  ngOnInit(): void {

    window.scrollTo({ top: 0, behavior: "smooth" });

    this.setFilterParams();

  }


  setFilterParams(): void {
    this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

    this.filters = {
      name: this.activatedRoute.snapshot.queryParams['name'] ?? '',
      email: this.activatedRoute.snapshot.queryParams['email'] ?? '',
    }

    this.getReports(this.page);

  }



  getReports(page: number): void {
    this.loadingReports = true;

    this.page = page ?? 1;
    this.reports = [];

    const options = {
      pageSize: this.itemsPerPage,
      pageNo: this.page - 1,
      sort: 'id,desc',
      name: this.filters.name?.trim() ?? '',
      email: this.filters.email?.trim() ?? '',
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page,
        name: this.filters.name?.trim() ?? '',
        email: this.filters.email?.trim() ?? '',
      },
      queryParamsHandling: 'merge',
      replaceUrl: !this.activatedRoute.snapshot.queryParams['page']
    });


    this.reportsService.getReports(options).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.reports = res.body;
          this.totalLength = Number(res.headers.get('X-Total-Items'));
          this.loadingReports = false;

        },
        error: (error) => {
          this.loadingReports = false;
        }
      }
    )
  }

  callToast(): void {
    this.toastService.info('Generating report ...');
  }

  selectReport(report: any, action: string): void {
    
    console.log(report);
    this.action = action;
    this.report = Object.assign({}, report?.reportData);
    this.report.createdBy = report.createdBy;
    this.report.createdOn = report.createdOn;

    console.log(this.report);

    this.reportImages = [];
    if (action === 'VIEW' && this.report.media?.length) {
      this.reportImages = JSON.parse(JSON.stringify(
        this.report.media.map((str: string) => (
          {
            // previewUrl: window.location.origin + '/api/media/file/' + str,
            uuid: str,
            name: str,
            uploaded: true,
            compressed: true
          }
        ))
      ));
    }
  }


  setDataForEdit(report: any, action: string = 'create'): void {
    localStorage.setItem('rptjson', JSON.stringify(report));
    this.toastService.info('Redirecting ...', 1200);

    setTimeout(() => {
      this.router.navigate(['/create-report'], {
        queryParams: {
          type: action
        }
      })
    }, 1000);
  }


  generateReport(report: any): void {

    this.toastService.info('Generating report ...');

    const selectedFiles: any[] = [];

    setTimeout(() => {
      this.generateReportService.generateReport(report, selectedFiles, true);
    }, 1500);

  }

  deleteReport(): void {
    this.performingAction = true;
    this.reportActionFail = false;

    this.reportsService.deleteReport(this.report.id).subscribe(
      {
        next: (res) => {
          this.performingAction = false;
          this.closeModal('closeReportActionModal');
          this.getReports(this.page);

          this.toastService.success('Report deleted successfully!');
        },
        error: (error) => {
          console.log(error);
          this.reportActionFail = true;
          this.performingAction = false;
          this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

        }
      }
    )
  }

  closeModal(id: string): void {
    const close: any = document.getElementById(id) as HTMLElement;
    close?.click();
  }


  resetFilters(): void {

    this.filters = {
      // year: new Date().getFullYear().toString()
    };

    this.page = 1;
    this.getReports(1)
  }




}
