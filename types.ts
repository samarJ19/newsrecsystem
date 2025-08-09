export interface JWTPayload {
    id:string,   
}
declare module 'next/server' {
  interface NextRequest {
    user:SafeUser
  }
}

export interface User{
  id:string,
  firstName: string,
  lastName: string,
  email: string,
  hashPassowrd: string,
  userinteraction: Userinteraction []
}

export interface SafeUser {
   id:string,
  firstName: string,
  lastName: string | null,
  email: string,
  userinteraction ?: Userinteraction []
}

export interface Userinteraction {
  id:string,
  action: Action,
  userId: string
}

enum Action{
  View,
  Like,
  Dislike,
  Saved
}