import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateReceiverUseCase } from "@/domain/delivery/application/use-cases/receiver/create-receiver";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const createReceiverBodySchema = z.object({
    name: z.string(),
})

export type CreateReceiverBodySchema = z.infer<typeof createReceiverBodySchema>

@Controller('/receivers/create')
export class CreateReceiverController {
    constructor(
        private createReceiver: CreateReceiverUseCase
    ) { }

    @Post()
    async handle(@Body() body: CreateReceiverBodySchema,
        @CurrentUser() user: UserPayload) {
        const { name } = body;
        const userId = user.sub

        const result = await this.createReceiver.execute({ name, userId })

        if (result.isLeft()) {
            const error = result.value
            switch (error.constructor) {
                case NotAllowedError:
                    throw new UnauthorizedException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }
    }
}