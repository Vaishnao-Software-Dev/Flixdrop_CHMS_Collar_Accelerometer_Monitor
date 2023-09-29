import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";

@Injectable({
  providedIn: "root",
})
export class LocalService {

  headers = {
    headers: {
      'Content-Type': 'application/json',
    }
  }

  accelerometerData = this.socket.fromEvent<string>('accelerometerData');

  constructor(private http: HttpClient, private socket: Socket) {
    this.socket.connect();
  }

  chartDateSets(){
      return this.http.get("http://localhost:3000/getAccData", this.headers);
  }

  connectToSocket() {
    this.socket.connect();
  }

  disconnectFromSocket() {
    this.socket.disconnect();
  }
}
