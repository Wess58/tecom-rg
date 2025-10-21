import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { ApiCacheService } from '../../../services/api-cache.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
export class LoginComponent implements OnInit {

  login: any = {};
  logingIn: boolean = false;
  open: boolean = false;
  authenticationError: boolean = false;
  errorMessage: string = '';


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private apiCacheService: ApiCacheService
  ) { }


  ngOnInit(): void {
    if (localStorage.getItem('basicAuth')) {
      this.router.navigate(['/reports']);
    }
  }

  loginUser(): void {
    this.authenticationError = false;
    this.logingIn = true;

    const data = {
      email: this.login.email,
      password: this.login.password
    }

    this.usersService.loginUser(data).subscribe(
      {
        next: (res) => {
          // console.log(res);

          if (res.status === 'ACTIVE') {
            localStorage.setItem('tcmuser', JSON.stringify(res));
            localStorage.setItem('basicAuth', res.basicAuth);
            delete res.basicAuth;

            this.apiCacheService.set('tcmuserStamp', {});
            this.router.navigate(['/reports'],
              {
                replaceUrl: true
              }
            );
          } else {
            this.errorMessage = 'Your account has been deactivated. Please contact Admin for assistance.';
            this.authenticationError = true;
          }

        },
        error: (error) => {
          console.log(error);
          this.errorMessage = 'Username or password is incorrect. Please try again, or contact the admin for assistance';

          this.authenticationError = true;
          this.logingIn = false;
        },
      }
    )
  }

  showPassword(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    this.open = !this.open;
    passwordInput.type = this.open ? 'text' : 'password';
  }





}
