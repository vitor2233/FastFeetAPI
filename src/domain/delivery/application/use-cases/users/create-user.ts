import { Either, left, right } from "@/core/either";
import { UsersRepository } from "../../repositories/users-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { User, UserRole } from "@/domain/delivery/enterprise/entities/user";
import { HashGenerator } from "@/domain/delivery/cryptography/hash-generator";

interface CreateUserUseCaseRequest {
    cpf: string
    name: string
    password: string
    role: 'DELIVERYMAN' | 'ADMIN'
}

type CreateUserUseCaseResponse = Either<UserAlreadyExistsError, { user: User }>

export class CreateUserUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private hashGenerator: HashGenerator
    ) { }

    async execute({ cpf, name, password, role }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
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