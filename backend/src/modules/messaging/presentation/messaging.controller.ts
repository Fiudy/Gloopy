import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateDirectConversationDto } from '../application/dto/create-direct-conversation.dto';
import { CreateGroupConversationDto } from '../application/dto/create-group-conversation.dto';
import { SendMessageDto } from '../application/dto/send-message.dto';
import { SendMediaMessageDto } from '../application/dto/send-media-message.dto';
import { RenameGroupDto } from '../application/dto/rename-group.dto';
import { ListMessagesQueryDto } from '../application/dto/list-messages-query.dto';
import { DeleteMessageQueryDto } from '../application/dto/delete-message-query.dto';
import { EditMessageDto } from '../application/dto/edit-message.dto';
import { CreateDirectConversationUseCase } from '../application/use-cases/create-direct-conversation.use-case';
import { CreateGroupConversationUseCase } from '../application/use-cases/create-group-conversation.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { SendMediaMessageUseCase } from '../application/use-cases/send-media-message.use-case';
import { EditMessageUseCase } from '../application/use-cases/edit-message.use-case';
import { DeleteMessageUseCase } from '../application/use-cases/delete-message.use-case';
import { ListConversationsUseCase } from '../application/use-cases/list-conversations.use-case';
import { ListMessagesUseCase } from '../application/use-cases/list-messages.use-case';
import { MarkMessageReadUseCase } from '../application/use-cases/mark-message-read.use-case';
import { ManageParticipantsUseCase } from '../application/use-cases/manage-participants.use-case';
import { toConversationResponse } from './mappers/conversation.mapper';
import { toMessageResponse } from './mappers/message.mapper';
import { MessageMediaEnricherService } from './services/message-media-enricher.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class MessagingController {
  constructor(
    private readonly createDirectConversation: CreateDirectConversationUseCase,
    private readonly createGroupConversation: CreateGroupConversationUseCase,
    private readonly sendMessage: SendMessageUseCase,
    private readonly sendMediaMessage: SendMediaMessageUseCase,
    private readonly editMessage: EditMessageUseCase,
    private readonly deleteMessage: DeleteMessageUseCase,
    private readonly listConversations: ListConversationsUseCase,
    private readonly listMessages: ListMessagesUseCase,
    private readonly markMessageRead: MarkMessageReadUseCase,
    private readonly manageParticipants: ManageParticipantsUseCase,
    private readonly mediaEnricher: MessageMediaEnricherService,
  ) {}

  @Get('conversations')
  async listMyConversations(@CurrentUser() userId: string) {
    const conversations = await this.listConversations.execute(userId);
    return conversations.map(toConversationResponse);
  }

  @Post('conversations/direct')
  @HttpCode(HttpStatus.OK)
  async createDirect(@CurrentUser() userId: string, @Body() dto: CreateDirectConversationDto) {
    const conversation = await this.createDirectConversation.execute({
      initiatorId: userId,
      recipientId: dto.recipientId,
    });
    return toConversationResponse(conversation);
  }

  @Post('conversations/group')
  @HttpCode(HttpStatus.CREATED)
  async createGroup(@CurrentUser() userId: string, @Body() dto: CreateGroupConversationDto) {
    const conversation = await this.createGroupConversation.execute({
      creatorId: userId,
      name: dto.name,
      memberIds: dto.memberIds,
    });
    return toConversationResponse(conversation);
  }

  @Get('conversations/:id/messages')
  async listConversationMessages(
    @CurrentUser() userId: string,
    @Param('id') conversationId: string,
    @Query() query: ListMessagesQueryDto,
  ) {
    const messages = await this.listMessages.execute({
      conversationId,
      requesterId: userId,
      before: query.before ? new Date(query.before) : undefined,
      limit: query.limit,
    });
    const mediaByMessageId = await this.mediaEnricher.resolveFor(messages);
    return messages.map((m) => toMessageResponse(m, userId, mediaByMessageId.get(m.id)));
  }

  @Post('conversations/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  async postMessage(
    @CurrentUser() userId: string,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    const message = await this.sendMessage.execute({
      conversationId,
      senderId: userId,
      content: dto.content,
    });
    return toMessageResponse(message, userId);
  }

  @Post('conversations/:id/media-messages')
  @HttpCode(HttpStatus.CREATED)
  async postMediaMessage(
    @CurrentUser() userId: string,
    @Param('id') conversationId: string,
    @Body() dto: SendMediaMessageDto,
  ) {
    const message = await this.sendMediaMessage.execute({
      conversationId,
      senderId: userId,
      mediaAssetId: dto.mediaAssetId,
      caption: dto.caption,
    });
    const mediaByMessageId = await this.mediaEnricher.resolveFor([message]);
    return toMessageResponse(message, userId, mediaByMessageId.get(message.id));
  }

  @Patch('messages/:id')
  async patchMessage(@CurrentUser() userId: string, @Param('id') messageId: string, @Body() dto: EditMessageDto) {
    const message = await this.editMessage.execute({
      messageId,
      requesterId: userId,
      content: dto.content,
    });
    return toMessageResponse(message, userId);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMessage(
    @CurrentUser() userId: string,
    @Param('id') messageId: string,
    @Query() query: DeleteMessageQueryDto,
  ) {
    await this.deleteMessage.execute({ messageId, requesterId: userId, scope: query.scope });
  }

  @Patch('conversations/:id')
  async renameGroup(@CurrentUser() requesterId: string, @Param('id') conversationId: string, @Body() dto: RenameGroupDto) {
    const conversation = await this.manageParticipants.renameGroup({ conversationId, requesterId, name: dto.name });
    return toConversationResponse(conversation);
  }

  @Post('messages/:id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async readMessage(@CurrentUser() userId: string, @Param('id') messageId: string) {
    await this.markMessageRead.execute({ messageId, userId });
  }

  @Post('conversations/:id/participants/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addParticipant(
    @CurrentUser() requesterId: string,
    @Param('id') conversationId: string,
    @Param('userId') newUserId: string,
  ) {
    await this.manageParticipants.addParticipant({ conversationId, requesterId, newUserId });
  }

  @Delete('conversations/:id/participants/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeParticipant(
    @CurrentUser() requesterId: string,
    @Param('id') conversationId: string,
    @Param('userId') targetUserId: string,
  ) {
    await this.manageParticipants.removeParticipant({ conversationId, requesterId, targetUserId });
  }

  @Post('conversations/:id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveConversation(@CurrentUser() userId: string, @Param('id') conversationId: string) {
    await this.manageParticipants.leave({ conversationId, userId });
  }

  @Post('conversations/:id/participants/:userId/promote')
  @HttpCode(HttpStatus.NO_CONTENT)
  async promoteAdmin(
    @CurrentUser() requesterId: string,
    @Param('id') conversationId: string,
    @Param('userId') targetUserId: string,
  ) {
    await this.manageParticipants.promoteToAdmin({ conversationId, requesterId, targetUserId });
  }

  @Post('conversations/:id/participants/:userId/demote')
  @HttpCode(HttpStatus.NO_CONTENT)
  async demoteAdmin(
    @CurrentUser() requesterId: string,
    @Param('id') conversationId: string,
    @Param('userId') targetUserId: string,
  ) {
    await this.manageParticipants.demoteAdmin({ conversationId, requesterId, targetUserId });
  }
}
