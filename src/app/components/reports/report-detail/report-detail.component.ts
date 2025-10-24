import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';


@Component({
  selector: 'app-report-detail',
  standalone: false,
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent implements OnChanges {

  details: any = [];


  @Input() report: any = {};
  @Input() images: any[] = [];
  @Input() isCreate: boolean = false;

  constructor(
    private reportsService: ReportsService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['report']) {
      console.log(this.report);
      
      this.createRecordDetailLayout()
    }
  }


  createRecordDetailLayout(): void {
    this.details = [];

    this.details.push(
      {
        title: 'Report date', value: this.report.date ?? '—', unformarttedDate: true, hasNoTime:true
      },
      {
        title: 'Client name', value: this.report.name ?? '—'
      },
      {
        title: 'Client phone number', value: this.report.phone ?? '—'
      },
      {
        title: 'Client email', value: this.report.email ?? '—'
      },
      {
        title: 'Device type', value: this.report.deviceType ?? '—'
      },
      {
        title: 'Brand & Model', value: this.report.brand ?? '—'
      },
      {
        title: 'Serial No / IMEI', value: this.report.imei ?? '—'
      },
      {
        title: 'Received accessories', value: this.report.accessories ?? '—'
      },
      {
        title: 'Reported issue', value: this.report.reportedIssue ?? '—'
      },
      {
        title: 'Diagnosis summary', value: this.report.diagnosisSummary ?? '—'
      },
      {
        title: 'Recommended fix', value: this.report.fix ?? '—'
      },
      {
        title: 'Estimated repair cost', value: this.report?.repairCurrency + ' ' + (this.reportsService.formatCurrency(this.report.repairAmount) ?? 0)
      },
      {
        title: 'Estimated repair time', value: this.report.repairTime + " " + this.report.repairTimeUnit
      },
      {
        title: 'Customer approval', value: this.report.customerApproval
      }
    )

    if (!this.isCreate) {
      this.details.push(
        {
          title: 'Created on',
          value: this.report.createdOn ?? null,
          unformarttedDate: true
        },
        {
          title: 'Created by',
          value: this.report.createdBy ?? '—'
        }
      )
    }
  }
}
