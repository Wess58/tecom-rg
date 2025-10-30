import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';


@Component({
  selector: 'app-report-detail',
  standalone: false,
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent implements OnChanges {

  details: any = [];
  creating = false;

  @Input() report: any = {};
  @Input() images: any[] = [];
  @Input() isCreate: boolean = false;

  @Output() generateReportEmit = new EventEmitter<any[]>();


  constructor(
    private reportsService: ReportsService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['report']) {
      this.creating = false;
      this.createRecordDetailLayout()
    }
  }

  createReport():void{
    this.creating = true;
    this.generateReportEmit.emit();
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
      {},
      {
        title: 'Estimated repair cost', value: this.report?.currency + ' ' + (this.reportsService.formatCurrency(this.report.amount) ?? 0)
      },
      {
        title: 'Estimated repair time', value: this.report.repairTime + " " + this.report.repairTimeUnit
      },
      {
        title: 'Customer approval', value: this.report.customerApproval
      },
      {
        title: 'Repair attempt fee', value: this.report?.repairCurrency + ' ' + (this.reportsService.formatCurrency(this.report.repairAmount) ?? 0)
      },
    )

    if (!this.isCreate) {
      this.details.push(
        {
          title: 'Created by',
          value: this.report.createdBy ?? '—'
        },
        {
          title: 'Created on',
          value: this.report.createdOn ?? null,
          unformarttedDate: true
        }
      )
    }
  }
}
