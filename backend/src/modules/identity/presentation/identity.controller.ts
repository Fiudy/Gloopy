import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '../application/use-cases/update-profile.use-case';
import { SearchUsersUseCase } from '../application/use-cases/search-users.use-case';
import { UpdateProfileDto } from '../application/dto/update-profile.dto';
import { SearchUsersDto } from '../application/dto/search-users.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class IdentityController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getProfile: GetProfileUseCase,
    private readonly updateProfile: UpdateProfileUseCase,
    private readonly searchUsers: SearchUsersUseCase,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto) {
    return this.loginUserUseCase.execute(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@CurrentUser() userId: string) {
    return this.getProfile.execute(userId);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  async updateMe(@CurrentUser() userId: string, @Body() dto: UpdateProfileDto) {
    return this.updateProfile.execute(userId, dto);
  }

  @Get('users/search')
  @UseGuards(AuthGuard('jwt'))
  async findUsers(@CurrentUser() userId: string, @Query() query: SearchUsersDto) {
    return this.searchUsers.execute(userId, query.q, query.limit);
  }
}
