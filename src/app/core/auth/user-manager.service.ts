import { inject, Injectable, signal } from '@angular/core';

import { User as FirebaseUser } from 'firebase/auth';
import { map, Observable, of, tap } from 'rxjs';

import { FirestoreDataService } from '../firebase/firestore-data.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagerService {
  private readonly firestoreService = inject(FirestoreDataService);

  user = signal<User | null>(null);

  setUser(firebaseUser: FirebaseUser | null): Observable<User | null> {
    if (firebaseUser) {
      return this.firestoreService.getItem('users', firebaseUser.uid).pipe(
        map((user) => {
          if (!user) {
            const newUser = this.createAppUser(firebaseUser);
            this.firestoreService.addItem('users', newUser, firebaseUser.uid).pipe(tap(() => this.updateLocalUser(newUser)));
          } else {
            this.updateLocalUser(user);
          }

          return user;
        }),
      );
    } else {
      this.updateLocalUser(this.createAppUser(null));
      return of(null);
    }
  }

  updateUserProperties(user: User): Observable<void> {
    return this.firestoreService.updateItem('users', user.uid, user).pipe(tap(() => this.updateLocalUser(user)));
  }

  updateLocalUser(user: User): void {
    this.user.set(user);
  }

  private createAppUser(firebaseUser: FirebaseUser | null): User {
    return {
      uid: firebaseUser?.uid || '',
      email: firebaseUser?.email || '',
      displayName: firebaseUser?.displayName || '',
      photoURL: firebaseUser?.photoURL || '',
      emailVerified: firebaseUser?.emailVerified || false,
    };
  }
}
