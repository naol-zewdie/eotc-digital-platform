import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import {
  CreateDonationCampaignInputDto,
  UpdateDonationCampaignInputDto,
  InitiateDonationInputDto,
  VerifyDonationInputDto,
} from './dto/donations.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  UserRole,
  DonationPurpose,
  PaymentGateway,
  PaymentStatus,
} from '@eotc/contracts';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get('campaigns')
  async findAllCampaigns(
    @Query('purpose') purpose?: DonationPurpose,
    @Query('isActive') isActive?: string,
    @Query('churchId') churchId?: string,
  ) {
    const activeBool = isActive !== undefined ? isActive === 'true' : undefined;
    return this.donationsService.findAllCampaigns({
      purpose,
      isActive: activeBool,
      churchId,
    });
  }

  @Get('campaigns/:idOrSlug')
  async findCampaign(@Param('idOrSlug') idOrSlug: string) {
    return this.donationsService.findCampaign(idOrSlug);
  }

  @Post('campaigns')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
    UserRole.CHURCH_REPRESENTATIVE,
  )
  async createCampaign(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: CreateDonationCampaignInputDto,
    @CurrentUser() user: any,
  ) {
    return this.donationsService.createCampaign(dto, user?.id || user?.sub);
  }

  @Put('campaigns/:idOrSlug')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
    UserRole.CHURCH_REPRESENTATIVE,
  )
  async updateCampaign(
    @Param('idOrSlug') idOrSlug: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: UpdateDonationCampaignInputDto,
    @CurrentUser() user: any,
  ) {
    return this.donationsService.updateCampaign(idOrSlug, dto, user?.id || user?.sub);
  }

  @Post('initiate')
  async initiateDonation(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: InitiateDonationInputDto,
  ) {
    return this.donationsService.initiateDonation(dto);
  }

  @Post('verify')
  async verifyDonation(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: VerifyDonationInputDto,
  ) {
    return this.donationsService.verifyDonation(dto);
  }

  @Get('receipt/:transactionId')
  async getReceipt(@Param('transactionId') transactionId: string) {
    return this.donationsService.getReceipt(transactionId);
  }

  @Get('stats')
  async getStats() {
    return this.donationsService.getStats();
  }

  @Get('transactions')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(
    UserRole.ADMINISTRATOR,
    UserRole.SUPER_ADMINISTRATOR,
    UserRole.CHURCH_REPRESENTATIVE,
  )
  async getTransactions(
    @Query('campaignId') campaignId?: string,
    @Query('gateway') gateway?: PaymentGateway,
    @Query('status') status?: PaymentStatus,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.donationsService.getTransactions({
      campaignId,
      gateway,
      status,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
  }
}
