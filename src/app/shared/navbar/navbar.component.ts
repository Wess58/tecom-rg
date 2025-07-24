import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { ApiCacheService } from '../../services/api-cache.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    standalone: false
})
export class NavbarComponent {

    currentUser: any = {};


    constructor(
        public router: Router,
        private usersService: UsersService,
        private apiCacheService: ApiCacheService
    ) {
        router.events.subscribe((val) => {
            if (val instanceof ActivationEnd && !this.currentUser?.id) {
                this.currentUser = JSON.parse(localStorage.getItem('tcmuser') || '{}');
                this.currentUser?.userId ? this.getUserWithCache(this.currentUser.userId) : '';
            }
        });
    }


    getUserWithCache(userId: number) {
        const cacheKey = `user_${userId}`;
        const cachedUser = this.apiCacheService.get<any>('tcmuserStamp');

        if (cachedUser) {
            // console.log('cachedUser', cachedUser);
            this.currentUser = JSON.parse(localStorage.getItem('tcmuser') || '{}');
        } else {

            // console.log('not cached');

            this.usersService.getOneUser(userId).subscribe(res => {
                // console.log('not cached', res);
                if(res.status !== 'ACTIVE'){
                    this.logout();
                }

                const user = {
                    email: res.body.email,
                    name: res.body.name,
                    status: res.body.status,
                    role: res.body.role,
                    userId: res.body.id,
                    jobTitle: res.body.jobTitle
                }

                localStorage.setItem('tcmuser', JSON.stringify(user));
                this.currentUser = { ...user };
                this.apiCacheService.set('tcmuserStamp', user);

            });
        }
    }



    logout(): void {
        this.router.navigate(['/login']);
        this.currentUser = {};

        // localStorage.removeItem('tcmuser');
        this.apiCacheService.clearAll();
        // localStorage.removeItem('url');

        setTimeout(() => {
            location.reload();
        }, 10);

    }

}
