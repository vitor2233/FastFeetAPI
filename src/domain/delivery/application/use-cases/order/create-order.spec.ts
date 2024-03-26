import { CreateOrderUseCase } from './create-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
    beforeEach(() => {
        inMemoryOrdersRepository =
            new InMemoryOrdersRepository()
        sut = new CreateOrderUseCase(inMemoryOrdersRepository)
    })

    it('should be able to create an order', async () => {
        const result = await sut.execute({
            name: 'Pacote 01',
            receiverId: '123'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            order: inMemoryOrdersRepository.items[0]
        })
    })

})