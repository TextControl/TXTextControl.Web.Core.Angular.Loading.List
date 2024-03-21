import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

declare const TXTextControl: any;

interface DocumentData {
  data: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  // public array of DocumentData
  public documentList: DocumentData[] = [];
  public selectedDocument: DocumentData | undefined;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getFilenames();
  }

  getFilenames() {
    this.http.get<DocumentData[]>('/document/list').subscribe(
      (result) => {
        this.documentList = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  saveDocument(name: string) {

    let streamType = TXTextControl.StreamType.InternalUnicodeFormat;

    switch (this.selectedDocument?.name.split('.').pop()) {
      case 'docx':
        streamType = TXTextControl.StreamType.WordprocessingML;
        break;
      case 'rtf':
        streamType = TXTextControl.StreamType.RichTextFormat;
        break;
      case 'doc':
        streamType = TXTextControl.StreamType.MSWord;
        break;
    }

    TXTextControl.saveDocument(streamType, (document: any) => {
      if (this.selectedDocument) {
        this.selectedDocument.data = document.data;

        // Send a POST request to the server
        this.http.post('/document/save', this.selectedDocument).subscribe(
          (result) => {
            alert("Document saved successfully");
            this.getFilenames();
          }
        );
      }
    });
  }

  loadDocument(name: string) {
    // Call HTTP GET with the name of the document as a query parameter
    this.http.get<DocumentData>('/document/load', {
      params: {
        name: name
      }
    }).subscribe(
      (result) => {
        this.selectedDocument = result;

        let streamType = TXTextControl.StreamType.InternalUnicodeFormat;

        switch (this.selectedDocument.name.split('.').pop()) {
          case 'docx':
            streamType = TXTextControl.StreamType.WordprocessingML;
            break;
          case 'rtf':
            streamType = TXTextControl.StreamType.RichTextFormat;
            break;
          case 'doc':
            streamType = TXTextControl.StreamType.MSWord;
            break;
        }

        TXTextControl.loadDocument(streamType, this.selectedDocument.data, () => {
          TXTextControl.setEditMode(1);
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'tx-ng-loading-docs.client';
}
