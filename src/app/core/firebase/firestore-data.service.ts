import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FirestoreDataService {
  constructor(private firestore: AngularFirestore) {}

  getItems(collectionName: string): Observable<any[]> {
    return this.firestore
      .collection(collectionName)
      .snapshotChanges()
      .pipe(map((actions) => actions.map((a) => a.payload.doc.data())));
  }

  getItem(collectionName: string, uid: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(uid).valueChanges();
  }

  addItem(collectionName: string, data: any, uid?: string): Observable<void> {
    const id = uid ? uid : this.firestore.createId();
    return from(this.firestore.collection(collectionName).doc(id).set(data));
  }

  updateItem(collectionName: string, uid: string, data: any): Observable<void> {
    return from(this.firestore.collection(collectionName).doc(uid).update(data));
  }

  deleteItem(collectionName: string, uid: string): Observable<void> {
    return from(this.firestore.collection(collectionName).doc(uid).delete());
  }
}
