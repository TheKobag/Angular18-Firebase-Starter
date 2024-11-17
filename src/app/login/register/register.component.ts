import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/auth/auth.service';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-register',
  standalone: true,
  imports: [TranslateModule, LoginFormComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly userSerice = inject(AuthService);
  private readonly router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
    rememberme: new FormControl(''),
  });

  onRegister(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (email && password)
      this.userSerice.signInWithEmailAndPassword(email, password).subscribe((user) => {
        if (user) {
          this.router.navigate(['/']);
        }
      });
  }
}
