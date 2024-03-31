import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../../repositories/users-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { User, UserRole } from "@/domain/delivery/enterprise/entities/user";
import { HashGenerator } from "@/domain/delivery/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

interface CreateUserUseCaseRequest {
    userId: string
    cpf: string
    name: string
    password: string
    role: 'DELIVERYMAN' | 'ADMIN'
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError | NotAllowedError, { user: User }>

@Injectable()
export class CreateUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private hashGenerator: HashGenerator
    ) { }

    async execute({ cpf, userId, name, password, role }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
        const loggedUser = await this.usersRepository.findById(userId)
        if (loggedUser.role != UserRole.ADMIN) {
            return left(new NotAllowedError())
        }

        const userWithSameCpf = await this.usersRepository.findByCpf(cpf)

        if (userWithSameCpf) {
            return left(new UserAlreadyExistsError())
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        let userRole: UserRole = UserRole.DELIVERYMAN
        if (role == 'ADMIN') {
            userRole = UserRole.ADMIN
        }

        const user = User.create({
            name,
            cpf,
            password: hashedPassword,
            role: userRole
        })

        await this.usersRepository.create(user)

        return right({
            user
        })
    }

}