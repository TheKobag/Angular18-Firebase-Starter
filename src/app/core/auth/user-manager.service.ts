import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { User as FirebaseUser } from 'firebase/auth';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from './user.model';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root',
})
export class UserManagerService {
  private readonly userService = inject(UserService);

  _user!: User;
  private user$ = new BehaviorSubject<User>(this._user);
  user = toSignal<User>(this.user$, { requireSync: true });

  setUser(firebaseUser: FirebaseUser | null): Observable<User> {
    let actualUser = of(this.user());
    if (firebaseUser) {
      this.userService.getUser(firebaseUser.uid).subscribe((user) => {
        if (!user) {
          this.userService
            .createUser(firebaseUser)
            .pipe(tap((user) => this.updateLocalUser(user)))
            .subscribe((usr) => (actualUser = of(usr)));
        } else {
          this.updateLocalUser(user);
          actualUser = of(user);
        }
      });
    } else {
      // const localStorageUid = localStorage.getItem('gw_user_uid')
      this.updateLocalUser(this.userService.createAppUser(null));
    }

    return actualUser;
  }

  updateUserProperties(): Observable<User> {
    return this.userService.updateUser(this.user().uid, this.user()).pipe(tap((user) => this.updateLocalUser(user)));
  }

  updateLocalUser(user: User): void {
    console.log('update', user);
    this.user$.next(user);
  }

}