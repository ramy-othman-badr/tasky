import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  url = 'https://todo.iraqsapp.com/'
  images_url = 'https://todo.iraqsapp.com/images/'

  access_token;
  refresh_token;

  httpOptions;

  constructor(public http: HttpClient) {

  }


  // post request
  postRequest(api_url, data?) {
    var promoise = new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.access_token}`,
        }),
      };
      this.http.post(this.url + api_url, data, httpOptions).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          console.log(error)
          reject(error);
        }
      );
    });
    return promoise;
  }


  // post request
  putRequest(api_url, data?) {
    var promoise = new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.access_token}`,
        }),
      };
      this.http.put(this.url + api_url, data, httpOptions).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          console.log(error)
          reject(error);
        }
      );
    });
    return promoise;
  }


  getRequest(api_url, data?) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.access_token}`,
      }),
    };
    var postData = '';
    let main_url;
    if (data && data != null) {
      for (let key in data) {
        if (Array.isArray(data[key])) {
          for (let l = 0; l < data[key].length; l++) {
            const element = data[key][l];
            postData = postData + key + '[]=' + element + '&';
          }
        } else {
          postData = postData + key + '=' + data[key] + '&';
        }
      }
      main_url = this.url + api_url + '?' + postData;
    } else {
      main_url = this.url + api_url;
    }
    var promoise = new Promise((resolve, reject) => {
      this.http.get(main_url, httpOptions).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
    return promoise;
  }


  deleteRequest(api_url) {
    var promoise = new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.access_token}`,
        }),
      };
      this.http.delete(this.url + api_url, httpOptions).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
    return promoise;
  }




}