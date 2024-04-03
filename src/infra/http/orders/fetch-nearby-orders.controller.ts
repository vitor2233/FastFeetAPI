import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { FetchNearbyOrdersUseCase } from "@/domain/delivery/application/use-cases/order/fetch-nearby-orders";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, Get, Param, UnauthorizedException } from "@nestjs/common";
import { z } from "zod"

const fetchNearbyOrderBodySchema = z.object({
    latitude: z.number(),
    longitude: z.number()
})

export type FetchNearbyOrderBodySchema = z.infer<typeof fetchNearbyOrderBodySchema>

@Controller('/orders/fetch-nearby/:latitude/:longitude')
export class FetchNearbyOrderController {
    constructor(
        private fetchNearbyOrders: FetchNearbyOrdersUseCase
    ) { }

    @Get()
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('latitude') latitude: number,
        @Param('longitude') longitude: number,
    ) {
        const deliverymanId = user.sub

        const result = await this.fetchNearbyOrders.execute({ deliverymanId, latitude, longitude })

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