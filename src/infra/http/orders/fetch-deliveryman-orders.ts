import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { FetchDeliverymanOrdersUseCase } from "@/domain/delivery/application/use-cases/order/fetch-deliveryman-orders";
import { BadRequestException, Body, Controller, Get, Param, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const fetchDeliverymanOrderBodySchema = z.object({
    deliverymanId: z.string().uuid()
})

export type FetchDeliverymanOrderBodySchema = z.infer<typeof fetchDeliverymanOrderBodySchema>

@Controller('/orders/fetch-nearby/:deliverymanId')
export class FetchDeliverymanOrderController {
    constructor(
        private fetchDeliverymanOrders: FetchDeliverymanOrdersUseCase
    ) { }

    @Get()
    async handle(@Param('deliverymanId') deliverymanId: string) {
        const result = await this.fetchDeliverymanOrders.execute({ deliverymanId })

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