type ErrorType = {
   message: string;
   status: number;
   path?: string
}
export class ErrorWithStatus {
   message: string
   status: number
   path?: string
   constructor({ message, status, path }: ErrorType) {
      this.message = message
      this.status = status
      this.path = path
   }
}