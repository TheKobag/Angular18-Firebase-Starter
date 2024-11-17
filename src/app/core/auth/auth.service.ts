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
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        // ...set user
        this.userManager.setUser(firebaseUser);
        // this.userSubject.next();
      } else {
        // User is signed out
        // ...
        this.userManager.setUser(null);
        // redirect a login
      }
    });
  }

  get userState$() {
    return authState(this.auth);
  }

  createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<User | null> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          // ...set user

          this.userManager.setUser(user);
          return user;
        })
        .catch((error) => {
          const errorCode = error.code;
          // const errorMessage = error.message;
          // ..
          console.log(errorCode);

          // if (errorCode === 'auth/email-already-in-use') {
          // }
          return null;
        })
    ).pipe(mergeMap((user) => this.userManager.setUser(user)));
  }

  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<User | null> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...set user
          this.userManager.setUser(user);
          return user;
        })
        .catch((error) => {
          const errorCode = error.code;
          // const errorMessage = error.message;
          console.log(errorCode);
          // if (errorCode === 'auth/invalid-credential') {
          // this.router.navigate(['register']);
          // }
          return null;
        })
    ).pipe(mergeMap((user) => this.userManager.setUser(user)));
  }

  signInWithPopup(): Observable<User | null> {
    const provider = new GoogleAuthProvider();
    // signInWithRedirect
    return from(
      signInWithPopup(this.auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential?.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...set user
          this.userManager.setUser(user);
          return user;
        })
        .catch((error) => {
          // Handle Errors here.
          // const errorCode = error.code;
          // const errorMessage = error.message;
          // The email of the user's account used.
          // const email = error.customData.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(error);

          // ...
          return null;
        })
    ).pipe(mergeMap((user) => this.userManager.setUser(user)));
  }

  logout(): Observable<void> {
    // ...set user
    this.userManager.setUser(null);
    return from(this.auth.signOut());
  }
}
