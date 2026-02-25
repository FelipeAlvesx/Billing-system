import { prisma }  from "../../config/db";
import bcrypt from 'bcrypt';

export class AuthService {
    async register(email: string, password: string) {

        // const existingUser = await prisma.user.findUnique({ where: { email } });
        // if (existingUser) {
        //     throw new Error('Email já registrado');
        // }
        const newUser = { email,passwordHash: bcrypt.hashSync(password, 10) };
        const user = await prisma.user.create({
            data: {email: newUser.email, password: newUser.passwordHash}
        });
        return `User registered! - ${user.email}`;
    }
    
    async login(email: string, password: string){
    }


}