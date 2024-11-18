import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';

import { from, mergeMap, Observable } from 'rxjs';

import { UserManagerService } from './user-manager.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly userManager = inject(UserManagerService);

  constructor() {
    this.auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.userManager.setUser(firebaseUser);
      } else {
        this.userManager.setUser(null);
      }
    });
  }

  get userState$() {
    return authState(this.auth);
  }

  createUserWithEmailAndPassword(email: string, password: string): Observable<User | null> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.userManager.setUser(user);
          return user;
        })
        .catch((error) => {
          console.log(error);
          return null;
        }),
    ).pipe(mergeMap((user) => this.userManager.setUser(user)));
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<User | null> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.userManager.setUser(user);
          return user;
        })
        .catch((error) => {
          console.log(error);
          return null;
        }),
    ).pipe(mergeMap((user) => this.userManager.setUser(user)));
  }

  signInWithPopup(): Observable<User | null> {
    const provider = new GoogleAuthProvider();
    return from(
      signInWithPopup(this.auth, provider)
        .then((result) => {
          const user = result.user;
          this.userManager.setUser(user);
          return user;
        })
        .catch((error) => {
          console.log(error);
          return null;
        }),
    ).pipe(mergeMap((user) => this.userManager.setUser(user)));
  }

  logout(): Observable<void> {
    this.userManager.setUser(null);
    return from(this.auth.signOut());
  }
}
