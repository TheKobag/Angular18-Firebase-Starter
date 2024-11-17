import { inject, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { User as FirebaseUser } from 'firebase/auth';
import { from, Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersRef = inject(AngularFireDatabase).database.ref('users');

  createUser(firebaseUser: FirebaseUser): Observable<User> {
    const newUser = this.createAppUser(firebaseUser);
    return from(
      this.usersRef
        .child(firebaseUser.uid)
        .set(newUser)
        .then(() => newUser)
    );
  }

  getUser(uid: string): Observable<User> {
    return from(
      this.usersRef.get().then((res) => (res.val() ? res.val()[uid] : null))
    );
  }

  updateUser(uid: string, property: Partial<User>): Observable<User> {
    this.usersRef.child(uid).update(property);
    return this.getUser(uid);
  }

  createAppUser(firebaseUser: FirebaseUser | null): User {
    return {
      uid: firebaseUser?.uid || '',
      email: firebaseUser?.email || '',
      displayName: firebaseUser?.displayName || '',
      photoURL: firebaseUser?.photoURL || '',
      emailVerified: firebaseUser?.emailVerified || false,
    };
  }
}
