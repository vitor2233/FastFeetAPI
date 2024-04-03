import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { UpdateOrderUseCase } from "@/domain/delivery/application/use-cases/order/update-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Param, Put, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const updateOrderBodySchema = z.object({
    deliverymanId: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number()
})

export type UpdateOrderBodySchema = z.infer<typeof updateOrderBodySchema>

@Controller('/orders/update/:orderId')
export class UpdateOrderController {
    constructor(
        private updateOrder: UpdateOrderUseCase
    ) { }

    @Put()
    async handle(@Body() body: UpdateOrderBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('orderId') orderId: string,
    ) {
        const { deliverymanId, name, address, latitude, longitude } = body;
        const userId = user.sub

        const result = await this.updateOrder.execute({ orderId, userId, deliverymanId, name, address, latitude, longitude })

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