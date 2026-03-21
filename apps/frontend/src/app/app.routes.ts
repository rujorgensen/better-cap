import type {
    Route,
} from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./_pages/main/main.component').then(
                        (m) => m.MainComponent,
                    ),
            },
        ],
    },

    // Otherwise redirect to home
    {
        path: '**',
        redirectTo: '',
    },
];
