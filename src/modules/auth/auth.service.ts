import { prisma }  from "../../config/db";


export class AuthService {

    async login(email: string, password: string){
        const user = await prisma.user.create({data: {
            name: "Felipe",
            email,
            password
        }});
        return user;
    }

    async register(name: string, email: string, password: string) {
        // Implement registration logic here
        return "User registered!";
    }

}