import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Receiver, ReceiverProps } from "@/domain/delivery/enterprise/entities/receiver"
import { faker } from "@faker-js/faker"

export function makeReceiver(
    override: Partial<ReceiverProps> = {},
    id?: UniqueEntityID,
) {
    const question = Receiver.create(
        {
            name: faker.person.fullName(),
            address: faker.location.streetAddress(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            ...override,
        },
        id,
    )

    return question
}