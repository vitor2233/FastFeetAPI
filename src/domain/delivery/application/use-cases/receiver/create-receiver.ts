import { Either, left, right } from "@/core/either";
import { ReceiversRepository } from "../../repositories/receivers-repository";
import { Receiver } from "@/domain/delivery/enterprise/entities/receiver";
import { Injectable } from "@nestjs/common";

interface CreateReceiverUseCaseRequest {
    name: string
}

type CreateReceiverUseCaseResponse = Either<null, { receiver: Receiver }>

@Injectable()
export class CreateReceiverUseCase {
    constructor(
        private receiversRepository: ReceiversRepository,
    ) { }

    async execute({ name }: CreateReceiverUseCaseRequest): Promise<CreateReceiverUseCaseResponse> {
        const receiver = Receiver.create({
            name,
        })

        await this.receiversRepository.create(receiver)

        return right({
            receiver
        })
    }

}