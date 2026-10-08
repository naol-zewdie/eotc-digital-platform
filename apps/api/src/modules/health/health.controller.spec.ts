import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status ok when database responds', async () => {
    const result = await controller.check();
    expect(result.status).toBe('ok');
    expect(result.version).toBe('1.0.0');
    expect(result.services.database.status).toBe('up');
  });

  it('should return health status degraded when database throws', async () => {
    jest.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('Connection failed'));
    const result = await controller.check();
    expect(result.status).toBe('degraded');
    expect(result.services.database.status).toBe('down');
    expect(result.services.database.error).toBe('Connection failed');
  });
});
