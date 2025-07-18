import { Component, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from '../../../services/toast.service';
import { ReportsService } from '../../../services/reports.service';

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
  reports: any = [];
  report: any = {
    role: 'USER'
  };

  errorMessage: string = '';
  reportActionFail: boolean = false;
  performingAction: boolean = false;

  page: number = 1;
  itemsPerPage = 20;
  totalLength: any;


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private reportsService: ReportsService

  ) { }

  ngOnInit(): void {

    window.scrollTo({ top: 1, behavior: "smooth" });

    this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

    this.getReports(this.page);

  }


  getReports(page: number): void {
    this.loadingReports = true;

    this.page = page ?? 1;
    this.reports = [];

    const options = {
      // status: this.filters.status,
      pageSize: this.itemsPerPage,
      pageNo: this.page - 1,
      sort: 'id,desc',
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page,
        // status: this.filters.status,
        // name: this.filters.name?.trim() ?? ''
      },
      queryParamsHandling: 'merge',
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


  generateReport(report: any): void {

  }




}
