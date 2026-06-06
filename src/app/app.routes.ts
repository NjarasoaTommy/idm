import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => {
      return import('./Components/conception/conception.component').then((m) => {
        return m.ConceptionComponent;
      });
    }
  },
  {
    path: "modele",
    loadComponent: () => {
      return import('./Components/modele/modele.component').then((m) => {
        return m.ModeleComponent;
      });
    }
  }
];
