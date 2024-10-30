import { escape } from "querystring";

export const userShema = {
  username: {
    exists: true, 
    notEmpty: true, 
    escape: true
  }, 
  password: {
    exists: true
  }
}