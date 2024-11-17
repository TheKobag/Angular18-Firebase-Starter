import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los documentos de una colección
  getItems(collectionName: string): Observable<any[]> {
    return this.firestore
      .collection(collectionName)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  // Obtener un solo documento
  getItem(collectionName: string, docId: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(docId).valueChanges();
  }

  // Agregar un documento a una colección
  addItem(collectionName: string, data: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(collectionName).doc(id).set(data);
  }

  // Actualizar un documento
  updateItem(collectionName: string, docId: string, data: any): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).update(data);
  }

  // Eliminar un documento
  deleteItem(collectionName: string, docId: string): Promise<void> {
    return this.firestore.collection(collectionName).doc(docId).delete();
  }
}
