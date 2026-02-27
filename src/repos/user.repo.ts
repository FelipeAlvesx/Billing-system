import { PrismaClient } from "@prisma/client";

export class UserRepo {

    constructor(private readonly prisma: PrismaClient) {}

    async createUser(data: any){
        return await this.prisma.user.create({data});    
    }

    async findByEmail(email: string){
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string){
        return await this.prisma.user.findUnique({ where: { id } });
    }

}