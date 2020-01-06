export class FileUpload {
    $key: string;
    projectID: any;
    name: string;
    url: string;
    file: File;
    progress: number;
    dated: any;
    commentID: any;
    createdAt: Date = new Date();
  
    constructor(file: File) {
      this.file = file;
    }
  }
  