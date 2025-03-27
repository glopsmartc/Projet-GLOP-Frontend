// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';
// import SockJS from 'sockjs-client'; 
// import { Stomp } from '@stomp/stompjs';
// import { AuthService } from './auth.service';

// declare const window: any;

// @Injectable({
//   providedIn: 'root',
// })
// export class NotificationService {
//   private stompClient: any;
//   public notification$ = new Subject<string>();

//   //private apiUrl: string;

//   constructor(private authService: AuthService) {
//     //this.apiUrl = this.getApiUrl();
//     this.connect();
//   }

//   /*private getApiUrl(): string {
//     if (typeof window !== 'undefined' && window.config?.apiBaseUrlAssistance) {
//       return `${window.config.apiBaseUrlAssistance}/ws`;
//     } else {
//       console.warn('window.config is not available or window is undefined');
//       return '';
//     }
//   }*/

//   private connect(): void {
//     try {
//       // Connect to the WebSocket endpoint
//       const socket = new SockJS('http://localhost:8083/ws');
//       this.stompClient = Stomp.over(socket);

//       // Connect and subscribe to the notification topic
//       this.stompClient.connect({}, () => {
//         console.log('WebSocket connected');
//         // Subscribe to logisticien notifications
//         this.stompClient.subscribe('/topic/logisticien', (message: any) => {
//           this.notification$.next(message.body);
//         });
//       }, (error: any) => {
//         console.error('WebSocket connection error:', error);
//       });
//     } catch (error) {
//       console.error('WebSocket connection failed:', error);
//     }
//   }

//   disconnect(): void {
//     if (this.stompClient) {
//       try {
//         this.stompClient.disconnect();
//       } catch (error) {
//         console.error('WebSocket disconnection error:', error);
//       }
//     }
//   }
// }