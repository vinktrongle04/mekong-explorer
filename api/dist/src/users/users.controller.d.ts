import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
        createdAt: Date;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    getProfile(): Promise<{
        message: string;
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
        createdAt: Date;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }) | null>;
}
