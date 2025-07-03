import {v4 as uuidv4} from 'uuid';
import {cookies} from "next/headers";


const generateUserId = (): string => {
  return uuidv4();
}

export const getUserIdFromCookies = async (): Promise<string> => {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value
  if (userId) {
    return userId;
  } else {
    const newUserId = generateUserId();
    cookieStore.set('userId', newUserId, {
      httpOnly: true, // Cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Cookie is sent with same-site requests
      maxAge: 604800 // 1 week in seconds
    });
    return newUserId;
  }
}