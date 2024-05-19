import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage!: Storage;

  constructor(public _storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this._storage.create();
    this.storage = storage;
  }

  storeUserData(data: any) {
    let stringData = JSON.stringify(data);
    var promise = new Promise((resolve, reject) => {
      this.storage
        .set('user', stringData)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  getUserData() {
    let data;
    var promise = new Promise((resolve, reject) => {
      this.storage
        .get('user')
        .then((response) => {
          data = JSON.parse(response);
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  removeUserData() {
    var promise = new Promise((resolve, reject) => {
      this.storage
        .remove('user')
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return promise;
  }




}
