import { prisma }  from "../../config/db";
import bcrypt from 'bcrypt';

export class AuthService {
    async register(email: string, password: string) {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        return `User registered! - ${user.email}`;
    }
    
    async login(email: string, password: string){
    }


}