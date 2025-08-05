import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { UsersService } from '../../../services/users.service';
import { ToastService } from '../../../services/toast.service';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
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


export class UsersComponent implements OnInit {

    loadingUsers = false;
    users: any = [];
    user: any = {
        role: 'USER'
    };
    currentUser: any = {};
    emailInvalid: boolean = false;

    errorMessage: string = '';
    userActionFail: boolean = false;
    performingAction: boolean = false;

    statuses: string[] = ['ACTIVE', 'INACTIVE'];
    action: string = '';

    page: number = 1;
    itemsPerPage = 20;
    totalLength: any;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private usersService: UsersService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('tcmuser') || '{}');

        window.scrollTo({ top: 1, behavior: "smooth" });

        this.page = +this.activatedRoute.snapshot.queryParams['page'] || 1;

        this.getUsers(this.page);
    }


    getUsers(page: number): void {
        this.loadingUsers = true;

        this.page = page ?? 1;
        this.users = [];

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


        this.usersService.getUsers(options).subscribe(
            {
                next: (res) => {
                    // console.log(res);
                    this.users = res.body;
                    this.totalLength = Number(res.headers.get('X-Total-Items'));
                    this.loadingUsers = false;

                },
                error: (error) => {
                    this.loadingUsers = false;
                }
            }
        )
    }

    createUser(): void {

        this.performingAction = true;
        this.userActionFail = false;

        this.usersService.createUser(this.user).subscribe(
            {
                next: (res) => {

                    this.performingAction = false;
                    this.setUserPassword('closeEditModal', 'CREATE');

                },
                error: (error) => {
                    console.log(error);
                    this.userActionFail = true;
                    this.performingAction = false;
                    this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

                }
            }
        )
    }


    editUser(): void {
        this.performingAction = true;
        this.userActionFail = false;

        this.usersService.updateUser(this.user).subscribe(
            {
                next: (res) => {
                    this.performingAction = false;
                    this.closeModal('closeEditModal');
                    this.getUsers(this.page);

                    this.toastService.success('User updated successfully!');
                },
                error: (error) => {
                    console.log(error);
                    this.userActionFail = true;
                    this.performingAction = false;
                    this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

                }
            }
        )
    }

    deleteUser(): void {
        this.performingAction = true;
        this.userActionFail = false;

        this.usersService.deleteUser(this.user.id).subscribe(
            {
                next: (res) => {
                    this.performingAction = false;
                    this.closeModal('closeUserActionModal');
                    this.getUsers(this.page);

                    this.toastService.success('User deleted successfully!');
                },
                error: (error) => {
                    console.log(error);
                    this.userActionFail = true;
                    this.performingAction = false;
                    this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

                }
            }
        )
    }

    setUserPassword(modalId: string = 'closeSetPasswordModal', action: string = 'SET_PASSWORD'): void {
        this.performingAction = true;
        this.userActionFail = false;

        const data = {
            email: this.user.email,
            password: this.user.password
        }

        this.usersService.setPassword(data).subscribe(
            {
                next: (res) => {
                    action !== 'SET_PASSWORD' ? this.getUsers(this.page) : '';
                    this.performingAction = false;
                    this.toastService.success('User' + (action === 'SET_PASSWORD' ? 'updated' : 'created') + 'successfully!');
                    this.closeModal(modalId);
                },
                error: (error) => {
                    console.log(error);
                    this.userActionFail = true;
                    this.performingAction = false;
                    this.errorMessage = error?.desc ?? 'Please try again in 15 minutes';

                }
            }
        )
    }


    selectUser(user: any, action: string): void {
        this.user = { ...user };
        this.action = action;
    }


    validateEmail(): void {
        // console.log(!(/\S+@\S+\.\S+/).test(this.user.email.trim()));
        this.emailInvalid = this.user.email && !(/\S+@\S+\.\S+/).test(this.user.email);
    }


    resetUser(): void {
        this.user = { role: 'USER' };
        this.performingAction = false;
        this.userActionFail = false;
    }

    closeModal(id: string): void {
        const close: any = document.getElementById(id) as HTMLElement;
        close?.click();
    }

}
