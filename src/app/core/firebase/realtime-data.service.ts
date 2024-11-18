import { inject, Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeDataService {
  database = inject(AngularFireDatabase).database;

  getItem<T>(collectionName: string, uid: string): Observable<T> {
    return from(
      this.database
        .ref(collectionName)
        .get()
        .then((res) => (res.val() ? res.val()[uid] : null)),
    );
  }

  getItems<T>(collectionName: string): Observable<T> {
    return from(
      this.database
        .ref(collectionName)
        .get()
        .then((res) => (res.val() ? res.val() : null)),
    );
  }

  addItem<T>(collectionName: string, uid: string, item: T): Observable<void> {
    return from(this.database.ref(collectionName).child(uid).set(item));
  }

  updateItem<T>(collectionName: string, uid: string, item: T): Observable<void> {
    return from(
      this.database
        .ref(collectionName)
        .child(uid)
        .update(item as Object),
    );
  }

  deleteItem(collectionName: string, uid: string): Observable<void> {
    return from(this.database.ref(collectionName).remove());
  }
}
