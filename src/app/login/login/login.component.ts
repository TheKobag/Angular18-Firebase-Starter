import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/auth/auth.service';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [LoginFormComponent, RouterLink, TranslateModule],
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly userSerice = inject(AuthService);
  private readonly router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
    rememberme: new FormControl(''),
  });

  onLogin(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (email && password)
      this.userSerice.signInWithEmailAndPassword(email, password).subscribe((user) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
  }

  signInGoogle(): void {
    this.userSerice.signInWithPopup().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
