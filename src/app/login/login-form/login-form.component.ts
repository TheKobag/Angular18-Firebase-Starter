import { ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-form',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, PasswordModule, CheckboxModule, ButtonModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  loginForm: InputSignal<FormGroup> = input.required();
  showGoogle: InputSignal<boolean> = input(false);
  onLogin: OutputEmitterRef<void> = output();
  onLoginWithGoogle: OutputEmitterRef<void> = output();
}
