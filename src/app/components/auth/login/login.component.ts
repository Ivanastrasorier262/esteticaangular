import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserService } from 'src/app/service/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    email!: string;
    password!: string;
    messageError: string|null = null;

    constructor(public layoutService: LayoutService, 
        private userService:UserService, private router: Router) { }

    login(){
        this.userService.login(this.email, this.password).then(()=>{
            console.log('login ok');
            this.router.navigate(['pages/patients']);
        }).catch(err=>{
            console.error(err);

            this.messageError = err.message;

        });
    }
}
