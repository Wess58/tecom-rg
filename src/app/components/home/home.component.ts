import { Component, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import moment from 'moment';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                // :enter is alias to 'void => *'
                style({ opacity: 0 }),
                animate(400, style({ opacity: 1 })),
            ]),
        ]),
    ],
    standalone: false
})
export class HomeComponent implements OnInit {

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
    public router: Router
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    // this.reportData = JSON.parse(localStorage.getItem('rptjson') ?? '{}');
    this.reportData.tech = JSON.parse(localStorage?.getItem('techId') ?? '1');
    // console.log(this.reportData);
    this.deviceTypes = this.deviceTypes.sort((a: string, b: string) => a.localeCompare(b));
    this.issueTypes = this.issueTypes.sort((a: string, b: string) => a.localeCompare(b));

  }

  validateEmail(): void {
    // console.log(!(/\S+@\S+\.\S+/).test(this.user.email.trim()));
    // this.emailInvalid = this.reportData.email && !(/\S+@\S+\.\S+/).test(this.reportData.email);
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

    // this.selectedFiles = this.selectedFiles.filter((file: any) => {
    //   return !file.fileTooLarge;
    // });

    this.selectedFiles.forEach((file: any, index: any) => {


      file.index = index;
      const reader = new FileReader();
      reader.onload = (e) => { file.image = reader.result; };

      reader.readAsDataURL(file);
      // console.log(file);

      // if (file.size > 5000000) {
      //   file.fileTooLarge = true;
      //   file.message = 'Image too large to upload!';
      // } else {
      //   file.fileTooLarge = false;
      //   file.message = '';

      // }
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

    // localStorage.setItem('rptjson', JSON.stringify(this.reportData?));
    localStorage.setItem('techId', JSON.stringify(this.reportData?.tech));

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
      const refId = 'TAR-' + moment(this.reportData?.date).format('YYMMDD') + moment().format('mmss');
      doc.text('#' + refId, 205, 10, { align: 'right' });

      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(11);
      doc.text(moment(this.reportData?.date).format('LL'), 205, 17, { align: 'right' });
      // *********** END OF HEADER ***********


      // *********** START OF REPORT BY ***********
      doc.setFontSize(9);
      doc.setTextColor('#5f6063');
      doc.text('REPORT BY', 5, 28, { align: 'left' });

      const tech = this.technicians.find((tech: any) => +this.reportData?.tech === tech?.id);

      doc.setTextColor('#3c4043');
      doc.setFont("Montserrat", 'bold');
      doc.setFontSize(9);
      doc.text(tech?.title ?? 'N/A', 5, 34.5, { align: 'left' });
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
      doc.text(this.reportData?.name?.toUpperCase() ?? 'N/A', 205, 40, { align: 'right' });

      doc.setFont("Montserrat", 'normal');
      doc.setFontSize(9);
      doc.setTextColor('#5f6063');
      doc.text(this.reportData?.phone ?? 'N/A', 205, 45, { align: 'right' });
      doc.text(this.reportData?.email ?? 'N/A', 205, 50, { align: 'right' });
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
      doc.text(this.reportData?.deviceType ?? 'N/A', 200, 75, { align: 'right' });
      doc.text(this.reportData?.brand ?? 'N/A', 200, 82, { align: 'right' });
      doc.text(this.reportData?.imei ?? 'N/A', 200, 89, { align: 'right' });
      doc.text(this.reportData?.accessories?.slice(0, 150)?.trim() ?? 'N/A', 200, 96, { align: 'right', maxWidth: 130 });

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
      doc.text(this.reportData?.reportedIssue ?? 'N/A', 48, 119, { align: 'left' });

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
      doc.text(this.reportData?.diagnosisSummary?.slice(0, 250)?.trim() ?? 'N/A', 9, 136, { align: 'left', maxWidth: 190 });

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
      doc.text(this.reportData?.fix?.slice(0, 250)?.trim() ?? 'N/A', 9, 179, { align: 'left', maxWidth: 190 });
      doc.text((this.reportData?.repairTime ?? 'N/A') + ' ' + (this.reportData?.repairTimeUnit ?? 'N/A'), 9, 197, { align: 'left' });
      doc.text(this.reportData?.customerApproval ?? 'N/A', 150, 197, { align: 'left' });

      doc.setFont("Montserrat", 'bolder');
      doc.setTextColor('#3c4043');
      doc.setFontSize(11);
      doc.text(this.reportData?.currency + ' ' + (String(this.reportData?.amount ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '0'), 80, 197, { align: 'left' });




      // *********** END OF Repair Recommendations INFO ***********


      // *********** START OF IMAGES INFO ***********1

      if (this?.selectedFiles?.length) {

        doc.setFont("Montserrat", 'bolder');
        doc.setTextColor('#3c4043');
        doc.setFontSize(12);
        doc.text('Attached images are provided for reference', 7, 210, { align: 'left' });

        // console.log(this.selectedFiles);

        const imageSet1 = this.selectedFiles.slice(0, 2);

        imageSet1.forEach((image: any) => {
          const x = this.imgPositions[image.index][0];
          const y = this.imgPositions[image.index][1];
          const img: any = new Image();
          img.src = image.image;
          doc.addImage(img, image.type.split("/")[1], x, y, 80, 50);
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
      const hasImages: boolean = this?.selectedFiles?.length;

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
      doc.text(this.reportData?.repairCurrency + ' ' + (String(this.reportData?.repairAmount ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '0'), 15, (hasImages ? 38 : 230), { align: 'left' });

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

      doc.save(refId + '-report');

      doc = new jsPDF();

    }, 10);

  }
}
