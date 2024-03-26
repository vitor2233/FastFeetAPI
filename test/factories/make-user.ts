import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User, UserProps, UserRole } from "@/domain/delivery/enterprise/entities/user"
import { faker } from "@faker-js/faker"

export function makeUser(
    override: Partial<UserProps> = {},
    id?: UniqueEntityID,
) {
    const question = User.create(
        {
            name: faker.person.fullName(),
            cpf: '111.111.111-11',
            password: faker.internet.password(),
            role: UserRole.DELIVERYMAN,
            ...override,
        },
        id,
    )

    return question
}