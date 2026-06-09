import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export const getAuthUser = async () => {
    try{
        const cookieStore = await cookies();
        const token = cookieStore.get('jwtToken')?.value;
        if(!token) return null;
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        return decoded.userId;
    } catch(e) {
        console.error(e);
        return null;
    }
}