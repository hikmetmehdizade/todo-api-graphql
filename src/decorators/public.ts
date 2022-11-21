import { SetMetadata } from '@nestjs/common';
import { DecoratorKeys } from 'src/consts';

const Public = () => SetMetadata(DecoratorKeys.IS_PUBLIC, true);

export default Public;
