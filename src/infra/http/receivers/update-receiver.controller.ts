import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { UpdateReceiverUseCase } from "@/domain/delivery/application/use-cases/receiver/update-receiver";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Param, Post, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const updateReceiverBodySchema = z.object({
    name: z.string(),
})

export type UpdateReceiverBodySchema = z.infer<typeof updateReceiverBodySchema>

@Controller('/receivers/update/:receiverId')
export class UpdateReceiverController {
    constructor(
        private updateReceiver: UpdateReceiverUseCase
    ) { }

    @Post()
    async handle(@Body() body: UpdateReceiverBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('receiverId') receiverId: string,
    ) {
        const { name } = body;
        const userId = user.sub

        const result = await this.updateReceiver.execute({ name, userId, receiverId })

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