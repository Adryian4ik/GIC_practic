import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    {
        path: "sign_in",
        component: SignInComponent
    },
    {
        path: "main",
        component: MainComponent
    },
    {
        path: "**",
        redirectTo: 'main'
    }
];
