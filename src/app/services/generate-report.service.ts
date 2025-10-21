import { Injectable } from '@angular/core';
import moment from 'moment';
import jsPDF from "jspdf";
import { ToastService } from './toast.service';
import { ReportsService } from './reports.service';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class GenerateReportService {

  imgPositions = [[15, 215], [110, 215], [15, 10], [110, 10]]; // x , y image placement coordinates

  constructor(
    private toastService: ToastService,
    private reportsService: ReportsService,
    private router: Router
  ) { }



  generateReport(reportData: any, selectedFiles: any[] = [], isRedownload: boolean = false): any {

    // localStorage.setItem('rptjson', JSON.stringify(reportData?));

    setTimeout(() => {
      let doc: any = new jsPDF();
      // let div:any = document.getElementById('testDiv');
      // console.log(div);

      // const specialElementHandlers:any = {
      //   '#editor': function (element:any, renderer:any) {
      //     return true;
      //   }
      // };

      // doc.fromHTML(div.html(), 15, 15, {
      //   'width': 190,
      //   'elementHandlers': specialElementHandlers
      // }); 

      // FONT INJECTION 
      doc.addFont("assets/fonts/montserrat/Montserrat-normal-400.ttf", "Montserrat", "normal");
      doc.addFont("assets/fonts/montserrat/Montserrat-normal-500.ttf", "Montserrat", "bold");
      doc.addFont("assets/fonts/montserrat/Montserrat-normal-600.ttf", "Montserrat", "bolder");
      doc.setFont("Montserrat");


      // *********** START OF HEADER ***********
      doc.setFillColor(242, 246, 248);
      doc.rect(0, 0, window.innerWidth, 22, "F");
      // const img: any = new Image();
      // img.src = 'assets/images/logo.png';
      // doc.addImage(img, 'png', 5, 2, 30, 10);

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
      const refId = 'TAR-' + moment(reportData?.date).format('YYMMDD') + moment().format('mmss');
      doc.text('#' + refId, 205, 10, { align: 'right' });

      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(11);
      doc.text(moment(reportData?.date).format('LL'), 205, 17, { align: 'right' });
      // *********** END OF HEADER ***********


      // *********** START OF REPORT BY ***********
      doc.setFontSize(9);
      doc.setTextColor('#5f6063');
      doc.text('REPORT BY', 5, 28, { align: 'left' });

      const tech = JSON.parse(localStorage.getItem('tcmuser') || '{}');
      // this.technicians.find((tech: any) => +reportData?.tech === tech?.id);
      // console.log(tech);
      doc.setTextColor('#3c4043');
      doc.setFont("Montserrat", 'bold');
      doc.setFontSize(9);
      doc.text(tech?.jobTitle ?? 'N/A', 5, 34.5, { align: 'left' });
      doc.setFont("Montserrat", 'bolder');
      doc.setFontSize(12);
      doc.text(tech?.name?.toUpperCase() ?? 'N/A', 5, 40, { align: 'left' });

      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(9);
      doc.setTextColor('#5f6063');
      doc.text('254792553595', 5, 45, { align: 'left' });
      doc.text(tech?.email ?? 'N/A', 5, 50, { align: 'left' });


      // *********** END OF REPORT BY ***********

      // *********** START OF REPORT TO ***********
      doc.setFontSize(9);
      doc.text('REPORT TO', 205, 28, { align: 'right' });

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(12);
      doc.text(reportData?.name?.toUpperCase() ?? 'N/A', 205, 40, { align: 'right' });

      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(9);
      doc.setTextColor('#5f6063');
      doc.text(reportData?.phone ?? 'N/A', 205, 45, { align: 'right' });
      doc.text(reportData?.email ?? 'N/A', 205, 50, { align: 'right' });
      // *********** END OF REPORT TO ***********


      // *********** START OF DEVICE INFO ***********

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      doc.roundedRect(5, 57, 200, 48, 5, 5, "S");

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(12);
      doc.text('Device Information', 9, 64, { align: 'left' });

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      // xStart , yStart, xEnd , yEnd
      doc.line(5, 68, 205, 68);

      // TITLE TEXT LAYOUT
      doc.setFont("Montserrat", 'bold');
      doc.setFontSize(11);
      doc.setTextColor('#3c4043');
      doc.text('Device Type', 9, 75, { align: 'left' });
      doc.text('Brand & Model', 9, 82, { align: 'left' });
      doc.text('Serial No / IMEI', 9, 89, { align: 'left' });
      doc.text('Received Accessories', 9, 96, { align: 'left' });

      // VALUE TEXT LAYOUT
      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(10);
      doc.setTextColor('#5f6063');
      doc.text(reportData?.deviceType ?? 'N/A', 200, 75, { align: 'right' });
      doc.text(reportData?.brand ?? 'N/A', 200, 82, { align: 'right' });
      doc.text(reportData?.imei ?? 'N/A', 200, 89, { align: 'right' });
      doc.text(reportData?.accessories?.slice(0, 150)?.trim() ?? 'N/A', 200, 96, { align: 'right', maxWidth: 130 });

      // *********** END OF DEVICE INFO ***********


      // *********** START OF REPORTED ISSUE INFO ***********

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      doc.roundedRect(5, 112, 200, 37, 5, 5, "S");

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(12);
      doc.text('Reported Issue  - ', 9, 119, { align: 'left' });

      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(10);
      doc.setTextColor('#5f6063');
      doc.text(reportData?.reportedIssue ?? 'N/A', 48, 119, { align: 'left' });

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      // xStart , yStart, xEnd , yEnd
      doc.line(5, 123, 205, 123);

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(12);
      doc.text('Diagnosis Summary', 9, 130, { align: 'left' });

      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(10);
      doc.setTextColor('#5f6063');
      doc.text(reportData?.diagnosisSummary?.slice(0, 250)?.trim() ?? 'N/A', 9, 136, { align: 'left', maxWidth: 190 });

      // *********** END OF REPORTED ISSUE INFO ***********


      // *********** START OF Repair Recommendations INFO ***********

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      doc.roundedRect(5, 155, 200, 45, 5, 5, "S");

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(12);
      doc.text('Repair Recommendations', 9, 162, { align: 'left' });

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      // xStart , yStart, xEnd , yEnd
      doc.line(5, 166, 205, 166);

      // TITLE TEXT LAYOUT
      doc.setFont("Montserrat", 'bold');
      doc.setFontSize(11);
      doc.setTextColor('#3c4043');
      doc.text('Recommended Fix', 9, 173, { align: 'left' });
      doc.text('Estimated Time', 9, 192, { align: 'left' });
      doc.text('Estimated Cost', 80, 192, { align: 'left' });
      doc.text('Customer Approval', 150, 192, { align: 'left' });

      // VALUE TEXT LAYOUT
      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(10);
      doc.setTextColor('#5f6063');
      doc.text(reportData?.fix?.slice(0, 250)?.trim() ?? 'N/A', 9, 179, { align: 'left', maxWidth: 190 });
      doc.text((reportData?.repairTime ?? 'N/A') + ' ' + (reportData?.repairTimeUnit ?? 'N/A'), 9, 197, { align: 'left' });
      doc.text(reportData?.customerApproval ?? 'N/A', 150, 197, { align: 'left' });

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(11);
      doc.text(reportData?.currency + ' ' + (String(reportData?.amount ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '0'), 80, 197, { align: 'left' });




      // *********** END OF Repair Recommendations INFO ***********


      // *********** START OF IMAGES INFO ***********1

      if (selectedFiles?.length) {

        doc.setFont("Montserrat", 'bolder');
        doc.setTextColor('#3c4043');
        doc.setFontSize(12);
        doc.text('Attached images are provided for reference', 7, 210, { align: 'left' });

        // console.log(selectedFiles);

        const imageSet1 = selectedFiles.slice(0, 2);

        imageSet1.forEach((image: any, index: number) => {
          const x = this.imgPositions[index][0];
          const y = this.imgPositions[index][1];
          // const img: any = new Image();
          // img.src = image.blob;
          // image.blob.type.split("/")[1]
          doc.addImage(image.previewUrl ?? (window.location.origin + '/api/media/file/' + image?.uuid), 'webp', x, y, 80, 50);
        });

        // if (this.selectedFiles.length > 2) {
        //   // ADD NEW PAGE TO FIT IMAGES 
        //   doc.addPage();

        //   const imageSet2 = this.selectedFiles.slice(2);
        //   imageSet2.forEach((image: any) => {
        //     const x = this.imgPositions[image.index][0];
        //     const y = this.imgPositions[image.index][1];
        //     const img: any = new Image();
        //     img.src = image.image;
        //     doc.addImage(img, image.type.split("/")[1], x, y, 80, 50);
        //   });
        // }

      }

      // *********** END OF IMAGES INFO ***********

      // *********** START OF REPAIR PAYMENT  ***********

      // const hasImages: boolean = this.selectedFiles.length > 2;
      const hasImages: boolean = selectedFiles?.length > 0;

      if (hasImages) {
        doc.addPage();
      }

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      doc.roundedRect(5, (hasImages ? 15 : 207), 90, 42, 5, 5, "S");

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(12);
      doc.text('Repair Attempt Fee', 9, (hasImages ? 22 : 214), { align: 'left' });

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      // xStart , yStart, xEnd , yEnd
      doc.line(5, (hasImages ? 26 : 218), 95, (hasImages ? 26 : 218));

      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(11);
      doc.text('Diagnosis / Repair attempt fee charged is :', 9, (hasImages ? 33 : 225), { align: 'left', maxWidth: 80 });
      doc.setFont("Montserrat", 'bolder');
      doc.setFontSize(12);
      doc.text(reportData?.repairCurrency + ' ' + (String(reportData?.repairAmount ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '0'), 15, (hasImages ? 38 : 230), { align: 'left' });

      // *********** END OF REPAIR PAYMENT  ***********


      // *********** START OF REPAIR PAYMENT  ***********

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      doc.roundedRect(115, (hasImages ? 15 : 207), 90, 42, 5, 5, "S");

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(12);
      doc.text('Payment Information', 200, (hasImages ? 22 : 214), { align: 'right' });

      doc.setDrawColor('#e1e1e1');
      doc.setLineWidth(0.4);
      // xStart , yStart, xEnd , yEnd
      doc.line(115, (hasImages ? 26 : 218), 205, (hasImages ? 26 : 218));


      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(10);
      doc.text('All Accounts Payable to :', 200, (hasImages ? 33 : 225), { align: 'right' });
      doc.text('Buy Goods And Services', 200, (hasImages ? 43 : 235), { align: 'right' });
      doc.text('Till Number', 200, (hasImages ? 48 : 240), { align: 'right' });

      doc.setFont("Montserrat", 'bolder');
      doc.text('TECOM ADVANCE', 200, (hasImages ? 38 : 230), { align: 'right' });
      doc.text('8546892', 200, (hasImages ? 53 : 245), { align: 'right' });

      // *********** END OF REPAIR PAYMENT  ***********

      doc.setTextColor('#3c4043');
      doc.setFontSize(9);
      doc.text('Thank you for choosing our repair service. Please feel free to reach out for any inquiries.', 7, (hasImages ? 80 : 270), { align: 'left' });

      doc.setTextColor('#00F');
      doc.setFont("Montserrat", 'normal');
      doc.textWithLink('Terms and Conditions', 204, (hasImages ? 80 : 270), {
        align: 'right',
        url: 'https://www.tecomadvance.com/assets/Tecom%20Advance%20Disclaimer.pdf'
      });
      doc.setDrawColor('#00F');
      doc.setLineWidth(0.2);
      doc.line(169, (hasImages ? 81 : 271), 205, (hasImages ? 81 : 271))


      // *********** END OF PAYMENT DETAILS ***********

      doc.save(refId + '-report', { returnPromise: true }).then(() => {
        this.toastService.success('Report generated successfully!');

        if (!isRedownload) {
          reportData.media = selectedFiles.map((image: any) => image.uuid);

          const data = {
            email: reportData.email,
            customerName: reportData.name,
            reportData
          }

          this.reportsService.createReport(data).subscribe();

          setTimeout(() => {
            this.toastService.info('Redirecting ...', 1500);
            this.router.navigate(['/reports']);
          }, 2000);
        }

        localStorage.removeItem('rptjson');

      });

      doc = new jsPDF();

    }, 10);

  }
}
