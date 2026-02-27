import { UserRepo } from "@/repos/user.repo";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Errors } from "@/shared/errors";

export class AuthService {

    constructor(private readonly userRepo: UserRepo) {}

    async register(email: string, password: string) {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
         throw new Error('Usuario já existe');
    }
        await this.userRepo.createUser({
            email,
            password: bcrypt.hashSync(password, 10)
        });
        return `User registered! `;
    }
    
    async login(email: string, password: string){
        const user = await this.userRepo.findByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('Email ou senha inválidos');
        }
        const userEmail = user?.email;
        const token = jwt.sign({ userEmail }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return { token };
    }


}