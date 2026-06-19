'use server';

import { cookies } from 'next/headers'
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { getAuthUser } from '@/lib/auth';

type AuthResult = 
    | { success: true } 
    | { success: false; error: string }

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    avatar: z.string().optional()
})

const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const register = async ({name, email, password, avatar} : {name: string, email: string, password: string, avatar?: string}) : Promise<AuthResult> => {
    try {
        const result = registerSchema.safeParse({ name, email, password, avatar })
        if (!result.success) {
            return { success: false, error: result.error.issues[0].message }
        }
        await connectDB();
        let user = await User.findOne({email});
        if(user) return {success: false,  error: 'Email already exists'};
        user = await User.create({name, email, password, avatar});
        const jwtToken = jwt.sign(
            { userId: user._id },  // payload - data you want to store in the token
            process.env.JWT_SECRET as string,  // secret key from your .env
            { expiresIn: '7d' }
        );
        (await cookies()).set('jwtToken', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });
        return {success: true};
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error registering"};
    }
} 

export const login = async ({email, password}: {email: string, password: string}) : Promise<AuthResult> => {
    try {
        const result = loginSchema.safeParse({email, password })
        if (!result.success) {
            return { success: false, error: result.error.issues[0].message }
        }

        await connectDB();
        const user = await User.findOne({email});

        if(!user) return {success: false, error: 'Invalid credentials'}

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return { success: false, error: 'Invalid credentials' }

        const jwtToken = jwt.sign(
            { userId: user._id},
            process.env.JWT_SECRET as string,
            {expiresIn: '7d'}
        );
        (await cookies()).set('jwtToken',jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60*60*24*7,
        })
        return {success: true};
    } catch(e) {
        console.error(e);
        return {success: false, error: "Error logging in"};
    }
}

export const signOut = async (): Promise<AuthResult> => {
    try {
        const cookieStore = await cookies();
        cookieStore.set('jwtToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            path: '/',
        });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Error signing out' };
    }
}