import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CreateOrderUseCase } from "@/domain/delivery/application/use-cases/order/create-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const createOrderBodySchema = z.object({
    receiverId: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number()
})

export type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders/create')
export class CreateOrderController {
    constructor(
        private createOrder: CreateOrderUseCase
    ) { }

    @Post()
    async handle(@Body() body: CreateOrderBodySchema,
        @CurrentUser() user: UserPayload) {
        const { name, receiverId, address, latitude, longitude } = body;
        const userId = user.sub

        const result = await this.createOrder.execute({ userId, receiverId, name, latitude, longitude, address })

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