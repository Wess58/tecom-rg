import { Component } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
export class LoginComponent {

  login: any = {};
  logingIn: boolean = false;
  open: boolean = false;
  authenticationError: boolean = false;
  errorMessage: string = '';


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) { }


  loginUser(): void {
    this.authenticationError = false;
    this.logingIn = true;

    const data = {
      username: this.login.username,
      password: this.login.password
    }

    this.usersService.loginUser(data).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.router.navigate(['/reports']);

        },
        error: (error) => {
          console.log(error);

          if (error?.error?.code === 401) {
            this.errorMessage = 'Your account has been deactivated. Please contact ICT support for assistance.';
          } else {
            this.errorMessage = 'Please check your username or password and try again.';
          }

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
