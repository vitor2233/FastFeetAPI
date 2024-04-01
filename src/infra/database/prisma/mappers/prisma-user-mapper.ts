import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserRole } from "@/domain/delivery/enterprise/entities/user";
import { Prisma, User as PrismaUser, UserRole as PrismaUserRole } from "@prisma/client";

export class PrismaUserMapper {
    static toDomain(raw: PrismaUser): User {
        const userRoleMap: Record<PrismaUserRole, UserRole> = {
            [PrismaUserRole.DELIVERYMAN]: UserRole.DELIVERYMAN,
            [PrismaUserRole.ADMIN]: UserRole.ADMIN,
        };

        const userRole: UserRole = userRoleMap[raw.role];

        return User.create({
            cpf: raw.cpf,
            role: userRole,
            password: raw.password,
            name: raw.name,
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
        const userRoleMap: Record<UserRole, PrismaUserRole> = {
            [UserRole.DELIVERYMAN]: PrismaUserRole.DELIVERYMAN,
            [UserRole.ADMIN]: PrismaUserRole.ADMIN,
        };

        const userRole: PrismaUserRole = userRoleMap[user.role];

        return {
            id: user.id.toString(),
            name: user.name,
            cpf: user.cpf,
            role: userRole,
            password: user.password
        }
    }
}
