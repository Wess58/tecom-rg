import { Component, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import moment from 'moment';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { GenerateReportService } from '../../../services/generate-report.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-create-report',
  standalone: false,
  templateUrl: './create-report.component.html',
  styleUrl: './create-report.component.scss',
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
export class CreateReportComponent implements OnInit {

  reportData: any = {
    date: moment().format('YYYY-MM-DD'),
    customerApproval: 'NO',
    currency: 'KES',
    repairCurrency: 'KES',
    deviceType: 'Phone',
    reportedIssue: 'Water Spill',
    repairTimeUnit: 'days'
  };
  emailInvalid = false;
  approvalOptions: string[] = ['YES', 'NO', 'WAITING'];
  currencyOptions: string[] = ['KES', 'USD'];
  selectedFiles: any = [];
  selectedImage: any;
  imgPositions = [[15, 215], [110, 215], [15, 10], [110, 10]]; // x , y image placement coordinates
  deviceTypes: string[] = ['Phone', 'Laptop', 'CPU', 'Monitor', 'Router', 'Switch', 'Printer', 'UPS', 'ECU', 'Key Fob'];
  issueTypes: string[] = ['Water Spill', 'Impaired', 'Malfunctioning', 'Dead', 'Unresponsive', 'Bricked', 'Crashed', 'Power failure'];
  technicians: any = [
    {
      title: 'Electronics & ICT Diagnostic Engineer',
      name: 'Isaac K.N',
      email: 'support@tecomadvance.com',
      id: 1
    },
    {
      title: 'Technical Support Engineer',
      name: 'Kennedy M.K',
      email: 'kennedy@tecomadvance.com',
      id: 2
    }
  ];

  repairTimeUnits: string[] = ['mins', 'hours', 'days', 'weeks', 'months', 'years'];


  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private generateReportService: GenerateReportService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.reportData = JSON.parse(localStorage.getItem('rptjson') ?? '{}');
    this.reportData.tech = JSON.parse(localStorage?.getItem('techId') ?? '1');
    // console.log(this.reportData);
    this.deviceTypes = this.deviceTypes.sort((a: string, b: string) => a.localeCompare(b));
    this.issueTypes = this.issueTypes.sort((a: string, b: string) => a.localeCompare(b));

  }

  validateEmail(): void {
    // console.log(!(/\S+@\S+\.\S+/).test(this.user.email.trim()));
    this.emailInvalid = this.reportData.email && !(/\S+@\S+\.\S+/).test(this.reportData.email);
  }


  selectMethod(approval: string): void {
    this.reportData.customerApproval = approval;
  }


  isFieldEmpty(): boolean {
    // console.log('here');

    return this.emailInvalid || !this.reportData.name || !this.reportData.phone ||
      !this.reportData.email || !this.reportData.brand || !this.reportData.imei || !this.reportData.accessories
      || !this.reportData.reportedIssue || !this.reportData.diagnosisSummary || !this.reportData.fix ||
      !this.reportData.amount || !this.reportData.repairTime;
  }



  onFileChange(event: any): void {

    this.selectedFiles = [...this.selectedFiles, ...event.target.files];

    this.selectedFiles.forEach((file: any, index: any) => {

      file.index = index;
      const reader = new FileReader();
      reader.onload = (e) => { file.image = reader.result; };

      reader.readAsDataURL(file);

    });
  }

  openUploadDialog(): void {
    setTimeout(() => {
      document.getElementById('uploadfile')?.click();
    }, 10);
    // console.log("doc type", documentType)
  }

  selectImage(image: any): void {
    this.selectedImage = Object.assign({}, image);
  }

  removeImage(): void {
    this.selectedFiles.splice(this.selectedImage.index, 1);

  }


  testGenerate(): void {
    let data: any = document.getElementById('content');
    let options: any = {
      orientation: 'p',
      unit: 'px',
      format: 'a4',
    };
    let doc = new jsPDF(options);

    // FONT INJECTION 
    doc.addFont("../../../assets/fonts/montserrat/Montserrat-normal-400.ttf", "Montserrat", "normal");
    doc.addFont("../../../assets/fonts/montserrat/Montserrat-normal-500.ttf", "Montserrat", "bold");
    doc.addFont("../../../assets/fonts/montserrat/Montserrat-normal-600.ttf", "Montserrat", "bolder");
    doc.setFont("Montserrat");


    // *********** START OF HEADER ***********
    doc.setFillColor(242, 246, 248);
    doc.rect(0, 0, window.innerWidth, 22, "F");


    doc.setFillColor(0, 0, 0);
    doc.roundedRect(3, 5, 51, 7, 1, 1, "F");

    doc.setFontSize(14);
    doc.setFont("Montserrat", 'bolder');
    doc.setTextColor('#13d0d5');
    doc.text('TECOM', 5, 10, { align: 'left' });
    doc.setTextColor('#ffd6b3');
    doc.text('ADVANCE', 26, 10, { align: 'left' });

    doc.setTextColor('#3c4043');
    doc.setFontSize(11);
    doc.text('Device Diagnosis Report', 5, 17, { align: 'left' });

    doc.setFontSize(14);
    const refId = 'TAR-' + moment(this.reportData.date).format('YYMMDD') + moment().format('mmss');
    doc.text('#' + refId, 205, 10, { align: 'right' });

    doc.setFont("Montserrat", 'normal');
    doc.setFontSize(11);
    doc.text(moment(this.reportData.date).format('LL'), 205, 17, { align: 'right' });
    // *********** END OF HEADER ***********


    doc.html(data.innerHTML, {
      callback: function (doc) {
        doc.save("angular-demo.pdf");
      },
      width: 400,
      windowWidth: 400,
      margin: 5,
      x: 10,
      y: 210
    });
  }


  generateReport(): void {
    this.toastService.info('Generating report ...');

    setTimeout(() => {
      this.generateReportService.generateReport(this.reportData, this.selectedFiles);
    }, 1500);

  }


}
