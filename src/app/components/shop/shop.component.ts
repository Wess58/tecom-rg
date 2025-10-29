import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';
import moment from 'moment';
import { ReportsService } from '../../services/reports.service';


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

    filters: any = {
        available: "",
        onOffer: "",
        hidden: "",
    };
    productImages: any[] = [];
    isGrid = false;

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

    currentImageIndex = 0;


    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private productsService: ProductsService,
        private toastService: ToastService,
        private reportsService: ReportsService
    ) { }

    ngOnInit(): void {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.setFilterParams();
    }


    setFilterParams(): void {
        this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

        this.filters = {
            name: this.activatedRoute.snapshot.queryParams['name'] ?? '',
            available: this.activatedRoute.snapshot.queryParams['available'] ?? '',
            onOffer: this.activatedRoute.snapshot.queryParams['onOffer'] ?? '',
            hidden: this.activatedRoute.snapshot.queryParams['hidden'] ?? '',
        }

        this.getProducts(this.page);
    }


    getProducts(page: number): void {
        this.loadingProducts = true;

        this.page = page ?? 1;
        this.products = [];

        const options = {
            name: this.filters.name?.trim() ?? '',
            available: !this.filters.available ? '' : this.filters.available == 'true',
            onOffer: !this.filters.onOffer ? '' : this.filters.onOffer == 'true',
            hidden: !this.filters.hidden ? '' : this.filters.hidden == 'true',
            pageSize: this.itemsPerPage,
            pageNo: this.page - 1,
            sort: 'id,desc',
        }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
                page,
                name: this.filters.name?.trim() ?? '',
                available: this.filters.available,
                onOffer: this.filters.onOffer,
                hidden: this.filters.hidden,
            },
            queryParamsHandling: 'merge',
            replaceUrl: !this.activatedRoute.snapshot.queryParams['page']
        });


        this.productsService.getProducts(options).subscribe(
            {
                next: (res) => {
                    // console.log(res);
                    this.products = res.body;
                    this.products.forEach((product: any) => {
                        !product?.media?.length ? product.media = [] : '';
                        product?.media.splice(0, 0, product.coverImage);
                        product.compatibleDevices = product?.compatibleDevices?.join(' , ') || '';

                    });

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

        this.action = action;
        this.product = Object.assign({}, product);

        if (action === 'EDIT') {
            this.product.price = this.reportsService.formatCurrency(this.product.price ?? '');
            this.product.offerPrice = this.reportsService.formatCurrency(this.product.offerPrice ?? '');
            this.product.inventoryCount = this.reportsService.formatCurrency(this.product.inventoryCount ?? '');
        }

        this.productImages = [];
        if (this.product?.media?.length) {
            this.productImages = JSON.parse(JSON.stringify(
                this.product.media.map((str: string) => (
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


    createProduct(): void {

        this.performingAction = true;
        this.productActionFail = false;

        this.productsService.createProduct(this.productFieldsFormatter()).subscribe(
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


    editProduct(modalId: string = 'closeEditModal'): void {
        this.performingAction = true;
        this.productActionFail = false;

        this.productsService.updateProduct(this.productFieldsFormatter()).subscribe(
            {
                next: (res) => {
                    this.performingAction = false;
                    this.closeModal(modalId);
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

    productFieldsFormatter(): any {

        // moment().format('DD/MM/YYYY')

        const product = Object.assign({}, this.product);

        // product.price = +product.price;
        product.price = product?.price ? +(product?.price?.replace(/,/g, '')) : 0;
        product.offerPrice = product?.offerPrice ? +(product?.offerPrice?.replace(/,/g, '')) : 0;
        // product.inventoryCount = +product.inventoryCount || 0;
        product.inventoryCount = product?.inventoryCount ? +(product?.inventoryCount?.replace(/,/g, '')) : 0;


        !product?.coverImage?.length ? product.coverImage = this.productImages[0].uuid : '';
        product.media = this.productImages.filter((image: any) => image.uuid && image.uuid !== product.coverImage).map((image: any) => image.uuid);
        if (product?.compatibleDevices?.length) product.compatibleDevices = product.compatibleDevices.split(',').map((str: string) => str.trim());

        return product;
    }

    changeProductState(): void {
        this.action === 'AVAILABLE' ?
            this.product.available = true :
            this.product.hidden = !this.product.hidden;

        this.editProduct('closeProductActionModal');
    }


    deleteProduct(): void {
        this.performingAction = true;
        this.productActionFail = false;

        this.productsService.deleteProduct(this.product.id).subscribe(
            {
                next: (res) => {
                    this.performingAction = false;
                    this.closeModal('closeProductActionModal');
                    this.getProducts(this.page);

                    this.toastService.success('Product deleted successfully!');
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

    updateImages(productImages: any): void {
        this.productImages = productImages;
    }

    setCoverImage(uuid: any): void {
        this.product.coverImage = uuid;
    }

    resetProduct(): void {
        this.product = { available: true, hidden: false, onOffer: false };
        this.performingAction = false;
        this.productActionFail = false;
        this.productImages = [];
    }

    closeModal(id: string): void {
        const close: any = document.getElementById(id) as HTMLElement;
        close?.click();
    }

    resetFilters(): void {

        this.filters = {
            available: "",
            onOffer: "",
            hidden: "",
            // year: new Date().getFullYear().toString()
        };

        this.page = 1;
        this.getProducts(1)
    }

}
