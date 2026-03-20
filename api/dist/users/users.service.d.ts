import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    create(createUserDto: CreateUserDto): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            displayName: string | null;
            avatarUrl: string | null;
            bio: string | null;
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<({
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            displayName: string | null;
            avatarUrl: string | null;
            bio: string | null;
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findByEmail(email: string): Promise<({
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            displayName: string | null;
            avatarUrl: string | null;
            bio: string | null;
            userId: string;
        } | null;
    } & {
        id: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
