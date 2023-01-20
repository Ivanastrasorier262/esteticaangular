import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UserService } from '../service/user.service';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [ConfirmationService, MessageService]
})
export class AppTopBarComponent {

    items!: MenuItem[];

    constructor(public layoutService: LayoutService, private confirmationService: ConfirmationService, private userService: UserService) { }

    closeSession(event: Event) {
        this.confirmationService.confirm({
            key: 'closeSession',
            target: event.target || new EventTarget,
            message: '¿Desea cerrar sesion?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.logout();
            },
            reject: () => {

            }
        });
    }
}
