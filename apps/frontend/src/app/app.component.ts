import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
    selector: 'app-root',
    imports: [
        RouterModule,
        NgxSonnerToaster,
    ],
    template: `
    <ngx-sonner-toaster />
    <router-outlet></router-outlet>
    `,
})
export class AppComponent {

}
