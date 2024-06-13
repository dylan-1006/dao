import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMessage } from '../../entities/message/message.model';
import { MessageStatus } from '../../entities/enumerations/message-status.model';
import dayjs from 'dayjs/esm';
import { ISession } from '../../entities/session/session.model';
import { ApplicationUserManager } from '../../home/applicationUserManager';

@Component({
  selector: 'jhi-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() currentSession: ISession | null = null;
  sessionId = this.currentSession?.id.toString();
  userId: number = 1;
  messages: IMessage[] = [];
  pinnedMessages: IMessage[] = [];
  tempPinnedMessages: IMessage[] = [];
  newMessage: string = '';

  @ViewChild('chatMessages') chatMessages!: ElementRef;

  constructor(private http: HttpClient, private applicationUserManager: ApplicationUserManager) {}

  ngOnInit() {
    if (this.currentSession) {
      this.userId = this.applicationUserManager.getCurrentApplicationUserID();
      this.sessionId = this.currentSession.id.toString();
      this.fetchMessages();
      this.scrollToBottom();
      this.pollForNewMessages();
    }
  }

  pollForNewMessages() {
    setInterval(() => {
      this.fetchMessages();
    }, 5000);
  }

  fetchMessages() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDE4NzYyMH0.KmaFFRyIJsssVtVaSkjbLKCeWHkIyIj4bWUqCXM5CrQAQjL6LH2ydNYaXGZ2mwIsgb3u955wWt4q9nUeZ9PYwQ'
    );

    this.http.get<IMessage[]>(`/api/in-session-messages/${this.sessionId}`, { headers }).subscribe(messages => {
      messages.sort((a, b) => a.id - b.id);
      this.messages = messages;
      this.pinnedMessages = messages.filter(message => message.isPinned);
    });
  }

  sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    const headers = new HttpHeaders()
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMDI4MzgxNX0.m-98LCrPjzQeYn4JjntfaUYEoP5XsvgI5P0V6QAR0KwRqhCIN7dfi7EoRxAhQv4xho_v-fiGZ3v_tqIVmKvfQg'
      )
      .set('Content-Type', 'application/json');

    const newMessage = {
      content: this.newMessage.trim(),
      sentTime: dayjs(),
      status: MessageStatus.SENT,
      hasAttachment: false,
      isPinned: false,
      applicationUser: { id: this.userId },
      session: { id: this.sessionId },
    };

    this.http.post<IMessage>('/api/messages', newMessage, { headers }).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        this.fetchMessages();
        this.newMessage = '';
        this.scrollToBottom();
      },
      error => {
        console.error('Error sending message:');
        console.error('Request URL:', '/api/messages');
        console.error('Request Body:', newMessage);
        console.error('Error:', error);
      }
    );
  }

  togglePin(message: IMessage) {
    message.isPinned = !message.isPinned;

    const index = this.messages.findIndex(msg => msg.id === message.id);
    this.messages[index].isPinned = message.isPinned;

    if (message.isPinned) {
      this.tempPinnedMessages.push(message);
      this.tempPinnedMessages.sort((a, b) => a.id - b.id);
      this.pinnedMessages = this.tempPinnedMessages;
    } else {
      this.tempPinnedMessages = this.tempPinnedMessages.filter(msg => msg.id !== message.id);
      this.pinnedMessages = this.tempPinnedMessages;
    }

    const headers = new HttpHeaders()
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTcxMjc4OTc0Mn0.yowm_DPqx98s3FEhkfgfcCIiNE__lkdxPAJZnGj-DDu-7gh1mAwWxvlV-K2oZi0XQot2fYEHjPj6Kl2l2hfqew'
      )
      .set('Content-Type', 'application/json');

    this.http.put(`/api/messages/${message.id}/toggle-pin`, {}, { headers }).subscribe(
      response => {
        console.log('Toggle pin successful:', response);
      },
      error => {
        console.error('Error toggling pin:', error);
      }
    );
  }

  scrollToBottom() {
    try {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch (err) {}
  }

  protected readonly dayjs = dayjs;
}
