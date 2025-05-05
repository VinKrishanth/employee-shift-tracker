
export const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
    maxAge: 9 * 60 * 60 * 1000, 
};
  