import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';
import { FILE_BORDER_KEYS } from '../../app.constants'
import { ComprssNConvrtService } from '../../services/comprss-n-convrt.service';
import moment from 'moment';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.scss',
    standalone: false,
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


export class ShopComponent implements OnInit {

    loadingProducts = false;
    products: any = [];
    product: any = {
        available: true,
        hidden: false,
        onOffer: false
    };
    productImages: any[] = [];
    isGrid = false;

    fileKeys = FILE_BORDER_KEYS;
    currentProduct: any = {};
    emailInvalid: boolean = false;

    errorMessage: string = '';
    productActionFail: boolean = false;
    performingAction: boolean = false;

    statuses: string[] = ['ACTIVE', 'INACTIVE'];
    action: string = '';

    page: number = 1;
    itemsPerPage = 20;
    totalLength: any;
    isCopied: boolean = false;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private productsService: ProductsService,
        private toastService: ToastService,
        private comprssNConvrtService: ComprssNConvrtService
    ) { }

    ngOnInit(): void {
        this.currentProduct = JSON.parse(sessionStorage.getItem('tcmproduct') || '{}');

        window.scrollTo({ top: 1, behavior: "smooth" });

        this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

        this.getProducts(this.page);
    }


    getProducts(page: number): void {
        this.loadingProducts = true;

        this.page = page ?? 1;
        this.products = [];

        const options = {
            // roleId: this.filters.roleId,
            // email: this.filters.email?.trim() ?? '',
            // name: this.filters.name?.trim() ?? '',
            // status: this.filters.status,
            pageSize: this.itemsPerPage,
            pageNo: this.page - 1,
            sort: 'id,desc',
        }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
                page,
                // roleId: this.filters.roleId,
                // status: this.filters.status,
                // email: this.filters.email?.trim() ?? '',
                // name: this.filters.name?.trim() ?? ''
            },
            queryParamsHandling: 'merge',
        });


        this.productsService.getProducts(options).subscribe(
            {
                next: (res) => {
                    // console.log(res);
                    this.products = res.body;
                    this.totalLength = Number(res.headers.get('X-Total-Items'));
                    this.loadingProducts = false;

                },
                error: (error) => {
                    this.loadingProducts = false;
                }
            }
        )
    }


    copyLink(product: any): void {
        navigator.clipboard.writeText('https://tecomadvance.com/shop?pid=' + product.id + '&pn=' + this.slugify(product.name));
        this.isCopied = true;
    }

    slugify(str: string): string {
        return str.replace(/[()]/g, '').replace(/\s/g, '-').toLowerCase();
    }

    selectProduct(product: any, action: string): void {
        this.product = { ...product };
        this.productImages = product.media && product.media.map((str: string) => (
            {
                previewUrl: window.location.origin + '/api/media/file/' + str,
                uuid: str,
                name: str,
                uploaded: true,
                compressed: true
            }
        ));        

        this.action = action;
    }


    createProduct(): void {

        this.performingAction = true;
        this.productActionFail = false;

        const product = Object.assign({}, this.product);

        !product?.coverImage?.length ? product.coverImage = this.productImages[0].uuid : '';
        product.media = this.productImages.filter((image: any) => image.uuid !== product.coverImage).map((image: any) => image.uuid);
        product.compatibleDevices = product.compatibleDevices.split(',').map((str: string) => str.trim());
        product.price = +product.price;
        product.offerPrice = +product.offerPrice || 0;
        product.inventoryCount = +product.inventoryCount || 0;

        console.log(product);

        // moment().format('DD/MM/YYYY')

        this.productsService.createProduct(product).subscribe(
            {
                next: (res) => {

                    this.performingAction = false;
                    this.closeModal('closeEditModal');
                    this.getProducts(this.page);
                    this.toastService.success('Product created successfully!');
                    this.resetProduct();
                },
                error: (error) => {
                    console.log(error);
                    this.productActionFail = true;
                    this.performingAction = false;
                    this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

                }
            }
        )
    }


    editProduct(): void {
        this.performingAction = true;
        this.productActionFail = false;

        this.productsService.updateProduct(this.product).subscribe(
            {
                next: (res) => {
                    this.performingAction = false;
                    this.closeModal('closeEditModal');
                    this.getProducts(this.page);

                    this.toastService.success('Product updated successfully!');
                },
                error: (error) => {
                    console.log(error);
                    this.productActionFail = true;
                    this.performingAction = false;
                    this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

                }
            }
        )
    }



    resetProduct(): void {
        this.product = { available: true, hidden: false, onOffer: false };
        this.performingAction = false;
        this.productActionFail = false;
    }

    closeModal(id: string): void {
        const close: any = document.getElementById(id) as HTMLElement;
        close?.click();
    }

    openUploadDialog(): void {
        // this.selectedDocumentSide = docSide;
        setTimeout(() => {
            document.getElementById('uploadfile')?.click();
        }, 10);
    }

    onFileChange(event: any): void {
        [...event.target.files].forEach((newFile: any) => {
            // const reader = new FileReader();
            // reader.onload = (e) => (newFile.image = reader.result);
            // reader.readAsDataURL(newFile);

            newFile.fileName = newFile.name.substr(0, newFile.name.lastIndexOf('.'));
            newFile.failCount = 0;
            newFile.duplicate = this.productImages.some((file: any) => newFile.name === file.name);
        });

        this.productImages = [...this.productImages, ...[...event.target.files]];

        this.productImages.forEach((file: any, index: number) => {

            if (!file.uploaded && !file.compressed) {
                file.compressing = true;
                setTimeout(() => {
                    this.comprssNConvrtService.compress(file);
                }, 500 * (index + 1));
            }
        });
    }


    uploadFile(file: any): void {
        this.comprssNConvrtService.compress(file);
    }

    duplicateFileFound(): boolean {
        return this.productImages.filter((file: any) => file.duplicate).length > 0;
    }

    setCoverImage(file: any): void {
        this.product.coverImage = file.uuid;
    }

    removeFileFromList(index: number): void {
        this.checkForMoreDuplicates(this.productImages[index]);
        setTimeout(() => {
            this.productImages.splice(index, 1);
        }, 100);
    }

    checkForMoreDuplicates(fileToRemove: any): void {
        const files: any = this.productImages.filter((file: any) => file.name === fileToRemove.name);
        files.length > 1 ? ((files[1].duplicate = false), this.uploadFile(files[1])) : '';
    }

    disableIfFileActivity(): boolean {
        return !this.productImages?.length || this.productImages.some(file => file.uploading === true || file.compressing === true);
    }

}
