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
            address: 'Rua teste, 123',
            latitude: -19.974579,
            longitude: -43.9464643,
            receiverId: '123'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            order: inMemoryOrdersRepository.items[0]
        })
    })

})