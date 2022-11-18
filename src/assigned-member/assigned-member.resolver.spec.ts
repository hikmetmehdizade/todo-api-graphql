import { Test, TestingModule } from '@nestjs/testing';
import { AssignedMemberResolver } from './assigned-member.resolver';

describe('AssignedMemberResolver', () => {
  let resolver: AssignedMemberResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignedMemberResolver],
    }).compile();

    resolver = module.get<AssignedMemberResolver>(AssignedMemberResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
